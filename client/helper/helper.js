// fill out and animate error message
const handleError = (message) => {
    $("#message").text(message);
    $("#errorMessage").fadeIn();
};

// redirect to given link
const redirect = (response) => {
    $("#errorMessage").fadeOut();
    window.location = response.redirect;
};

// make an ajax request
const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};