#!/usr/bin/env python3
"""Seed Sanity CMS documents from the current next-intl message JSON files.

Required env:
  SANITY_API_WRITE_TOKEN
Optional env:
  NEXT_PUBLIC_SANITY_PROJECT_ID (defaults to dwgqm2o3)
  NEXT_PUBLIC_SANITY_DATASET (defaults to production)
  NEXT_PUBLIC_SANITY_API_VERSION (defaults to 2025-01-01)
"""
from __future__ import annotations

import json
import os
import sys
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]


def load_dotenv(path: Path) -> None:
    if not path.exists():
        return
    for raw in path.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def key(value: str) -> str:
    return urllib.parse.quote(value.lower().replace(" ", "-").replace("·", "").replace("/", "-"))[:64]


def with_keys(items: list[dict[str, Any]], prefix: str) -> list[dict[str, Any]]:
    out = []
    for idx, item in enumerate(items):
        title = item.get("title") or item.get("name") or item.get("label") or str(idx)
        out.append({"_key": f"{prefix}-{idx}-{key(str(title))}", **item})
    return out


def card(obj: dict[str, Any]) -> dict[str, Any]:
    return {"title": obj["title"], "body": obj["body"]}


def landing_doc(locale: str, m: dict[str, Any]) -> dict[str, Any]:
    h = m["hero"]
    problem_cards = [card(v) for v in m["problem"]["cards"].values()]
    pillars = [card(v) for v in m["approach"]["pillars"].values()]
    categories = [card(v) for v in m["build"]["categories"].values()]
    apps = list(m["apps"]["items"].values())
    steps = list(m["process"]["steps"].values())
    personas = [card(v) for v in m["forWho"]["personas"].values()]
    training = m["training"]
    cta = m["cta"]
    return {
        "_id": f"landingPage.{locale}",
        "_type": "landingPage",
        "locale": locale,
        "seo": {
            "title": m["meta"]["title"],
            "description": m["meta"]["description"],
        },
        "hero": {
            "eyebrow": h["eyebrow"],
            "title": h["title"],
            "titleAccent": h["titleAccent"],
            "subtitle": h["subtitle"],
            "primaryCta": {"label": h["ctaPrimary"], "href": "#contact"},
            "secondaryCta": {"label": h["ctaSecondary"], "href": "#work"},
            "stats": with_keys([
                {"value": h["stats"]["speed"], "label": h["stats"]["speedLabel"]},
                {"value": h["stats"]["packs"], "label": h["stats"]["packsLabel"]},
                {"value": h["stats"]["ai"], "label": h["stats"]["aiLabel"]},
            ], "stat"),
        },
        "problem": {
            "eyebrow": m["problem"]["eyebrow"],
            "title": m["problem"]["title"],
            "subtitle": m["problem"]["subtitle"],
            "cards": with_keys(problem_cards, "problem"),
        },
        "approach": {
            "eyebrow": m["approach"]["eyebrow"],
            "title": m["approach"]["title"],
            "subtitle": m["approach"]["subtitle"],
            "pillars": with_keys(pillars, "pillar"),
        },
        "build": {
            "eyebrow": m["build"]["eyebrow"],
            "title": m["build"]["title"],
            "subtitle": m["build"]["subtitle"],
            "badge": m["build"].get("badge"),
            "categories": with_keys(categories, "category"),
        },
        "apps": {
            "eyebrow": m["apps"]["eyebrow"],
            "title": m["apps"]["title"],
            "subtitle": m["apps"]["subtitle"],
            "items": with_keys(apps, "app"),
        },
        "process": {
            "eyebrow": m["process"]["eyebrow"],
            "title": m["process"]["title"],
            "subtitle": m["process"]["subtitle"],
            "steps": with_keys(steps, "step"),
        },
        "forWho": {
            "eyebrow": m["forWho"]["eyebrow"],
            "title": m["forWho"]["title"],
            "personas": with_keys(personas, "persona"),
        },
        "training": {
            "eyebrow": training["eyebrow"],
            "title": training["title"],
            "subtitle": training["subtitle"],
            "academyLabel": training["academyLabel"],
            "academyTitle": training["academyTitle"],
            "academyBody": training["academyBody"],
            "forWhomLabel": training["forWhom"],
            "resultLabel": training["result"],
            "levels": with_keys(list(training["levels"].values()), "level"),
            "outcomesTitle": training["outcomesTitle"],
            "outcomes": list(training["outcomes"].values()),
            "cta": {"label": training["cta"], "href": "#contact"},
        },
        "finalCta": {
            "eyebrow": cta["eyebrow"],
            "title": cta["title"],
            "subtitle": cta["subtitle"],
            "expectations": cta["expectations"]["list"],
        },
    }


def mutate(project_id: str, dataset: str, api_version: str, token: str, docs: list[dict[str, Any]]) -> dict[str, Any]:
    url = f"https://{project_id}.api.sanity.io/v{api_version}/data/mutate/{dataset}"
    payload = {"mutations": [{"createOrReplace": doc} for doc in docs]}
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "MyAppFactory CMS seed script",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> int:
    # Load repo-local public vars, then user/server private token if present.
    load_dotenv(ROOT / ".env.local")
    load_dotenv(Path("/opt/data/.env"))
    project_id = os.environ.get("NEXT_PUBLIC_SANITY_PROJECT_ID", "dwgqm2o3")
    dataset = os.environ.get("NEXT_PUBLIC_SANITY_DATASET", "production")
    api_version = os.environ.get("NEXT_PUBLIC_SANITY_API_VERSION", "2025-01-01")
    token = os.environ.get("SANITY_API_WRITE_TOKEN")
    if not token:
        print("Missing SANITY_API_WRITE_TOKEN", file=sys.stderr)
        return 1

    fr = json.loads((ROOT / "messages" / "fr.json").read_text())
    en = json.loads((ROOT / "messages" / "en.json").read_text())
    docs = [
        {
            "_id": "siteSettings",
            "_type": "siteSettings",
            "title": "MyAppFactory",
            "defaultLocale": "fr",
            "mainNav": with_keys([
                {"label": fr["header"]["nav"]["approach"], "href": "#approach"},
                {"label": fr["header"]["nav"]["build"], "href": "#work"},
                {"label": fr["header"]["nav"]["process"], "href": "#process"},
                {"label": fr["header"]["nav"]["training"], "href": "#training"},
                {"label": fr["header"]["nav"]["contact"], "href": "#contact"},
            ], "nav"),
            "contactEmail": fr["cta"]["emailFallback"]["address"],
        },
        landing_doc("fr", fr),
        landing_doc("en", en),
    ]
    result = mutate(project_id, dataset, api_version, token, docs)
    ids = [doc["_id"] for doc in docs]
    print(json.dumps({"ok": True, "projectId": project_id, "dataset": dataset, "upserted": ids, "transactionId": result.get("transactionId")}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
