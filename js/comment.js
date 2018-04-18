Comments = {
    REPOS : undefined,
    OWNER : undefined,
    ACCEPT_JSON: "application/json",
    ACCEPTS : "application/vnd.github.v3+json",
    init: function(owner, repository) {
        Comments.REPOS = repository;
        Comments.OWNER = owner;
    },
    get: function(issueId, callback) {
        $.ajax(
            {
                url: "https://api.github.com/repos/" + Comments.OWNER + "/" + Comments.REPOS + "/issues/" + issueId + "/comments",
                accepts: {
                    json: Comments.ACCEPT_JSON
                },
                dataType: 'json',
            }
        ).done(function(data) {
            callback(data);
        })
    },
    getReactions: function(commentId, callback) {
         $.ajax(
            {
                url: "https://api.github.com/repos/" + Comments.OWNER + "/" + Comments.REPOS + "/issues/comments/" + commentId + "/reactions",
                accepts: {
                    json: "application/vnd.github.squirrel-girl-preview"
                },
                dataType: 'json',
            }
        ).done(function(data) {
            callback(data);
        })
    },
    add: function(callback) {
    }
}
