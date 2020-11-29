"use strict";

var handleSong = function handleSong(e) {
  e.preventDefault();
  ReactDOM.render( /*#__PURE__*/React.createElement(SongForm, {
    visible: false
  }), document.querySelector("#makeSong"));
  $("songMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#songName").val() == '' || $("#songLyrics").val() == '') {
    handleError("All field are required");
    return false;
  }

  sendAjax('POST', $("#songForm").attr("action"), $("#songForm").serialize(), function () {
    loadSongsFromServer();
  });
  return false;
};

var SongForm = function SongForm(props) {
  if (props.visible) {
    return /*#__PURE__*/React.createElement("form", {
      id: "songForm",
      name: "songForm",
      onSubmit: handleSong,
      action: "/maker",
      method: "POST",
      className: "songForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name"
    }, "Name: "), /*#__PURE__*/React.createElement("input", {
      id: "songName",
      type: "text",
      name: "name",
      placeholder: "Song Name"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "lyrics"
    }, "Lyrics: "), /*#__PURE__*/React.createElement("input", {
      id: "songLyrics",
      type: "text",
      name: "lyrics",
      placeholder: "Song Lyrics"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeSongSubmit",
      type: "submit",
      value: "Make Song"
    }));
  }

  return null;
};

var SongList = function SongList(props) {
  if (props.songs.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "songList"
    }, /*#__PURE__*/React.createElement("div", {
      key: song._id,
      className: "song"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/songIcon.jpeg",
      alt: "song icon",
      className: "songIcon"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "songName"
    }, "+")));
  }

  var songNodes = props.songs.map(function (song) {
    return /*#__PURE__*/React.createElement("div", {
      key: song._id,
      className: "song"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/songIcon.jpeg",
      alt: "song icon",
      className: "songIcon"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "songName"
    }, "Name ", song.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "songLyrics"
    }, "Lyrics: ", song.lyrics, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "songList"
  }, /*#__PURE__*/React.createElement("div", {
    className: "song",
    onClick: getToken
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/img/songIcon.jpeg",
    alt: "song icon",
    className: "songIcon"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "songName"
  }, "+")), songNodes);
};

var loadSongsFromServer = function loadSongsFromServer() {
  sendAjax('GET', '/getSongs', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(SongList, {
      songs: data.songs
    }), document.querySelector("#songs"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SongForm, {
    csrf: csrf,
    visible: true
  }), document.querySelector("#makeSong"));
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  //getToken();
  ReactDOM.render( /*#__PURE__*/React.createElement(SongList, {
    songs: []
  }), document.querySelector("#songs"));
  loadSongsFromServer();
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
