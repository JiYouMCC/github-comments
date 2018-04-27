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
          $("<div></div>").append(
            $("<a></a>").attr('href', userLink).append(
              $("<img></img>").attr('src', userAvatar).attr('height','20').attr('width','20')
            ).append(
              $("<span></span>").text(userName).addClass('username')
            )
          )
        ).append(
          $("<span></span>").text(date).addClass('post-meta')
        ).append(
          $("<div></div>").append(html).addClass('post-content')
        )
      );
    }
  },
  showForm: function(userInfo, issueId, addCallback) {
    if(userInfo) {
      var userName = userInfo.login;
      var userAvatar = userInfo.avatar_url;
      var userLink = userInfo.html_url;
      $("#comments_form").text("");
      $("#comments_form").append(
          $("<div></div>").append(
            $("<a></a>").attr('href', userLink).append(
              $("<img></img>").attr('src', userAvatar).attr('height','20').attr('width','20')
            ).append(
              $("<span></span>").text(userName).addClass('username')
            )
          )
        );
      $("#comments_form").append($("<textarea></textarea>").attr('id', 'commnet_text'));
      $("#comments_form").append($("<button></button>").attr('id', 'add_comment').text("Enter"));
      $("#add_comment").click(function() {
        GithubComments.Comments.Add(issueId, $("#commnet_text").val(), addCallback);
      });
    } else {
      $("#comments_form").text("");
      $("#comments_form").append($("<a></a>").attr("onclick", 'GithubComments.User.Login()').text("Login"));
    }
  }
}
