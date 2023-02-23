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
    	<div style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <button 
          onClick={ handleOnGoogleSignInClick } 
          type="button" 
          className="login-with-google-btn" >
            Sign in with Google
        </button>
      </div>
    )
}

export default KanbanOauthPage;