import { useDispatch, useSelector } from "react-redux";

import { Menu, MenuItem, Stack } from "@mui/material";

import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { updateProjectById } from "../services/projects-service";

import { User } from "../../../types/User";

import { AppState } from "../../../stores/app-reducers";

import { actions as ProjectsCacheActions } from "../../../stores/projects-cache-slice";

interface ProjectCollaboratorMenuProps {
  collaboratorsMenuAnchorEl: any,
  collaboratorsMenuOpen: boolean,
  
  handleOnCollaboratorsMenuClose?: Function
}

const ProjectCollaboratorMenu = (props: ProjectCollaboratorMenuProps) => {
  // ------------------ Dispatch ------------------
  const dispatch = useDispatch();

  // ------------------ Projects cache ------------------
  const projectsCacheState = useSelector((state: AppState) => state.ProjectsCache);
  const { updateActiveProject } = ProjectsCacheActions;

  // ------------------ User cache ------------------
  const userCacheState = useSelector((state: AppState) => state.UserCache);

  // ------------------ Project collaborator menu ------------------
  const handleOnClose = () => {
    if(props.handleOnCollaboratorsMenuClose){
      props.handleOnCollaboratorsMenuClose();
    }
  }

  const handleOnQuitProjectClick = () => {
    const activeProject = projectsCacheState._activeProject;
    if(activeProject) {
      const activeCollaboratorEmails = activeProject.collaboratorList.map(collaborator => collaborator.email);
      
      const updatedCollaboratorEmails = activeCollaboratorEmails.filter(email => 
        email !== userCacheState._loginedUserEmail);
      const updatedCollaborators = updatedCollaboratorEmails.map(email => {
        return { 
          email: email 
        } as User;
      });
  
      const updatedProject = {
        ... activeProject,
        collaboratorList: updatedCollaborators
      }
  
      updateProjectById(updatedProject.id, updatedProject, new Map()).then(res => {
        alert('You are removed');
        dispatch(updateActiveProject(undefined));
      }).catch(err => {
        console.log(err);
        alert('Opps, failed to remove yourself from project')
      });
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
