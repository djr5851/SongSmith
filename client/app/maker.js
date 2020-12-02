
// validate song and push to db
const createSong = (e) => {
    e.preventDefault();

    $("#errorMessage").fadeOut()

    if($("#songName").val() == '' || $("#songLyrics").val() == '') {
        handleError("All fields are required");
        return false;
    }

    setCreateSongVisible(false);

    sendAjax('POST', $("#createSong").attr("action"), $("#createSong").serialize(), function() {
        loadSongsFromServer();
    });

    return false;
};

// toggle confirm deletion window
const setConfirmDeleteVisible = (visible, song) => {
    if (visible) {
        $("#overlay").fadeIn();
        sendAjax('GET', '/getToken', null, (result) => {
            ReactDOM.render(
                <ConfirmDelete visible={true} song={song} csrf={result.csrfToken}/>, document.querySelector("#makeSong")
            );
        });
    }
    else {
        $("#overlay").fadeOut();
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
                <img src="/assets/img/exit.png" alt="exit" className="exitButton" onClick={() => setConfirmDeleteVisible(false)} />
                <h1>Delete "{props.song.name}"?</h1>
                <input type="hidden" name="_id" value={props.song._id}/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="formSubmit" type="submit" value="Confirm" />
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
                <img src="/assets/img/exit.png" alt="exit" className="exitButton" onClick={() => setCreateSongVisible(false)} />
                <input id="songName" className="songNameInput" type="text" name="name" placeholder="Song Name"/>
                <button className="tool" type="button" onClick={InsertChord}>InsertChord</button>
                <textarea id="songLyrics" type="text" name="lyrics" placeholder="Song Lyrics"/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="formSubmit" type="submit" value="Make Song" />
            </form>
        );
    }
    return null;
};

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
                <img src="/assets/img/exit.png" alt="exit" className="exitButton" onClick={() => setUpdateSongVisible(false)} />
                <input id="updateSongName" className="songNameInput" type="text" name="name" defaultValue={props.name}/>
                <button className="tool" type="button" onClick={InsertChord}>InsertChord</button>
                <textarea id="updateSongLyrics" type="text" name="lyrics" defaultValue={props.lyrics}/>
                <input type="hidden" name="_id" value={props._id}/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="formSubmit" type="submit" value="Update Song" />
            </form>
        );
    }
    return null;
};


const updateSong = (e) => {
    e.preventDefault();

    $("#errorMessage").fadeOut()

    if($("#updateSongName").val() == '' || $("#updateSongLyrics").val() == '') {
        handleError("All fields are required");
        return false;
    }

    setUpdateSongVisible(false);

    sendAjax('POST', $("#updateSong").attr("action"), $("#updateSong").serialize(), function() {
        loadSongsFromServer();
    });

    return false;

}

const InsertChord = () => {
    let cursorPos = $('textarea').prop('selectionStart');
    let text = $('textarea').val();
    let textBefore = text.substring(0,  cursorPos);
    let textAfter  = text.substring(cursorPos, text.length);
    $('textarea').val(textBefore + "^[*chord*]" + textAfter);

    let searchText = "*chord*";
    let textarea = document.querySelector("textarea");
    let pos = textarea.value.indexOf(searchText);
    if(pos!=-1) {
    textarea.focus();
    textarea.selectionStart = pos;
    textarea.selectionEnd = pos+searchText.length
    }
}

