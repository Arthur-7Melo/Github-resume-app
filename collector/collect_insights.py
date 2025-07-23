import os
import sys
import json
import argparse
import requests
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

def main():
  try:
    langs = fetch_languages(REPO)
  except requests.HTTPError as e:
    print(f"Erro na GitHub API: {e}", file=sys.stderr)
    sys.exit(1)

  output = {
    "repo": REPO,
    "top_languages": langs
  }

  print(json.dumps(output, indent=2))

if __name__ == "__main__":
  main()