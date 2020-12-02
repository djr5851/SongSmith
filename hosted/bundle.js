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
  $("songMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#songName").val() == '' || $("#songLyrics").val() == '') {
    handleError("All field are required");
    return false;
  }

  setCreateSongVisible(false);
  sendAjax('POST', $("#createSong").attr("action"), $("#createSong").serialize(), function () {
    loadSongsFromServer();
  });
  return false;
}; // toggle confirm deletion window


var setConfirmDeleteVisible = function setConfirmDeleteVisible(visible, _id) {
  if (visible) {
    sendAjax('GET', '/getToken', null, function (result) {
      ReactDOM.render( /*#__PURE__*/React.createElement(ConfirmDelete, {
        visible: true,
        _id: _id,
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
      action: "/deleteSong",
      method: "POST",
      className: "confirmDelete"
    }, /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_id",
      value: props._id
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


var CreateSongForm = function CreateSongForm(props) {
  if (props.visible) {
    return /*#__PURE__*/React.createElement("form", {
      id: "createSong",
      name: "createSong",
      onSubmit: createSong,
      action: "/maker",
      method: "POST",
      className: "songForm"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/songIcon.jpeg",
      alt: "exit",
      className: "exitButton",
      onClick: function onClick() {
        return setCreateSongVisible(false);
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
};

var updateSong = function updateSong(e) {
  e.preventDefault();
  $("songMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#updateSongName").val() == '' || $("#updateSongLyrics").val() == '') {
    handleError("All field are required");
    return false;
  }

  setUpdateSongVisible(false);
  sendAjax('POST', $("#updateSong").attr("action"), $("#updateSong").serialize(), function () {
    loadSongsFromServer();
  });
  return false;
};

var InsertChord = function InsertChord() {
  var cursorPos = $('textarea').prop('selectionStart');
  var text = $('textarea').val();
  var textBefore = text.substring(0, cursorPos);
  var textAfter = text.substring(cursorPos, text.length);
  $('textarea').val(textBefore + "^[*chord*]" + textAfter);
  var searchText = "*chord*";
  var textarea = document.querySelector("textarea");
  var pos = textarea.value.indexOf(searchText);

  if (pos != -1) {
    textarea.focus();
    textarea.selectionStart = pos;
    textarea.selectionEnd = pos + searchText.length;
  }
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
      src: "/assets/img/songIcon.jpeg",
      alt: "exit",
      className: "exitButton",
      onClick: function onClick() {
        return setCreateSongVisible(false);
      }
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "name"
    }, "Name: "), /*#__PURE__*/React.createElement("input", {
      id: "updateSongName",
      type: "text",
      name: "name",
      defaultValue: props.name
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "lyrics"
    }, "Lyrics: "), /*#__PURE__*/React.createElement("button", {
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
      className: "makeSongSubmit",
      type: "submit",
      value: "Update Song"
    }));
  }

  return null;
};

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
    className: "test",
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
      setConfirmDeleteVisible(true, props.song._id);
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
    if (e.target.className !== "test" && e.target.tagName !== "A") {
      setOpenSongVisible(true);
      setOpenSongName(song.name);
      setOpenSongLyrics(song.lyrics);
      document.addEventListener('click', closeSongView);
    }
  };

  var closeSongView = function closeSongView() {
    setOpenSongVisible(false);
    document.removeEventListener('click', closeSongView);
  };

  var songNodes = props.songs.map(function (song) {
    return /*#__PURE__*/React.createElement("div", {
      key: song._id,
      className: "song",
      onClick: function onClick(e) {
        return setupSongView(e, song);
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/songIcon.jpeg",
      alt: "song icon",
      className: "songIcon"
    }), /*#__PURE__*/React.createElement(DropdownMenu, {
      song: song
    }), /*#__PURE__*/React.createElement("h3", {
      className: "songName"
    }, "Name ", song.name, " "));
  });
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
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/img/songIcon.jpeg",
    alt: "song icon",
    className: "songIcon"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "songName"
  }, "+")), songNodes);
};

var parseChords = function parseChords() {
  debugger;
  var lyrics = document.querySelector("#lyrics");
  var chords = lyrics.innerHTML.match(/(?<=\[).+?(?=\])/g);
  var temp = lyrics.innerHTML;

  for (var i = 0; i < chords.length; i++) {
    temp = temp.replace(chords[i], "<div class=\"chordParent\"><div class=\"chordParent\">".concat(chords[i], "</div></div>"));
  }

  var cleanup = temp.replace(/[\[\]^]+/g, "");
  lyrics.innerHTML = cleanup;
};

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
    className: "songForm"
  }, props.name, " ", /*#__PURE__*/React.createElement("p", null, " "), /*#__PURE__*/React.createElement("div", {
    id: "lyrics"
  }, props.lyrics));
}; // toggle song creation form


var setCreateSongVisible = function setCreateSongVisible(visible) {
  if (visible) {
    sendAjax('GET', '/getToken', null, function (result) {
      ReactDOM.render( /*#__PURE__*/React.createElement(CreateSongForm, {
        csrf: result.csrfToken,
        visible: true
      }), document.querySelector("#makeSong"));
    });
  } else {
    ReactDOM.render( /*#__PURE__*/React.createElement(CreateSongForm, {
      visible: false
    }), document.querySelector("#makeSong"));
  }
}; // toggle song update form


var setUpdateSongVisible = function setUpdateSongVisible(visible, song) {
  if (visible) {
    sendAjax('GET', '/getToken', null, function (result) {
      ReactDOM.render( /*#__PURE__*/React.createElement(UpdateSongForm, {
        _id: song._id,
        name: song.name,
        lyrics: song.lyrics,
        csrf: result.csrfToken,
        visible: true
      }), document.querySelector("#makeSong"));
    });
  } else {
    ReactDOM.render( /*#__PURE__*/React.createElement(UpdateSongForm, {
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
