Util = {
  showComments: function(data) {
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
  }
}
