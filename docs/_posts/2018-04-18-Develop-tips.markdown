---
layout: post
title:  "Develop tips"
date:   2018-04-18 10:11:03 +0800
---

# Reference

[Gitment](https://github.com/imsun/gitment)

[Github REST API v3](https://developer.github.com/v3/)

- [list-comments-on-an-issue](https://developer.github.com/v3/issues/comments/#list-comments-on-an-issue)
- [get-or-create-an-authorization-for-a-specific-app](https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app)
- [oauth-available-scopes](https://developer.github.com/apps/building-oauth-apps/scopes-for-oauth-apps/#available-scopes)

[JQuery API Documentation](http://api.jquery.com/)

# API Design

- Init(owner, repos);

    初始化相关操作

- List(issueId, callback);
  
    列出某个文章所有的评论
  
- Add(issueId, args..., callback);

    添加评论
  
- Count(issueId, callback);
  
    获取某个文章的评论数量

//TODO
