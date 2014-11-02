<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>fi: A simple web page font-family usage inspector.</title>
<style>
body {
    margin: 0;
    background-color: #28a428;
    font-family: "Avenir Next", "Segoe UI", Arial, sans-serif;
    font-weight: 100;
    color: #fff;
    font-size: 12px;
}

main {
    position: absolute;
    top: 38.2%;
    left: 50%;
    transform: translate(-50%, -38.2%);
    width: 600px;
    overflow: hidden;
    text-align: center;
}

h1 {
    font-weight: 100;
}

#action {
    display: block;
    width: 200px;
    margin-right: auto;
    margin-left: auto;
    border: 1px solid #fff;
    border-radius: 5px;
    line-height: 2;
    color: #fff;
    font-size: 32px;
    text-decoration: none;
    transition: background-color 0.3s, color 0.3s;
}

#action:hover {
    background-color: #fff;
    color: #28a428;
}

#hint {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
}

#github-stats a {
    display: block;
    float: left;
    padding: 2px 4px;
    text-decoration: none;
    transition: background-color 0.3s, color 0.3s;
    color: #fff;
    font-size: 11px;
}

#github-stats .stat {
    display: inline-block;
    overflow: hidden;
    border: 1px solid #fff;
    border-radius: 3px;
}

#github-stats .stat:hover {
    background-color: #fff;
}

#github-stats .stat:hover a {
    color: #28a428;
}
</style>
</head>
<body>
<main>
    <h1>Inspect font-family usage in a web page through a single click</h1>
    <p><a id="action" href="javascript:{{code}}">fi</a></p>
    <p id="hint">Save as a bookmarklet or drag this onto your bookmark bar</p>
    <p id="github-stats">
        <span class="stat"><a id="star-text">Star</a><a id="star-count">-</a></span>
        <span class="stat"><a id="follow-text">Follow</a><a id="follower-count">-</a></span>
    </div>
</main>
<script>
(function () {
    var head = document.getElementsByTagName('head')[0];
    var user = 'Justineo';
    var repo = 'fi';
    var starText = $('star-text');
    var followText = $('follow-text');
    var starCount = $('star-count');
    var followerCount = $('follower-count');

    function $(id) {
        return document.getElementById(id);
    }

    function addCommas(n) {
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
        starText.href = 'https://github.com/' + user + '/' + repo;
        starCount.href = 'https://github.com/' + user + '/' + repo + '/stargazers';

        followText.href = 'https://github.com/' + user;
        followText.innerHTML = 'Follow @' + user;
        followerCount.href = 'https://github.com/' + user + '/followers';

        window.callback = callback;
        jsonp('https://api.github.com/users/' + user);
        jsonp('https://api.github.com/repos/' + user + '/' + repo);
    }

    init();
})();
</script>
</body>
</html>
