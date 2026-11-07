---
"@s_and_a/arrow-ui": patch
---

Expose the unzoomed paper width to the PDF page slot and update it when the available width changes. Canvas renderers can resize after rotation, viewport changes or panel resizing without losing the selected page or magnifying twice.

Add an optional maximum fit width. It fits the paper at 100% and preserves that base width during zoom, so responsive percentage widths do not cancel the user's magnification.
