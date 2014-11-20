<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>fi: A simple web page font-family usage inspector.</title>
<style>
{{{style}}}
</style>
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?14e3eaa9f77516e10d56d0d7757c4dcc";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
</script>
</head>
<body>
<header><a class="link github" id="fork">Fork me on GitHub</a></header>
<main>
    <h1>Inspect font-family usage in a web page through a single click</h1>
    <p><a class="link main" href="javascript:{{bookmarklet}}void(0)">fi</a></p>
    <p class="hint">Save as a bookmarklet or drag this onto your bookmark bar</p>
    <p class="hint headsup">Have <span title="Bookmarklets may be blocked under certain security policies.">problems</span>? Try browser extensions below:</p>
    <p><a class="link chrome" href="https://chrome.google.com/webstore/detail/fi/ijieejlhfllnijjknojcklolfjllhknd">For Google Chrome</a></p>
    <p id="github-stats">
        <span class="stat"><a class="text" id="star-text">Star</a><a id="star-count">-</a></span>
        <span class="stat"><a class="text" id="follow-text">Follow</a><a id="follower-count">-</a></span>
    </p>
</main>
<script>
{{{init}}}
</script>
</body>
</html>
