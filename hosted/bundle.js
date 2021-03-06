"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// validate song and push to db
var createSong = function createSong(e) {
  e.preventDefault();
  $("#errorMessage").fadeOut();

  if ($("#songName").val() == '' || $("#songLyrics").val() == '') {
    handleError("All fields are required");
    return false;
  } // close form after validating


  setCreateSongVisible(false);
  sendAjax('POST', $("#createSong").attr("action"), $("#createSong").serialize(), function () {
    loadSongsFromServer();
  });
  return false;
}; // toggle confirm deletion window


var setConfirmDeleteVisible = function setConfirmDeleteVisible(visible, song) {
  if (visible) {
    $("#overlay").fadeIn();
    sendAjax('GET', '/getToken', null, function (result) {
      ReactDOM.render( /*#__PURE__*/React.createElement(ConfirmDelete, {
        visible: true,
        song: song,
        csrf: result.csrfToken
      }), document.querySelector("#songForms"));
    });
  } else {
    $("#overlay").fadeOut();
    ReactDOM.render( /*#__PURE__*/React.createElement(ConfirmDelete, {
      visible: false
    }), document.querySelector("#songForms"));
  }
}; // confirm deletion window


var ConfirmDelete = function ConfirmDelete(props) {
  if (props.visible) {
    return /*#__PURE__*/React.createElement("form", {
      id: "confirmDelete",
      name: "confirmDelete",
      onSubmit: deleteSong,
      action: "/deleteSong",
      method: "POST",
      className: "confirmDelete"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/exit.png",
      alt: "exit",
      className: "exitButton",
      onClick: function onClick() {
        return setConfirmDeleteVisible(false);
      }
    }), /*#__PURE__*/React.createElement("h1", null, "Delete \"", props.song.name, "\"?"), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_id",
      value: props.song._id
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Confirm"
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


var CreateSongForm = function CreateSongForm(props) {
  if (props.visible) {
    return /*#__PURE__*/React.createElement("form", {
      id: "createSong",
      name: "createSong",
      onSubmit: createSong,
      action: "/dashboard",
      method: "POST",
      className: "songForm"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/exit.png",
      alt: "exit",
      className: "exitButton",
      onClick: function onClick() {
        return setCreateSongVisible(false);
      }
    }), /*#__PURE__*/React.createElement("input", {
      id: "songName",
      className: "songNameInput",
      type: "text",
      name: "name",
      placeholder: "Song Name"
    }), /*#__PURE__*/React.createElement("button", {
      className: "tool",
      type: "button",
      onClick: InsertChord
    }, "InsertChord"), /*#__PURE__*/React.createElement("textarea", {
      id: "songLyrics",
      type: "text",
      name: "lyrics",
      placeholder: "Song Lyrics"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Make Song"
    }));
  }

  return null;
}; // song update form


var UpdateSongForm = function UpdateSongForm(props) {
  if (props.visible) {
    return /*#__PURE__*/React.createElement("form", {
      id: "updateSong",
      name: "updateSong",
      onSubmit: updateSong,
      action: "/updateSong",
      method: "POST",
      className: "songForm"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/exit.png",
      alt: "exit",
      className: "exitButton",
      onClick: function onClick() {
        return setUpdateSongVisible(false);
      }
    }), /*#__PURE__*/React.createElement("input", {
      id: "updateSongName",
      className: "songNameInput",
      type: "text",
      name: "name",
      defaultValue: props.name
    }), /*#__PURE__*/React.createElement("button", {
      className: "tool",
      type: "button",
      onClick: InsertChord
    }, "InsertChord"), /*#__PURE__*/React.createElement("textarea", {
      id: "updateSongLyrics",
      type: "text",
      name: "lyrics",
      defaultValue: props.lyrics
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_id",
      value: props._id
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Update Song"
    }));
  }

  return null;
}; // handle updating a song in the database


var updateSong = function updateSong(e) {
  e.preventDefault();
  $("#errorMessage").fadeOut();

  if ($("#updateSongName").val() == '' || $("#updateSongLyrics").val() == '') {
    handleError("All fields are required");
    return false;
  } // hide form after validation


  setUpdateSongVisible(false);
  sendAjax('POST', $("#updateSong").attr("action"), $("#updateSong").serialize(), function () {
    loadSongsFromServer();
  });
  return false;
}; // insert and highlight text that will be parsed as a chord


var InsertChord = function InsertChord() {
  // find cursor position and insert chord template
  var cursorPos = $('textarea').prop('selectionStart');
  var text = $('textarea').val();
  var textBefore = text.substring(0, cursorPos);
  var textAfter = text.substring(cursorPos, text.length);
  $('textarea').val(textBefore + "^[*chord*]" + textAfter); // find template and select it

  var searchText = "*chord*";
  var textarea = document.querySelector("textarea");
  var pos = textarea.value.indexOf(searchText);

  if (pos != -1) {
    textarea.focus();
    textarea.selectionStart = pos;
    textarea.selectionEnd = pos + searchText.length;
  }
}; // drop down menu for songs


var DropdownMenu = function DropdownMenu(props) {
  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      visible = _React$useState2[0],
      setVisible = _React$useState2[1];

  var showMenu = function showMenu() {
    setVisible(true);
    document.addEventListener('click', closeMenu);
  };

  var closeMenu = function closeMenu() {
    setVisible(false);
    document.removeEventListener('click', closeMenu);
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "threeDots",
    onClick: showMenu
  }), visible && /*#__PURE__*/React.createElement("div", {
    className: "dropdownContent"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: function onClick() {
      setUpdateSongVisible(true, props.song);
      return false;
    }
  }, "Edit"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: function onClick() {
      setConfirmDeleteVisible(true, props.song);
      return false;
    }
  }, "Delete")));
}; // grid of songs and song creation button


