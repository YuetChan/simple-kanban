import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Checkbox, Menu, MenuItem } from "@mui/material";

import { AppState } from "../../../stores/app-reducers";

import { actions as tasksSearchActions } from "../../../stores/tasks-search-slice";

interface UserListMenuProps {
  usersFilterMenuAnchorEl?: any,
  usersFilterMenuOpen?: any,

  handleOnUsersFilterMenuClose?: Function
}

const UserListMenu = (props: UserListMenuProps) => {
  // ------------------ Dispatch ------------------
  const dispatch = useDispatch();

  // ------------------ Project cache ------------------
  const projectsCacheState = useSelector((state: AppState) => state.ProjectsCache);

  // ------------------ Tasks Search ------------------
  const tasksSearchState = useSelector((state: AppState) => state.TasksSearch);
  const { addActiveUserEmail, removeActiveUserEmail } = tasksSearchActions;

  // ------------------ User list menu ------------------
  const [ userCheckMp, setUserCheckMp ] = React.useState<Map<string, boolean> | undefined>(undefined);
  
  useEffect(() => {
    if(projectsCacheState._activeProject) {
      const checkMp = new Map();
      checkMp.set(projectsCacheState._activeProject.userEmail, false);

      setUserCheckMp(checkMp);
    }
  }, [ projectsCacheState._activeProject ]);

  useEffect(() => {
    if(projectsCacheState._activeProject) {
      const userEmail = projectsCacheState._activeProject.userEmail;

      const checkMp = new Map();
      checkMp.set(userEmail, checkMp.get(userEmail));
      tasksSearchState._activeUserEmails.forEach(email => checkMp.set(email, true));

      setUserCheckMp(checkMp);
    }
  }, [ tasksSearchState._activeUserEmails ]);

  const handleOnClose = (e: any) => {
    if(props.handleOnUsersFilterMenuClose) {
      props.handleOnUsersFilterMenuClose();
    }
  }

  const handleOnOwnerCheck = (e: any) => {
    const activeProject = projectsCacheState._activeProject;
    if(activeProject) {
      const userEmail = activeProject.userEmail;

      if(e.target.checked) {
        dispatch(addActiveUserEmail(userEmail));
      }else {
        dispatch(removeActiveUserEmail(userEmail));
      }
    }
  }

  const handleOnCollaboratorCheck = (e: any, email: string) => {
    if(e.target.checked) {
      dispatch(addActiveUserEmail(email));
    }else {
      dispatch(removeActiveUserEmail(email));
    }
  }

  // ------------------ Html template ------------------
  return (
    <Menu
      anchorEl={ props.usersFilterMenuAnchorEl }
      open={ props.usersFilterMenuOpen }
      onClose={ handleOnClose }
      PaperProps={{ style: { maxHeight: "360px" }}}>
      {
        (projectsCacheState._activeProject && userCheckMp)
        ? (
          <MenuItem 
            key={ projectsCacheState._activeProject.userEmail } 
            value={ projectsCacheState._activeProject.userEmail }>
            <Checkbox 
              checked={ userCheckMp.get(projectsCacheState._activeProject.userEmail) }
              onChange={ (e) => handleOnOwnerCheck(e) } />
  
            { projectsCacheState._activeProject?.userEmail }
          </MenuItem>
        ): null
      }

      { 
        (projectsCacheState._activeProject && userCheckMp)
        ? (
          projectsCacheState._activeProject.collaboratorList.map((collaborator) => (
            <MenuItem 
              key={ collaborator.email }
              value={ collaborator.email }>
              <Checkbox 
                checked={ userCheckMp.get(collaborator.email) }
                onChange={ (e) => handleOnCollaboratorCheck(e, collaborator.email) } />
    
              { collaborator.email }
            </MenuItem>
          ))
        )
        : null
      }
    </Menu>
  )
}

export default UserListMenu;