Util = {
  showComments: function(data) {
    $("#comments").text("");
    $("#comments").append($("<div></div>").text("Comments").addClass('post-list-heading'));
    for (var i = data.length - 1; i >= 0; i--) {
      var commentData = data[i];
      var userName = commentData.user.login;
      var userAvatar = commentData.user.avatar_url;
      var userLink = commentData.user.html_url;
      var date = new Date(commentData.created_at);
      var converter = new showdown.Converter();      
      converter.setOption('emoji', true);
      var html = converter.makeHtml(commentData.body);
      $("#comments").append(
        $("<div class='comment'></div>").append(
          $("<a></a>").attr('href', userLink).append($("<span></span>").text(userName).addClass('username'))
        ).append(
          $("<span></span>").text(date).addClass('post-meta')
        ).append(
          $("<div></div>").append(html).addClass('post-content')
        )
      );
    }
  }
}
