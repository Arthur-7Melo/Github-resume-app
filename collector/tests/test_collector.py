import os
import sys
import json
from datetime import datetime, timezone, timedelta
import mongomock
import pytest
import requests
from fastapi import status
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from main import app, coll, HEADERS

client = TestClient(app)

class DummyResponse:
  def __init__(self, status_code, json_data):
    self.status_code = status_code
    self._json = json_data
  def raise_for_status(self):
    if self.status_code >= 400:
      raise requests.HTTPError(f"{self.status_code} Error")
  def json(self):
    return self._json
  
@pytest.fixture(autouse=True)
def stub_mongo(monkeypatch):
  fake_client = mongomock.MongoClient()
  fake_db = fake_client["test_db"]
  fake_coll = fake_db["snapshots"]
  monkeypatch.setattr("main.coll", fake_coll)
  return fake_coll

@pytest.fixture
def fake_languages(monkeypatch):
  data = {
    "Python": 1234,
    "Javascript": 4321
  }
  monkeypatch.setattr(
    "request.get",
    lambda url, headers=None, params=None: DummyResponse(200, data)
    if url.endswith("/languages") else DummyResponse(200, {})
  )
  return data

@pytest.fixture
def fake_commits(monkeypatch):
  calls = {"count": 0}
  def fake_get(url, headers=None, params=None):
    if "/commits" in url:
      calls["count"] += 1
      if calls["count"] == 1:
        return DummyResponse(200, [{}, {}, {}])
      return DummyResponse(200, [])
    return DummyResponse(200, {})
  monkeypatch.setattr("requests.get", fake_get)
  return calls

def test_collect_success(monkeypatch, stub_mongo):
  repo = "owner/repo"
  def fake_get(url, headers=None, params=None):
    if url.endswith("/languages"):
      return DummyResponse(200, {"JS": 10, "Py": 5})
    if "/commits" in url:
      return DummyResponse(200, [])
    if url.endswith(f"/{repo}"):
      return DummyResponse(200, {"stargazers_count": 3})
    return DummyResponse(404, {})
  monkeypatch.setattr("requests.get", fake_get)

  resp = client.post(f"/collector?repo={repo}")
  assert resp.status_code == status.HTTP_200_OK

  body = resp.json()
  assert body["status"] == "ok"
  assert body["repo"] == "owner/repo"
  assert "insertedAt" in body

  docs = list(stub_mongo.find({"repo": repo}))
  assert len(docs) == 1
  doc = docs[0]
  assert doc["stars"] == 3
  assert doc["commits_last_week"] == 0
  lang_names = [l["name"] for l in doc["top_languages"]]
  assert set(lang_names) == {"JS", "Py"}

def test_collect_fail_languages(monkeypatch):
  repo = "owner/badrepo"
  def fake_get(url, headers=None, params=None):
    if url.endswith("/languages"):
      raise requests.ConnectionError("Network!")
    return DummyResponse(200, {})
  monkeypatch.setattr("requests.get", fake_get)

  resp = client.post(f"/collector?repo={repo}")
  assert resp.status_code == status.HTTP_400_BAD_REQUEST
  assert "Erro Github/languages" in resp.text


