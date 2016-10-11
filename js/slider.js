var commentIndex = -1;
var comments = [];

function bindComment(comment) {
    console.log(JSON.stringify(comment));

    document.getElementById("avatar")
        .getElementsByTagName("img")[0]
        .setAttribute("src", comment.user.photo_100);

    document.getElementById("name").innerHTML = comment.user.first_name + " "
        + comment.user.last_name;

    document.getElementById("photo")
        .setAttribute("src", getPhoto(comment));

    document.getElementById("comment").innerHTML = twemoji.parse(comment.text);
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