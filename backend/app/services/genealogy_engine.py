import math
import re
from typing import Any
from sqlalchemy.orm import Session
from app.models.complaint import Complaint

class GenealogyEngine:
    @staticmethod
    def _tokenize(text: str) -> set[str]:
        # Simple stopword filtering and tokenization
        stopwords = {
            "the", "a", "an", "is", "in", "it", "of", "and", "or", "for", "to", "at", 
            "by", "with", "from", "on", "that", "this", "my", "our", "after", "about"
        }
        words = re.findall(r"\b[a-z]{3,}\b", text.lower())
        return {w for w in words if w not in stopwords}

    @staticmethod
    def calculate_similarity(text1: str, text2: str) -> float:
        """
        Calculates Jaccard + Semantic token similarity between two complaint narratives.
        Also accounts for domain and failure symptom equivalence.
        """
        tokens1 = GenealogyEngine._tokenize(text1)
        tokens2 = GenealogyEngine._tokenize(text2)
        
        if not tokens1 or not tokens2:
            return 0.0
            
        intersection = tokens1.intersection(tokens2)
        union = tokens1.union(tokens2)
        jaccard = len(intersection) / len(union)

        # Semantic synonym groups
        synonyms = [
            {"stops", "shuts", "turns", "cuts", "dies", "halt", "down", "off", "fails"},
            {"overheating", "hot", "thermal", "heat", "warm", "burn"},
            {"vibration", "shaking", "screeching", "noise", "whine", "sound", "rattling"},
            {"black", "blank", "dark", "flicker", "display", "screen"},
            {"crash", "freeze", "hang", "unresponsive", "halt"}
        ]
        
        synonym_bonus = 0.0
        for group in synonyms:
            if any(t in tokens1 for t in group) and any(t in tokens2 for t in group):
                synonym_bonus += 0.25

        score = min(1.0, (jaccard * 0.7) + (synonym_bonus * 0.3))
        return round(score, 3)

    @classmethod
    def find_related_complaints(
        cls, 
        target_complaint: Complaint, 
        db: Session, 
        threshold: float = 0.45, 
        limit: int = 8
    ) -> list[dict[str, Any]]:
        """
        Scans other complaints in the same or related organization to find genealogy links.
        """
        candidates = db.query(Complaint).filter(
            Complaint.id != target_complaint.id,
            Complaint.organization_id == target_complaint.organization_id
        ).all()

        results = []
        target_corpus = f"{target_complaint.title} {target_complaint.description} {target_complaint.product_service}"

        for cand in candidates:
            cand_corpus = f"{cand.title} {cand.description} {cand.product_service}"
            sim = cls.calculate_similarity(target_corpus, cand_corpus)
            
            # Boost score if same primary domain or identical product line
            if cand.primary_domain and target_complaint.primary_domain and cand.primary_domain == target_complaint.primary_domain:
                sim = min(1.0, sim + 0.15)
            if cand.product_service.lower() in target_complaint.product_service.lower() or target_complaint.product_service.lower() in cand.product_service.lower():
                sim = min(1.0, sim + 0.20)

            if sim >= threshold:
                results.append({
                    "complaint_id": cand.id,
                    "tracking_code": cand.tracking_code,
                    "title": cand.title,
                    "product_service": cand.product_service,
                    "primary_domain": cand.primary_domain,
                    "similarity_score": round(sim, 3),
                    "status": cand.status,
                    "created_at": cand.created_at.isoformat()
                })

        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results[:limit]
