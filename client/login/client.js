// attempt to log user in
const handleLogin = (e) => {
    e.preventDefault();

    $("#errorMessage").fadeOut()

    if($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username or password is empty");
        return false;
    }

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
}

// attempt to add user to db
const handleSignup = (e) => {
    e.preventDefault();

    $("#errorMessage").fadeOut();

    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
    
    return false;
}

// window containing login form
const LoginWindow = (props) => {
    return (
        <div id="loginBox">
            <form id="loginForm" name="loginForm"
                onSubmit={handleLogin}
                action="/login"
                method="POST"
                className="mainForm"
            >
                {/* <label htmlFor="username">Username: </label> */}
                <h1>Songsmith</h1>
                <input id="user" className="accountInput" type="text" name="username" placeholder="Username"/>
                {/* <label htmlFor="pass">Password: </label> */}
                <input id="pass" className="accountInput" type="password" name="pass" placeholder="Password"/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="formSubmit" type="submit" value="Sign in" />
                <p>Don’t have an account? <a id="signupLink" href="/signup">Sign up</a></p>
            </form>
        </div>
    );
};

// window containg signup form
const SignupWindow = (props) => {
    return (
        <div id="loginBox">
        <form id="signupForm" 
              name="signupForm"
              onSubmit={handleSignup}
              action="/signup"
              method="POST"
              className="mainForm"
        >
            <h1>Create Account</h1>
            <input id="user" className="accountInput" type="text" name="username" placeholder="Username"/>
            <input id="pass" className="accountInput" type="password" name="pass" placeholder="Password"/>
            <input id="pass2" className="accountInput" type="password" name="pass2" placeholder="Retype password"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Sign up" />
            <p>Already have an account? <a id="signinLink" href="/signup">Sign in</a></p>
        </form>
    </div>
    );
};

// render login window
const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content"),
        () => {
            // set up sign in link
            const signupLink = document.querySelector("#signupLink");
            signupLink.addEventListener("click", (e) => {
                e.preventDefault();
                createSignupWindow(csrf);
                return false;
            });
        }
    );
};

// render signup window
const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content"),
        () => {
            // set up log in link
            const signinLink = document.querySelector("#signinLink");
            signinLink.addEventListener("click", (e) => {
                e.preventDefault();
                createLoginWindow(csrf);
                return false;
            });
        }
    );
};

// set up login/signup buttons and pass in csrf
const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    createLoginWindow(csrf); // default view
}

// request csrf token
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});