Util = {
  showComments: function(issueId) {
    $("#comments").text("");
    $("#comments").append($("<div><span id='comment_count'>⌛</span> comments in all</div>"))
    $("#comments").append($("<div></div>").text("Comments").addClass('post-list-heading'));
    $("#comments").append($("<div></div>").attr('id', 'commnets_data'))

    GithubComments.Comments.Get(issueId, function(result) {
      if (result.status) {
        for (var i = 0; i < result.data.length; i++) {
          Util.addComment(result.data[i]);
        }
        Util.showForm(issueId);
        GithubComments.Comments.Count(issueId, function(result) {
          if (result.status) {
            $("#comment_count").text(result.count);
          }
        });
      } else {
        if (result.data == GithubComments.ERROR.ISSUE_ID_NOT_EXIST) {
          $("#comments").text("");
          $("#comments").append($("<div></div>").text("No comment.").addClass('post-list-heading'));
        }
      }
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
            $("<div></div>").addClass('trigger').append(
              $("<a></a>").addClass('page-link').attr('id', 'link_logout').text("Logout").css('cursor', 'pointer')
            )
          )
        );
        $("#comments_form").append($("<textarea></textarea>").attr('id', 'commnet_text').attr('style', 'width:100%'));
        $("#comments_form").append($("<button></button>").attr('id', 'add_comment').text("Enter"));
        $("#add_comment").click(function() {
          GithubComments.Comments.Add(issueId, $("#commnet_text").val(), function(result) {
            if (result.status) {
              $("#commnet_text").val("");
              Util.addComment(result.data);
              $("#comment_count").text(parseInt($("#comment_count").text()) + 1);
            }
          });
        });
        $('#link_logout').click(function() {
          GithubComments.User.Logout();
          Util.showForm(issueId);

        });
      } else {
        $("#comments_form").text("");
        $("#comments_form").append(
          $("<div></div>").addClass('trigger').append(
            $("<a></a>").click(function() {
              GithubComments.User.Login();
            }).css('cursor', 'pointer').addClass('page-link').text("Login")));
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
    $("#commnets_data").prepend(
      $("<div class='comment'></div>").append(
        $("<div></div>").append(
          $("<a></a>").attr('href', userLink).append(
            $("<img></img>").attr('src', userAvatar).addClass('user_img')
          ).append(
            $("<span></span>").text(userName).addClass('username')
          )
        ).append(
          $("<span></span>").text(" @TA").css('cursor', 'pointer').click(function() {
            Util.addMention(userName)
          })
        )
      ).append(
        $("<span></span>").text(date).addClass('post-meta')
      ).append(
        $("<div></div>").addClass('comment_text').attr('id', 'Comment_' + commentId)
      )
    );

    var converter = new showdown.Converter({
      ghMentions: true,
      tables: true,
      tasklists: true,
      simpleLineBreaks: true,
      openLinksInNewWindow: true,
      simplifiedAutoLink: true
    });
    var html = converter.makeHtml(GithubComments.Emoji.Parse(commentData.body));
    document.getElementById('Comment_' + commentId).innerHTML = GithubComments.Emoji.Parse(html);
  },
  addMention: function(userName) {
    $("#commnet_text").val($("#commnet_text").val() + "@" + userName + " ");
    $("#commnet_text").focus();
  }
}