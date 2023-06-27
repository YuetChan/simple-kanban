import { useState } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";

interface ProjectCreateDialogProps {
    open?: boolean,
    title?: string,
    description?: string,

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
  
    const handleOnProjectCreate = (name: string, description: string) => {
        if(props.handleOnProjectCreate) {
            props.handleOnProjectCreate(name, description);
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
                    margin="dense"
                    label="Enter name"
                    fullWidth
                    variant="standard" 
                    value={ projectName }
                    
                    onChange={ (e: any) => handleOnProjectNameChange(e) } 
                    />

                <TextField
                    margin="dense"
                    label="Enter description"
                    fullWidth
                    variant="standard" 
                    value={ projectDescription }
                    
                    onChange={ (e: any) => handleOnProjectDescriptionChange(e) } 
                    />    
            </DialogContent>

            <DialogActions>
                <Button 
                    variant="text" 
                    onClick={ (e: any) => handleOnProjectCreate(projectName, projectDescription) }>
                    Create
                </Button>
            </DialogActions>

        </Dialog>
    )
}

export default ProjectCreateDialog;