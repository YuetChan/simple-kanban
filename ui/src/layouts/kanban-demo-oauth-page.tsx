import { useState } from "react";
import { redirectToLoginPage } from "../services/auth.services";

import jwt_decode from "jwt-decode";
import { TextField } from "@mui/material";

interface KanbanDemoOauthPageProps {
    style?: any
}

const KanbanDemoOauthPage = (props: KanbanDemoOauthPageProps) => {
    const [ demoUsername, setDemoUsername ] = useState("");
  
    const handleOnGoogleSignInClick = () => {
        redirectToLoginPage()
    }

    const handleDemoLogin = async () => {
        if (demoUsername.trim() === "") {
            alert("Please enter a non empty account name.");
            return;
        }
  
        try {
            const res = await fetch(`${process.env.REACT_APP_DEMO_OAUTH_URL}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: demoUsername }),
            });

            if (res.status === 201) {
                const data = await res.json();

                const decoded = jwt_decode<{ jwt: string, justRegistered: boolean }>(data.jwt);

                if(decoded.justRegistered) {
                    alert("Successful account registration!");
                }else {
                    alert("Sign in an existing account");
                }

                const currentURL = new URL(window.location.href);
                currentURL.searchParams.set('jwt', data.jwt);
                
                // Reload the page with the updated URL
                window.location.href = currentURL.toString();
            } else {
                alert("Error during demo signin / registration");
                console.error("Error during demo signin / registration:", res);
            }
        } catch (error) {
            console.error("Error during demo signin / registration:", error);
        }
    };
  
    return (
        <div
            style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",

                height: "100vh",
                width: "100vw",
  
                ... props.style,
            }}>

            <div
                style={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
            
                    width: "360px",
                    background: "whitesmoke",
            
                    borderRadius: "4px",
                    padding: "54px 18px 54px 18px",
              
                    ... props.style,
                }}>
            <img 
                src="https://i.ibb.co/NjWwY0t/Screenshot-from-2023-05-17-19-03-10.png" 
                width={ 200 } 
                height={ 65} 

                style={{
                    marginBottom: "36px"
                }}/>

            <button 
                type="button" 

                onClick={ handleDemoLogin } 
            
                className="login-with-demo-btn"
                style={{ marginBottom: "18px" }}>
                Sign in or Register an Anonymous Demo Account
            </button>

            <TextField
                label="Enter an account name"
                variant="outlined"
                value={ demoUsername }

                onChange={(e) => setDemoUsername(e.target.value)}

                style={{
                    background: "white"
                }}/>


 
            <div style={{
                margin: "36px 0px 36px 0px"
            }}>
                ----- OR -----
            </div>

            <button 
                type="button" 

                className="login-with-google-btn"

                onClick={ handleOnGoogleSignInClick } >
                Sign in with Google
            </button>
            </div>


        
        </div>
    );
  };
  
  export default KanbanDemoOauthPage;