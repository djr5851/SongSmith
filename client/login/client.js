const handleLogin = (e) => {
    e.preventDefault();

    $("#errorMessage").fadeOut()

    if($("#user").val() == '' || $("#pass").val() == '') {
        handleError("Username or password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
}

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

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content"),
        () => {
            const signupLink = document.querySelector("#signupLink");
            signupLink.addEventListener("click", (e) => {
                e.preventDefault();
                createSignupWindow(csrf);
                return false;
            });
        }
    );
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content"),
        () => {
            const signinLink = document.querySelector("#signinLink");
            signinLink.addEventListener("click", (e) => {
                e.preventDefault();
                createLoginWindow(csrf);
                return false;
            });
        }
    );
};

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

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});