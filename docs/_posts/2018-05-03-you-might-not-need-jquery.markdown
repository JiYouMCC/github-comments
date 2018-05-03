---
layout: post
title:  "You might not need JQuery"
date:   2018-05-03 13:26:00 +0800
issue:  3
---
[You might not need JQuery](http://youmightnotneedjquery.com/)

# $.param()

    Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&');

# AJAX

    var request = new XMLHttpRequest();
    request.open('POST', '/my/url', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send(data);


    var request = new XMLHttpRequest();
    request.open('GET', '/my/url', true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var resp = request.responseText;
        } else {
            // We reached our target server, but it returned an error
        }
    };
    request.onerror = function() {
      // There was a connection error of some sort
    };
    request.send();