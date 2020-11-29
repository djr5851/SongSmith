const handleSong = (e) => {
    e.preventDefault();

    ReactDOM.render(
        <SongForm visible={false}/>, document.querySelector("#makeSong")
    );    

    $("songMessage").animate({width:'hide'},350);

    if($("#songName").val() == '' || $("#songLyrics").val() == '') {
        handleError("All field are required");
        return false;
    }

    sendAjax('POST', $("#songForm").attr("action"), $("#songForm").serialize(), function() {
        loadSongsFromServer();
    });

    return false;
};

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

const SongList = function(props) {
    if (props.songs.length === 0) {
        return (
            <div className="songList">
                {/* <h3 className="emptySong">No Songs yet</h3> */}
                <div key={song._id} className="song">
                    <img src="/assets/img/songIcon.jpeg" alt="song icon" className="songIcon" />
                    <h3 className="songName">+</h3>
                </div>
            </div>
        );
    }

    const songNodes = props.songs.map(function(song) {
        return (
            <div key={song._id} className="song">
                <img src="/assets/img/songIcon.jpeg" alt="song icon" className="songIcon" />
                <h3 className="songName">Name {song.name} </h3>
                <h3 className="songLyrics">Lyrics: {song.lyrics} </h3>
            </div>
        );
    });

    return (
        <div className="songList">
            <div className="song" onClick={getToken}>
                <img src="/assets/img/songIcon.jpeg" alt="song icon" className="songIcon" />
                <h3 className="songName">+</h3>
            </div>
            {songNodes}
        </div>
    )
};

const loadSongsFromServer = () => {
    sendAjax('GET', '/getSongs', null, (data) => {
        ReactDOM.render(
            <SongList songs={data.songs} />, document.querySelector("#songs")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <SongForm csrf={csrf} visible={true}/>, document.querySelector("#makeSong")
    );
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    //getToken();
    ReactDOM.render(
        <SongList songs={[]} />, document.querySelector("#songs")
    );

    loadSongsFromServer();
});
