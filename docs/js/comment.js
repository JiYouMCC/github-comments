Comments = {
    ACCEPT_JSON: "application/json",
    ACCESS_TOKEN: undefined,
    CLIENT_ID: undefined,
    CLIENT_SECRET: undefined,
    CORS_ANYWHERE: 'https://cors-anywhere.herokuapp.com/',
    OWNER : undefined,
    PARAM_CODE : 'code',
    REPOS : undefined,
    SCOPE: "public_repo",
    COOKIE_ACCESS_TOKEN_NAME: 'GIT_ACCESS_TOKEN',
    USER_INFO: undefined,
    init: function(owner, repository, clientId, clientSecret) {
        Comments.REPOS = repository;
        Comments.OWNER = owner;
        Comments.CLIENT_ID = clientId;
        Comments.CLIENT_SECRET = clientSecret;
        Comments.initAccessToken();
    },
    initAccessToken: function() {
        var accessToken = Cookies.get(Comments.COOKIE_ACCESS_TOKEN_NAME)
        if (accessToken) {
            Comments.ACCESS_TOKEN = accessToken;
            Comments.getUser();
        } else {
            var url = new URL(window.location.href);
            var code = url.searchParams.get(Comments.PARAM_CODE);
            if (code) {
                Comments.getAccessToken(code);
            }
        }
    },
    login: function(redirectUri) {
        if (!redirectUri) {
            redirectUri = location.href;
        }
        var data = {
            scope: Comments.SCOPE,
            redirect_uri: redirectUri, 
            client_id:Comments.CLIENT_ID,
            client_secret:Comments.CLIENT_SECRET
        };
        location.href = 'https://github.com/login/oauth/authorize?' + $.param(data);
    },
    logout: function(callback){
        Cookies.remove(Comments.COOKIE_ACCESS_TOKEN_NAME);
        Comments.ACCESS_TOKEN = undefined;
        Comments.USER_INFO = undefined;
        if (callback) {
            callback();
        }
    },
    getAccessToken: function(code) {
        if (!code)
            return;
        $.ajax({
            method: 'POST',
            url: Comments.CORS_ANYWHERE + 'https://github.com/login/oauth/access_token',
            data: {
                'client_id':Comments.CLIENT_ID,
                'client_secret':Comments.CLIENT_SECRET,
                'code':code
            },
            headers: {
                Accept: Comments.ACCEPT_JSON,
                'X-Requested-With': 'XMLHttpRequest'
            },
        }).done(function(data) {
            if(data.access_token) {
                Comments.ACCESS_TOKEN = data.access_token;
                Cookies.set(Comments.COOKIE_ACCESS_TOKEN_NAME, data.access_token);
                Comments.getUser();
           }
       })
    },
    get: function(issueId, callback) {
        $.ajax({
            url: "https://api.github.com/repos/" + Comments.OWNER + "/" + Comments.REPOS + "/issues/" + issueId + "/comments",
            dataType: 'json',
        }).done(function(data) {
            callback(data);
        })
    },
    add: function(issueId, commentText, callback) {
        $.ajax({
            method: 'POST',
            url: "https://api.github.com/repos/" + Comments.OWNER + "/" + Comments.REPOS + "/issues/" + issueId + "/comments?" + $.param({'access_token':Comments.ACCESS_TOKEN}),
            data: JSON.stringify({
                'body': commentText
            }),
            dataType: 'json'
        }).done(function(data) {
            callback(data);
        })
    },
    getUser: function(callback){
        if (Comments.USER_INFO){
            if (callback) {
                callback(data);
            }

            return;
        }
        $.ajax({
            url: "https://api.github.com/user?" + $.param({'access_token':Comments.ACCESS_TOKEN}),
            dataType: 'json',
        }).done(function(data) {
            Comments.USER_INFO = data;
            if (callback) {
                callback(data);
            }
        })
    },
    getReactions: function(commentId, callback) {
        //TODO
         $.ajax({
             url: "https://api.github.com/repos/" + Comments.OWNER + "/" + Comments.REPOS + "/issues/comments/" + commentId + "/reactions",
             accepts: {
                 json: "application/vnd.github.squirrel-girl-preview"
             },
             dataType: 'json',
         }).done(function(data) {
             callback(data);
         })
    },
    isLogin: function(){
        return Boolean(Comments.USER_INFO);
    }
}
