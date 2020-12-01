
// validate song and push to db
const createSong = (e) => {
    e.preventDefault();

    $("songMessage").animate({width:'hide'},350);

    if($("#songName").val() == '' || $("#songLyrics").val() == '') {
        handleError("All field are required");
        return false;
    }

    setCreateSongVisible(false);

    sendAjax('POST', $("#createSong").attr("action"), $("#createSong").serialize(), function() {
        loadSongsFromServer();
    });

    return false;
};

// toggle confirm deletion window
const setConfirmDeleteVisible = (visible, _id) => {
    if (visible) {
        sendAjax('GET', '/getToken', null, (result) => {
            ReactDOM.render(
                <ConfirmDelete visible={true} _id={_id} csrf={result.csrfToken}/>, document.querySelector("#makeSong")
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
                <input type="hidden" name="_id" value={props._id}/>
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
const CreateSongForm = (props) => {
    if (props.visible) {
        return (
            <form id="createSong" 
                  name="createSong"
                  onSubmit={createSong}
                  action="/maker"
                  method="POST"
                  className="songForm"
            >
                <img src="/assets/img/songIcon.jpeg" alt="exit" className="exitButton" onClick={() => setCreateSongVisible(false)} />
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

const updateSong = (e) => {
    e.preventDefault();

    $("songMessage").animate({width:'hide'},350);

    if($("#updateSongName").val() == '' || $("#updateSongLyrics").val() == '') {
        handleError("All field are required");
        return false;
    }

    setUpdateSongVisible(false);

    sendAjax('POST', $("#updateSong").attr("action"), $("#updateSong").serialize(), function() {
        loadSongsFromServer();
    });

    return false;

}

// song update form
const UpdateSongForm = (props) => {
    if (props.visible) {
        return (
            <form id="updateSong" 
                  name="updateSong"
                  onSubmit={updateSong}
                  action="/updateSong"
                  method="POST"
                  className="songForm"
            >
                <img src="/assets/img/songIcon.jpeg" alt="exit" className="exitButton" onClick={() => setCreateSongVisible(false)} />
                <label htmlFor="name">Name: </label>
                <input id="updateSongName" type="text" name="name" defaultValue={props.name}/>
                <label htmlFor="lyrics">Lyrics: </label>
                <input id="updateSongLyrics" type="text" name="lyrics" defaultValue={props.lyrics}/>
                <input type="hidden" name="_id" value={props._id}/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="makeSongSubmit" type="submit" value="Update Song" />
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
      
      showMenu() {
        this.setState({ visible: true }, () => {
          document.addEventListener('click', this.closeMenu);
        });
      }
      
      closeMenu() {          
          this.setState({ visible: false }, () => {
            document.removeEventListener('click', this.closeMenu);
          });  
      }
    
      render() {
        return (
            <div>
              <div className="test" onClick={this.showMenu}></div>
              { this.state.visible && 
                    <div className="dropdown-content" ref={(e) => {this.dropdownMenu = e; }}>
                      <a href="#" onClick={() => {setUpdateSongVisible(true, this.props.song); return false;}}>Edit</a>
                      <a href="#" onClick={() => {setConfirmDeleteVisible(true, this.props.song._id); return false;}}>Delete</a>
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
                <DropdownMenu song={song}/>
                <h3 className="songName">Name {song.name} </h3>
                <h3 className="songLyrics">Lyrics: {song.lyrics} </h3>
            </div>
        );
    });

    return (
        <div className="songList">
            <div className="song" onClick={() => setCreateSongVisible(true)}>
                <img src="/assets/img/songIcon.jpeg" alt="song icon" className="songIcon" />
                <h3 className="songName">+</h3>
            </div>
            {songNodes}
        </div>
    );
};

// toggle song creation form
const setCreateSongVisible = (visible) => {
    if (visible) {
        sendAjax('GET', '/getToken', null, (result) => {
            ReactDOM.render(
                <CreateSongForm csrf={result.csrfToken} visible={true}/>, document.querySelector("#makeSong")
            );        
        });
    }
    else {
        ReactDOM.render(
            <CreateSongForm visible={false}/>, document.querySelector("#makeSong")
        );            
    }
}
// toggle song update form
const setUpdateSongVisible = (visible, song) => {
    if (visible) {
        sendAjax('GET', '/getToken', null, (result) => {
            ReactDOM.render(
                <UpdateSongForm _id={song._id} name={song.name} lyrics={song.lyrics} csrf={result.csrfToken} visible={true}/>, document.querySelector("#makeSong")
            );        
        });
    }
    else {
        ReactDOM.render(
            <UpdateSongForm visible={false}/>, document.querySelector("#makeSong")
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
