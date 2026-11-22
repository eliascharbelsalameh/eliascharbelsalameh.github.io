# Security policy

This is a static website. GitHub Pages serves its files as they are: there is
no server code, no account, no form that sends data and no tracking. The only
things it stores are your theme and language choices (in `localStorage`) and
whether the intro has already played (in `sessionStorage`), all in your own
browser.

## Reporting a vulnerability

Please don't open a public issue. Write to esalameh@proton.me with:

- the page affected and what an attacker could do with it;
- the steps to reproduce it, and the browser you used.

I'll reply as soon as I can. Once it's fixed, I'm happy to credit you in the
commit if you'd like.

## Scope

**In scope:** the code in this repository and the site it publishes at
<https://eliascharbelsalameh.github.io>, for example script injection through
the address (the `?lang=` parameter, links to an entry, the 404 page).

**Out of scope:**

- GitHub Pages itself: report those to GitHub through
  <https://bounty.github.com>;
- reports from automated scanners with no demonstrated impact, such as missing
  security headers that GitHub Pages doesn't let a site set.
