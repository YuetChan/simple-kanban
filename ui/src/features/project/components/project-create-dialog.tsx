import React from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField } from "@mui/material";

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
    const [ projectName, setProjectName ] = React.useState("");

    const handleOnProjectNameChange = (e: any) => {
        setProjectName(e.target.value);
    }  
  
    const handleOnProjectCreate = () => {
        if(props.handleOnProjectCreate) {
            props.handleOnProjectCreate(projectName, "");
        } 

        setProjectName("");
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
                    label="Project name"
                    fullWidth
                    variant="standard" 
                    value={ projectName }
                    
                    onChange={ (e) => handleOnProjectNameChange(e) } 
                    />
            </DialogContent>

            <DialogActions>
                <Button 
                    variant="outlined" 
                    onClick={ handleOnProjectCreate }>
                    Create
                </Button>
            </DialogActions>

        </Dialog>
    )
}

export default ProjectCreateDialog;