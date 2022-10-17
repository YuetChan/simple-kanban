import { useDispatch, useSelector } from "react-redux";

import { Menu, MenuItem, Stack } from "@mui/material";

import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { getProjectById, updateProjectById } from "../services/projects-service";

import { User } from "../../../types/User";

import { AppState } from "../../../stores/app-reducers";

import { actions as ProjectsCacheActions } from "../../../stores/projects-cache-slice";

interface ProjectCollaboratorMenuProps {
  collaboratorsMenuAnchorEl: any,
  collaboratorsMenuOpen: boolean,

  handleOnCollaboratorsMenuClose?: Function
}

const ProjectCollaboratorMenu = (props: ProjectCollaboratorMenuProps) => {
  // ------------------ Store ------------------
  const dispatch = useDispatch();

  // ------------------ Projects cache ------------------
  const projectsCacheContextState = useSelector((state: AppState) => state.ProjectsCache);

  const { updateActiveProject } = ProjectsCacheActions;

  // ------------------ User cache ------------------
  const userCacheContextState = useSelector((state: AppState) => state.UserCache);

  // ------------------ Project collaborator menu ------------------
  const handleOnQuitProjectClick = () => {
    const activeProject = projectsCacheContextState._activeProject;
    if(activeProject) {
      const activeCollaboratorEmails = activeProject.collaboratorList.map(collaborator => collaborator.email);

      const updatedCollaboratorEmails = activeCollaboratorEmails.filter(email => 
        email !== userCacheContextState._loginedUserEmail);
      const updatedCollaborators = updatedCollaboratorEmails.map(email => {
        return { 
          email: email 
        } as User;
      });
  
      const updatedProject = {
        ... activeProject,
        collaboratorList: updatedCollaborators
      }
  
      updateProjectById(activeProject.id, updatedProject, new Map()).then(res => {
        alert('You are removed');
  
        getProjectById(activeProject.id).then(res => {
          dispatch(updateActiveProject(undefined));
        });
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
      onClose={ () => {
        if(props.handleOnCollaboratorsMenuClose){
          props.handleOnCollaboratorsMenuClose();
        }
      } }
      PaperProps={{ style: { maxHeight: "360px" }}}>
      <MenuItem 
        key="remove_self" 
        value="remove_self"
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
