import React, { useEffect } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField } from "@mui/material";

interface ProjectDeleteDialogProps {
    open?: boolean,
    label?: string,
  
    handleOnClose?: Function,
    handleOnDelete?: Function
}

const ProjectDeleteDialog = (props: ProjectDeleteDialogProps) => {
    // ------------------ Project delete dialog ------------------
    const [ enable, setEnable ] = React.useState(false);
    const [ value, setValue ] = React.useState("");

    useEffect(() => {
        setEnable(value === "DELETE");
    }, [ value ]);

    const handleOnClose = () => {
        if(props.handleOnClose) {
            props.handleOnClose();
        }

        setValue("");
    }

    const handleOnDelete = () => {
        if(props.handleOnDelete) {
            props.handleOnDelete();
        }

        setValue("");
    }

    const handleOnChange = (e: any) => {
        setValue(e.target.value);
    }

    // ------------------ Html template ------------------
    return (
        <Dialog
            scroll={ "paper" }
            sx={{
                "& .MuiDialog-container": {
                    "& .MuiPaper-root": {
                        minWidth: "350px",
                        width: "350px"
                    },
                },
            }}
            open={ props.open? props.open : false }
            onClose={ handleOnClose }>
            <DialogTitle>
                <Stack direction="row" justifyContent="space-between">
                    <div>{ props.label? props.label : "" }</div>
                </Stack>
            </DialogTitle>
  
            <DialogContent dividers={ true }>
                <DialogContentText
                    tabIndex={ -1 }
                    sx={{ marginBottom:"12px" }}>
                    <p>Please enter DELETE to confirm the deletion</p>  
            
                    <TextField 
                        placeholder="DELETE" 
                        value={ value }  
                        label="Enter DELETE"
                        
                        onChange={ handleOnChange } />
                </DialogContentText>
            </DialogContent>
  
            <DialogActions>
                <Button onClick={ handleOnClose }>Cancel</Button>
                <Button 
                    color="error"
                    disabled={ !enable } 
                    onClick={ handleOnDelete }>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ProjectDeleteDialog;