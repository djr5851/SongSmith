"use strict";

// attempt to log user in
var handleLogin = function handleLogin(e) {
  e.preventDefault();
  $("#errorMessage").fadeOut();

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password is empty");
    return false;
  }

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
}; // attempt to add user to db


var handleSignup = function handleSignup(e) {
  e.preventDefault();
  $("#errorMessage").fadeOut();

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
}; // window containing login form


var LoginWindow = function LoginWindow(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "loginBox"
  }, /*#__PURE__*/React.createElement("form", {
    id: "loginForm",
    name: "loginForm",
    onSubmit: handleLogin,
    action: "/login",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("h1", null, "Songsmith"), /*#__PURE__*/React.createElement("input", {
    id: "user",
    className: "accountInput",
    type: "text",
    name: "username",
    placeholder: "Username"
  }), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    className: "accountInput",
    type: "password",
    name: "pass",
    placeholder: "Password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign in"
  }), /*#__PURE__*/React.createElement("p", null, "Don\u2019t have an account? ", /*#__PURE__*/React.createElement("a", {
    id: "signupLink",
    href: "/signup"
  }, "Sign up"))));
}; // window containg signup form


var SignupWindow = function SignupWindow(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "loginBox"
  }, /*#__PURE__*/React.createElement("form", {
    id: "signupForm",
    name: "signupForm",
    onSubmit: handleSignup,
    action: "/signup",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("h1", null, "Create Account"), /*#__PURE__*/React.createElement("input", {
    id: "user",
    className: "accountInput",
    type: "text",
    name: "username",
    placeholder: "Username"
  }), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    className: "accountInput",
    type: "password",
    name: "pass",
    placeholder: "Password"
  }), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    className: "accountInput",
    type: "password",
    name: "pass2",
    placeholder: "Retype password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign up"
  }), /*#__PURE__*/React.createElement("p", null, "Already have an account? ", /*#__PURE__*/React.createElement("a", {
    id: "signinLink",
    href: "/signup"
  }, "Sign in"))));
}; // render login window


var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector("#content"), function () {
    // set up sign in link
    var signupLink = document.querySelector("#signupLink");
    signupLink.addEventListener("click", function (e) {
      e.preventDefault();
      createSignupWindow(csrf);
      return false;
    });
  });
}; // render signup window


var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector("#content"), function () {
    // set up log in link
    var signinLink = document.querySelector("#signinLink");
    signinLink.addEventListener("click", function (e) {
      e.preventDefault();
      createLoginWindow(csrf);
      return false;
    });
  });
}; // set up login/signup buttons and pass in csrf


var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");
  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  createLoginWindow(csrf); // default view
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
