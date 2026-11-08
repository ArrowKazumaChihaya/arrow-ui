---
"@s_and_a/arrow-ui": patch
---

Restore keyboard focus after a wrapping loading spinner finishes. Preserve the previous control without scrolling, unless focus moved elsewhere, the control was removed/disabled/hidden, or an enclosing region remains inert. This keeps consecutive keyboard operations usable after asynchronous saves.
