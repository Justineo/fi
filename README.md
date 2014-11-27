# fi

A snippet for inspecting font-family usage in a webpage.

## What's it for?

To have a quick look into `font-family` usage in a webpage.

Texts inside these elements will be ignored: `script`, `noscript`, `style`, `iframe`, `option`.

Invisible elements won't be taken into account as well, which are verified by any of the following criteria:

* with `opacity: 0`
* with `display: none`
* with `visibility: hidden`
* with `text-indent` value no larger than `-512` (an intuitive value) or the value equals to `100%` (which are common ways of hiding text for icons or title images)
* with computed area no larger than 1px² and with `overflow` value not equal to `visible` (which are common ways to provide accessibility enhancement, see GitHub's `a.accessibility-aid` at the begining of `body`)
* with `clip: rect(1px, 1px, 1px, 1px)` (another way of hiding text)
* with invisible `parentNode` according to the criteria above

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
* [Firefox](https://addons.mozilla.org/zh-CN/firefox/addon/fi/)(under review)

	*Firefox version provide additional functionalities to see the glyph count grouping by used font family values.*
