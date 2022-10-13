import React, { useEffect } from "react";

import { Checkbox, Menu, MenuItem } from "@mui/material";

import { useProjectsCacheContext } from "../../../providers/projects-cache";
import { useTasksSearchContext } from "../../../providers/tasks-search";

interface UserListMenuProps {
  usersFilterMenuAnchorEl?: any,
  usersFilterMenuOpen?: any,

  handleOnUsersFilterMenuClose?: Function
}

const UserListMenu = (props: UserListMenuProps) => {
  // ------------------ Project cache ------------------
  const projectsCacheContextState = useProjectsCacheContext().state;

  // ------------------ Task Search ------------------
  const tasksSearchContextState = useTasksSearchContext().state;
  const tasksSearchContextDispatch = useTasksSearchContext().Dispatch;

  // ------------------ User list menu ------------------
  const [ userCheckMp, setUserCheckMp ] = React.useState<Map<string, boolean> | undefined>(undefined);
  
  useEffect(() => {
    if(projectsCacheContextState._activeProject) {
      const checkMp = new Map();
      checkMp.set(projectsCacheContextState._activeProject.userEmail, false);

      setUserCheckMp(checkMp);
    }
  }, [ projectsCacheContextState._activeProject ]);

  useEffect(() => {
    if(projectsCacheContextState._activeProject) {
      const userEmail = projectsCacheContextState._activeProject.userEmail;

      const checkMp = new Map();
      checkMp.set(userEmail, checkMp.get(userEmail));
      tasksSearchContextState._activeUserEmails.forEach(email => checkMp.set(email, true));

      setUserCheckMp(checkMp);
    }
  }, [ tasksSearchContextState._activeUserEmails ])

  const handleOnOwnerCheck = (e: any) => {
    const activeProject = projectsCacheContextState._activeProject;
    if(activeProject) {
      const userEmail = activeProject.userEmail;

      if(e.target.checked) {
        tasksSearchContextDispatch({
          type: 'activeUserEmails_add',
          value: userEmail
        });
      }else {
        tasksSearchContextDispatch({
          type: 'activeUserEmails_remove',
          value: userEmail
        });
      }
    }
  }

  const handleOnCollaboratorCheck = (e: any, email: string) => {
    if(e.target.checked) {
      tasksSearchContextDispatch({
        type: 'activeUserEmails_add',
        value: email
      });
    }else {
      tasksSearchContextDispatch({
        type: 'activeUserEmails_remove',
        value: email
      });
    }
  }

  // ------------------ Html template ------------------
  return (
    <Menu
      anchorEl={ props.usersFilterMenuAnchorEl }
      open={ props.usersFilterMenuOpen }
      onClose={ () => {
        if(props.handleOnUsersFilterMenuClose) {
          props.handleOnUsersFilterMenuClose();
        }
      } }
      PaperProps={{ style: { maxHeight: "360px" }}}>   

      {
        (projectsCacheContextState._activeProject && userCheckMp)
        ? (
          <MenuItem 
            key={ projectsCacheContextState._activeProject.userEmail } 
            value={ projectsCacheContextState._activeProject.userEmail }>
            <Checkbox 
              checked={ userCheckMp.get(projectsCacheContextState._activeProject.userEmail) }
              onChange={ (e) => handleOnOwnerCheck(e) } />
  
            { projectsCacheContextState._activeProject?.userEmail }
          </MenuItem>
        ): null
      }

      { 
        (projectsCacheContextState._activeProject && userCheckMp)
        ? (
          projectsCacheContextState._activeProject.collaboratorList.map((collaborator) => (
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