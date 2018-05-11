GithubComments = {
    _accessToken: undefined,
    _clientId: undefined,
    _clientSecret: undefined,
    _owner: undefined,
    _repos: undefined,
    _emojiJson: undefined,
    ACCEPT_JSON: "application/json",
    ACCESS_TOKEN_NAME: 'GIT_ACCESS_TOKEN',
    EMOJI_JSON: 'EMOJI_JSON',
    CORS_ANYWHERE: 'https://cors-anywhere.herokuapp.com/',
    PARAM_CODE: 'code',
    SCOPE: "public_repo",
    GITHUB_GPI: 'https://api.github.com',
    ERROR: {
        ISSUE_NOT_FOUND: "Comment issue not found, maybe not created.",
        UNHANDLE_EXCEPTION: "Error",
        NOT_LOGIN: "User has not login.",
        ISSUE_ID_NOT_EXIST: "The issue id not exist"
    },
    Init: function(owner, repository, clientId, clientSecret, callback) {
        GithubComments._repos = repository;
        GithubComments._owner = owner;
        GithubComments._clientId = clientId;
        GithubComments._clientSecret = clientSecret;

        // init access token
        var accessToken = localStorage.getItem(GithubComments.ACCESS_TOKEN_NAME);
        if (accessToken) GithubComments._accessToken = accessToken;

        // init emoji
        var emojiJson = localStorage.getItem(GithubComments.EMOJI_JSON);
        if (emojiJson) {
            GithubComments._emojiJson = JSON.parse(emojiJson);
            if(callback) callback();
        } else {
            GithubComments.Emoji.Init(function(data) {
                if(callback) callback();
            });
        }
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
            location.href = 'https://github.com/login/oauth/authorize?' + Object.keys(data).map(function(k) {
                return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
            }).join('&');
        },
        Logout: function() {
            localStorage.removeItem(GithubComments.ACCESS_TOKEN_NAME);
            GithubComments._accessToken = undefined;
            GithubComments.User._userInfo = undefined;
        },
        GetAccessToken: function(code, callback) {
            if (GithubComments._accessToken) {
                if (callback) callback(GithubComments._accessToken);
                return;
            }

            if (!code) {
                var url = window.location.href;
                var start = url.indexOf('?');
                var paramsStr = url.slice(start + 1);
                var paramsStr = paramsStr.split('&');
                var params = {};
                for  (index in paramsStr) {
                    var keyValue = paramsStr[index].split('=');
                    params[keyValue[0]] = keyValue[1];
                }
                
                if (params[GithubComments.PARAM_CODE])
                    code = params[GithubComments.PARAM_CODE];
            }

            if (!code) {
                if (callback) callback(undefined);
                return;
            }

            $.ajax({
                method: 'POST',
                url: GithubComments.CORS_ANYWHERE + 'https://github.com/login/oauth/access_token',
                data: {
                    'client_id': GithubComments._clientId,
                    'client_secret': GithubComments._clientSecret,
                    'code': code
                },
                headers: {
                    Accept: GithubComments.ACCEPT_JSON,
                    'X-Requested-With': 'XMLHttpRequest'
                },
            }).done(function(data) {
                if (data.access_token) {
                    GithubComments._accessToken = data.access_token;
                    localStorage.setItem(GithubComments.ACCESS_TOKEN_NAME, data.access_token);
                }

                if (callback) callback(data.access_token);
            });
        },
        Get: function(callback) {
            GithubComments.User.GetAccessToken(undefined, function(accessToken) {
                if (!GithubComments._accessToken) {
                    if (callback) callback(undefined);
                    return;
                }

                if (GithubComments.User._userInfo) {
                    if (callback) callback(GithubComments.User._userInfo);
                    return;
                }

                $.ajax({
                    url: "https://api.github.com/user?" + $.param({
                        'access_token': GithubComments._accessToken
                    }),
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
            if (!issueId) {
                if (callback) {
                    callback({
                        'status': false,
                        'data': GithubComments.ERROR.ISSUE_ID_NOT_EXIST
                    })
                }
                return;
            }
            $.ajax({
                url: GithubComments.GITHUB_GPI + '/repos/' + GithubComments._owner + '/' + GithubComments._repos + '/issues/' + issueId + '/comments',
                async: false,
                dataType: 'json',
                error: function(request, status, error) {
                    var error = GithubComments.ERROR.UNHANDLE_EXCEPTION;
                    if (request.status == '404') {
                        error = GithubComments.ERROR.ISSUE_NOT_FOUND;
                    }

                    if (callback) {
                        callback({
                            'status': false,
                            'data': error
                        })
                    }

                },
                success: function(data) {
                    if (callback) {
                        callback({
                            'status': true,
                            'data': data
                        })
                    }
                }
            })
        },
        Add: function(issueId, commentText, callback) {
            if (!GithubComments.User.IsLogin) {
                if (callback) callback({
                    'status': false,
                    'data': GithubComments.ERROR.NOT_LOGIN
                });
            }

            $.ajax({
                method: 'POST',
                async: false,
                url: GithubComments.GITHUB_GPI + '/repos/' + GithubComments._owner + '/' + GithubComments._repos + '/issues/' + issueId + '/comments?' + $.param({
                    'access_token': GithubComments._accessToken
                }),
                data: JSON.stringify({
                    'body': commentText
                }),
                dataType: 'json',
                success: function(data) {
                    if (callback) callback({
                        'status': true,
                        'data': data
                    });
                }
            });
        },
        Count: function(issueId, callback) {
            if (!issueId) {
                if (callback) {
                    callback({
                        'status': false,
                        'data': GithubComments.ERROR.ISSUE_ID_NOT_EXIST
                    })
                }
                return;
            }
            
            
            
            var request = new XMLHttpRequest();
            request.open('GET', "https://api.github.com/repos/" + GithubComments._owner + "/" + GithubComments._repos + "/issues/" + issueId, true);
            request.responseType = 'json';
            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    // Success!
                    var comment = request.responseText;
                    if (comment.comments >= 0 && callback) {
                        callback({
                            'status': true,
                            'count': comment.comments
                        })
                    }
                } else {
                    // We reached our target server, but it returned an error
                    var error = GithubComments.ERROR.UNHANDLE_EXCEPTION;
                    if (request.status == '404') {
                        error = GithubComments.ERROR.ISSUE_NOT_FOUND;
                    }

                    if (callback) {
                        callback({
                            'status': false,
                            'data': error
                        })
                    }
                }
            };
            request.onerror = function() {
                // There was a connection error of some sort
                var error = GithubComments.ERROR.UNHANDLE_EXCEPTION;
                if (callback) {
                        callback({
                            'status': false,
                            'data': error
                        })
                    }
            };
            request.send(); 
            
           /* $.ajax({
                url: "https://api.github.com/repos/" + GithubComments._owner + "/" + GithubComments._repos + "/issues/" + issueId,
                dataType: 'json',
                error: function(request, status, error) {
                    var error = GithubComments.ERROR.UNHANDLE_EXCEPTION;
                    if (request.status == '404') {
                        error = GithubComments.ERROR.ISSUE_NOT_FOUND;
                    }

                    if (callback) {
                        callback({
                            'status': false,
                            'data': error
                        })
                    }

                },
                success: function(comment) {
                    if (comment.comments >= 0 && callback) {
                        callback({
                            'status': true,
                            'count': comment.comments
                        })
                    }
                }
            });*/
        }
    },
    Issue: {
        Create: function(issueId, callback) {}
    },
    Emoji: {
        Init: function(callback) {
            $.ajax({
                method: 'GET',
                async: false,
                url: 'https://api.github.com/emojis',
                headers: {
                    Accept: GithubComments.ACCEPT_JSON,
                },
            }).done(function(data) {
                localStorage.setItem(GithubComments.EMOJI_JSON, JSON.stringify(data));
                GithubComments._emojiJson = data;
                if (callback) {
                    callback(data)
                }
            });
        },
        Parse: function(text) {
            var result = text;
            var emojiList = text.match(/:.+?:/g);
            for (index in emojiList) {
                var emoji = emojiList[index];
                var emojiShort = emojiList[index].slice(1, -1);
                if (GithubComments._emojiJson && GithubComments._emojiJson[emojiShort]) {
                    result = result.replace(emoji, '<img class="emoji" title="' + emojiShort + '" alt="' + emojiShort + '" src="' + GithubComments._emojiJson[emojiShort] + '" height="20" width="20">');
                }
            }
            return result;
        }
    }
}
