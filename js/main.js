const ACTIVE_CLASS_NAME = 'active';
const LOADING_CLASS_NAME = 'load';
const submitButtonToHover = document.getElementById('submitToHover');
const sliderContainer = document.getElementById('wrapper');

let signed = false;
let requestData = {};

VK.init({apiId: 5174764});

VK.Auth.login(function (response) {
    if (response.session) {
        signed = true;
    }
});

function validate(value) {
    requestData = parseLink(value);

    if (requestData) {
        submitButtonToHover.classList.add(ACTIVE_CLASS_NAME);
    } else {
        submitButtonToHover.classList.remove(ACTIVE_CLASS_NAME);
        requestData = {};
    }
}

function send(gender, sortType) {
    let {groupId, postId} = requestData;
    submitButtonToHover.classList.add(LOADING_CLASS_NAME);
    if (groupId && postId && signed) {
        submitButtonToHover.classList.add(LOADING_CLASS_NAME);

        getAllComments(groupId, postId, function (comments) {
            comments = filterWithPhoto(comments);
            comments = filterByGender(comments, gender);

            switch (sortType) {
                case 'likes' : {
                    comments = sortByLikes(comments);
                    break;
                }
                case 'random' : {
                    comments = shuffle(comments);
                    break;
                }
                default : {
                    comments = sortByLikes(comments);
                }
            }

            initSlider(comments);
            nextComment();

            if (comments) {
                sliderContainer.style.display = 'block';
                window.scrollTo(0, sliderContainer.scrollHeight);
                submitButtonToHover.classList.remove(LOADING_CLASS_NAME);
            }
        });
    }

    return false;
}

function getAllComments(ownerId, postId, callback) {
    VK.Api.call("execute.getAllComments", {
        "owner_id": ownerId,
        "post_id": postId,
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

function getPhoto(comment) {
    var photo;
    for (var i = 0; i < comment.attachments.length; i++) {
        if (comment.attachments[i].type === "photo") {
            photo = comment.attachments[i].photo.photo_604;
            break;
        }
    }
    return photo;
}

function log(comments) {
    comments.forEach(function (i) {
        console.log(JSON.stringify(i));
    });
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