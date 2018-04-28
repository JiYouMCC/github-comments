GithubComments = {
    _accessToken: undefined,
    _clientId: undefined,
    _clientSecret: undefined,
    _owner : undefined,
    _repos : undefined,
    ACCEPT_JSON: "application/json",
    ACCESS_TOKEN_NAME: 'GIT_ACCESS_TOKEN',
    CORS_ANYWHERE: 'https://cors-anywhere.herokuapp.com/',
    PARAM_CODE : 'code',
    SCOPE: "public_repo",
    Init: function(owner, repository, clientId, clientSecret) {
        GithubComments._repos = repository;
        GithubComments._owner = owner;
        GithubComments._clientId = clientId;
        GithubComments._clientSecret = clientSecret;

        // init access token
        var accessToken = localStorage.getItem(GithubComments.ACCESS_TOKEN_NAME);
        if (accessToken) GithubComments._accessToken = accessToken;
    },
    User: {
        _userInfo: undefined,
        Login: function(redirectUri) {
            if (!redirectUri) redirectUri = location.href;
            var data = {
                scope: GithubComments.SCOPE,
                redirect_uri: redirectUri, 
                client_id: GithubComments._clientId,
                client_secret: GithubComments._clientSecret
            };
            location.href = 'https://github.com/login/oauth/authorize?' + $.param(data);
        },
        Logout: function() {
            localStorage.removeItem(GithubComments.ACCESS_TOKEN_NAME);
            GithubComments._accessToken = undefined;
            GithubComments.User._userInfo = undefined;
        },
        GetAccessToken: function(code, callback) {
            if (GithubComments._accessToken) {
                if(callback) callback(GithubComments._accessToken);
                return;
            }

            if (!code) {
                var url = new URL(window.location.href);
                code = url.searchParams.get(GithubComments.PARAM_CODE);
            }

            if (!code) {
                if(callback) callback(undefined);
                return;
            }

            $.ajax({
                method: 'POST',
                url: GithubComments.CORS_ANYWHERE + 'https://github.com/login/oauth/access_token',
                data: {
                    'client_id':GithubComments._clientId,
                    'client_secret':GithubComments._clientSecret,
                    'code':code
                },
                headers: {
                    Accept: GithubComments.ACCEPT_JSON,
                    'X-Requested-With': 'XMLHttpRequest'
                },
            }).done(function(data) {
                if(data.access_token) {
                    GithubComments._accessToken = data.access_token;
                    localStorage.setItem(GithubComments.ACCESS_TOKEN_NAME, data.access_token);
                }

                if(callback) callback(data.access_token);
            });
        },
        Get: function(callback) {
            GithubComments.User.GetAccessToken(undefined, function(accessToken) {
                if (!GithubComments._accessToken) {
                if (callback) callback(undefined);
                    return;
                }

                if (GithubComments.User._userInfo){
                    if (callback) callback(GithubComments.User._userInfo);
                    return;
                }

                $.ajax({
                    url: "https://api.github.com/user?" + $.param({'access_token':GithubComments._accessToken}),
                    dataType: 'json',
                    success: function(data) {
                        GithubComments.User._userInfo = data;
                    }
                }).done(function(data) {
                    if (callback) callback(data);
                });
            });
        },
        IsLogin: function() {
            return Boolean(GithubComments.User._userInfo);
        }
    },
    Comments: {
        Get: function(issueId, callback) {
            $.ajax({
                url: "https://api.github.com/repos/" + GithubComments._owner + "/" + GithubComments._repos + "/issues/" + issueId + "/comments",
                dataType: 'json',
            }).done(function(data) {
                callback(data);
            })
        },
        Add: function(issueId, commentText, callback) {
            if (!GithubComments.User.IsLogin) {
                if(callback) callback(undefined);
            }

            $.ajax({
                method: 'POST',
                url: "https://api.github.com/repos/" + GithubComments._owner + "/" + GithubComments._repos + "/issues/" + issueId + "/comments?" + $.param({'access_token':GithubComments._accessToken}),
                data: JSON.stringify({
                    'body': commentText
                }),
                dataType: 'json'
            }).done(function(data) {
                if (callback) callback(data);
            })
        },
        Count: function(issueId, callback) {
            $.ajax({
                url: "https://api.github.com/repos/" + GithubComments._owner + "/" + GithubComments._repos + "/issues/" + issueId,
                dataType: 'json',
            }).done(function(data) {
                if (callback)
                {
                    callback(data.comments);
                }
            })
        }
    }
/*    getReactions: function(commentId, callback) {
        //TODO
         $.ajax({
             url: "https://api.github.com/repos/" + Comments.OWNER + "/" + Comments._repos + "/issues/comments/" + commentId + "/reactions",
             accepts: {
                 json: "application/vnd.github.squirrel-girl-preview"
             },
             dataType: 'json',
         }).done(function(data) {
             callback(data);
         })
    },*/

}
