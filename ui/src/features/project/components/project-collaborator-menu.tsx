import { Button, Menu,  Stack } from "@mui/material";

import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AssistantIcon from '@mui/icons-material/Assistant';
import KanbanIconTitle from "../../../components/kanban-Icon-title";
import WarningIcon from '@mui/icons-material/Warning';

interface ProjectCollaboratorMenuProps {
    anchorEl: any,
    open: boolean,
  
    handleOnMenuClose?: Function,
    handleOnQuitProject?: Function
}

const ProjectCollaboratorMenu = (props: ProjectCollaboratorMenuProps) => {
  // ------------------ Collaborator menu ------------------
  const handleOnClose = () => {
    if(props.handleOnMenuClose){
      props.handleOnMenuClose();
    }
  }

  const handleOnQuitProject = () => {
    if(props.handleOnQuitProject){
      props.handleOnQuitProject()
    }
  }

  return (
    <Menu
        anchorEl={ props.anchorEl }
        open={ props.open }

        onClose={ handleOnClose }

        PaperProps={{ 
            style: { 
                width: "330px",

            }}}>
            <Stack 
                direction="column" 

                sx={{  
                    padding: "8px" 
                    }}>
                {/* <KanbanIconTitle 
                    icon={ <AssistantIcon /> }
                    label="Member setting"
                    /> */}

                    <Stack direction="column">
                    <KanbanIconTitle 
                    icon={ <WarningIcon /> }
                    label="Warning"
                    />

                        <Button 
                    startIcon={<ExitToAppIcon />} 
                    variant="text"
                    color="error"

                    onClick={ handleOnQuitProject }

                    sx={{
                        padding: "0px 12px",
                        marginTop: "12px"
                    }}>
                    Quit project
                </Button>
                    </Stack>


            </Stack>

 
    </Menu>     
  )
}

export default ProjectCollaboratorMenu;
