"use strict";

// handle change password
var updateAccount = function updateAccount(e) {
  e.preventDefault();
  $("#errorMessage").fadeOut();

  if ($("#currentUser").val() == '' || $("#currentPass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#newPass").val() !== $("#newPass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#accountForm").attr("action"), $("#accountForm").serialize(), redirect);
  return false;
}; // account edit form


var AccountForm = function AccountForm(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "loginBox"
  }, /*#__PURE__*/React.createElement("form", {
    id: "accountForm",
    name: "account",
    onSubmit: updateAccount,
    action: "/account",
    method: "POST"
  }, /*#__PURE__*/React.createElement("h1", {
    id: "username"
  }, props.username), /*#__PURE__*/React.createElement("input", {
    id: "currentPass",
    className: "accountInput",
    type: "password",
    name: "currentPass",
    placeholder: "Current Password"
  }), /*#__PURE__*/React.createElement("input", {
    id: "newPass",
    className: "accountInput",
    type: "password",
    name: "newPass",
    placeholder: "New Password"
  }), /*#__PURE__*/React.createElement("input", {
    id: "newPass2",
    className: "accountInput",
    type: "password",
    name: "newPass2",
    placeholder: "Confirm New Password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Save"
  })));
}; // render account update form


var createAccountForm = function createAccountForm(csrf, username) {
  ReactDOM.render( /*#__PURE__*/React.createElement(AccountForm, {
    csrf: csrf,
    username: username
  }), document.querySelector("#content"));
}; // load username and csrf


var setup = function setup(csrf) {
  sendAjax('GET', '/getUsername', null, function (result) {
    createAccountForm(csrf, result.username);
  });
}; // request csrf token


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

// fill out and animate error message
var handleError = function handleError(message) {
  $("#message").text(message);
  $("#errorMessage").fadeIn();
}; // redirect to given link


var redirect = function redirect(response) {
  $("#errorMessage").fadeOut();
  window.location = response.redirect;
}; // make an ajax request


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
