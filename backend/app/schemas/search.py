from typing import Optional
from pydantic import BaseModel

class SearchResultItem(BaseModel):
    id: str
    entity_type: str  # complaint, incident, solver, policy, evidence, customer
    title: str
    subtitle: str
    domain: Optional[str] = None
    status: Optional[str] = None
    link_url: str

class GlobalSearchResponse(BaseModel):
    query: str
    total_results: int
    results: list[SearchResultItem] = []
