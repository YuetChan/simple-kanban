import { Menu, MenuItem, Stack } from "@mui/material";

import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { getProjectById, updateProjectById } from "../../apis/projects-api";
import { useKanbanProjectsContext } from "../../providers/kanban-projects";
import { useKanbanUsersContext } from "../../providers/kanban-users";
import React from "react";

const KanbanDrawerCollaboratorMenu = (props: any) => {
  const projectsContextState = useKanbanProjectsContext().state;
  const projectsContextDispatch = useKanbanProjectsContext().Dispatch;

  const usersContextState = useKanbanUsersContext().state;

  const handleOnQuitProjectClick = () => {
    const project = projectsContextState._activeProject;

    const collaboratorEmails = project.collaboratorList.map(collaborator =>  collaborator.email);
    const updatedCollaboratorEmails = collaboratorEmails.filter(email => {
      return email !== usersContextState._loginedUserEmail;
    });

    const updatedCollaborators = updatedCollaboratorEmails.map(email => {
      return { email: email }
    });

    const updatedProject = {
      ... project,
      collaboratorList: updatedCollaborators
    }

    updateProjectById(project.id, updatedProject, new Map()).then(res => {
      alert('You are removed');

      getProjectById(project.id).then(res => {
        projectsContextDispatch({
          type: 'activeProject_update',
          value: undefined
        });
      });
    }).catch(err => {
      console.log(err);
      alert('Opps, failed to remove yourself')
    });
  }

  return (
    <Menu
      anchorEl={ props.collaboratorsMenuAnchorEl }
      open={ props.collaboratorsMenuOpen }
      onClose={ props.handleOnCollaboratorsMenuClose }
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
