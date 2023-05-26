import React, { useState } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

interface ProjectCreateDialogProps {
    open?: boolean,
    title?: string,
    description?: string,
    showLogout?: boolean,

    handleOnProjectCreate?: Function,
    handleOnLogout?: Function,
    handleOnClose?: Function
}

const ProjectCreateDialog = (props: ProjectCreateDialogProps) => {
    // ------------------ Project create dialog ------------------
    const [ projectName, setProjectName ] = useState("");
    const [ projectDescription, setProjectDescription ] = useState("");

    const handleOnProjectNameChange = (e: any) => {
        setProjectName(e.target.value);
    }  

    const handleOnProjectDescriptionChange = (e: any) => {
        setProjectDescription(e.target.value);
    }  
  
    const handleOnProjectCreate = () => {
        if(props.handleOnProjectCreate) {
            props.handleOnProjectCreate(projectName, projectDescription);
        } 

        setProjectName("");
        setProjectDescription("");
    }

    const handleOnClose = () => {
        if(props.handleOnClose) {
            props.handleOnClose();
        }

        setProjectName("");
    }

    // ------------------ Html template ------------------
    return (
        <Dialog 
            open={ props.open? props.open : false } 
            onClose={ handleOnClose }>
            <DialogTitle>
                { props.title? props.title : "" }
            </DialogTitle>
      
            <DialogContent>
                <DialogContentText>
                    { props.description? props.description : "" }
                </DialogContentText>

                <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    fullWidth
                    variant="standard" 
                    value={ projectName }
                    
                    onChange={ (e) => handleOnProjectNameChange(e) } 
                    />

                <TextField
                    autoFocus
                    margin="dense"
                    label="Description"
                    fullWidth
                    variant="standard" 
                    value={ projectDescription }
                    
                    onChange={ (e) => handleOnProjectDescriptionChange(e) } 
                    />    
            </DialogContent>

            <DialogActions>
                <Button 
                    variant="text" 
                    onClick={ handleOnProjectCreate }>
                    Create
                </Button>
            </DialogActions>

        </Dialog>
    )
}

export default ProjectCreateDialog;