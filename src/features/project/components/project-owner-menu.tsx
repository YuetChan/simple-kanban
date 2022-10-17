import React, { useContext } from "react";

import { ReactReduxContext, useDispatch, useSelector } from "react-redux";

import { Menu, MenuItem, Stack, TextField } from "@mui/material";

import PersonRemoveAlt1OutlinedIcon from '@mui/icons-material/PersonRemoveAlt1Outlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';

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
  const projectsCacheContextState = useSelector((state: AppState) => state.ProjectsCache);

  const { updateActiveProject } = ProjectsCahceActions;

  // ------------------ Owner menu ------------------
  const [ collaboratorToAddEmail, setCollaboratorToAddEmail ] = React.useState('');
  const [ collaboratorSecret, setCollaboratorSecret ] = React.useState('');
  const [ collaboratorToRemoveEmail, setCollaboratorToRemoveEmail ] = React.useState('');

  const collaboratorAddRef = React.useRef(undefined);
  const collaboratorSecretRef = React.useRef(undefined);
  const collaboratorRemoveRef = React.useRef(undefined);

  const handleOnCollaboratorAddKeyPress = (e: any) => {
    if(e.key === 'Tab') {
      e.stopPropagation();
    }
  }

  const handleOnCollaboratorSecretKeyPress = (e: any) => {
    if(e.key === 'Tab') {
      e.stopPropagation();
    }
  }

  const handleOnCollaboratorRemoveKeyPress = (e: any) => { }

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
    const activeProject = projectsCacheContextState._activeProject;
    if(activeProject) {
      const collaboratorEmails = activeProject.collaboratorList.map(collaborator =>  collaborator.email);
      if(collaboratorEmails.indexOf(collaboratorToAddEmail) !== -1) {
        alert('Collaborator already added to the project')
        return;
      }
  
      const updatedCollaboratorEmails = [ ...collaboratorEmails, collaboratorToAddEmail];
      const updatedCollaborators = updatedCollaboratorEmails.map(email => {
        return {
          email: email
        } as User;
      })
  
      const updatedProject = {
        ... activeProject,
        collaboratorList: updatedCollaborators
      }
  
      const collaboratorEmailSecretMap = {
        [collaboratorToAddEmail]: collaboratorSecret
      }
  
      updateProjectById(activeProject.id, updatedProject, collaboratorEmailSecretMap).then(res => {
        alert('Collaborator added');
  
        getProjectById(activeProject.id).then(res => {
          dispatch(updateActiveProject(res));
        });
      }).catch(err => {
        console.log(err);
        alert('Opps, failed to add collaborator')
      });
    }
  }

  const handleOnCollaboratorRemoveClick = (e: any) => {
    const activeProject = projectsCacheContextState._activeProject;
    if(activeProject) {
      const collaboratorEmails = activeProject.collaboratorList.map(collaborator =>  collaborator.email);
      const updatedCollaboratorEmails = collaboratorEmails.filter(email => {
        return email !== collaboratorToRemoveEmail;
      })
  
      if(updatedCollaboratorEmails.length === collaboratorEmails.length) {
        alert('Collaborator not in project');
        return;
      }
  
      const updatedCollaborators = updatedCollaboratorEmails.map(email => {
        return {
          email: email
        } as User;
      })
  
      const updatedProject = {
        ... activeProject,
        collaboratorList: updatedCollaborators
      }
  
      updateProjectById(activeProject.id, updatedProject, new Map()).then(res => {
        alert('Collaborator removed');
  
        getProjectById(activeProject.id).then(res => {
          dispatch(updateActiveProject(res));
        })
      }).catch(err => {
        console.log(err);
        alert('Opps, failed to remove collaborator')
      });
    }
  }
  
  // ------------------ Html template ------------------
  return (
    <Menu           
      anchorEl={ props.ownerMenuAnchorEl }
      open={ props.ownerMenuOpen }
      onClose={ () => {
        if(props.handleOnOwnerMenuClose) {
          props.handleOnOwnerMenuClose();
        }
      } }
      PaperProps={{ style: { maxHeight: "360px" }}}>
    <Stack 
      direction="column" 
      style={{ padding: "4px 16px" }}>
      <TextField 
        label={ "Email" } 
        variant="standard" 
        placeholder="Email"
        inputRef={ collaboratorAddRef }  
        onKeyDown={ (e) => handleOnCollaboratorAddKeyPress(e) }
        onChange={ (e) => handleOnCollaboratorToAddEmailChange(e) } />

      <TextField 
        label={ "Secret" } 
        variant="standard" 
        placeholder="Secret" 
        inputRef={ collaboratorSecretRef }
        onKeyDown={ (e) => handleOnCollaboratorSecretKeyPress(e) }
        onChange={ (e) => handleOnCollaboratorToAddSecretChange(e) } />
    </Stack>  
    
    <MenuItem 
      key="add_collaborator" 
      value="add_collaborator"
      onClick={ handleOnCollaboratorAddClick }>
      <Stack 
        direction="row" 
        justifyContent="center" 
        spacing={ 1 }>
        <PersonAddAlt1OutlinedIcon />
            
        <div>Add a collaborator (Max 20)</div>
      </Stack>
    </MenuItem>

    <Stack 
      direction="column" 
      style={{ padding: "4px 16px" }}>
      <TextField 
        label={ "Email" } 
        variant="standard" 
        placeholder="Email" 
        inputRef={ collaboratorRemoveRef }
        onKeyDown={ (e) => handleOnCollaboratorRemoveKeyPress(e) }
        onChange={ (e) => handleOnCollaboratorToRemoveEmailChange(e) } />
    </Stack>

    <MenuItem 
      key="remove_collaborator" 
      value="remove_collaborator"
      onClick={ handleOnCollaboratorRemoveClick }>
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