var SongList = function SongList(props) {
  var _React$useState3 = React.useState(false),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      openSongVisible = _React$useState4[0],
      setOpenSongVisible = _React$useState4[1];

  var _React$useState5 = React.useState(""),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      openSongName = _React$useState6[0],
      setOpenSongName = _React$useState6[1];

  var _React$useState7 = React.useState(""),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      openSongLyrics = _React$useState8[0],
      setOpenSongLyrics = _React$useState8[1];

  var setupSongView = function setupSongView(e, song) {
    // dont open if clicking dropdown or its links
    if (e.target.className !== "threeDots" && e.target.tagName !== "A") {
      setOpenSongVisible(true);
      setOpenSongName(song.name);
      setOpenSongLyrics(song.lyrics);
      $("#overlay").fadeIn();
      document.addEventListener('click', closeSongView);
    }
  };

  var closeSongView = function closeSongView(e) {
    // only close if clicking outside of window or on exit button
    if (e.target.id === "overlay" || e.target.className === "exitButton") {
      setOpenSongVisible(false);
      $("#overlay").fadeOut();
      document.removeEventListener('click', closeSongView);
    }
  }; // load in songs and create elements for them


  var songNodes = props.songs.map(function (song) {
    return /*#__PURE__*/React.createElement("div", {
      key: song._id,
      className: "song",
      onClick: function onClick(e) {
        return setupSongView(e, song);
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/songIcon.png",
      alt: "song icon",
      className: "songIcon"
    }), /*#__PURE__*/React.createElement(DropdownMenu, {
      song: song
    }), /*#__PURE__*/React.createElement("h3", null, "\u200E\u200E \u200E"), /*#__PURE__*/React.createElement("div", {
      className: "songName"
    }, /*#__PURE__*/React.createElement("h3", null, song.name, " ")));
  }); // render all song elements

  return /*#__PURE__*/React.createElement("div", {
    className: "songList"
  }, openSongVisible && /*#__PURE__*/React.createElement(SongView, {
    name: openSongName,
    lyrics: openSongLyrics
  }), /*#__PURE__*/React.createElement("div", {
    className: "song",
    onClick: function onClick() {
      return setCreateSongVisible(true);
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "addSong"
  }, "+")), songNodes);
}; // find chords and seperate them into divs


var parseChords = function parseChords() {
  var lyrics = document.querySelector("#lyrics");
  var chords = lyrics.innerHTML.match(/(?<=\[).+?(?=\])/g);

  if (chords) {
    var temp = lyrics.innerHTML;

    for (var i = 0; i < chords.length; i++) {
      temp = temp.replace(/\[(.*?)\]/, "<div class=\"chordParent\"><div class=\"chordChild\">".concat(chords[i], "</div></div>"));
    }

    var cleanup = temp.replace(/[\^]+/g, "");
    lyrics.innerHTML = cleanup;
  }
}; // song viewing window with parsed chords


var SongView = function SongView(props) {
  React.useEffect(function () {
    var script = document.createElement('script');
    script.innerHTML = "parseChords()";
    document.body.appendChild(script);
    return function () {
      document.body.removeChild(script);
    };
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "songView"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/img/exit.png",
    alt: "exit",
    className: "exitButton"
  }), /*#__PURE__*/React.createElement("h1", null, "\"", props.name, "\""), /*#__PURE__*/React.createElement("div", {
    id: "lyrics"
  }, /*#__PURE__*/React.createElement("p", null, props.lyrics)));
}; // advertisement placeholder


var Ad = function Ad() {
  return /*#__PURE__*/React.createElement("div", {
    className: "ad"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://www.youtube.com/watch?v=6f4L8Yt5H9M"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/img/ad.jpg",
    alt: "ad"
  })));
}; // toggle song creation form


var setCreateSongVisible = function setCreateSongVisible(visible) {
  $("#errorMessage").fadeOut();

  if (visible) {
    $("#overlay").fadeIn();
    sendAjax('GET', '/getToken', null, function (result) {
      ReactDOM.render( /*#__PURE__*/React.createElement(CreateSongForm, {
        csrf: result.csrfToken,
        visible: true
      }), document.querySelector("#songForms"));
    });
  } else {
    $("#overlay").fadeOut();
    ReactDOM.render( /*#__PURE__*/React.createElement(CreateSongForm, {
      visible: false
    }), document.querySelector("#songForms"));
  }
}; // toggle song update form


var setUpdateSongVisible = function setUpdateSongVisible(visible, song) {
  $("#errorMessage").fadeOut();

  if (visible) {
    $("#overlay").fadeIn();
    sendAjax('GET', '/getToken', null, function (result) {
      ReactDOM.render( /*#__PURE__*/React.createElement(UpdateSongForm, {
        _id: song._id,
        name: song.name,
        lyrics: song.lyrics,
        csrf: result.csrfToken,
        visible: true
      }), document.querySelector("#songForms"));
    });
  } else {
    $("#overlay").fadeOut();
    ReactDOM.render( /*#__PURE__*/React.createElement(UpdateSongForm, {
      visible: false
    }), document.querySelector("#songForms"));
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
  // Render ad
  ReactDOM.render( /*#__PURE__*/React.createElement(Ad, null), document.querySelector("#ad"));
  loadSongsFromServer();
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
