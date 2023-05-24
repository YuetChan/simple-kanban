import { useEffect } from "react";
import { redirectToLoginPage } from "../services/auth.services";

interface KanbanOauthPageProps {
    style?: any
}

const KanbanOauthPage = (props: KanbanOauthPageProps) => {
	useEffect(() => { }, []);

    const handleOnGoogleSignInClick = () => {
        redirectToLoginPage()
    }

    return (
        <div style={{                
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",

            ...props.style
            }}>
            <button 
                onClick={ handleOnGoogleSignInClick } 
                type="button" 
                className="login-with-google-btn">
                    Sign in with Google
            </button>
        </div>
    )
}

export default KanbanOauthPage;