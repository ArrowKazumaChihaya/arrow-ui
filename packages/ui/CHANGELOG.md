# @s_and_a/arrow-ui

## 0.1.2

- Show full department/store names and long codes in organization chart cards by wrapping text.

- Organization charts support anchored pan/pinch gestures, async tree data, and non-overlapping mobile controls. Preserve user zoom and pan across design changes.

- OTP digits shrink to fit narrow forms and forward field required/help/label attributes to native controls.

- Keep the OTP draft and corresponding digit focus when switching between classic single-field and remix split-field designs.

### Patch Changes

- Add a shared profile card for manager and personal employee information. Wrap breadcrumb actions at narrow widths and prevent responsive grids and page offsets from overflowing or adding duplicate mobile gutters.

- Restore document scrolling outside dialogs. Keep long navigation titles and input fields within their containers, use the reference page gutters, and remove nested decorative frames inside cards and dialogs. Time ranges support overnight starts and independent start/end updates without overwriting the other draft value.
  - @s_and_a/arrow-ui-tokens@0.1.2
