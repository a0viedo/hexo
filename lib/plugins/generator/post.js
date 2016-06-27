'use strict';

function postGenerator(locals) {
  var posts = locals.posts.sort('-date').toArray();
  var translatedPosts = locals.translatedPosts.toArray();
  var length = posts.length;
  var results;
  var translatedResults;

  results = posts.map(function(post, i) {
    var layout = post.layout;
    var path = post.path;

    if (!layout || layout === 'false') {
      return {
        path: path,
        data: post.content
      };
    }

    if (i) post.prev = posts[i - 1];
    if (i < length - 1) post.next = posts[i + 1];

    var layouts = ['post', 'page', 'index'];
    if (layout !== 'post') layouts.unshift(layout);

    post.__post = true;

    return {
      path: path,
      layout: layouts,
      data: post
    };
  });

  translatedResults = translatedPosts.map(function(translatedPost){
    var originalPost = results.find(function(r){
      return r.data.postId === translatedPost.postId;
    });

    translatedPost.prev = originalPost.data.prev;
    translatedPost.next = originalPost.data.next;
    return {
      path: translatedPost.path,
      layout: ['post', 'page', 'index'],
      data: translatedPost
    };
  });

  return results.concat(translatedResults);
}

module.exports = postGenerator;
