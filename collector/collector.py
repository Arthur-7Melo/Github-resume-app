import os
import sys
import json
import argparse
import requests
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

parser = argparse.ArgumentParser()
parser.add_argument("--repo", required=True, help="owner/name do repositório Github")
args = parser.parse_args()
repo = args.repo

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
if not GITHUB_TOKEN:
  print("Erro: Defina GITHUB_TOKEN no .env", file=sys.stderr)
  sys.exit(1)
MONGO_URI= os.getenv("MONGO_URI")
if not MONGO_URI:
  print("⚠️  Erro: defina MONGO_URI no .env", file=sys.stderr)
  sys.exit(1)
DB_NAME        = os.getenv("MONGO_DB", "github_insights")
COLLECTION     = os.getenv("MONGO_COLLECTION", "snapshots")

HEADERS = {"Authorization": f"Bearer {GITHUB_TOKEN}"}

def fetch_languages(repo: str) -> dict:
  url = f"https://api.github.com/repos/{repo}/languages"
  resp = requests.get(url, headers=HEADERS)
  resp.raise_for_status()
  return resp.json()

def fetch_commit_activity(repo: str) -> int:
    since_dt = datetime.now(timezone.utc) - timedelta(days=7)
    since = since_dt.isoformat(timespec="seconds")

    all_commits = []
    page = 1

    while True:
        url = (
            f"https://api.github.com/repos/{repo}/commits"
            f"?since={since}"
            f"&per_page=100"
            f"&page={page}"
        )
        resp = requests.get(url, headers=HEADERS)
        resp.raise_for_status()
        batch = resp.json()

        if not batch:
            break

        all_commits.extend(batch)
        page += 1
        return len(all_commits)
    
def fetch_stars(repo: str) -> int:
  url = f"https://api.github.com/repos/{repo}"
  resp = requests.get(url, headers=HEADERS)
  resp.raise_for_status()
  data = resp.json()
  return data.get("stargazers_count", 0)

def main():
  try:
        langs = fetch_languages(repo)
        commits = fetch_commit_activity(repo)
        stars = fetch_stars(repo)
  except requests.HTTPError as e:
        print(f"⚠️  Erro na GitHub API: {e}", file=sys.stderr)
        sys.exit(1)

  
  total_bytes = sum(langs.values()) or 1
  top_pct = [
        {
            "name": lang,
            "bytes": count,
            "pct": round((count/total_bytes)*100, 1)
        }
        for lang, count in langs.items()
    ]
  top_pct.sort(key=lambda x: x["bytes"], reverse=True)

  snapshot = {
        "repo": repo,
        "fetchedAt": datetime.now(timezone.utc),
        "top_languages": top_pct,
        "commits_last_week": commits,
        "stars": stars
    }

  client = MongoClient(MONGO_URI)
  db = client[DB_NAME]
  coll = db[COLLECTION]
  coll.insert_one(snapshot)
  print(json.dumps({
        "status": "ok",
        "repo": repo,
        "insertedAt": snapshot["fetchedAt"].isoformat()
    }, ensure_ascii=False))

if __name__ == "__main__":
  main()