import { Avatar, Stack } from "@mui/material";
import { truncate } from "../../../libs/text-lib";
import { textToAvatar } from "../../../services/avatar-service";


interface UserProfileMiniProps {
    size: number,
    email: string
}

const UserProfileMini = (props: UserProfileMiniProps) => {
    return (
        <Stack 
            direction="row" 
            alignItems="center" 
            spacing={ 1.4 }
            >
            <Avatar>
                { textToAvatar(props.email, props.size) }
            </Avatar>

            <Stack direction="column" alignItems="flex-start">
                <div>
                    <b>{ truncate(props.email.split("@")[0], 15) }</b>
                </div>

                <div>
                    <a 
                        href="javascript:void(0)" 
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