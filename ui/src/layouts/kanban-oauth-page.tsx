import { useEffect } from "react";
import { redirectToLoginPage } from "../services/auth.services";

const KanbanOauthPage = () => {
	useEffect(() => { }, []);

    const handleOnGoogleSignInClick = () => {
      redirectToLoginPage()
    }

    return (
        <button 
          onClick={ handleOnGoogleSignInClick } 
          type="button" 
          className="login-with-google-btn" >
            Sign in with Google
        </button>
      
    )
}

export default KanbanOauthPage;