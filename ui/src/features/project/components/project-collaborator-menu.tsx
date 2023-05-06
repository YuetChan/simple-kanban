import { Menu, MenuItem, Stack } from "@mui/material";

import ExitToAppIcon from '@mui/icons-material/ExitToApp';

interface ProjectCollaboratorMenuProps {
  collaboratorsMenuAnchorEl: any,
  collaboratorsMenuOpen: boolean,
  
  handleOnCollaboratorsMenuClose?: Function,
  handleOnQuitProjectClick?: Function
}

const ProjectCollaboratorMenu = (props: ProjectCollaboratorMenuProps) => {
  // ------------------ Project collaborator menu ------------------
  const handleOnClose = () => {
    if(props.handleOnCollaboratorsMenuClose){
      props.handleOnCollaboratorsMenuClose();
    }
  }

  const handleOnQuitProjectClick = () => {
    if(props.handleOnQuitProjectClick){
      props.handleOnQuitProjectClick()
    }
  }

  return (
    <Menu
      anchorEl={ props.collaboratorsMenuAnchorEl }
      open={ props.collaboratorsMenuOpen }
      onClose={ handleOnClose }
      PaperProps={{ style: { maxHeight: "360px" }}}>
      <MenuItem 
        key="quit_project" 
        value="quit_project"
        onClick={ handleOnQuitProjectClick }>
        <Stack 
          direction="row" 
          justifyContent="center" 
          spacing={ 1 }>
          <ExitToAppIcon />

          <div>Quit project</div>
        </Stack>
      </MenuItem>  
    </Menu>     
  )
}

export default ProjectCollaboratorMenu;
