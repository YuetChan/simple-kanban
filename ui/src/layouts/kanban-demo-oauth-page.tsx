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
            alert("Please enter a demo name.");
            return;
        }
  
        try {
            // Assuming you have an API endpoint for demo login, make a POST request to create a user
            const res = await fetch("http://localhost:3200/oauth/demo-oauth", {
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
                // Handle the case where the demo login fails (e.g., username already exists)
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
                height: "100vh",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
  
                ... props.style,
            }}
        >
        <TextField
            label="Enter an account name"
            variant="outlined"
            value={ demoUsername }

            onChange={(e) => setDemoUsername(e.target.value)}

            style={{ marginBottom: "18px" }}/>

        <button 
            type="button" 

            onClick={ handleDemoLogin } 
            
            className="login-with-demo-btn">
            Sign in or Register a Demo Account
        </button>
 
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
    );
  };
  
  export default KanbanDemoOauthPage;