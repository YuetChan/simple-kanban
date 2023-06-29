import { useSelector } from "react-redux";

import { Avatar, AvatarGroup, Link, Stack, Tooltip } from "@mui/material";

import { textToAvatarDataUrl } from "../../../services/avatar-service";

import { AppState } from "../../../stores/app-reducers";

interface UserListProps {
  handleOnUserAvatarsClick?: Function
}

const UserList = (props: UserListProps) => {
    // ------------------ Project cache ------------------
    const projectsCahceState = useSelector((state: AppState) => state.ProjectsCache);

    const handleOnUserListClick = (e: any) => {
        if(props.handleOnUserAvatarsClick) {
            props.handleOnUserAvatarsClick(e);
        }
    }

    const getAvatarIcon = (email: string) => {
        return (
            <Tooltip key={`tooltip-${email}`} title={ email }>
                <Avatar 
                    alt={ email } 
                    src={ textToAvatarDataUrl(email) } 
                    />
            </Tooltip>
        )
    }

    // ------------------ Html template ------------------
    return (
        <Stack 
            direction="row" 
            alignItems="center" >
            <Link 
                href="javascript:void(0)" 
                onClick={ (e) => handleOnUserListClick(e) }>
                <AvatarGroup  
                    sx={{ '& .MuiAvatar-root': { height: 36, width: 36 } }}
                    max={ 5 }
                    >
                    {
                        projectsCahceState._activeProject
                        ? getAvatarIcon(projectsCahceState._activeProject.userEmail)
                        : null
                    }

                    {
                        projectsCahceState?._activeProject?.collaboratorList.map(collaborator => {
                            return getAvatarIcon(collaborator.email)
                        })
                    }    
                </AvatarGroup>
            </Link> 
        </Stack>  
    )
}

export default UserList;