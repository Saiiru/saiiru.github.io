"""Regression for public proof-only project showcase: 3 demos, no incomplete work."""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = os.environ.get('BASE_URL', 'http://127.0.0.1:4396')
CAPTURE_DIR = Path(os.environ.get('CAPTURE_DIR', '/tmp/standalone-portfolio-captures'))
DEMONSTRABLE = [
    ('HOLO-NET Fleet Registry', 'starwarsplanets'),
    ('Finance Dashboard', 'react-finance-dashboard'),
    ('Angular Component Lab', 'AngularFrontEndMasters'),
]
HIDDEN = ['ignite-lab-archive', 'java-order-management-cli',
          'travel-planner-api', 'skills-copilot-codespaces-vscode',
          'portfolio-ui-experiments', 'git-github-foundations']

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    CAPTURE_DIR.mkdir(exist_ok=True, parents=True)
    for width in (320, 390, 768, 1280, 1440):
        page = browser.new_page(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        response = page.goto(BASE, wait_until='networkidle')
        assert response.status == 200, width
        group = page.locator('#projetos-independentes')
        group.scroll_into_view_if_needed()
        group.locator('.standalone-project').first.wait_for(timeout=12000)
        assert group.locator('.standalone-project').count() == 3, width
        assert group.locator('.standalone-featured-card').count() == 2, width
        assert group.locator('.standalone-ledger-row').count() == 1, width
        for title, slug in DEMONSTRABLE:
            demo = group.get_by_role('link', name='Abrir demonstração de ' + title)
            assert demo.count() == 1, (width, title)
            assert demo.get_attribute('href') == 'https://saiiru.github.io/' + slug + '/'
            source = group.get_by_role('link', name='Examinar ' + slug + ' no GitHub')
            assert source.count() == 1, (width, slug)
        for slug in HIDDEN:
            assert group.get_by_role('link', name='Examinar ' + slug + ' no GitHub').count() == 0, (width, slug)
        assert page.locator('#todos-projetos').count() == 0
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), width
        assert not errors, (width, errors)
        if width in (390, 1440):
            group.screenshot(path=str(CAPTURE_DIR / f'proof-only-{width}.png'))
        print('PROOF_ONLY_SHOWCASE_PASS', width, flush=True)
        page.close()
    deep = browser.new_page(viewport={'width':390, 'height':844})
    deep.goto(BASE + '/#projetos-independentes', wait_until='networkidle')
    assert deep.locator('#projetos-independentes .standalone-project').count() == 3
    deep.close()
    print('PROOF_ONLY_DEEP_LINK_PASS', flush=True)
    broken = browser.new_page(viewport={'width':390, 'height':844})
    broken.route('**/StandaloneProjects-*.js', lambda route: route.abort())
    broken.goto(BASE, wait_until='networkidle')
    broken.locator('#projetos-independentes').scroll_into_view_if_needed()
    broken.get_by_role('alert').wait_for(timeout=12000)
    assert broken.get_by_role('link', name='Consultar projetos no GitHub').is_visible()
    broken.close()
    print('PROOF_ONLY_FAILURE_FALLBACK_PASS', flush=True)
    browser.close()
