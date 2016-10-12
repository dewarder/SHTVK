const PRELOADER_CLASS_NAME = 'image-preloader';
const profileLink = "https://vk.com/id";
var commentIndex = -1;
var comments = [];

var preloader = null;

function bindComment(comment) {
  console.log(JSON.stringify(comment));
  var link = profileLink + comment.user.id;

  if (!preloader) {
    preloader = document.getElementById("preloader");
  }

  document.getElementById("avatar")
    .setAttribute("href", link);

  document.getElementById("avatar")
    .getElementsByTagName("img")[0]
    .setAttribute("src", comment.user.photo_100);

  document.getElementsByClassName("img")[0].onload = function () {
    document.getElementsByClassName("img")[0].parentElement.classList.remove(PRELOADER_CLASS_NAME);
  };

  document.getElementById("name").innerHTML = comment.user.first_name + " "
    + comment.user.last_name;
  document.getElementById("name").setAttribute("href", link);

  document.getElementById("photoLink").setAttribute("href", link);
  document.getElementById("photo")
    .setAttribute("src", getPhoto(comment));

  document.getElementById("comment").innerHTML = twemoji.parse(comment.text);

  if (preloader) {
    preloader.parentNode.removeChild(preloader);
    preloader = null;
  }
}

function initSlider(data) {
  comments = data;

  document.onkeydown = checkKey;
  function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '37') {
      previousComment();
    }
    else if (e.keyCode == '39') {
      nextComment();
    }
  }
}

function nextComment() {
  commentIndex++;
  if (commentIndex == comments.length) {
    commentIndex = 0;
  }
  bindComment(comments[commentIndex]);
}

function previousComment() {
  commentIndex--;
  if (commentIndex == -1) {
    commentIndex = comments.length - 1;
  }
  bindComment(comments[commentIndex]);
}