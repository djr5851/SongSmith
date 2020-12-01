"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

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
    }, "Lyrics: "), /*#__PURE__*/React.createElement("input", {
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

var DropdownMenu = /*#__PURE__*/function (_React$Component) {
  _inherits(DropdownMenu, _React$Component);

  var _super = _createSuper(DropdownMenu);

  function DropdownMenu(props) {
    var _this;

    _classCallCheck(this, DropdownMenu);

    _this = _super.call(this, props);
    _this.state = {
      visible: false
    };
    _this.showMenu = _this.showMenu.bind(_assertThisInitialized(_this));
    _this.closeMenu = _this.closeMenu.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(DropdownMenu, [{
    key: "showMenu",
    value: function showMenu() {
      var _this2 = this;

      this.setState({
        visible: true
      }, function () {
        document.addEventListener('click', _this2.closeMenu);
      });
    }
  }, {
    key: "closeMenu",
    value: function closeMenu() {
      var _this3 = this;

      this.setState({
        visible: false
      }, function () {
        document.removeEventListener('click', _this3.closeMenu);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "test",
        onClick: this.showMenu
      }), this.state.visible && /*#__PURE__*/React.createElement("div", {
        className: "dropdown-content",
        ref: function ref(e) {
          _this4.dropdownMenu = e;
        }
      }, /*#__PURE__*/React.createElement("a", {
        href: "#",
        onClick: function onClick() {
          setUpdateSongVisible(true, _this4.props.song);
          return false;
        }
      }, "Edit"), /*#__PURE__*/React.createElement("a", {
        href: "#",
        onClick: function onClick() {
          setConfirmDeleteVisible(true, _this4.props.song._id);
          return false;
        }
      }, "Delete")));
    }
  }]);

  return DropdownMenu;
}(React.Component); // grid of songs and song creation button


var SongList = function SongList(props) {
  var songNodes = props.songs.map(function (song) {
    return /*#__PURE__*/React.createElement("div", {
      key: song._id,
      className: "song"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/songIcon.jpeg",
      alt: "song icon",
      className: "songIcon"
    }), /*#__PURE__*/React.createElement(DropdownMenu, {
      song: song
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
      return setCreateSongVisible(true);
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/img/songIcon.jpeg",
    alt: "song icon",
    className: "songIcon"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "songName"
  }, "+")), songNodes);
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
