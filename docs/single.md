---
layout: page
title: Single Test Page
permalink: /test/
issue: 1
---
<link href="{{ site.baseurl }}/css/style.css" rel="stylesheet" type="text/css">
The single test page.
<div id="comments_form"></div>
<div id="comments"></div>
<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.min.js"></script>
<script src="{{ site.baseurl }}/js/comment.js"></script>
<script src="{{ site.baseurl }}/js/util.js"></script>
<script src="{{ site.baseurl }}/js/gh-emoji.min.js"></script>
<script type="text/javascript">
GithubComments.Init("JiYouMCC", "github-comments", "ca1f2f2f0b71983065c5", "48f6a24d710cc1012011fce5824f89a26fc49970");
Util.showComments({{ page.issue }});
</script>
<script type="text/babel">
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        toString() {
            return '(' + this.x + ', ' + this.y + ')';
        }
    }

    function f() {
        alert('es5的写法');
    }

    var p = new Point('横坐标', '纵坐标');
    alert(p);
    const name = '张三';
    alert(name);
    f();

    var arrs = [1, 2, 3, 4, 5, 6];

    var array = arrs.filter(obj => obj > 3);

    console.log(arrs);
    console.log(array);
</script>

