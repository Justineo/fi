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
    </style>
</head>
<body>
    <main>
        <h1>Inspect font-family usage in a web page through a single click</h1>
        <p><a id="action" href="javascript:{{code}}">fi</a></p>
        <p id="hint">Save as a bookmarklet or drag this onto your bookmark bar</p>
        <div class="github">
            <iframe width="85" scrolling="0" height="20" frameborder="0" allowtransparency="true" src="http://ghbtns.com/github-btn.html?user=Justineo&amp;repo=fi&amp;type=watch&amp;count=true"></iframe>
            <iframe width="85" scrolling="0" height="20" frameborder="0" allowtransparency="true" src="http://ghbtns.com/github-btn.html?user=Justineo&amp;repo=fi&amp;type=fork&amp;count=true"></iframe>
        </div>
    </main>
    <footer></footer>
</body>
</html>
