import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.seed.demo_data import seed_database

# Ensure database is seeded for tests
seed_database()

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Resolve AI" in data["platform"]
    assert "demo_accounts" in data

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_login_demo_customer():
    response = client.post("/api/auth/login", json={
        "email": "elena.vance@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["user"]["role"] == "customer"

def test_login_demo_solver():
    response = client.post("/api/auth/login", json={
        "email": "dr.marcus.vance@omnisolver.com",
        "password": "password123"
    })
    assert response.status_code == 200
    token_data = response.json()
    assert token_data["user"]["role"] == "solver"

def test_persona_quick_switcher():
    response = client.post("/api/auth/switch-persona", json={
        "target_role": "company_user"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["role"] == "company_user"

def test_complaints_list():
    # Login as solver to view complaints
    auth_res = client.post("/api/auth/login", json={
        "email": "dr.marcus.vance@omnisolver.com",
        "password": "password123"
    })
    token = auth_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/complaints", headers=headers)
    assert response.status_code == 200
    complaints = response.json()
    assert len(complaints) > 0

def test_ai_copilot():
    auth_res = client.post("/api/auth/login", json={
        "email": "dr.marcus.vance@omnisolver.com",
        "password": "password123"
    })
    token = auth_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch complaints
    c_res = client.get("/api/complaints", headers=headers)
    assert len(c_res.json()) > 0
    c_id = c_res.json()[0]["id"]
    
    copilot_res = client.post(
        "/api/ai/copilot",
        headers=headers,
        json={
            "complaint_id": c_id,
            "prompt": "What should I check first?"
        }
    )
    assert copilot_res.status_code == 200
    data = copilot_res.json()
    assert "answer" in data
    assert len(data["citations"]) > 0

def test_what_if_simulation():
    auth_res = client.post("/api/auth/login", json={
        "email": "admin@apexdynamics.com",
        "password": "password123"
    })
    token = auth_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    sim_res = client.post(
        "/api/company/what-if",
        headers=headers,
        json={
            "response_sla_hours": 2.0,
            "automate_verification": True,
            "preventive_maintenance_enabled": True,
            "simulation_horizon_days": 30
        }
    )
    assert sim_res.status_code == 200
    data = sim_res.json()
    assert data["projected_sla_compliance_rate"] > 90.0
    assert "Structural Causal Model" in data["model_type"]

def test_external_b2b_api():
    b2b_res = client.post(
        "/api/v1/external/complaints",
        headers={"X-API-Key": "omni_live_apex_demo_key_9812"},
        json={
            "external_ticket_id": "ZEN-4091",
            "customer_reference": "C-9012",
            "product": "OmniBook Pro 16",
            "description": "Screen is completely black and flickering on startup",
            "priority": "high"
        }
    )
    assert b2b_res.status_code == 200
    data = b2b_res.json()
    assert data["status"] == "success"
    assert data["primary_domain"] == "Hardware"

def test_policies_and_drift_detection():
    # Login as company user
    auth_res = client.post("/api/auth/login", json={
        "email": "admin@apexdynamics.com",
        "password": "password123"
    })
    token = auth_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Test policies list
    pol_res = client.get("/api/policies", headers=headers)
    assert pol_res.status_code == 200
    policies = pol_res.json()
    assert len(policies) >= 3
    assert any("Refund" in p["title"] for p in policies)

    # Test policy drift analysis
    drift_res = client.get("/api/policies/drift", headers=headers)
    assert drift_res.status_code == 200
    drift_data = drift_res.json()
    assert "STATISTICAL CORRELATION" in drift_data["disclaimer"]
    assert len(drift_data["active_drift_alerts"]) > 0
    alert_type = drift_data["active_drift_alerts"][0]["detected_drift_type"]
    assert "Reconciliation" in alert_type or "Refund" in alert_type

def test_notifications_flow():
    # Login as solver
    auth_res = client.post("/api/auth/login", json={
        "email": "dr.marcus.vance@omnisolver.com",
        "password": "password123"
    })
    token = auth_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch notifications
    notif_res = client.get("/api/notifications", headers=headers)
    assert notif_res.status_code == 200
    notifs = notif_res.json()
    assert len(notifs) > 0

    # Mark first notification as read
    first_id = notifs[0]["id"]
    read_res = client.post(f"/api/notifications/{first_id}/read", headers=headers)
    assert read_res.status_code == 200
    assert read_res.json()["is_read"] is True

def test_global_semantic_search():
    # Login as admin
    auth_res = client.post("/api/auth/login", json={
        "email": "admin@apexdynamics.com",
        "password": "password123"
    })
    token = auth_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Search for extruder
    search_res = client.get("/api/search?q=extruder", headers=headers)
    assert search_res.status_code == 200
    results = search_res.json()["results"]
    assert len(results) > 0
    assert any(r["entity_type"] == "complaint" for r in results)

def test_customer_context_retention():
    # Login as solver
    auth_res = client.post("/api/auth/login", json={
        "email": "dr.marcus.vance@omnisolver.com",
        "password": "password123"
    })
    token = auth_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    c_res = client.get("/api/complaints", headers=headers)
    c_id = c_res.json()[0]["id"]

    ctx_res = client.get(f"/api/complaints/{c_id}/context", headers=headers)
    assert ctx_res.status_code == 200
    ctx_data = ctx_res.json()
    assert "avoidance_directives" in ctx_data
    assert "products_owned" in ctx_data
    assert len(ctx_data["avoidance_directives"]) > 0

def test_escalation_and_9point_handoff():
    # Login as solver
    auth_res = client.post("/api/auth/login", json={
        "email": "dr.marcus.vance@omnisolver.com",
        "password": "password123"
    })
    token = auth_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Find the safety scenario complaint or first complaint
    c_res = client.get("/api/complaints", headers=headers)
    complaints = c_res.json()
    target_c = next((c for c in complaints if "smoke" in c["title"].lower()), complaints[0])

    # Trigger escalation
    esc_res = client.post(
        f"/api/complaints/{target_c['id']}/escalate",
        headers=headers,
        json={"reason": "Safety hazard smoke detected during thermal operation."}
    )
    assert esc_res.status_code == 200
    handoff = esc_res.json()
    assert handoff["tracking_code"] == target_c["tracking_code"]
    assert "what_ai_understood" in handoff
    assert "actions_already_attempted" in handoff
    assert "possible_root_causes" in handoff
    assert "recommended_next_step" in handoff

    # Test GET handoff-package
    pkg_res = client.get(f"/api/complaints/{target_c['id']}/handoff-package", headers=headers)
    assert pkg_res.status_code == 200
    assert pkg_res.json()["tracking_code"] == target_c["tracking_code"]

def test_autonomous_solve_workflow():
    # Login as customer
    auth_res = client.post("/api/auth/login", json={
        "email": "elena.vance@example.com",
        "password": "password123"
    })
    token = auth_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Find CMP-2026-1001 (Autonomous scenario)
    c_res = client.get("/api/complaints", headers=headers)
    target = next((c for c in c_res.json() if "CMP-2026-1001" in c["tracking_code"]), None)
    
    if target:
        solve_res = client.post(f"/api/complaints/{target['id']}/autonomous-solve", headers=headers)
        assert solve_res.status_code == 200
        data = solve_res.json()
        assert data["success"] is True
        assert data["status"] == "resolved"
        assert "refunded" in data["execution_result"]

def test_multi_agent_deliberation():
    # Login as solver
    auth_res = client.post("/api/auth/login", json={
        "email": "dr.marcus.vance@omnisolver.com",
        "password": "password123"
    })
    token = auth_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    c_res = client.get("/api/complaints", headers=headers)
    c_id = c_res.json()[0]["id"]

    delib_res = client.post(
        "/api/ai/deliberate",
        headers=headers,
        json={"complaint_id": c_id}
    )
    assert delib_res.status_code == 200
    data = delib_res.json()
    assert "traces" in data
    assert len(data["traces"]) >= 4
    assert "Multi-agent" in data["supervisor_verdict"]

def test_process_mining_and_incidents():
    auth_res = client.post("/api/auth/login", json={
        "email": "admin@apexdynamics.com",
        "password": "password123"
    })
    token = auth_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    inc_res = client.get("/api/incidents", headers=headers)
    assert inc_res.status_code == 200
    assert len(inc_res.json()) > 0

    pm_res = client.get("/api/incidents/process-mining", headers=headers)
    assert pm_res.status_code == 200
    pm_data = pm_res.json()
    assert "transitions" in pm_data
    assert "bottleneck_steps" in pm_data
    assert len(pm_data["bottleneck_steps"]) > 0

def test_ai_resolution_score_and_multipersona_feedback():
    # Login as solver
    auth_res = client.post("/api/auth/login", json={
        "email": "dr.marcus.vance@omnisolver.com",
        "password": "password123"
    })
    token = auth_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch complaints
    c_res = client.get("/api/complaints", headers=headers)
    complaints = c_res.json()
    assert len(complaints) > 0
    target_c = complaints[0]

    # Test GET ai-evaluation
    eval_res = client.get(f"/api/complaints/{target_c['id']}/ai-evaluation", headers=headers)
    assert eval_res.status_code == 200
    eval_data = eval_res.json()
    assert "overall_score" in eval_data
    assert 0 <= eval_data["overall_score"] <= 100
    assert "confidence_level" in eval_data
    assert "quality_tier" in eval_data
    
    # Verify 4-persona feedback
    assert "feedback_to_user" in eval_data
    assert "what_was_fixed" in eval_data["feedback_to_user"] or "summary" in eval_data["feedback_to_user"]
    assert "feedback_to_solver" in eval_data
    assert "peer_review_critique" in eval_data["feedback_to_solver"]
    assert "feedback_to_company" in eval_data
    assert "workload_avoidance_hours" in eval_data["feedback_to_company"]
    assert "feedback_to_admin" in eval_data
    assert "safety_guardrail_status" in eval_data["feedback_to_admin"]

    # Test GET company ai-quality-scores
    comp_res = client.get("/api/company/ai-quality-scores", headers=headers)
    assert comp_res.status_code == 200
    comp_data = comp_res.json()
    assert "average_score" in comp_data
    assert comp_data["average_score"] > 80
    assert "sub_metric_averages" in comp_data
    assert "domain_benchmarks" in comp_data

