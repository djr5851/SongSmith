const updateAccount = (e) => {
    e.preventDefault();

    $("#errorMessage").fadeOut();

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
        <div id="loginBox">
            <form id="accountForm" 
                    name="account"
                    onSubmit={updateAccount}
                    action="/account"
                    method="POST"
            >
                <h1 id="username">{props.username}</h1>
                <input id="currentPass" className="accountInput" type="password" name="currentPass" placeholder="Current Password"/>
                <input id="newPass" className="accountInput" type="password" name="newPass" placeholder="New Password"/>
                <input id="newPass2" className="accountInput" type="password" name="newPass2" placeholder="Confirm New Password"/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="formSubmit" type="submit" value="Save" />
            </form>
        </div>
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