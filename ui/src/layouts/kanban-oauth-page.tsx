import { useEffect } from "react";
import { redirectToLoginPage } from "../services/auth.services";

const KanbanOauthPage = () => {
	useEffect(() => {
		console.log("called12312312312312")
	}, []);

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