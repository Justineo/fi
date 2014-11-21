# fi

A snippet for inspecting font-family usage in a webpage.

## What's it for?

To have a quick look into `font-family` usage in a webpage.

Texts inside these elements will be ignored: `script`, `noscript`, `style`, `iframe`, `option`.

Invisible elements won't be taken into account as well, which includes those with `opacity: 0`, `display: none` and `visibility: hidden`.

The result will sort all used `font-family` values by the number of glyphs they apply to. ie. most used one will be at the top of the result list.

## Usage

### Bookmarklet

1. Open http://justineo.github.io/fi/
2. Drag the **fi** link in the middle of the page onto your browser's bookmark bar
3. Open the webpage you'd like to inspect
4. Click the bookmarklet you just added
5. View the result

Bookmarklets can be **blocked** under certain security policies so browser extensions are more recommended.

### Browser Extensions

* [Chrome](https://chrome.google.com/webstore/detail/fi/ijieejlhfllnijjknojcklolfjllhknd)
* [Firefox](https://addons.mozilla.org/zh-CN/firefox/addon/fi/)