const DropdownMenu = (props) => {
    const [visible, setVisible] = React.useState(false);
    const showMenu = () => {
        setVisible(true);
        document.addEventListener('click', closeMenu);
    }
      
    const closeMenu = () => {          
        setVisible(false);
        document.removeEventListener('click', closeMenu);
    }
    
    return (
        <div>
            <div className="test" onClick={showMenu}></div>
            { visible && 
                <div className="dropdownContent">
                    <a href="#" onClick={() => {setUpdateSongVisible(true, props.song); return false;}}>Edit</a>
                    <a href="#" onClick={() => {setConfirmDeleteVisible(true, props.song); return false;}}>Delete</a>
                </div>
            }
        </div>
    );
}

    
// grid of songs and song creation button
const SongList = function(props) {
    const [openSongVisible, setOpenSongVisible] = React.useState(false);
    const [openSongName, setOpenSongName] = React.useState("");
    const [openSongLyrics, setOpenSongLyrics] = React.useState("");
    
    const setupSongView = (e, song) => {
        // dont open if clicking dropdown or its links
        if(e.target.className !== "test" && e.target.tagName !== "A")
        {
            setOpenSongVisible(true);
            setOpenSongName(song.name);
            setOpenSongLyrics(song.lyrics);
            $("#overlay").fadeIn();
            document.addEventListener('click', closeSongView);
        }
    }

    const closeSongView = (e) => {
        if (e.target.id === "overlay" || e.target.className === "exitButton")
        {
            setOpenSongVisible(false);
            $("#overlay").fadeOut();
            document.removeEventListener('click', closeSongView);
        }
    }

    const songNodes = props.songs.map(function(song) {
        return (
            <div key={song._id} className="song" onClick={(e) => setupSongView(e, song)}>
                <img src="/assets/img/songIcon.png" alt="song icon" className="songIcon"/>
                <DropdownMenu song={song}/>
                <h3>‎‎ ‎</h3>
                <div className="songName">
                    <h3>{song.name} </h3>
                </div>
            </div>
        );
    });

    return (
        <div className="songList">
            {openSongVisible && <SongView name={openSongName} lyrics={openSongLyrics}/>}
            <div className="song" onClick={() => setCreateSongVisible(true)}>
                <h3 className="addSong">+</h3>
            </div>
            {songNodes}
        </div>
    );
};

const parseChords = () => {
    let lyrics = document.querySelector("#lyrics");
    let chords = lyrics.innerHTML.match(/(?<=\[).+?(?=\])/g);
    if (chords) {
        let temp = lyrics.innerHTML;
        for (let i = 0; i < chords.length; i++) {
            temp = temp.replace(/\[(.*?)\]/, `<div class="chordParent"><div class="chordChild">${chords[i]}</div></div>`);
        }
        let cleanup = temp.replace(/[\^]+/g, "");
        lyrics.innerHTML = cleanup;
    }
}

const SongView = (props) => {
    React.useEffect(() => {
        const script = document.createElement('script');
        script.innerHTML = "parseChords()";
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    })
    return (
        <div className="songView">
            <img src="/assets/img/exit.png" alt="exit" className="exitButton"/>
            <h1>"{props.name}"</h1>
            <div id="lyrics">
                <p>{props.lyrics}</p>
            </div>
        </div>
    )
}

// toggle song creation form
const setCreateSongVisible = (visible) => {
    $("#errorMessage").fadeOut()
    if (visible) {
        $("#overlay").fadeIn();
        sendAjax('GET', '/getToken', null, (result) => {
            ReactDOM.render(
                <CreateSongForm csrf={result.csrfToken} visible={true}/>, document.querySelector("#makeSong")
            );        
        });
    }
    else {
        $("#overlay").fadeOut();
        ReactDOM.render(
            <CreateSongForm visible={false}/>, document.querySelector("#makeSong")
        );            
    }
}
// toggle song update form
const setUpdateSongVisible = (visible, song) => {
    $("#errorMessage").fadeOut()
    if (visible) {
        $("#overlay").fadeIn();
        sendAjax('GET', '/getToken', null, (result) => {
            ReactDOM.render(
                <UpdateSongForm _id={song._id} name={song.name} lyrics={song.lyrics} csrf={result.csrfToken} visible={true}/>, document.querySelector("#makeSong")
            );        
        });
    }
    else {
        $("#overlay").fadeOut();
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
