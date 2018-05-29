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
<script src="{{ site.baseurl }}/js/comment.min.js"></script>
<script src="{{ site.baseurl }}/js/util.js"></script>
<script type="text/javascript">
GithubComments.Init("JiYouMCC", "github-comments", "ca1f2f2f0b71983065c5", "48f6a24d710cc1012011fce5824f89a26fc49970", function(){
	Util.showComments({{ page.issue }});
});
</script>