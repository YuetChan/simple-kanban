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
  // ------------------ Project ------------------
  const projectsContextState = useProjectsCacheContext().state;

  // ------------------ Drawer ------------------
  const drawerContextState = useTasksSearchContext().state;
  const drawerContextDispatch = useTasksSearchContext().Dispatch;

  const [ userCheckMp, setUserCheckMp ] = React.useState(new Map());

  useEffect(() => {
    const checkMap = new Map();
    drawerContextState._activeUserEmails?.forEach(email => {
      checkMap.set(email, true);
    });

    setUserCheckMp(checkMap);
  }, [ drawerContextState._activeUserEmails ]);

  const handleOnUserCheck = (e: any, email: string) => {
    if(e.target.checked) {
      drawerContextDispatch({
        type: 'activeUserEmails_add',
        value: email
      });
    }else {
      drawerContextDispatch({
        type: 'activeUserEmails_remove',
        value: email
      });
    }
  }

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
      <MenuItem 
        key={ projectsContextState._activeProject?.userEmail } 
        value={ projectsContextState._activeProject?.userEmail }>
        <Checkbox 
          checked={ userCheckMp.get(projectsContextState._activeProject?.userEmail) }
          onChange={ (e) => handleOnUserCheck(e, projectsContextState._activeProject?.userEmail) } />

        { projectsContextState._activeProject?.userEmail }
      </MenuItem>

      { 
        projectsContextState._activeProject?.collaboratorList.map((collaborator) => (
        <MenuItem 
          key={ collaborator.email }
          value={ collaborator.email }>
          <Checkbox 
            checked={ userCheckMp.get(collaborator.email) }
            onChange={ (e) => handleOnUserCheck(e, collaborator.email) } />

          { collaborator.email }
        </MenuItem>
      ))}
    </Menu>
  )
}

export default UserListMenu;