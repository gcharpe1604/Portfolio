"""Losslessly compress the original fonts: pip install fonttools brotli; python scripts/process-fonts.py."""

from pathlib import Path

from fontTools.ttLib import TTFont

fonts = Path(__file__).resolve().parent.parent / "public" / "fonts"
for name in ("manrope-variable", "ibm-plex-mono"):
    with TTFont(fonts / f"{name}.ttf") as font:
        font.flavor = "woff2"
        font.save(fonts / f"{name}.woff2")
