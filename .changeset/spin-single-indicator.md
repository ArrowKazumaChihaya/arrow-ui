---
"@s_and_a/arrow-ui": patch
"@s_and_a/arrow-ui-design-remix": patch
---

ArSpin: when several loading marks (a wrapping spinner's veil or a bare block spinner) are on screen in the same region, only the first one in reading order turns; the others stay hidden until it ends. ArTimeInput (remix): after four digits the focus moves at once to the next time box in reading order (row by row, left to right) and the box is ready for typing; Tab and Shift+Tab follow the same order. Time boxes keep their own width; the day switch only adds to it.

ArAppHeader: the header menus keep the same weight on hover (no jitter). On touch screens the notice and to-do lists no longer close when the finger lifts: a tap opens them, and a tap outside (or on the pill again) closes them.
