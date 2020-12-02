
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
                <button type="button" onClick={InsertChord}>InsertChord</button>
                <textarea id="updateSongLyrics" type="text" name="lyrics" defaultValue={props.lyrics}/>
                <input type="hidden" name="_id" value={props._id}/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="makeSongSubmit" type="submit" value="Update Song" />
            </form>
        );
    }
    return null;
};

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
                    <a href="#" onClick={() => {setConfirmDeleteVisible(true, props.song._id); return false;}}>Delete</a>
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
            document.addEventListener('click', closeSongView);
        }
    }

    const closeSongView = () => {
        setOpenSongVisible(false);
        document.removeEventListener('click', closeSongView);
    }

    const songNodes = props.songs.map(function(song) {
        return (
            <div key={song._id} className="song" onClick={(e) => setupSongView(e, song)}>
                <img src="/assets/img/songIcon.jpeg" alt="song icon" className="songIcon"/>
                <DropdownMenu song={song}/>
                <h3 className="songName">Name {song.name} </h3>
            </div>
        );
    });

    return (
        <div className="songList">
            {openSongVisible && <SongView name={openSongName} lyrics={openSongLyrics}/>}
            <div className="song" onClick={() => setCreateSongVisible(true)}>
                <img src="/assets/img/songIcon.jpeg" alt="song icon" className="songIcon" />
                <h3 className="songName">+</h3>
            </div>
            {songNodes}
        </div>
    );
};

const parseChords = () => {
    debugger;
    let lyrics = document.querySelector("#lyrics");
    let chords = lyrics.innerHTML.match(/(?<=\[).+?(?=\])/g);
    let temp = lyrics.innerHTML;
    for (let i = 0; i < chords.length; i++) {
        temp = temp.replace(chords[i], `<div class="chordParent"><div class="chordParent">${chords[i]}</div></div>`);
    }
    let cleanup = temp.replace(/[\[\]^]+/g, "");
    lyrics.innerHTML = cleanup;
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
        <div className="songForm">
            {props.name} <p> </p>
            <div id="lyrics">
                {props.lyrics}
            </div>
        </div>
    )
}

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
