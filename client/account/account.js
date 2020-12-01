const updateAccount = (e) => {
    e.preventDefault();

    $("#songMessage").animate({width:'hide'},350);

    if($("#currentUser").val() == '' || $("#currentPass").val() == '' || $("#newPass").val() == '' || $("#newPass2").val() == '') {
        handleError("All fields are required");
        return false;
    }

    if($("#newPass").val() !== $("#newPass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    console.dir($("#accountForm").serialize());

    sendAjax('POST', $("#accountForm").attr("action"), $("#accountForm").serialize(), redirect);
    
    return false;
}


// account edit form
const AccountForm = (props) => {
    return (
        <form id="accountForm" 
                name="account"
                onSubmit={updateAccount}
                action="/account"
                method="POST"
                className="songForm"
        >
            <h1 id="username">{props.username}</h1>
            {/* <label htmlFor="userLabel">Username: </label> */}
            {/* <input id="currentUser" type="text" name="currentUser" defaultValue={props.username}/> */}
            {/* <label htmlFor="currentPassLabel">Current Password: </label> */}
            <input id="currentPass" type="text" name="currentPass" placeholder="Current Password"/>
            {/* <label htmlFor="newPassLabel">New Password: </label> */}
            <input id="newPass" type="text" name="newPass" placeholder="New Password"/>
            {/* <label htmlFor="newPass2Label">Confirm New Password: </label> */}
            <input id="newPass2" type="text" name="newPass2" placeholder="Confirm New Password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeSongSubmit" type="submit" value="Save" />
        </form>
    );
};


const createAccountForm = (csrf, username) => {
    ReactDOM.render(
        <AccountForm csrf={csrf} username={username}/>,
        document.querySelector("#content")
    );
};

const setup = (csrf) => {
    sendAjax('GET', '/getUsername', null, (result) => {
        createAccountForm(csrf, result.username);
    });
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});