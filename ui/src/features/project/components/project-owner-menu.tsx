import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { Menu, MenuItem, Stack, TextField } from "@mui/material";

import PersonRemoveAlt1OutlinedIcon from "@mui/icons-material/PersonRemoveAlt1Outlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";

import { getProjectById, updateProjectById } from "../services/projects-service";

import { User } from "../../../types/User";

import { AppState } from "../../../stores/app-reducers";

import { actions as ProjectsCahceActions } from "../../../stores/projects-cache-slice";

interface ProjectOwnerMenuProps {
  ownerMenuAnchorEl: any,
  ownerMenuOpen: boolean,
  handleOnOwnerMenuClose?: Function
}

const ProjectOwnerMenu = (props: ProjectOwnerMenuProps) => {
  // ------------------ Dispatch ------------------
  const dispatch = useDispatch();

  // ------------------ Projects cache ------------------
  const projectsCacheState = useSelector((state: AppState) => state.ProjectsCache);
  const { updateActiveProject } = ProjectsCahceActions;

  // ------------------ Project owner menu ------------------
  const [ collaboratorToAddEmail, setCollaboratorToAddEmail ] = React.useState("");
  const [ collaboratorSecret, setCollaboratorSecret ] = React.useState("");
  const [ collaboratorToRemoveEmail, setCollaboratorToRemoveEmail ] = React.useState("");

  const collaboratorAddRef = React.useRef(undefined);
  const collaboratorSecretRef = React.useRef(undefined);
  const collaboratorRemoveRef = React.useRef(undefined);

  const handleOnClose = (e: any) => {
    if(props.handleOnOwnerMenuClose) {
      props.handleOnOwnerMenuClose();
    }
  }

  const handleOnCollaboratorAddKeyPress = (e: any) => {
    if(e.key === "Tab") {
      e.stopPropagation();
    }
  }

  const handleOnCollaboratorSecretKeyPress = (e: any) => {
    if(e.key === "Tab") {
      e.stopPropagation();
    }
  }

  const handleOnCollaboratorToAddEmailChange = (e: any) => {
    setCollaboratorToAddEmail(e.target.value)
  }

  const handleOnCollaboratorToAddSecretChange = (e: any) => {
    setCollaboratorSecret(e.target.value);
  }

  const handleOnCollaboratorToRemoveEmailChange = (e: any) => {
    setCollaboratorToRemoveEmail(e.target.value)
  }

  const handleOnCollaboratorAddClick = (e: any) => {
    const activeProject = projectsCacheState._activeProject;

    if(activeProject) {
      const collaboratorEmails = activeProject.collaboratorList.map(collaborator =>  collaborator.email);

      if(collaboratorEmails.indexOf(collaboratorToAddEmail) !== -1) {
        alert("Collaborator already added to the project");
        return;
      }
  
      const updatedCollaboratorEmails = [ ...collaboratorEmails, collaboratorToAddEmail];
      const updatedCollaborators = updatedCollaboratorEmails.map(email => {
        return { email: email } as User;
      })
  
      const updatedProject = {
        ... activeProject,
        collaboratorList: updatedCollaborators
      }
  
      const collaboratorEmailSecretMap = {
        [collaboratorToAddEmail]: collaboratorSecret
      }
  
      updateProjectById(activeProject.id, updatedProject, collaboratorEmailSecretMap).then(res => {
        alert("Collaborator added");
  
        getProjectById(activeProject.id).then(res => {
          dispatch(updateActiveProject(res));
        });
      }).catch(err => {
        console.log(err);
        alert("Opps, failed to add collaborator")
      });
    }
  }

  const handleOnCollaboratorRemoveClick = (e: any) => {
    const activeProject = projectsCacheState._activeProject;
    if(activeProject) {
      const collaboratorEmails = activeProject.collaboratorList.map(collaborator =>  collaborator.email);
      const updatedCollaboratorEmails = collaboratorEmails.filter(email => {
        return email !== collaboratorToRemoveEmail;
      })
  
      if(updatedCollaboratorEmails.length === collaboratorEmails.length) {
        alert("Collaborator not in project");
        return;
      }
  
      const updatedCollaborators = updatedCollaboratorEmails.map(email => {
        return { email: email } as User;
      })
  
      const updatedProject = {
        ... activeProject,
        collaboratorList: updatedCollaborators
      }
  
      updateProjectById(activeProject.id, updatedProject, new Map()).then(res => {
        alert("Collaborator removed");
  
        getProjectById(activeProject.id).then(res => {
          dispatch(updateActiveProject(res));
        })
      }).catch(err => {
        console.log(err);
        alert("Opps, failed to remove collaborator")
      });
    }
  }
  
  // ------------------ Html template ------------------
  return (
    <Menu      
      PaperProps={{ style: { maxHeight: "360px" }}}     
      anchorEl={ props.ownerMenuAnchorEl }
      open={ props.ownerMenuOpen }
      onClose={ handleOnClose } >
    <Stack 
      direction="column" 
      style={{ padding: "4px 16px" }} >
      <TextField 
        label="Add email" 
        variant="standard" 
        placeholder="Email"
        inputRef={ collaboratorAddRef }  
        onKeyDown={ (e) => handleOnCollaboratorAddKeyPress(e) }
        onChange={ (e) => handleOnCollaboratorToAddEmailChange(e) } />

      <TextField 
        label="Enter secret"
        variant="standard" 
        placeholder="Secret" 
        inputRef={ collaboratorSecretRef }
        onKeyDown={ (e) => handleOnCollaboratorSecretKeyPress(e) }
        onChange={ (e) => handleOnCollaboratorToAddSecretChange(e) } />
    </Stack>  
    
    <MenuItem 
      key="collaborator_add" 
      value="collaborator_add"
      onClick={ handleOnCollaboratorAddClick } >
      <Stack 
        direction="row" 
        justifyContent="center" 
        spacing={ 1 }>
        <PersonAddAlt1OutlinedIcon />
            
        <div>Add a collaborator</div>
      </Stack>
    </MenuItem>

    <Stack 
      direction="column" 
      style={{ padding: "4px 16px" }} >
      <TextField 
        label="Remove email" 
        variant="standard" 
        placeholder="Email" 
        inputRef={ collaboratorRemoveRef }
        onChange={ (e) => handleOnCollaboratorToRemoveEmailChange(e) } />
    </Stack>

    <MenuItem 
      key="collaborator_remove" 
      value="collaborator_remove"
      onClick={ handleOnCollaboratorRemoveClick } >
      <Stack 
        direction="row" 
        justifyContent="center" 
        spacing={ 1 }>
        <PersonRemoveAlt1OutlinedIcon />

        <div>Remove a collaborator</div>
      </Stack>
    </MenuItem>  
  </Menu>
  )
}

export default ProjectOwnerMenu;