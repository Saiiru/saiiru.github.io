"""Public standalone showcase and legacy archive regression.

All twelve repositories are autonomous. Broken links, accidental hiding or
unverified functionality claims are detected without touching other projects.
"""
import os
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE_URL", "http://127.0.0.1:4396")
EXPECTED = [
    "AngularFrontEndMasters", "java-oop-bootcamp", "git-github-foundations",
    "java-algorithms-labs", "react-finance-dashboard", "ignite-lab-archive", "portfolio-ui-experiments",
    "skills-copilot-codespaces-vscode", "ruby-prefix-grouping", "starwarsplanets",
    "travel-planner-api", "java-order-management-cli",
]
CAPTURE_DIR = Path(os.environ.get("CAPTURE_DIR", "/tmp/standalone-portfolio-captures"))

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path="/usr/bin/chromium", headless=True, args=["--no-sandbox"]
    )
    CAPTURE_DIR.mkdir(exist_ok=True, parents=True)
    for width in (320, 390, 768, 1280, 1440):
        page = browser.new_page(
            viewport={"width": width, "height": 900}, reduced_motion="reduce"
        )
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        response = page.goto(BASE, wait_until="networkidle")
        assert response.status == 200, width
        group = page.locator("#projetos-independentes")
        group.scroll_into_view_if_needed()
        group.locator(".standalone-project").first.wait_for(timeout=12000)
        assert group.locator(".standalone-project").count() == 12, width
        assert group.locator(".standalone-family").count() == 4, width
        assert group.locator(".standalone-featured-card").count() == 2, width
        assert group.locator(".standalone-ledger-row").count() == 10, width
        for title, slug in (
            ("Angular Component Lab", "AngularFrontEndMasters"),
            ("Finance Dashboard", "react-finance-dashboard"),
            ("Star Wars Planet Explorer", "starwarsplanets"),
            ("Portfolio UI Experiments", "portfolio-ui-experiments"),
        ):
            demo = group.get_by_role("link", name="Abrir demonstração de " + title)
            assert demo.count() == 1, (title, width)
            assert demo.get_attribute("href") == "https://saiiru.github.io/" + slug + "/"

        for slug in EXPECTED:
            link = group.get_by_role("link", name="Examinar " + slug + " no GitHub")
            assert link.count() == 1, (width, slug)
            assert link.get_attribute("href") == "https://github.com/Saiiru/" + slug
        assert "sem ligação com a KORA" in group.inner_text(), width
        assert page.evaluate("document.documentElement.scrollWidth<=innerWidth"), width
        assert not errors, (width, errors)
        if width in (390, 1440):
            group.screenshot(path=str(CAPTURE_DIR / f"standalone-{width}.png"))
        if width == 390:
            compact = group.locator(".standalone-ledger-row").first
            compact.locator("summary").click()
            assert compact.get_by_role("link", name="DOCUMENTAÇÃO TÉCNICA").is_visible()
            assert compact.get_by_text("Nome anterior:").count() == 1
        page.get_by_role("button", name="EXPLORAR O ARQUIVO").click()
        for slug in ("travel-planner-api", "java-order-management-cli"):
            search = page.get_by_role("searchbox", name="Buscar projeto, tecnologia ou descrição")
            search.fill(slug)
            result = page.locator(".public-repo")
            assert result.count() >= 1, (slug, width)
            assert result.filter(has=page.locator(".repo-slug", has_text=slug)).count() >= 1, (slug, width)
        for old, current in (("Plann.er", "travel-planner-api"), ("ada-commerce", "java-order-management-cli")):
            search.fill(old)
            rows = page.locator(".public-repo")
            assert rows.count() == 1, (width, old, rows.count())
            assert rows.first.get_attribute("href") == "https://github.com/Saiiru/" + current
        page.close()
        print("STANDALONE_PASS", width)
    deep = browser.new_page(viewport={"width": 390, "height": 844})
    deep.goto(BASE + "/#projetos-independentes", wait_until="networkidle")
    deep.locator("#projetos-independentes .standalone-project").first.wait_for(timeout=12000)
    assert deep.locator(".navigation a").first.get_attribute("href") == "#projetos-independentes"
    assert deep.locator("#projetos-independentes .standalone-project").count() == 12
    deep.close()
    print("STANDALONE_DEEP_LINK_PASS")
    broken = browser.new_page(viewport={"width": 390, "height": 844})
    broken.route("**/StandaloneProjects-*.js", lambda route: route.abort())
    broken.goto(BASE, wait_until="networkidle")
    broken.locator("#projetos-independentes").scroll_into_view_if_needed()
    broken.get_by_role("alert").wait_for(timeout=12000)
    assert broken.get_by_role("link", name="Consultar projetos no GitHub").is_visible()
    assert broken.locator("#sairu-title").count() == 1
    broken.close()
    print("STANDALONE_CHUNK_FAILURE_FALLBACK_PASS")
    browser.close()
print("STANDALONE_GALLERY_PASS")
