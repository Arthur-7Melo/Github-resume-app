import os
import sys
import json
import argparse
import requests
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

load_dotenv()

parser = argparse.ArgumentParser()
parser.add_argument("--repo", required=True, help="owner/name do repositório Github")
args = parser.parse_args()
REPO = args.repo

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
if not GITHUB_TOKEN:
  print("Erro: Defina GITHUB_TOKEN no .env", file=sys.stderr)
  sys.exit(1)

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
    langs = fetch_languages(REPO)
    total_bytes = sum(langs.values()) or 1
    top_pct = [
       {
          "name": lang,
          "bytes": count,
          "porcentagem": round((count/total_bytes) * 100, 1)
       }
       for lang, count in langs.items()
    ]
    top_pct.sort(key=lambda x: x["bytes"], reverse=True)

    commits_last_week = fetch_commit_activity(REPO)
    stars = fetch_stars(REPO)
  except requests.HTTPError as e:
    print(f"Erro na GitHub API: {e}", file=sys.stderr)
    sys.exit(1)

  output = {
    "repo": REPO,
    "top_languages": top_pct,
    "commits_last_week": commits_last_week,
    "stars": stars
  }

  print(json.dumps(output, indent=2))

if __name__ == "__main__":
  main()