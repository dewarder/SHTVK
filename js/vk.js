VK.init({apiId: 5174764});

function isLoggedIn() {
  return VK.Auth.getSession() != null;
}

function getAllComments(ownerId, postId, callback) {
  VK.Api.call("execute.getAllComments", {
    owner_id: ownerId,
    post_id: postId,
    v: 5.57
  }, function (data) {

    if (data.response) {
      var users = [];
      data.response.profiles.forEach(function (item, i, arr) {
        users = users.concat(item);
      });

      var comments = [];
      data.response.comments.forEach(function (item, i, arr) {
        comments = comments.concat(item);
      });
      comments.forEach(function (comment) {
        for (i in users) {
          var u = users[i];
          if (comment.from_id === u.id) {
            comment.user = u;
            break;
          }
        }
      });

      callback(comments)
    } else {
      alert(data.error.error_msg);
    }
  });
}

function getAttachedPhotoUrlFromComment(comment) {
  var photo;
  for (var i = 0; i < comment.attachments.length; i++) {
    if (comment.attachments[i].type === "photo") {
      photo = comment.attachments[i].photo.photo_604;
      break;
    }
  }
  return photo;
}

function filterWithPhoto(comments) {
  return comments.filter(function (comment) {
    if (comment.hasOwnProperty("attachments")) {
      for (var i = 0; i < comment.attachments.length; i++) {
        if (comment.attachments[i].type === "photo") {
          return true;
        }
      }
    }
    return false;
  });
}

function filterByGender(comments, gender) {
  return comments.filter(function (comment) {
    return comment.user.sex == gender;
  })
}

function sortByLikes(comments) {
  return comments.sort(function (comment1, comment2) {
    return comment2.likes.count - comment1.likes.count;
  })
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function parseLink(link) {
  var begin = link.indexOf("wall");
  if (begin >= 0) {
    var ids = link.substring(begin + 4).split("_");

    if (ids.length >= 2) {
      var groupId = ids[0];
      var postId = ids[1];
      if (postId.indexOf('?') > 0) {
        postId = postId.split('?')[0];
      }
      return {groupId: groupId, postId: postId};
    }
  }
  return null;
}