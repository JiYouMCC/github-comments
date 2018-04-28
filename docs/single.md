---
layout: page
title: Single Test Page
permalink: /test/
---
<link href="{{ site.baseurl }}/css/style.css" rel="stylesheet" type="text/css">
The single test page.
<div id="comments_form"></div>
<div id="comments"></div>
<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.min.js"></script>
<!-- <script src="https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js"></script> -->
<script src="{{ site.baseurl }}/js/comment.js"></script>
<script src="{{ site.baseurl }}/js/util.js"></script>
<script type="text/javascript">
//var getUserCallback = function (data) {Util.showForm(data, 1);}
//var initCallback = function(){ GithubComments.User.Get(getUserCallback);};
GithubComments.Init("JiYouMCC", "git-comment", "ca1f2f2f0b71983065c5", "48f6a24d710cc1012011fce5824f89a26fc49970");
Util.showComments(1);
Util.showForm(1);
</script>

