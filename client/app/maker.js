
// validate song and push to db
const handleSong = (e) => {
    e.preventDefault();

    $("songMessage").animate({width:'hide'},350);

    if($("#songName").val() == '' || $("#songLyrics").val() == '') {
        handleError("All field are required");
        return false;
    }

    SetSongFormVisible(false);

    sendAjax('POST', $("#songForm").attr("action"), $("#songForm").serialize(), function() {
        loadSongsFromServer();
    });

    return false;
};

// toggle confirm deletion window
const setConfirmDeleteVisible = (visible, songID) => {
    if (visible) {
        sendAjax('GET', '/getToken', null, (result) => {
            ReactDOM.render(
                <ConfirmDelete visible={true} songID={songID} csrf={result.csrfToken}/>, document.querySelector("#makeSong")
            );
        });
    }
    else {
        ReactDOM.render(
            <ConfirmDelete visible={false}/>, document.querySelector("#makeSong")
        );}
};

// confirm deletion window
const ConfirmDelete = (props) => {
    if (props.visible) {
        return (
            <form id="confirmDelete" 
                  name="confirmDelete"
                  onSubmit={deleteSong}
                  action="/deleteSong"
                  method="POST"
                  className="confirmDelete"
            >
                <input type="hidden" name="songID" value={props.songID}/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="confirmDeleteSubmit" type="submit" value="Delete Song" />
            </form>
        );
    }
    return null;
};

// delete a song from the db
const deleteSong = (e) => {
    e.preventDefault();
    setConfirmDeleteVisible(false);
    sendAjax('POST', $("#confirmDelete").attr("action"), $("#confirmDelete").serialize(), function() {
        loadSongsFromServer();
    });
};

// song creation form
const SongForm = (props) => {
    if (props.visible) {
        return (
            <form id="songForm" 
                  name="songForm"
                  onSubmit={handleSong}
                  action="/maker"
                  method="POST"
                  className="songForm"
            >
                <img src="/assets/img/songIcon.jpeg" alt="exit" className="exitButton" onClick={() => SetSongFormVisible(false)} />
                <label htmlFor="name">Name: </label>
                <input id="songName" type="text" name="name" placeholder="Song Name"/>
                <label htmlFor="lyrics">Lyrics: </label>
                <input id="songLyrics" type="text" name="lyrics" placeholder="Song Lyrics"/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="makeSongSubmit" type="submit" value="Make Song" />
            </form>
        );
    }
    return null;
};

class DropdownMenu extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          visible: false,
        };
        
        this.showMenu = this.showMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
      }
      
      showMenu(e) {
        e.preventDefault();
        
        this.setState({ visible: true }, () => {
          document.addEventListener('click', this.closeMenu);
        });
      }
      
      closeMenu(e) {
        
        // if (!this.dropdownMenu.contains(e.target)) {
          
          this.setState({ visible: false }, () => {
            document.removeEventListener('click', this.closeMenu);
          });  
          
        // }
      }
    
      render() {
        return (
            <div>
              <div className="test" onClick={this.showMenu}></div>
              { this.state.visible && 
                    <div className="dropdown-content" ref={(e) => {this.dropdownMenu = e; }}>
                      <a href="#">Edit</a>
                      <a href="#" onClick={() => setConfirmDeleteVisible(true, this.props.songID)}>Delete</a>
                    </div>
              }
            </div>
        );
      }
    }
    
    // grid of songs and song creation button
const SongList = function(props) {
    const songNodes = props.songs.map(function(song) {
        return (
            <div key={song._id} className="song">
                <img src="/assets/img/songIcon.jpeg" alt="song icon" className="songIcon"/>
                <DropdownMenu songID={song._id}/>
                <h3 className="songName">Name {song.name} </h3>
                <h3 className="songLyrics">Lyrics: {song.lyrics} </h3>
            </div>
        );
    });

    return (
        <div className="songList">
            <div className="song" onClick={() => SetSongFormVisible(true)}>
                <img src="/assets/img/songIcon.jpeg" alt="song icon" className="songIcon" />
                <h3 className="songName">+</h3>
            </div>
            {songNodes}
        </div>
    );
};

// toggle song creation form
const SetSongFormVisible = (visible) => {
    if (visible) {
        sendAjax('GET', '/getToken', null, (result) => {
            ReactDOM.render(
                <SongForm csrf={result.csrfToken} visible={true}/>, document.querySelector("#makeSong")
            );        
        });
    }
    else {
        ReactDOM.render(
            <SongForm visible={false}/>, document.querySelector("#makeSong")
        );            
    }
}

// get songs from db
const loadSongsFromServer = () => {
    sendAjax('GET', '/getSongs', null, (data) => {
        ReactDOM.render(
            <SongList songs={data.songs} />, document.querySelector("#songs")
        );
    });
};

// load songs once page loads
$(document).ready(function() {
    //getToken();

    loadSongsFromServer();
});
