import os
import sys
import requests
from fastapi import FastAPI, HTTPException, Query
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from pymongo import MongoClient

from models import LanguageStat, Snapshot, CollectResponse

load_dotenv()

GITHUB_TOKEN   = os.getenv("GITHUB_TOKEN")
MONGO_URI      = os.getenv("MONGO_URI")
DB_NAME        = os.getenv("MONGO_DB", "github_insights")
COLLECTION     = os.getenv("MONGO_COLLECTION", "snapshots")

if not(MONGO_URI or GITHUB_TOKEN):
    print("Erro: MONGO_URI e GITHUB_TOKEN precisam estar definidos no .env")
    sys.exit(1)

HEADERS = {"Authorization": f"Bearer {GITHUB_TOKEN}"}
mongo = MongoClient(MONGO_URI)
db = mongo[DB_NAME]
coll = db[COLLECTION]

app = FastAPI(title="Collector Service")

@app.post("/collector", response_model=CollectResponse)
def collect(repo: str = Query(..., description="Name/owner do repositório no Github")):
    try:
        res = requests.get(
            f"https://api.github.com/repos/{repo}/languages",
            headers=HEADERS
        )
        res.raise_for_status()
        langs = res.json()
    except Exception as e:
        raise HTTPException(400, f"Erro Github/languages: {e}")
    
    since = (datetime.now(timezone.utc) - timedelta(days= 7))\
    .isoformat(timespec="seconds") + "Z"
    total_commits = 0
    page = 1
    while True:
        resp = requests.get(
            f"https://api.github.com/repos/{repo}/commits",
            headers=HEADERS,
            params={
                "since": since,
                "per_page": 100,
                "page": page
            }
        )
        resp.raise_for_status()
        batch = resp.json()
        if not batch:
            break
        total_commits += len(batch)
        page += 1

      
    try :
        st = requests.get(
            f"https://api.github.com/repos/{repo}",
            headers=HEADERS
        )
        st.raise_for_status()
        stars = st.json().get("stargazers_count", 0)
    except Exception as e:
        raise HTTPException(400, f"Erro Github/stars: {e}")

    total_bytes = sum(langs.values()) or 1
    top_pct = sorted(
        [
            LanguageStat(name=k, bytes=v, pct=round((v/total_bytes)*100, 1))
            for k, v in langs.items()
        ],
        key=lambda x: x.bytes, reverse=True
    )

    snapshot = Snapshot(
        repo=repo,
        fetchedAt=datetime.now(timezone.utc),
        top_languages=top_pct,
        commits_last_week=total_commits,
        stars=stars
    )

    doc = snapshot.dict()
    coll.insert_one(doc)

    return CollectResponse(
        status="ok",
        repo=repo,
        insertedAt=snapshot.fetchedAt
    )