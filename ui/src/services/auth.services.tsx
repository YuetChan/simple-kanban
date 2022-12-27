const redirectToLoginPage = () => {
  console.log(process.env.REACT_APP_OAUTH_URL)
  const OAUTH_URL = process.env.REACT_APP_OAUTH_URL;
  if(OAUTH_URL) {
    window.location.href = OAUTH_URL;
  };
}

export {redirectToLoginPage};