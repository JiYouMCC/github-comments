function encodeQueryData(data) {
    let ret = [];
    for (let d in data)
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
}

Comments = {
    REPOS : undefined,
    OWNER : undefined,
    CLIENT_ID: undefined,
    CLIENT_SECRET: undefined,
    ACCEPT_JSON: "application/json",
    ACCEPTS : "application/vnd.github.v3+json",
    SCOPE: "public_repo",
    ACCESS_TOKEN: undefined,
    CORS_ANYWHERE: 'https://cors-anywhere.herokuapp.com/',
    init: function(owner, repository, clientId, clientSecret) {
        Comments.REPOS = repository;
        Comments.OWNER = owner;
        Comments.CLIENT_ID = clientId;
        Comments.CLIENT_SECRET = clientSecret;
        Comments.initAccessToken();
    },
    initAccessToken: function() {
        var accessToken = window.sessionStorage.getItem("GIT_ACCESS_TOKEN");
        if (accessToken) {
            Comments.ACCESS_TOKEN = accessToken;
        } else {
            var url = new URL(window.location.href);
            var code = url.searchParams.get("code");
            if (code) {
                Comments.getAccessToken(code);
            }
        }
    },
    login: function(redirectUri) {
        var data = {
            scope: Comments.SCOPE,
            redirect_uri: redirectUri, 
            client_id:Comments.CLIENT_ID,
            client_secret:Comments.CLIENT_SECRET
        };
        var querystring = encodeQueryData(data);
        location.href = 'https://github.com/login/oauth/authorize?' + querystring;
    },
    getAccessToken: function(code) {
       $.ajax({
           method: 'POST',
           url: Comments.CORS_ANYWHERE + 'https://github.com/login/oauth/access_token',
           headers: {
               Accept: 'application/json',
               'X-Requested-With': 'XMLHttpRequest'
           },
           data: {
               'client_id':Comments.CLIENT_ID,
               'client_secret':Comments.CLIENT_SECRET,
               'code':code
           }
       }).done(function(data) {
           if(data.access_token) {
               Comments.ACCESS_TOKEN = data.access_token;
               window.sessionStorage.setItem("GIT_ACCESS_TOKEN", data.access_token);
           }
       })   
    },
    get: function(issueId, callback) {
        $.ajax({
            url: "https://api.github.com/repos/" + Comments.OWNER + "/" + Comments.REPOS + "/issues/" + issueId + "/comments",
            accepts: {
                json: Comments.ACCEPT_JSON
            },
            dataType: 'json',
        }).done(function(data) {
            callback(data);
        })
    },
    add: function(issueId, commentText, callback) {
        $.ajax({
            method: "POST",
            url: "https://api.github.com/repos/" + Comments.OWNER + "/" + Comments.REPOS + "/issues/" + issueId + "/comments?access_token=" + Comments.ACCESS_TOKEN,
            headers: {
               Accept: 'application/json',
               'X-Requested-With': 'XMLHttpRequest'
            },
            accepts: {
                json: Comments.ACCEPT_JSON
            },
            data: JSON.stringify({
                'body': commentText
            }),
            dataType: 'json'
        }).done(function(data) {
            callback(data);
        })
    },
    getUser: function(callback){
        $.ajax({
            url: "https://api.github.com/user?access_token=" + Comments.ACCESS_TOKEN,
            accepts: {
                json: Comments.ACCEPT_JSON
            },
            dataType: 'json',
        }).done(function(data) {
            callback(data);
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
    }
}
