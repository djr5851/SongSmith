"use strict";

// validate song and push to db
var handleSong = function handleSong(e) {
  e.preventDefault();
  $("songMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#songName").val() == '' || $("#songLyrics").val() == '') {
    handleError("All field are required");
    return false;
  }

  SetSongFormVisible(false);
  sendAjax('POST', $("#songForm").attr("action"), $("#songForm").serialize(), function () {
    loadSongsFromServer();
  });
  return false;
}; // toggle confirm deletion window


var setConfirmDeleteVisible = function setConfirmDeleteVisible(visible, songID) {
  if (visible) {
    sendAjax('GET', '/getToken', null, function (result) {
      ReactDOM.render( /*#__PURE__*/React.createElement(ConfirmDelete, {
        visible: true,
        songID: songID,
        csrf: result.csrfToken
      }), document.querySelector("#makeSong"));
    });
  } else {
    ReactDOM.render( /*#__PURE__*/React.createElement(ConfirmDelete, {
      visible: false
    }), document.querySelector("#makeSong"));
  }
}; // confirm deletion window


var ConfirmDelete = function ConfirmDelete(props) {
  if (props.visible) {
    return /*#__PURE__*/React.createElement("form", {
      id: "confirmDelete",
      name: "confirmDelete",
      onSubmit: deleteSong,
      action: "/delete",
      method: "POST",
      className: "confirmDelete"
    }, /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "songID",
      value: props.songID
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "confirmDeleteSubmit",
      type: "submit",
      value: "Delete Song"
    }));
  }

  return null;
}; // delete a song from the db


var deleteSong = function deleteSong(e) {
  e.preventDefault();
  setConfirmDeleteVisible(false);
  sendAjax('POST', $("#confirmDelete").attr("action"), $("#confirmDelete").serialize(), function () {
    loadSongsFromServer();
  });
}; // song creation form


var SongForm = function SongForm(props) {
  if (props.visible) {
    return /*#__PURE__*/React.createElement("form", {
      id: "songForm",
      name: "songForm",
      onSubmit: handleSong,
      action: "/maker",
      method: "POST",
      className: "songForm"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/songIcon.jpeg",
      alt: "exit",
      className: "exitButton",
      onClick: function onClick() {
        return SetSongFormVisible(false);
      }
    }), /*#__PURE__*/React.createElement("label", {
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
}; // grid of songs and song creation button


var SongList = function SongList(props) {
  var songNodes = props.songs.map(function (song) {
    return /*#__PURE__*/React.createElement("div", {
      key: song._id,
      className: "song"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/songIcon.jpeg",
      alt: "song icon",
      className: "songIcon"
    }), /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/songIcon.jpeg",
      alt: "exit",
      className: "exitButton",
      onClick: function onClick() {
        setConfirmDeleteVisible(true, song._id);
      }
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
    onClick: function onClick() {
      return SetSongFormVisible(true);
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/img/songIcon.jpeg",
    alt: "song icon",
    className: "songIcon"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "songName"
  }, "+")), songNodes);
}; // toggle song creation form


var SetSongFormVisible = function SetSongFormVisible(visible) {
  if (visible) {
    sendAjax('GET', '/getToken', null, function (result) {
      ReactDOM.render( /*#__PURE__*/React.createElement(SongForm, {
        csrf: result.csrfToken,
        visible: true
      }), document.querySelector("#makeSong"));
    });
  } else {
    ReactDOM.render( /*#__PURE__*/React.createElement(SongForm, {
      visible: false
    }), document.querySelector("#makeSong"));
  }
}; // get songs from db


var loadSongsFromServer = function loadSongsFromServer() {
  sendAjax('GET', '/getSongs', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(SongList, {
      songs: data.songs
    }), document.querySelector("#songs"));
  });
}; // load songs once page loads


$(document).ready(function () {
  //getToken();
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
