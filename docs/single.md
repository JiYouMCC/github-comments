---
layout: page
title: Single Test Page
permalink: /test/
---

The single test page.
<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.min.js"></script>
<script src="{{ site.baseurl }}/js/comment.js"></script>
<script type="text/javascript">
  Comments.init("JiYouMCC", "git-comment");
  var callback = function(data) {
    for (var i = data.length - 1; i >= 0; i--) {
      var commentData = data[i];
      var userName = commentData.user.login;
      var userAvatar = commentData.user.avatar_url;
      var userLink = commentData.user.html_url;
      var date = new Date(commentData.created_at);
      var converter = new showdown.Converter();
      var html = converter.makeHtml(commentData.body);
      $("#comments").append(
        $("<div class='comment'></div>").append(
          $("<p></p>").text(userName + " @ " + date)
        ).append(
          $(html)
        )
      );
    }
    console.log(data);
  }
  Comments.get(1, callback);
</script>
<div id="comments"></div>
