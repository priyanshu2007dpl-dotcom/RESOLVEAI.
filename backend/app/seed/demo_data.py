import secrets
from datetime import datetime, timezone, timedelta
from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.user import Organization, User, CustomerProfile
from app.models.solver import Solver, SolverSkill
from app.models.complaint import Complaint, Evidence, ComplaintEvent, Message, Feedback
from app.models.investigation import Investigation, RootCause, CorrectiveAction, PreventionRecommendation
from app.models.incident import Incident, IncidentComplaint, ProcessEvent
from app.models.audit import AuditLog, ApiKey, Webhook
from app.models.policy import Policy, PolicyDriftRecord
from app.models.autonomous_action import AutonomousAction
from app.models.notification import Notification
from app.models.ai_evaluation import AIResolutionAudit
from app.services.ai_engine import AIEngine
from app.services.ai_evaluation_engine import AIEvaluationEngine

def seed_database(force_reseed: bool = False):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Organizations
    org_apex = db.query(Organization).filter(Organization.slug == "apex-dynamics").first()
    if not org_apex:
        org_apex = Organization(
            name="Apex Dynamics Corp",
            slug="apex-dynamics",
            domain="apexdynamics.com",
            plan_tier="Enterprise",
            sla_config={"critical_hours": 2, "high_hours": 8, "medium_hours": 24, "low_hours": 72}
        )
        db.add(org_apex)
        db.flush()

    org_nova = db.query(Organization).filter(Organization.slug == "novatech").first()
    if not org_nova:
        org_nova = Organization(
            name="NovaTech Solutions",
            slug="novatech",
            domain="novatech.io",
            plan_tier="Business"
        )
        db.add(org_nova)
        db.flush()

    # 2. Users
    pw_hash = get_password_hash("password123")
    
    def get_or_create_user(email, full_name, role, org_id=None):
        u = db.query(User).filter(User.email == email).first()
        if not u:
            u = User(
                email=email,
                hashed_password=pw_hash,
                full_name=full_name,
                role=role,
                organization_id=org_id
            )
            db.add(u)
            db.flush()
        return u

    u_admin = get_or_create_user("platform.admin@omniresolve.ai", "OmniResolve SuperAdmin", "platform_admin")
    u_company = get_or_create_user("admin@apexdynamics.com", "Apex Operations Leadership", "company_user", org_apex.id)
    u_customer = get_or_create_user("elena.vance@example.com", "Elena Vance", "customer")
    
    u_solver_mech = get_or_create_user("dr.marcus.vance@omnisolver.com", "Dr. Marcus Vance", "solver")
    u_solver_soft = get_or_create_user("sarah.lin@omnisolver.com", "Sarah Lin", "solver")
    u_solver_hard = get_or_create_user("david.kim@omnisolver.com", "David Kim", "solver")
    u_solver_cust = get_or_create_user("rachel.green@omnisolver.com", "Rachel Green", "solver")

    # Customer Profile
    cust_profile = db.query(CustomerProfile).filter(CustomerProfile.user_id == u_customer.id).first()
    if not cust_profile:
        cust_profile = CustomerProfile(
            user_id=u_customer.id,
            customer_code="CUST-ELENA-01",
            company_name="Vance Precision Tooling",
            phone="+1 (555) 234-8901",
            address="104 Industrial Parkway, Chicago, IL"
        )
        db.add(cust_profile)
        db.flush()

    # Solvers Profiles
    def get_or_create_solver(user_id, domain, secondaries, exp, rating, avg_h, loc, certs):
        s = db.query(Solver).filter(Solver.user_id == user_id).first()
        if not s:
            s = Solver(
                user_id=user_id,
                primary_domain=domain,
                secondary_domains=secondaries,
                experience_years=exp,
                availability_status="available",
                max_concurrent_complaints=5,
                current_workload=2,
                average_rating=rating,
                avg_resolution_hours=avg_h,
                location=loc,
                certifications=certs
            )
            db.add(s)
            db.flush()
        return s

    s_mech = get_or_create_solver(u_solver_mech.id, "Mechanical", ["Electrical", "Industrial Equipment", "Automotive"], 14, 4.95, 3.8, "Chicago, IL (Onsite & Remote)", ["PE Mechanical Engineer", "IEEE Senior Member", "Six Sigma Black Belt"])
    s_soft = get_or_create_solver(u_solver_soft.id, "Software", ["Networking", "Cybersecurity", "Cloud Systems"], 9, 4.98, 2.5, "San Francisco, CA (Remote)", ["AWS Certified Solutions Architect Pro", "CKA Kubernetes"])
    s_hard = get_or_create_solver(u_solver_hard.id, "Hardware", ["Electronics", "Appliances", "Circuit Analysis"], 11, 4.88, 4.1, "Austin, TX", ["IPC-A-610 Master Solder Specialist", "CompTIA A+ & Server+"])
    s_cust = get_or_create_solver(u_solver_cust.id, "Customer Service", ["Billing & Payment", "Refunds", "Operational issues"], 7, 4.92, 1.8, "New York, NY", ["ITIL 4 Managing Professional", "Customer Success Lead Certified"])

    # Solver Skills
    if not db.query(SolverSkill).first():
        skills = [
            SolverSkill(solver_id=s_mech.id, skill_name="Bearing Diagnostics & Lubrication", domain="Mechanical", proficiency_level="Expert"),
            SolverSkill(solver_id=s_mech.id, skill_name="Thermal Overload Analysis", domain="Electrical", proficiency_level="Expert"),
            SolverSkill(solver_id=s_mech.id, skill_name="Vibration FFT Spectrum Analysis", domain="Mechanical", proficiency_level="Expert"),
            SolverSkill(solver_id=s_soft.id, skill_name="FastAPI & Python Concurrency", domain="Software", proficiency_level="Expert"),
            SolverSkill(solver_id=s_soft.id, skill_name="Buffer Overflow & Memory Diagnostics", domain="Software", proficiency_level="Expert"),
            SolverSkill(solver_id=s_hard.id, skill_name="eDP & Panel Display Debugging", domain="Hardware", proficiency_level="Expert"),
            SolverSkill(solver_id=s_hard.id, skill_name="SMD Capacitor Replacement", domain="Electronics", proficiency_level="Advanced"),
            SolverSkill(solver_id=s_cust.id, skill_name="Payment Gateway Dispute Resolution", domain="Billing & Payment", proficiency_level="Expert")
        ]
        db.add_all(skills)

    # 3. Policies & Policy Drift
    if not db.query(Policy).first():
        pol_billing = Policy(
            organization_id=org_apex.id,
            title="Automated Payment Reconciliation & Refund Policy",
            slug="billing-refund-policy",
            version="v2.0",
            category="Billing & Refund",
            content="Under §3.1 of the Apex Dynamics Financial Operations Manual, any customer payment capture failure where money is deducted but the session state timed out qualifies for immediate automated reconciliation credit up to ₹5,000 without requiring secondary manual manager authorization.",
            rules_json={"max_auto_refund_inr": 5000, "settlement_window_hours": 2, "auto_reconciliation_enabled": True}
        )
        pol_sop = Policy(
            organization_id=org_apex.id,
            title="Apex Industrial Extruder Maintenance SOP",
            slug="extruder-maintenance-sop",
            version="v1.4",
            category="Extruder SOP",
            content="Extruder v3 models operating above 1500 RPM must utilize synthetic polyalphaolefin ISO VG 220 lubricant. Standard mineral oil undergoes thermal shear degradation at stator temperatures >80°C, latching thermal cutoff relay K1 (Fault code E-42).",
            rules_json={"required_grease": "ISO VG 220 Synthetic", "max_stator_temp_c": 80, "mandatory_field_inspection": True}
        )
        pol_warranty = Policy(
            organization_id=org_apex.id,
            title="Enterprise Hardware Warranty & Return Standard",
            slug="hardware-warranty-standard",
            version="v3.0",
            category="Warranty & Hardware",
            content="Hardware devices exhibiting physical display or motherboard anomalies within 36 months of deployment receive expedited priority diagnosis. Ribbon cable fatigue failures qualify for immediate component harness replacement.",
            rules_json={"warranty_months": 36, "replacement_harness_covered": True}
        )
        db.add_all([pol_billing, pol_sop, pol_warranty])
        db.flush()

        # Policy Drift Record
        db.add(PolicyDriftRecord(
            organization_id=org_apex.id,
            policy_id=pol_billing.id,
            previous_version="v1.0",
            new_version="v2.0",
            change_summary="Tightened automated settlement validation threshold from 48 hours to 2 hours, resulting in temporary transaction timeout spikes from acquirer bank retries.",
            detected_drift_type="Reconciliation Window Tightening",
            pre_change_complaint_rate=14,
            post_change_complaint_rate=38,
            correlation_confidence="High"
        ))

    # 4. Root Causes
    rc_motor = db.query(RootCause).filter(RootCause.code == "RC-MECH-409").first()
    if not rc_motor:
        rc_motor = RootCause(
            organization_id=org_apex.id,
            code="RC-MECH-409",
            title="Bearing Lubrication Shear Breakdown Triggering Thermal Overload",
            category="Mechanical / Thermal",
            domain="Mechanical",
            description="Under continuous high RPM (>1800) in ambient temps exceeding 30°C, mineral lubricant breaks down in viscosity, inducing micro-friction and triggering the K1 thermal protection relay.",
            incident_count=32,
            is_recurring=True,
            prevention_recommendation="Switch to synthetic ISO VG 220 polyalphaolefin grease and raise warning telemetry threshold in firmware."
        )
        rc_display = RootCause(
            organization_id=org_apex.id,
            code="RC-HARD-102",
            title="eDP Display Ribbon Harness Micro-Flex Stress Fracture",
            category="Hardware Design",
            domain="Hardware",
            description="Repeated display hinge rotation pinches the 30-pin ribbon cable harness, resulting in backlight ground loop failure.",
            incident_count=14,
            is_recurring=False
        )
        rc_gateway = RootCause(
            organization_id=org_apex.id,
            code="RC-FIN-882",
            title="Payment Gateway Idempotent Webhook Lock Failure",
            category="Financial Infrastructure",
            domain="Billing & Payment",
            description="High-frequency concurrent payment retries trigger database row locks in the verification listener, delaying automated reconciliation.",
            incident_count=800,
            is_recurring=True,
            prevention_recommendation="Deploy distributed Redis lock with exponential backoff on acquirer bank webhooks."
        )
        db.add_all([rc_motor, rc_display, rc_gateway])
        db.flush()

    # 5. Incidents (INC-2047 and INC-1042)
    inc_2047 = db.query(Incident).filter(Incident.incident_code == "INC-2047").first()
    if not inc_2047:
        inc_2047 = Incident(
            incident_code="INC-2047",
            organization_id=org_apex.id,
            title="Apex Industrial Extruder Motor Bearing Thermal Protection Trip Cluster",
            description="Cluster of 32 customer complaints reporting sudden extruder motor power cut-off between 15-25 minutes of continuous operation.",
            status="investigating",
            severity="critical",
            primary_domain="Mechanical",
            root_cause_id=rc_motor.id,
            affected_user_count=32,
            affected_products=["Apex Industrial Extruder v3", "HeavyDrive Spindle Motor 4B"],
            affected_regions=["US Midwest Industrial", "Bavaria Region Germany"],
            detected_at=datetime.now(timezone.utc) - timedelta(days=3)
        )
        db.add(inc_2047)
        db.flush()

    # Scenario 2 Incident: INC-1042
    inc_1042 = db.query(Incident).filter(Incident.incident_code == "INC-1042").first()
    if not inc_1042:
        inc_1042 = Incident(
            incident_code="INC-1042",
            organization_id=org_apex.id,
            title="Payment Verification Service Failure & Reversal Lockup",
            description="Cluster of 800 complaints regarding payment deducted but order/subscription showing unfulfilled across APAC and Europe payment bridges.",
            status="investigating",
            severity="critical",
            primary_domain="Billing & Payment",
            affected_user_count=800,
            affected_products=["Apex Pay Gateway", "Enterprise Subscription Portal", "Direct Checkout API"],
            affected_regions=["APAC Region", "Western Europe", "North America East"],
            detected_at=datetime.now(timezone.utc) - timedelta(hours=14)
        )
        db.add(inc_1042)
        db.flush()

    # 6. Flagship Demo Complaints (The 4 WOW Demo Scenarios)
    
    # SCENARIO 3 FLAGSHIP: CMP-2026-9812 (Hardware/Mechanical 11-step Extruder)
    cmp_mech = db.query(Complaint).filter(Complaint.tracking_code == "CMP-2026-9812").first()
    if not cmp_mech:
        cmp_mech = Complaint(
            tracking_code="CMP-2026-9812",
            organization_id=org_apex.id,
            customer_id=cust_profile.id,
            title="Apex Industrial Extruder stops unexpectedly after 20 minutes with high-pitch whine",
            description="The machine starts up properly and extrudes for about 20 minutes. Then it produces a loud high-pitched metallic screeching sound from the drive housing and shuts off automatically. The digital readout shows safety fault code E-42.",
            product_service="Apex Industrial Extruder v3",
            transaction_ref="EXT-PO-88219",
            location="Chicago Plant #2",
            urgency="high",
            status="in_progress",
            primary_domain="Mechanical",
            contributing_domains=["Electrical", "Industrial Equipment"],
            severity_score=85,
            sentiment_score=-0.75,
            detected_entities={"error_codes": ["E-42"], "durations": ["20 minutes"], "key_symptoms": ["stops", "whine", "screeching", "shuts off"]},
            assigned_solver_id=s_mech.id,
            assigned_at=datetime.now(timezone.utc) - timedelta(hours=2),
            sla_due_at=datetime.now(timezone.utc) + timedelta(hours=6)
        )
        db.add(cmp_mech)
        db.flush()

        db.add(IncidentComplaint(incident_id=inc_2047.id, complaint_id=cmp_mech.id, similarity_score=0.96))

        inv_mech = Investigation(
            complaint_id=cmp_mech.id,
            solver_id=s_mech.id,
            summary="Automated AI multi-domain investigation identified cross-domain coupling between mechanical spindle friction and electrical breaker trip.",
            observed_problem="Machine halts mid-cycle at T+20 min following audible bearing acoustic distress and thermal sensor trip (Fault E-42).",
            probable_root_cause="Bearing lubrication breakdown induces friction heating above 80°C, triggering thermal overload switch K1 to protect motor windings.",
            contributing_factors=["Ambient plant temperature exceeding 32°C", "Viscosity loss in standard mineral grease under sustained RPM", "Thermal trip threshold set conservatively at 82°C"],
            confidence_score=0.94,
            next_steps=[
                {"step": "Perform thermal imaging of bearing flange housing", "type": "physical_inspection", "completed": True},
                {"step": "Flush spindle and replace with ISO VG 220 synthetic lubricant", "type": "corrective_action", "completed": False},
                {"step": "Clear fault code E-42 and run 60-minute trial extrusion", "type": "verification_run", "completed": False}
            ],
            safety_verification_required=True,
            human_verified=False,
            status="in_progress"
        )
        db.add(inv_mech)

        db.add(Evidence(
            complaint_id=cmp_mech.id,
            file_name="extruder_motor_housing.jpg",
            file_type="image",
            file_size_bytes=2480120,
            mime_type="image/jpeg",
            sha256_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            file_path="uploads/extruder_motor_housing.jpg",
            visual_observation="Visual Observation: Localized dark amber heat discoloration detected along the lower bearing retainer flange. Grease expulsion traces visible at seam. Physical technician verification mandatory.",
            uploaded_by_user_id=u_customer.id
        ))
        db.add(Evidence(
            complaint_id=cmp_mech.id,
            file_name="maintenance_log_apex_v3.pdf",
            file_type="pdf",
            file_size_bytes=1048576,
            mime_type="application/pdf",
            sha256_hash="a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
            file_path="uploads/maintenance_log_apex_v3.pdf",
            extracted_text="Maintenance Log ID: ML-9821. Routine service 400 operating hours prior. Recorded bearing clearance at 0.04mm. Thermistor calibrated to K1 relay.",
            uploaded_by_user_id=u_customer.id
        ))
        db.add(Evidence(
            complaint_id=cmp_mech.id,
            file_name="screeching_sound_recording.wav",
            file_type="audio",
            file_size_bytes=384000,
            mime_type="audio/wav",
            sha256_hash="9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
            file_path="uploads/screeching_sound_recording.wav",
            audio_transcript="[Audio Transcript] 'The motor operates fine for the first 20 minutes, then an audible high-pitch screeching noise begins at the rear drive shaft, followed 30 seconds later by total emergency cut-off.'",
            uploaded_by_user_id=u_customer.id
        ))

    # SCENARIO 1 FLAGSHIP: CMP-2026-1001 (Autonomous Support ₹2,000 refund)
    cmp_auto = db.query(Complaint).filter(Complaint.tracking_code == "CMP-2026-1001").first()
    if not cmp_auto:
        cmp_auto = Complaint(
            tracking_code="CMP-2026-1001",
            organization_id=org_apex.id,
            customer_id=cust_profile.id,
            title="My payment failed but ₹2,000 was deducted from bank account",
            description="I was attempting to renew our monthly diagnostic telemetry subscription. The checkout page threw a session timeout error, but my mobile banking app immediately notified me that ₹2,000 was deducted. Please refund or credit immediately.",
            product_service="Apex Telemetry Subscription Portal",
            transaction_ref="TXN-PAYTM-88219",
            location="Online Portal",
            urgency="medium",
            status="resolved",
            primary_domain="Billing & Payment",
            contributing_domains=["Refunds"],
            severity_score=45,
            sentiment_score=-0.65,
            detected_entities={"amount": ["₹2,000"], "transaction_ref": ["TXN-PAYTM-88219"]},
            resolved_at=datetime.now(timezone.utc) - timedelta(minutes=45)
        )
        db.add(cmp_auto)
        db.flush()

        db.add(AutonomousAction(
            complaint_id=cmp_auto.id,
            organization_id=org_apex.id,
            action_type="reconciliation_refund",
            permission_tier="low_risk_auto",
            status="executed",
            amount=2000.0,
            currency="INR",
            payload={"transaction_ref": "TXN-PAYTM-88219", "reversal_ref": "REV-2000-AUTO-991"},
            result_summary="Automated reconciliation refund credit of ₹2,000.00 processed via banking gateway.",
            policy_citation="Automated Payment Reconciliation & Refund Policy v2.0 §3.1",
            executed_by="Autonomous Support Agent",
            executed_at=datetime.now(timezone.utc) - timedelta(minutes=45)
        ))

        db.add(Message(
            complaint_id=cmp_auto.id,
            sender_id=u_customer.id,
            sender_name="OmniResolve Autonomous Agent",
            sender_role="ai",
            message_text="Hello Elena Vance. We verified against payment gateway records that the session timed out after authorization. Under company policy (Automated Payment Reconciliation & Refund Policy v2.0 §3.1), we have automatically processed an instant reconciliation refund of ₹2,000.00 to your original payment instrument (Reversal Ref: REV-2000-AUTO-991).",
            is_internal_note=False
        ))

    # SCENARIO 4 FLAGSHIP: CMP-2026-9999 (Safety Signal & Human Handoff)
    cmp_safety = db.query(Complaint).filter(Complaint.tracking_code == "CMP-2026-9999").first()
    if not cmp_safety:
        cmp_safety = Complaint(
            tracking_code="CMP-2026-9999",
            organization_id=org_apex.id,
            customer_id=cust_profile.id,
            title="Extruder motor is overheating rapidly and there is heavy smoke coming from spindle",
            description="URGENT: Machine #3 was running when black smoke started pouring out from the rear bearing spindle accompanied by an acrid electrical burning smell. We hit the E-stop button immediately. The motor casing is scorching hot.",
            product_service="Apex Industrial Extruder v3",
            transaction_ref="PO-EXT-99812",
            location="Chicago Plant #2",
            urgency="critical",
            status="escalated",
            primary_domain="Mechanical",
            contributing_domains=["Electrical"],
            severity_score=98,
            sentiment_score=-0.95,
            assigned_solver_id=s_mech.id,
            assigned_at=datetime.now(timezone.utc) - timedelta(minutes=15),
            sla_due_at=datetime.now(timezone.utc) + timedelta(hours=2)
        )
        db.add(cmp_safety)
        db.flush()

        db.add(ComplaintEvent(
            complaint_id=cmp_safety.id,
            event_type="human_escalation",
            actor_role="ai",
            actor_name="Escalation Intelligence Engine",
            description="SAFETY OVERRIDE TRIGGERED: Smoke & thermal hazard detected. Automated troubleshooting halted immediately. Complete 9-point Context Package transferred to on-call PE Dr. Marcus Vance."
        ))

        db.add(Notification(
            user_id=u_solver_mech.id,
            role="solver",
            notification_type="safety_escalation",
            title="🚨 URGENT Safety Escalation: Smoke on Extruder CMP-2026-9999",
            message="Autonomous agent halted workflow. Customer reported heavy black smoke and burning smell. Full 9-point Context Package ready in Solver Workspace.",
            link_url=f"/solver?case={cmp_safety.id}"
        ))

    # 7. In-App Notifications for demo personas
    if not db.query(Notification).first():
        db.add_all([
            Notification(
                user_id=u_customer.id,
                role="customer",
                notification_type="resolution_confirmed",
                title="Complaint CMP-2026-1001 Autonomously Resolved",
                message="Your ₹2,000 deduction has been reconciled and refunded per company policy.",
                link_url=f"/customer?case={cmp_auto.id if cmp_auto else ''}"
            ),
            Notification(
                user_id=u_solver_mech.id,
                role="solver",
                notification_type="complaint_assigned",
                title="New Case Assigned: CMP-2026-9812",
                message="Apex Industrial Extruder shutdown case matched with 98% skill affinity.",
                link_url=f"/solver?case={cmp_mech.id if cmp_mech else ''}"
            ),
            Notification(
                user_id=u_company.id,
                role="company_user",
                notification_type="incident_detected",
                title="Incident Cluster Detected: INC-1042",
                message="800 payment webhook timeout complaints correlated to gateway lockup.",
                link_url="/company?tab=incidents"
            ),
            Notification(
                user_id=u_admin.id,
                role="platform_admin",
                notification_type="sla_warning",
                title="Platform Audit: 100% Cryptographic Evidence Integrity",
                message="All evidence hashes validated against SHA-256 ledger.",
                link_url="/admin"
            )
        ])

    # 8. Seed AI Resolution Audits (Scores & 4-Persona Feedback) for all complaints
    all_complaints = db.query(Complaint).all()
    for c in all_complaints:
        existing_audit = db.query(AIResolutionAudit).filter(AIResolutionAudit.complaint_id == c.id).first()
        if not existing_audit:
            AIEvaluationEngine.evaluate_complaint_resolution(c, db=db, force_regenerate=True)

    db.commit()
    print("OmniResolve AI database seeded and verified successfully across all 4 WOW scenarios!")
    db.close()

if __name__ == "__main__":
    seed_database()
