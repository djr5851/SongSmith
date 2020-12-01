"use strict";

var updateAccount = function updateAccount(e) {
  e.preventDefault();
  $("#songMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#currentUser").val() == '' || $("#currentPass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#newPass").val() !== $("#newPass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  console.dir($("#accountForm").serialize());
  sendAjax('POST', $("#accountForm").attr("action"), $("#accountForm").serialize(), redirect);
  return false;
}; // account edit form


var AccountForm = function AccountForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "accountForm",
    name: "account",
    onSubmit: updateAccount,
    action: "/account",
    method: "POST",
    className: "songForm"
  }, /*#__PURE__*/React.createElement("h1", {
    id: "username"
  }, props.username), /*#__PURE__*/React.createElement("input", {
    id: "currentPass",
    type: "text",
    name: "currentPass",
    placeholder: "Current Password"
  }), /*#__PURE__*/React.createElement("input", {
    id: "newPass",
    type: "text",
    name: "newPass",
    placeholder: "New Password"
  }), /*#__PURE__*/React.createElement("input", {
    id: "newPass2",
    type: "text",
    name: "newPass2",
    placeholder: "Confirm New Password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeSongSubmit",
    type: "submit",
    value: "Save"
  }));
};

var createAccountForm = function createAccountForm(csrf, username) {
  ReactDOM.render( /*#__PURE__*/React.createElement(AccountForm, {
    csrf: csrf,
    username: username
  }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
  sendAjax('GET', '/getUsername', null, function (result) {
    createAccountForm(csrf, result.username);
  });
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#songMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#songMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
