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
  const [ userCheckMp, setUserCheckMp ] = React.useState(new Map());

  useEffect(() => {
    const checkMap = new Map();
    tasksSearchContextState._activeUserEmails?.forEach(email => {
      checkMap.set(email, true);
    });

    setUserCheckMp(checkMap);
  }, [ tasksSearchContextState._activeUserEmails ]);

  const handleOnUserCheck = (e: any, email: string) => {
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
      <MenuItem 
        key={ projectsCacheContextState._activeProject?.userEmail } 
        value={ projectsCacheContextState._activeProject?.userEmail }>
        <Checkbox 
          checked={ userCheckMp.get(projectsCacheContextState._activeProject?.userEmail) }
          onChange={ (e) => handleOnUserCheck(e, projectsCacheContextState._activeProject?.userEmail) } />

        { projectsCacheContextState._activeProject?.userEmail }
      </MenuItem>

      { 
        projectsCacheContextState._activeProject?.collaboratorList.map((collaborator) => (
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