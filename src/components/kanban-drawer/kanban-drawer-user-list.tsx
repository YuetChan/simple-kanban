import { Avatar, AvatarGroup, IconButton, Link, Stack, Tooltip } from "@mui/material";

import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';

import { useKanbanProjectsContext } from "../../providers/kanban-projects";
import { textToAvatar } from "../../apis/avatar-api";

const KanbanDrawerUserList = (props: any) => {
  const projectsContextState = useKanbanProjectsContext().state;

  return (
    <Stack 
      direction="row" 
      alignItems="center"
      style={{ margin: "0px 0px 16px 0px" }}>
      <Tooltip title="Collaborator setting">
        <IconButton 
          style={{ transform: "translateX(-16px)" }} 
          onClick={ (e) => {
            if(props.isOwner) {
              props.openOwnerMenu(e);
            }else {
              props.openCollaboratorsMenu(e);
            }
          }}>
          <ManageAccountsOutlinedIcon />
        </IconButton>  
      </Tooltip>

      <Link 
        href="javascript:void(0)" 
        onClick={ (e) => props.handleOnUserAvatarsClick(e) }>
        <AvatarGroup  
          max={ 5 } 
          sx={{ '& .MuiAvatar-root': { width: 36, height: 36, } }}>
          {
            projectsContextState._activeProject
            ? (
              <Tooltip title={ projectsContextState._activeProject?.userEmail }>
                <Avatar>{ textToAvatar(projectsContextState._activeProject?.userEmail) }</Avatar>
              </Tooltip>
            )
            : null
          }

          {
            projectsContextState?._activeProject?.collaboratorList.map(collaborator => {
              return (
                <Tooltip title={ collaborator.email }>
                  <Avatar>{ textToAvatar(collaborator.email) }</Avatar>
                </Tooltip>
              )
            })
          }    
        </AvatarGroup>
      </Link> 
    </Stack>  
  )
}

export default KanbanDrawerUserList;