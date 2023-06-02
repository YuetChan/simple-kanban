const redirectToLoginPage = () => {
    if(process.env.REACT_APP_OAUTH_URL) {
        window.location.href = process.env.REACT_APP_OAUTH_URL;
    };
}

export {redirectToLoginPage};