from pydantic import BaseModel
from datetime import datetime
from typing import List

class LanguageStat(BaseModel):
  name: str
  bytes: int
  pct: float

class Snapshot(BaseModel):
  repo: str
  fetchedAt: datetime
  top_languages: List[LanguageStat]
  commits_last_week: int
  stars: int

class CollectResponse(BaseModel):
  status: str
  repo: str
  insertedAt: datetime

