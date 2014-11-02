<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>fi: A simple web page font-family usage inspector.</title>
<style>
@font-face {
  font-family: 'git';
  src: url('font/git.eot?33992391');
  src: url('font/git.eot?33992391#iefix') format('embedded-opentype'),
       url('font/git.woff?33992391') format('woff'),
       url('font/git.ttf?33992391') format('truetype'),
       url('font/git.svg?33992391#git') format('svg');
  font-weight: normal;
  font-style: normal;
}

body {
    margin: 0;
    background-color: #28a428;
    font-family: "Avenir Next", "Segoe UI", Arial, sans-serif;
    font-weight: 100;
    color: #fff;
    font-size: 12px;
}

a {
    display: inline-block;
    border: 1px solid #fff;
    border-radius: 3px;
    color: #fff;
    line-height: 2;
    vertical-align: middle;
    text-decoration: none;
    transition: background-color 0.3s, color 0.3s;
}

main {
    position: absolute;
    top: 38.2%;
    left: 50%;
    -webkit-transform: translate(-50%, -38.2%);
    transform: translate(-50%, -38.2%);
    width: 600px;
    overflow: hidden;
    text-align: center;
}

h1 {
    font-weight: 100;
    font-size: 32px;
}

#action {
    display: block;
    width: 200px;
    margin-right: auto;
    margin-left: auto;
    font-size: 32px;
}

#repo-link:hover,
#action:hover {
    background-color: #fff;
    color: #28a428;
}

#hint {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
}

#github-stats a {
    float: left;
    padding: 0 4px;
    border: none;
    font-size: 11px;
}

#github-stats .stat {
    overflow: hidden;
    display: inline-block;
    border: 1px solid #fff;
    border-radius: 3px;
}

#github-stats .stat:hover {
    background-color: #fff;
}

#github-stats .stat:hover a {
    color: #28a428;
}

#repo-link:before,
.text:before {
    content: "\e800";
    font-family: git;
    margin-right: 3px;
}

.text:before {
    float: left;
}

.stat:hover:before,
#repo-link:hover:before {
    color: #28a428;
}

#repo-link {
    position: fixed;
    top: 10px;
    right: 10px;
    padding: 0 4px;
}

a[href^="http://tongji.baidu.com"] {
    display: none;
}
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
<header><a id="repo-link">Fork me on GitHub</a></header>
<main>
    <h1>Inspect font-family usage in a web page through a single click</h1>
    <p><a id="action" href="javascript:{{code}}void(0)">fi</a></p>
    <p id="hint">Save as a bookmarklet or drag this onto your bookmark bar</p>
    <p id="github-stats">
        <span class="stat"><a class="text" id="star-text">Star</a><a id="star-count">-</a></span>
        <span class="stat"><a class="text" id="follow-text">Follow</a><a id="follower-count">-</a></span>
    </div>
</main>
<script>
(function () {
    var head = document.getElementsByTagName('head')[0];
    var user = 'Justineo';
    var repo = 'fi';
    var repoLink = $('repo-link');
    var starText = $('star-text');
    var followText = $('follow-text');
    var starCount = $('star-count');
    var followerCount = $('follower-count');

    function $(id) {
        return document.getElementById(id);
    }

    function addCommas(n) {
        n = Number(n);
        return String(n).replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }

    function jsonp(path) {
        var el = document.createElement('script');
        el.src = path + '?callback=callback';
        head.insertBefore(el, head.firstChild);
    }

    function callback(obj) {
        if (!obj.data) {
            return;
        }
        if (obj.data.watchers != null) {
            $('star-count').innerHTML = addCommas(obj.data.watchers);
        } else if (obj.data.followers != null) {
            $('follower-count').innerHTML = addCommas(obj.data.followers);
        }
    }

    function init() {
        var repoUrl = 'https://github.com/' + user + '/' + repo;
        repoLink.href = repoUrl;
        starText.href = repoUrl;
        starCount.href = repoUrl + '/stargazers';

        var userUrl = 'https://github.com/' + user;
        followText.href = userUrl;
        followText.innerHTML = 'Follow @' + user;
        followerCount.href = userUrl + '/followers';

        window.callback = callback;
        jsonp('https://api.github.com/users/' + user);
        jsonp('https://api.github.com/repos/' + user + '/' + repo);
    }

    init();
})();
</script>
</body>
</html>
