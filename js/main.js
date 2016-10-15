const ACTIVE_CLASS_NAME = 'active';
const LOADING_CLASS_NAME = 'load';

//Elements
const submitButton = document.getElementById('submitToHover');
const sliderContainer = document.getElementById('wrapper');

initSubmitButton();

function initSubmitButton() {
  if (isLoggedIn()) {
    submitButton.setAttribute("value", "Розпочати");
  } else {
    submitButton.setAttribute("value", "Увійти та розпочати");
  }
}

function validate(value) {
  if (parseLink(value)) {
    submitButton.classList.add(ACTIVE_CLASS_NAME);
  } else {
    submitButton.classList.remove(ACTIVE_CLASS_NAME);
  }
}

function loginIfNeededAndLoad(link, gender, sortType) {
  if (isLoggedIn()) {
    loadComments(link, gender, sortType);
  } else {
    VK.Auth.login(function (response) {
      if (response.session) {
        loadComments(link, gender, sortType);
      }
    })
  }

  return false;
}

function loadComments(link, gender, sortType) {
  submitButton.classList.add(LOADING_CLASS_NAME);
  let {groupId, postId} = parseLink(link);
  getAllComments(groupId, postId, function (comments) {
    comments = filterWithPhoto(comments);
    comments = getFilterGenderStrategy(gender)(comments);
    comments = getSortStrategy(sortType)(comments);

    initSlider(comments);
    nextComment();

    if (comments) {
      sliderContainer.style.display = 'block';
      window.scrollTo(0, sliderContainer.scrollHeight);
      submitButton.classList.remove(LOADING_CLASS_NAME);
    }
  });
}

function getFilterGenderStrategy(gender) {
  switch (gender) {
    case '1':
      return function (comments) {
        return filterByGender(comments, 1);
      };

    case '2':
      return function (comments) {
        return filterByGender(comments, 2);
      };

    default:
      return self;
  }
}

function getSortStrategy(type) {
  switch (type) {
    case 'likes':
      return sortByLikes;

    case 'random':
      return shuffle;

    default:
      return self;
  }
}

function self(object) {
  return object;
}