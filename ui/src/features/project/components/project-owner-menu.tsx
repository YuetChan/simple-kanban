import { useRef, useState } from "react";

import { Button, IconButton, Menu, Stack, TextField } from "@mui/material";

import KanbanIconTitle from "../../../components/kanban-Icon-title";

import PersonRemoveAlt1OutlinedIcon from "@mui/icons-material/PersonRemoveAlt1Outlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";

import GamepadIcon from '@mui/icons-material/Gamepad';
import DangerousIcon from '@mui/icons-material/Dangerous';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DescriptionIcon from '@mui/icons-material/Description';
import UpgradeIcon from '@mui/icons-material/Upgrade';

interface ProjectOwnerMenuProps {
    anchorEl: any,
    open: boolean,

    handleOnOwnerMenuClose?: Function,

    handleOnCollaboratorAdd?: Function,
    handleOnCollaboratorRemove?: Function,

    handleOnNewProjectNameUpdate?: Function,
    handleOnNewProjectDescriptionUpdate?: Function,

    handleOnProjectDelete?: Function
}

const ProjectOwnerMenu = (props: ProjectOwnerMenuProps) => {
    // ------------------ Project owner menu ------------------
    const [ collaboratorToAddEmail, setCollaboratorToAddEmail ] = useState("");
    const [ collaboratorToRemoveEmail, setCollaboratorToRemoveEmail ] = useState("");

    const collaboratorAddRef = useRef<any>(undefined);
    const collaboratorRemoveRef = useRef<any>(undefined);

    const [ newProjectName, setNewProjectName ] = useState("");
    const [ newProjectDescription, setNewProjectDescription ] = useState("");

    const projectNameRef = useRef<any>(undefined);
    const projectDescriptionRef = useRef<any>(undefined);

    const handleOnClose = (e: any) => {
        if(props.handleOnOwnerMenuClose) {
            props.handleOnOwnerMenuClose();
        }
    }

    const handleOnCollaboratorAddKeyPress = (e: any) => {
        if(e.key === "Tab") { 
            e.preventDefault();
            collaboratorRemoveRef.current.focus()
        }
    }

    const handleOnCollaboratorRemoveKeyPress = (e: any) => {
        if(e.key === "Tab") {
            e.preventDefault();
            projectNameRef.current.focus()
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

    const handleOnNewProjectNameUpdateChange = (e: any) => {
        setNewProjectName(e.target.value);
    }

    const handleOnNewProjectDescriptionUpdateChange = (e: any) => {
        setNewProjectDescription(e.target.value);
    }

    const handleOnNewProjectNameUpdateKeyPress = (e: any) => {
        if(e.key === "Tab") {
            e.preventDefault();
            e.preventDefault();
            projectDescriptionRef.current.focus();
        }
    }

    const handleOnNewProjectDescriptionUpdateKeyPress = (e: any) => {
        if(e.key === "Tab") {
            e.preventDefault();
            collaboratorAddRef.current.focus();
        }
    }

    const handleOnNewProjectNameUpdate = () => {
        if(props.handleOnNewProjectNameUpdate) {
            props.handleOnNewProjectNameUpdate(newProjectName);
        }
    }

    const handleOnNewProjectDescriptionUpdate = () => {
        if(props.handleOnNewProjectDescriptionUpdate) {
            props.handleOnNewProjectDescriptionUpdate(newProjectDescription);
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
                }}}
                
                MenuListProps={{
                    onKeyDown: (event) => {
                        if (event.key === 'Tab') {
                            event.preventDefault(); // Prevent the default action of the Tab key
                        }
                    },
                }}>

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

                    <IconButton 
                        data-testid="collaborator-add-icon-button"
                        onClick={ handleOnCollaboratorAdd }> 
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
        
                        onKeyDown={ (e) => handleOnCollaboratorRemoveKeyPress(e) }
                        onChange={ (e) => handleOnCollaboratorToRemoveEmailChange(e) } 

                        sx={{
                            width: "240px"
                        }} />

                    <IconButton 
                        data-testid="collaborator-remove-icon-button"
                        onClick={ handleOnCollaboratorRemove }> 
                        <PersonRemoveAlt1OutlinedIcon />
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
                        label="Project name" 
                        variant="standard" 
                        placeholder="Name"
                        inputRef={ projectNameRef }  
        
                        onKeyDown={ (e) => handleOnNewProjectNameUpdateKeyPress(e) }
                        onChange={ (e) => handleOnNewProjectNameUpdateChange(e) } 

                        sx={{
                            width: "240px"
                        }} />

                    <IconButton 
                        data-testid="project-name-update-icon-button"
                        onClick={ handleOnNewProjectNameUpdate }> 
                        <UpgradeIcon />
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
                        label="Project description" 
                        variant="standard" 
                        placeholder="Description"
                        inputRef={ projectDescriptionRef }  
        
                        onKeyDown={ (e) => handleOnNewProjectDescriptionUpdateKeyPress(e) }
                        onChange={ (e) => handleOnNewProjectDescriptionUpdateChange(e) } 

                        sx={{
                            width: "240px"
                        }} />

                    <IconButton 
                        data-testid="project-description-update-icon-button"
                        onClick={ handleOnNewProjectDescriptionUpdate }> 
                        <DescriptionIcon />
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