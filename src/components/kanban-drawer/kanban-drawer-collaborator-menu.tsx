import React from "react";

import { Menu, MenuItem, Stack } from "@mui/material";

import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { getProjectById, updateProjectById } from "../../apis/projects-api";

import { useKanbanProjectsContext } from "../../providers/kanban-projects";
import { useKanbanUsersContext } from "../../providers/kanban-users";

interface DrawerCollaboratorMenuProps {
  collaboratorsMenuAnchorEl: any,
  collaboratorsMenuOpen: boolean,
  handleOnCollaboratorsMenuClose?: Function
}

const KanbanDrawerCollaboratorMenu = (props: DrawerCollaboratorMenuProps) => {
  const projectsContextState = useKanbanProjectsContext().state;
  const projectsContextDispatch = useKanbanProjectsContext().Dispatch;

  const usersContextState = useKanbanUsersContext().state;

  const handleOnQuitProjectClick = () => {
    const originalProject = projectsContextState._activeProject;

    const originalCollaboratorEmails = originalProject.collaboratorList.map(collaborator =>  collaborator.email);
    const updatedCollaboratorEmails = originalCollaboratorEmails.filter(email => {
      return email !== usersContextState._loginedUserEmail;
    });

    const updatedCollaborators = updatedCollaboratorEmails.map(email => {
      return { email: email }
    });

    const updatedProject = {
      ... originalProject,
      collaboratorList: updatedCollaborators
    }

    updateProjectById(originalProject.id, updatedProject, new Map()).then(res => {
      alert('You are removed');

      getProjectById(originalProject.id).then(res => {
        projectsContextDispatch({
          type: 'activeProject_update',
          value: undefined
        });
      });
    }).catch(err => {
      console.log(err);
      alert('Opps, failed to remove yourself from project')
    });
  }

  return (
    <Menu
      anchorEl={ props.collaboratorsMenuAnchorEl }
      open={ props.collaboratorsMenuOpen }
      onClose={ () => {
        if(props.handleOnCollaboratorsMenuClose){
          props.handleOnCollaboratorsMenuClose()
        }
      } }
      PaperProps={{ style: { maxHeight: "360px" }}}>
      <MenuItem 
        key="remove_self" 
        value="remove_self"
        onClick={ handleOnQuitProjectClick }>
        <Stack 
          direction="row" 
          justifyContent="center" 
          spacing={ 1 }>
          <ExitToAppIcon />

          <div>Quit project</div>
        </Stack>
      </MenuItem>  
    </Menu>     
  )
}

export default KanbanDrawerCollaboratorMenu;
