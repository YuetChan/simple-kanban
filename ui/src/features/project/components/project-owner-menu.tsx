import React, { useRef, useState } from "react";

import { Button, Divider, IconButton, Menu, Stack, TextField } from "@mui/material";

import KanbanIconTitle from "../../../components/kanban-Icon-title";

import PersonRemoveAlt1OutlinedIcon from "@mui/icons-material/PersonRemoveAlt1Outlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";

import GamepadIcon from '@mui/icons-material/Gamepad';
import DangerousIcon from '@mui/icons-material/Dangerous';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

interface ProjectOwnerMenuProps {
    anchorEl: any,
    open: boolean,

    handleOnOwnerMenuClose?: Function,
    handleOnCollaboratorAdd?: Function,
    handleOnCollaboratorRemove?: Function,

    handleOnProjectDelete?: Function
}

const ProjectOwnerMenu = (props: ProjectOwnerMenuProps) => {
    // ------------------ Project owner menu ------------------
    const [ collaboratorToAddEmail, setCollaboratorToAddEmail ] = useState("");
    const [ collaboratorToRemoveEmail, setCollaboratorToRemoveEmail ] = useState("");

    const collaboratorAddRef = useRef(undefined);
    const collaboratorRemoveRef = useRef(undefined);

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

    const handleOnCollaboratorToAddEmailChange = (e: any) => {
        setCollaboratorToAddEmail(e.target.value)
    }

    const handleOnCollaboratorToRemoveEmailChange = (e: any) => {
        setCollaboratorToRemoveEmail(e.target.value)
    }

    const handleOnCollaboratorAdd = (e: any) => {
        if(props.handleOnCollaboratorAdd) {
            props.handleOnCollaboratorAdd(collaboratorToAddEmail)
        }
    }

    const handleOnCollaboratorRemove = (e: any) => {
        if(props.handleOnCollaboratorRemove) {
            props.handleOnCollaboratorRemove(collaboratorToRemoveEmail)
        }
    }

    const handleOnProjectDelete = (e: any) => {
        if(props.handleOnProjectDelete) {
            props.handleOnProjectDelete();
        }
    }
  
    // ------------------ Html template ------------------
    return (
        <Menu         
            anchorEl={ props.anchorEl }
            open={ Boolean(props.anchorEl) }

            onClose={ handleOnClose }

            PaperProps={{ 
                style: { 
                    width: "330px" 
                }}}>

            <Stack direction="column" spacing={ 1.4 } >
                
       
            <Stack 
                direction="column"
 
                style={{ 
                    padding: "8px" 
                    }}>
                <KanbanIconTitle 
                    icon={ <GamepadIcon /> }
                    label="Owner setting"
                    />
                <Stack 
                    direction="row"
                    alignItems="center"
                    spacing={ 1.2 }  

                    sx={{ 
                        padding: "0px 12px 0px 12px" 
                    }}>
                    <TextField 
                        label="Email to add" 
                        variant="standard" 
                        placeholder="Email"
                        inputRef={ collaboratorAddRef }  
        
                        onKeyDown={ (e) => handleOnCollaboratorAddKeyPress(e) }
                        onChange={ (e) => handleOnCollaboratorToAddEmailChange(e) } 

                        sx={{
                            width: "240px"
                        }} />

                    <IconButton onClick={ handleOnCollaboratorAdd }> 
                        <PersonAddAlt1OutlinedIcon />
                    </IconButton>
                </Stack>

                <Stack 
                    direction="row"
                    alignItems="center" 
                    spacing={ 1.2 }  
                    
                    sx={{ 
                        padding: "0px 12px 0px 12px" 
                    }}>
                    <TextField 
                        label="Email to remove" 
                        variant="standard" 
                        placeholder="Email"
                        inputRef={ collaboratorRemoveRef }  
        
                        onKeyDown={ (e) => handleOnCollaboratorAddKeyPress(e) }
                        onChange={ (e) => handleOnCollaboratorToRemoveEmailChange(e) } 

                        sx={{
                            width: "240px"
                        }} />

                    <IconButton onClick={ handleOnCollaboratorRemove }> 
                        <PersonRemoveAlt1OutlinedIcon />
                    </IconButton>
                </Stack> 
            </Stack> 


            <Stack 
                direction="column"
 
                style={{ 
                    padding: "8px" 
                    }}>
                <KanbanIconTitle 
                    icon={ <DangerousIcon /> }
                    label="Dangerous"
                    />

                    <Button 
                        startIcon={<DeleteForeverIcon />} 
                        variant="text"
                        color="error"

                        onClick={ handleOnProjectDelete }

                        sx={{
                            padding: "0px 12px",
                            marginTop: "12px"
                        }}>
                        Delete project
                    </Button>    
                </Stack>
            </Stack> 
        </Menu>
    )
}

export default ProjectOwnerMenu;