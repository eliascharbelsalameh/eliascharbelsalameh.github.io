# Contributing

Thanks for taking a look. This repository is the personal website of Elias
Charbel Salameh, so it works a little differently from an open-source project.

## Reporting a problem

Open an issue with the
[Report a problem](https://github.com/eliascharbelsalameh/eliascharbelsalameh.github.io/issues/new/choose)
form if you find:

- a broken link or an image that doesn't load;
- a typo, or a fact that looks wrong;
- something that displays wrongly in your browser, theme (light or dark),
  language (English or French) or screen size;
- an accessibility barrier (see [ACCESSIBILITY.md](../ACCESSIBILITY.md)).

For a security problem, don't open an issue: follow [SECURITY.md](SECURITY.md).

## Pull requests

- **Content.** Pull requests that change the content can't be accepted: the
  text in `assets/js/data.js`, the posts in `posts/` and the images in
  `assets/images/` describe the author and are all rights reserved (see
  [LICENSE](../LICENSE)). If something in them is wrong, open an issue.
- **Code.** Small fixes to the HTML, CSS, JavaScript or `tools/` are welcome.
  For anything larger, open an issue first so we can agree on it before you
  spend time on it.

By opening a pull request you agree that your contribution is released under
the MIT License, like the rest of the code.

## Working on the code

There is nothing to install. With Node 18 or newer:

1. Make your change (the README's file map says what lives where).
2. Run `node tools/build.mjs`. It regenerates the parts of `index.html`,
   `blog/`, `404.html` and `sitemap.xml` that come from the content. Commit
   what it changes: the check on every push and pull request runs
   `node tools/build.mjs --check` and fails if they are out of date.
3. Preview it through a local server, as in the README's
   [Preview locally](../README.md#2-preview-locally) section. Check the light
   and dark themes, English and French, a phone width, and your system's
   "reduce motion" setting.

The code keeps to a few habits:

- no dependencies and no bundler;
- `app.js` is written in ES5 style (`var` and function declarations);
- colours are tokens in `styles.css`, defined for both themes;
- every visible string is in both the English and the French tables;
- every animation has a reduced-motion path.

## Conduct

Everyone taking part is expected to follow the
[code of conduct](CODE_OF_CONDUCT.md).
