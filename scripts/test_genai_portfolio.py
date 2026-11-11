"""Regression checks for the public GenAI portfolio refresh (no network access)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_new_palette_is_explicit():
    css = (ROOT / "src/cyber2077.css").read_text()
    for color in ("#F3E600", "#00E5FF", "#FF2DAA", "#0313A6", "#C5003C", "#050505"):
        assert color.lower() in css.lower()
    assert "prefers-reduced-motion" in css


def test_palette_is_in_live_bundle():
    app = (ROOT / "src/App.jsx").read_text()
    assert "import './cyber2077.css'" in app
    assert 'href="#labs"' in app


def test_luka_is_not_advertised_publicly():
    for name in ("src/App.jsx", "src/components/datashards.js", "README.md"):
        text = (ROOT / name).read_text().lower()
        assert "luka" not in text, name
    index = (ROOT / "src/components/PublicArchive.jsx").read_text()
    assert "LUKA-MKI" in index


def test_portfolio_has_real_evidence_not_fake_production_claims():
    app = (ROOT / "src/App.jsx").read_text()
    shard = (ROOT / "src/components/datashards.js").read_text()
    for project in ("Crivo", "Vetor", "Lastro", "KORA"):
        assert project.lower() in (app + shard).lower()
    assert "sintétic" in shard

if __name__ == '__main__':
    import inspect
    functions = [(name, obj) for name, obj in globals().items() if name.startswith('test_') and inspect.isfunction(obj)]
    failures = 0
    for name, fn in functions:
        try:
            fn()
            print(f'PASS {name}')
        except Exception as exc:
            print(f'FAIL {name}: {exc}')
            failures += 1
    raise SystemExit(bool(failures))
