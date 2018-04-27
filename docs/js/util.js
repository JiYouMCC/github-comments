Util = {
  showComments: function(data) {
    $("#comments").text("");
    $("#comments").append($("<div></div>").text("Comments").addClass('post-list-heading'));
    for (var i = 0; i < data.length; i++) {
      Util.addComment(data[i]);
    }
  },
  showForm: function(userInfo, issueId) {
    if(userInfo) {
      var userName = userInfo.login;
      var userAvatar = userInfo.avatar_url;
      var userLink = userInfo.html_url;
      $("#comments_form").text("");
      $("#comments_form").append(
          $("<div></div>").append(
            $("<a></a>").attr('href', userLink).append(
              $("<img></img>").attr('src', userAvatar).addClass('user_img')
            ).append(
              $("<span></span>").text(userName).addClass('username')
            )
          )
        );
      $("#comments_form").append($("<a></a>").addClass('page-link').attr("onclick", 'GithubComments.User.Logout(Util.showForm);').text("Logout"));
      $("#comments_form").append($("<textarea></textarea>").attr('id', 'commnet_text'));
      $("#comments_form").append($("<button></button>").attr('id', 'add_comment').text("Enter"));
      $("#add_comment").click(function() {
        GithubComments.Comments.Add(issueId, $("#commnet_text").val(), function(data){
          $("#commnet_text").val("");
          Util.addComment(data);
        });
        
      });
    } else {
      $("#comments_form").text("");
      $("#comments_form").append($("<a></a>").addClass('page-link').attr("onclick", 'GithubComments.User.Login()').text("Login"));
    }
  },
  addComment: function(comment) {
    var commentData = comment;
    var userName = commentData.user.login;
    var userAvatar = commentData.user.avatar_url;
    var userLink = commentData.user.html_url;
    var date = new Date(commentData.created_at);
    var converter = new showdown.Converter();
    converter.setOption('emoji', true);
    var html = converter.makeHtml(commentData.body);
    $("#comments").prepend(
      $("<div class='comment'></div>").append(
        $("<div></div>").append(
          $("<a></a>").attr('href', userLink).append(
            $("<img></img>").attr('src', userAvatar).addClass('user_img')
          ).append(
            $("<span></span>").text(userName).addClass('username')
          )
        )
      ).append(
        $("<span></span>").text(date).addClass('post-meta')
      ).append(
        $("<div></div>").append(html).addClass('comment_text')
      )
    );
  }
}
