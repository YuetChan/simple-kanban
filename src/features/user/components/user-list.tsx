import { useSelector } from "react-redux";

import { Avatar, AvatarGroup, IconButton, Link, Stack, Tooltip } from "@mui/material";

import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';

import { textToAvatar } from "../../../services/avatar-service";

import { AppState } from "../../../stores/app-reducers";

interface UserListProps {
  isOwner?: boolean,

  openOwnerMenu?: Function,
  openCollaboratorsMenu?: Function,
  handleOnUserAvatarsClick?: Function
}

const UserList = (props: UserListProps) => {
  // ------------------ Project cache ------------------
  const projectsCahceContextState = useSelector((state: AppState) => state.ProjectsCache);
  
  // ------------------ Html template ------------------
  return (
    <Stack 
      direction="row" 
      alignItems="center"
      style={{ margin: "0px 0px 16px 0px" }}>
      <Tooltip title="Collaborator setting">
        <IconButton 
          style={{ transform: "translateX(-16px)" }} 
          onClick={ (e) => {
            if(props.isOwner? props.isOwner : false) {
              if(props.openOwnerMenu) {
                props.openOwnerMenu(e);
              }
            }else {
              if(props.openCollaboratorsMenu) {
                props.openCollaboratorsMenu(e);
              }
            }
          }}>
          <ManageAccountsOutlinedIcon />
        </IconButton>  
      </Tooltip>

      <Link 
        href="javascript:void(0)" 
        onClick={ (e) => {
          if(props.handleOnUserAvatarsClick) {
            props.handleOnUserAvatarsClick(e);
          }
        } }>
        <AvatarGroup  
          max={ 5 } 
          sx={{ '& .MuiAvatar-root': { width: 36, height: 36, } }}>
          {
            projectsCahceContextState._activeProject
            ? (
              <Tooltip title={ projectsCahceContextState._activeProject.userEmail }>
                <Avatar style={{
                  width: "30px",
                  height: "30px"
                  }}>
                    { textToAvatar(projectsCahceContextState._activeProject.userEmail) }
                </Avatar>
              </Tooltip>
            )
            : null
          }

          {
            projectsCahceContextState?._activeProject?.collaboratorList.map(collaborator => {
              return (
                <Tooltip title={ collaborator.email }>
                  <Avatar style={{
                  width: "30px",
                  height: "30px"
                  }}>
                    { textToAvatar(collaborator.email) }
                  </Avatar>
                </Tooltip>
              )
            })
          }    
        </AvatarGroup>
      </Link> 
    </Stack>  
  )
}

export default UserList;