"""Browser regression: all four current datashards, deep links, keyboard and export."""
import json
import os
import tempfile
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE_URL", "http://127.0.0.1:4392")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path="/usr/bin/chromium", args=["--no-sandbox"])
    page = browser.new_page(viewport={"width": 1440, "height": 1000}, accept_downloads=True)
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(BASE, wait_until="networkidle")

    assert page.locator(".datashard-archive").count() == 1
    assert page.locator(".shard-select").count() == 4
    assert page.locator(".shard-select[aria-pressed=true]").get_attribute("data-shard") == "rota"
    assert page.get_by_role("tab").count() == 3
    assert page.get_by_role("tabpanel").count() == 1
    assert "KORA / Rota" in page.locator(".shard-reader").inner_text()

    page.locator('.shard-select[data-shard="vetor"]').click()
    assert page.locator('.shard-select[data-shard="vetor"]').get_attribute("aria-pressed") == "true"
    assert page.locator(".shard-demo-link").get_attribute("href") == "/labs/index.html?lab=vetor"
    assert "shard=vetor" in page.url
    assert "02 / 04" in page.locator(".archive-read-count").inner_text()
    assert page.get_by_role("link", name="LER O README").get_attribute("href").endswith("/vetor/README.md")
    assert page.get_by_role("link", name="RELATÓRIO DE AVALIAÇÃO").get_attribute("href").endswith("/reports/vetor.json")

    page.get_by_role("tab", name="Implementação", exact=True).click()
    assert "aprovação" in page.get_by_role("tabpanel").inner_text().lower()
    page.get_by_role("tab", name="Implementação", exact=True).press("ArrowRight")
    assert page.get_by_role("tab", name="Testes e provas", exact=True).get_attribute("aria-selected") == "true"
    assert "vetor-ml.test.mjs" in page.get_by_role("tabpanel").inner_text()
    page.get_by_role("tab", name="Testes e provas", exact=True).press("Home")
    assert page.get_by_role("tab", name="O problema", exact=True).get_attribute("aria-selected") == "true"

    with page.expect_download() as item:
        page.locator(".shard-export").click()
    download = item.value
    with tempfile.TemporaryDirectory() as directory:
        filename = Path(directory) / download.suggested_filename
        download.save_as(filename)
        record = json.loads(filename.read_text())
        assert record["id"] == "vetor"
        assert record["mode"] == "trained-ml-local"
        assert record["demo"].endswith("lab=vetor")
        assert record["readme"].endswith("/vetor/README.md")
        assert record["report"].endswith("/reports/vetor.json")
        assert record["publicTitle"].startswith("Vetor —")
    assert download.suggested_filename.endswith(".datashard.json")

    page.goto(BASE + "?shard=lastro#labs", wait_until="networkidle")
    assert page.locator(".shard-select[aria-pressed=true]").get_attribute("data-shard") == "lastro"
    page.locator('.shard-select[data-shard="lastro"]').press("ArrowLeft")
    assert page.locator(".shard-select[aria-pressed=true]").get_attribute("data-shard") == "vetor"
    page.goto(BASE + "?shard=invalid#labs", wait_until="networkidle")
    assert page.locator(".shard-select[aria-pressed=true]").get_attribute("data-shard") == "crivo"
    print("PASS selection, keyboard, deep links, fallback, proof links and JSON export")

    for width in [320, 390, 768, 1280, 1440]:
        viewport = browser.new_page(viewport={"width": width, "height": 900}, reduced_motion="reduce")
        viewport.goto(BASE, wait_until="networkidle")
        viewport.locator('.shard-select[data-shard="lastro"]').click()
        assert viewport.locator(".shard-reader h3").inner_text() == "Lastro"
        assert viewport.evaluate("document.documentElement.scrollWidth<=innerWidth"), width
        assert viewport.locator('.shard-select[data-shard="lastro"]').is_visible()
        print("PASS shard archive width", width)
        viewport.close()

    assert not errors, errors
    browser.close()

print("DATASHARD_SUITE_PASS")
