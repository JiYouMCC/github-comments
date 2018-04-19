---
layout: page
title: Single Test Page
permalink: /test/
---
The single test page.
<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.min.js"></script>
<script src="{{ site.baseurl }}/js/comment.js"></script>
<script src="{{ site.baseurl }}/js/util.js"></script>
<script type="text/javascript">
Comments.init("JiYouMCC", "git-comment");
Comments.get(1, Util.showComments);
</script>
<div id="comments"></div>
