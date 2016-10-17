//Elements
const AVATAR = document.getElementById("avatar");
const AVATAR_IMAGE = document.getElementById("avatarImage");
const NAME = document.getElementById("name");
const PHOTO_LINK = document.getElementById("photoLink");
const PHOTO = document.getElementById("photo");
const COMMENT = document.getElementById("comment");
const COUNTERS_FROM = document.getElementById("from");
const COUNTERS_TOTAL = document.getElementById("total");

const PRELOADER_CLASS_NAME = 'image-preloader';
const PROFILE_LINK = "https://vk.com/id";

var comments = [];
var commentIndex = -1;

var preloader = null;

function bindComment(index, comment) {
  var link = PROFILE_LINK + comment.user.id;

  if (!preloader) {
    preloader = document.getElementById("preloader");
  }

  var avatarUrl = comment.user.photo_100;
  if (!isImageCached(avatarUrl)) {
    AVATAR_IMAGE.setAttribute("src", "");
  }
  AVATAR_IMAGE.setAttribute("src", avatarUrl);
  AVATAR.setAttribute("href", link);

  document.getElementsByClassName("img")[0].onload = function () {
    document.getElementsByClassName("img")[0].parentElement.classList.remove(PRELOADER_CLASS_NAME);
  };

  NAME.innerHTML = comment.user.first_name + " " + comment.user.last_name;
  NAME.setAttribute("href", link);
  bindAge(index, function (age) {
    if (age) NAME.innerHTML += ", " + age;
  });

  COUNTERS_FROM.innerHTML = index + 1;

  PHOTO_LINK.setAttribute("href", link);

  var photoUrl = getAttachedPhotoUrlFromComment(comment);
  if (!isImageCached(photoUrl)) {
    PHOTO.setAttribute("src", "");
  }
  PHOTO.setAttribute("src", photoUrl);

  COMMENT.innerHTML = twemoji.parse(comment.text);

  if (preloader) {
    preloader.parentNode.removeChild(preloader);
    preloader = null;
  }
}

function bindAge(index, callback) {
  var i = index;
  var comment = comments[index];
  if (comment.user.hasOwnProperty("age")) {
    if (commentIndex == i) {
      callback(comment.user.age);
    }
  } else {
    getAge(comment.user.id, function (age) {
      comment.user.age = age;
      if (commentIndex == i) {
        callback(age);
      }
    });
  }
}

function initSlider(data) {
  commentIndex = -1;
  comments = data;
  COUNTERS_TOTAL.innerHTML = comments.length;

  document.onkeydown = checkKey;
  function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '37' || e.keyCode == '65') {
      previousComment();
    }
    else if (e.keyCode == '39' || e.keyCode == '68') {
      nextComment();
    }
    else if (e.keyCode == '81') {
      var newTab = window.open(PROFILE_LINK + comments[commentIndex].user.id, '_blank');
      window.focus();
    }
  }
}

function nextComment() {
  commentIndex++;
  if (commentIndex == comments.length) {
    commentIndex = 0;
  }
  bindComment(commentIndex, comments[commentIndex]);
}

function previousComment() {
  commentIndex--;
  if (commentIndex == -1) {
    commentIndex = comments.length - 1;
  }
  bindComment(commentIndex, comments[commentIndex]);
}

function isImageCached(src) {
  var image = new Image();
  image.src = src;
  return image.complete;
}