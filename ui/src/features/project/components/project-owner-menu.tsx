import React from "react";

import { Menu, MenuItem, Stack, TextField } from "@mui/material";

import PersonRemoveAlt1OutlinedIcon from "@mui/icons-material/PersonRemoveAlt1Outlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";

interface ProjectOwnerMenuProps {
  ownerMenuAnchorEl: any,
  ownerMenuOpen: boolean,

  handleOnOwnerMenuClose?: Function,
  handleOnCollaboratorAddClick?: Function,
  handleOnCollaboratorRemoveClick?: Function
}

const ProjectOwnerMenu = (props: ProjectOwnerMenuProps) => {
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
    if(props.handleOnCollaboratorAddClick) {
      props.handleOnCollaboratorAddClick(collaboratorToAddEmail, collaboratorSecret)
    }
  }

  const handleOnCollaboratorRemoveClick = (e: any) => {
    if(props.handleOnCollaboratorRemoveClick) {
      props.handleOnCollaboratorRemoveClick(collaboratorToRemoveEmail)
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
        label="Email to add" 
        variant="standard" 
        placeholder="Email"
        inputRef={ collaboratorAddRef }  
        onKeyDown={ (e) => handleOnCollaboratorAddKeyPress(e) }
        onChange={ (e) => handleOnCollaboratorToAddEmailChange(e) } />

      <TextField 
        label="Secret"
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
        label="Email to remove" 
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