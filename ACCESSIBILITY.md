# Accessibility

This site should work for everyone who visits it, whether they use a mouse, a
keyboard, a screen reader, a phone or a zoomed-in screen. The target is the
[Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)
at level AA.

## What the site does

- **Keyboard.** Everything that works with a mouse also works with the keyboard.
  A "Skip to timeline" link comes first, and focus is always visible. `/` jumps
  to the search box and `Escape` closes the open preview, then the menu.
- **Previews on hover.** The preview that opens over a timeline entry also opens
  when the entry has keyboard focus. It stays open while the pointer is over it
  and `Escape` closes it without moving the pointer (WCAG 1.4.13).
- **Motion.** The site follows your system's "reduce motion" setting: the intro
  is not shown, the hero's robot shows a still frame, and cards appear without
  sliding. Without that setting, moving and blinking effects stop on their own
  within five seconds.
- **The intro.** It plays once per visit (per browser tab session), lasts about
  two seconds, and can be skipped with `Escape`, `Enter`, `Space` or a click.
- **Contrast.** Text and controls aim for at least 4.5:1 contrast (3:1 for large
  text and icons) in both the light and the dark theme.
- **Screen readers.** Buttons and regions have labels, the page language changes
  to French when you choose French, and the number of matching entries is
  announced when you filter. Decorative pictures and animations are hidden from
  screen readers.
- **Without JavaScript.** Every timeline entry is still listed, most important
  first. The blog pages are plain HTML.
- **Themes and print.** Light and dark themes follow your system until you pick
  one. The page prints as a clean list.

## Supported browsers

Current versions of Chrome, Edge, Firefox and Safari, on desktop and on phones.
Some effects (the theme switch reveal, the language crossfade and the
scroll-linked animations) only run in browsers that support them; other
browsers show the same content without the effect.

## Known limitations

- **The intro covers the page** for about two seconds on the first visit of a
  session. It can be skipped as described above and is not shown when your
  system asks to reduce motion.
- **The "At a glance" map** is a visual summary and is hidden from screen
  readers. Each of its bars is an entry in the timeline list below it, so no
  information is lost.
- **Filters, views, the map and the terminal need JavaScript.** Without it you
  get the full list but not these tools.
- **Testing.** The site has been checked with keyboard-only use and with
  contrast measurements, but not yet with every screen reader. Reports from
  screen reader users are especially welcome.

## Report a barrier

If something gets in your way, please say so:

- open an issue with the
  [Report a problem](https://github.com/eliascharbelsalameh/eliascharbelsalameh.github.io/issues/new?template=report-a-problem.yml)
  form and choose "Accessibility barrier", or
- write to esalameh@proton.me if you'd rather not use GitHub.

Saying which page, browser and assistive technology you were using helps.

_Last reviewed: 22 November 2026._
