import { Avatar, Stack } from "@mui/material";
import { truncate } from "../../../libs/text-lib";
import { textToAvatarDataUrl } from "../../../services/avatar-service";


interface UserProfileMiniProps {
    size: number,
    email: string,
    handleOnSignout?: Function,
}

const UserProfileMini = (props: UserProfileMiniProps) => {
    const handleOnSignout = (e: any) => {
        if(props.handleOnSignout) {
            props.handleOnSignout();
        }
    }

    return (
        <Stack 
            direction="row" 
            alignItems="center" 
            spacing={ 1.4 }
            >
            <Avatar 
                alt={ props.email } 
                src={ textToAvatarDataUrl(props.email) } 
                
                style={{
                    height: props.size,
                    width: props.size
                }} />

            <Stack direction="column" alignItems="flex-start">
                <div>
                    <b>{ truncate(props.email.split("@")[0], 15) }</b>
                </div>

                <div>
                    <a 
                        href="javascript:void(0)" 

                        onClick={ handleOnSignout }

                        style={{
                            textDecoration: "none",
                            color: "rgb(47, 47, 47)"
                        }}> 
                        <span style={{
                            fontSize: "14px"
                            }}>
                                SIGN OUT 🖐️
                        </span> 
                    </a>
                </div>

            </Stack>
        </Stack>

    )
}

export default UserProfileMini;