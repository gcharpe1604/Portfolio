"""Outline the navbar's Manrope 800 gc. mark; requires fonttools."""

from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent
with TTFont(root / "public/fonts/manrope-variable.ttf") as font:
    glyphs = font.getGlyphSet(location={"wght": 800})
    cmap = font.getBestCmap()
    spacing = -0.06 * font["head"].unitsPerEm
    paths = []
    bounds = []
    cursor = 0
    for character in "gc.":
        glyph = glyphs[cmap[ord(character)]]
        outline = SVGPathPen(glyphs)
        glyph.draw(outline)
        box = BoundsPen(glyphs)
        glyph.draw(box)
        left, bottom, right, top = box.bounds
        bounds.append((left + cursor, bottom, right + cursor, top))
        color = "#ae3b28" if character == "." else "#1a1c19"
        paths.append(
            f'<path fill="{color}" transform="translate({cursor},0)" d="{outline.getCommands()}"/>'
        )
        cursor += glyph.width + spacing

left = min(box[0] for box in bounds)
bottom = min(box[1] for box in bounds)
right = max(box[2] for box in bounds)
top = max(box[3] for box in bounds)
scale = min(56 / (right - left), 56 / (top - bottom))
x = (64 - (right - left) * scale) / 2 - left * scale
y = (64 - (top - bottom) * scale) / 2 + top * scale
svg = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
    '<rect width="64" height="64" rx="12" fill="#f3efe5"/>'
    f'<g transform="translate({x},{y}) scale({scale}, {-scale})">'
    + "".join(paths)
    + "</g></svg>\n"
)
(root / "public/assets/gc-mark.svg").write_text(svg, encoding="utf-8")
