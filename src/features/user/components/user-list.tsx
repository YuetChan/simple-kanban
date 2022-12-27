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
  const projectsCahceState = useSelector((state: AppState) => state.ProjectsCache);
  
  // ------------------ User list ------------------
  const handleOnSettingClick = (e: any) => {
    if(props.isOwner? props.isOwner : false) {
      if(props.openOwnerMenu) {
        props.openOwnerMenu(e);
      }
    }else {
      if(props.openCollaboratorsMenu) {
        props.openCollaboratorsMenu(e);
      }
    }
  }

  const handleOnUserListClick = (e: any) => {
    if(props.handleOnUserAvatarsClick) {
      props.handleOnUserAvatarsClick(e);
    }
  }

  // ------------------ Html template ------------------
  return (
    <Stack 
      direction="row" 
      alignItems="center"
      style={{ margin: "0px 0px 16px 0px" }} >
      <Tooltip title="Collaborator setting" >
        <IconButton 
          style={{ transform: "translateX(-16px)" }} 
          onClick={ (e) => handleOnSettingClick(e) } >

          <ManageAccountsOutlinedIcon />
        </IconButton>  
      </Tooltip>

      <Link 
        href="javascript:void(0)" 
        onClick={ (e) => handleOnUserListClick(e) }>
        <AvatarGroup  
          sx={{ '& .MuiAvatar-root': { height: 36, width: 36 } }}
          max={ 5 } >
          {
            projectsCahceState._activeProject
            ? (
              <Tooltip title={ projectsCahceState._activeProject.userEmail }>
                <Avatar style={{
                  height: "30px",
                  width: "30px"
                  }}>
                    { textToAvatar(projectsCahceState._activeProject.userEmail) }
                </Avatar>
              </Tooltip>
            )
            : null
          }

          {
            projectsCahceState?._activeProject?.collaboratorList.map(collaborator => {
              return (
                <Tooltip title={ collaborator.email }>
                  <Avatar style={{
                    height: "30px",
                    width: "30px"
                    }} >
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