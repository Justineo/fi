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
