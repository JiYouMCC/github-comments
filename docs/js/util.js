Util = {
  showComments: function(issueId) {
    $("#comments").text("");
    $("#comments").append($("<div><span id='comment_count'>⌛</span> comments in all</div>"))
    $("#comments").append($("<div></div>").text("Comments").addClass('post-list-heading'));
    $("#comments").append($("<div></div>").attr('id', 'commnets_data'))

    GithubComments.Comments.Get(issueId, function(data) {
      for (var i = 0; i < data.length; i++) {
        Util.addComment(data[i]);
      }
    });

    GithubComments.Comments.Count(issueId, function(count) {
      $("#comment_count").text(count);
    });
  },
  showForm: function(issueId) {
    GithubComments.User.Get(function(userInfo) {
      if (userInfo) {
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
          ).append(
            $("<a></a>").addClass('page-link').attr('id', 'link_logout').text("Logout")
          )
        );
        $("#comments_form").append($("<textarea></textarea>").attr('id', 'commnet_text').attr('style', 'width:100%'));
        $("#comments_form").append($("<button></button>").attr('id', 'add_comment').text("Enter"));
        $("#add_comment").click(function() {
          GithubComments.Comments.Add(issueId, $("#commnet_text").val(), function(data) {
            $("#commnet_text").val("");
            Util.addComment(data);
            $("#comment_count").text(parseInt($("#comment_count").text()) + 1);
          });
        });
        $('#link_logout').click(function() {
          GithubComments.User.Logout();
          Util.showForm(issueId);

        });
      } else {
        $("#comments_form").text("");
        $("#comments_form").append($("<a></a>").attr('id', 'link_login').addClass('page-link').text("Login"));
        $("#link_login").click(GithubComments.User.Login);
      }
    });
  },
  addComment: function(comment) {
    var commentData = comment;
    var commentId = commentData.id;
    var userName = commentData.user.login;
    var userAvatar = commentData.user.avatar_url;
    var userLink = commentData.user.html_url;
    var date = new Date(commentData.created_at);
    var converter = new showdown.Converter();
    converter.setOption('emoji', true);
    converter.setOption('ghMentions', true);
    var html = converter.makeHtml(commentData.body);
    $("#commnets_data").prepend(
      $("<div class='comment'></div>").append(
        $("<div></div>").append(
          $("<a></a>").attr('href', userLink).append(
            $("<img></img>").attr('src', userAvatar).addClass('user_img')
          ).append(
            $("<span></span>").text(userName).addClass('username')
          ).append(
            $("<span></span>").text("@TA").onclick(function(){Util.addMention(userName)})
          )
        )
      ).append(
        $("<span></span>").text(date).addClass('post-meta')
      ).append(
        $("<div></div>").addClass('comment_text').attr('id', 'Comment_' + commentId)
      ) 
    );
    document.getElementById('Comment_' + commentId).innerHTML = html;
  },
  addMention: function(userName) {
    $("#commnet_text").val($("#commnet_text").val() + "@" + userName);
    $("#commnet_text").focus();
  }
}