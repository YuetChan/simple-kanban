import { Checkbox, Menu, MenuItem } from "@mui/material";

interface UserListMenuProps {
  usersFilterMenuAnchorEl?: any,
  usersFilterMenuOpen?: any,

  userCheckMp?: Map<string, boolean>, 
  // last element is assumed to be the logined user
  userList?: Array<string>,
  
  handleOnUsersFilterMenuClose?: Function,
  handleOnOwnerCheck?: Function,
  handleOnCollaboratorCheck?: Function
}

const UserListMenu = (props: UserListMenuProps) => {
  const handleOnClose = (e: any) => {
    if(props.handleOnUsersFilterMenuClose) {
      props.handleOnUsersFilterMenuClose();
    }
  }

  const handleOnOwnerCheck = (e: any) => {
    if(props.handleOnOwnerCheck) {
      props.handleOnOwnerCheck(e.target.checked)
    }
  }

  const handleOnCollaboratorCheck = (e: any, email: string) => {
    if(props.handleOnCollaboratorCheck) {
      props.handleOnCollaboratorCheck(e.target.checked, email)
    }
  }

  const getOwnerMenuItem = () => {
    if (props.userList) {
      const ownerIdx = props.userList.length - 1
      const ownerEmail = props.userList[ownerIdx]

      return (
        <MenuItem 
          key={ "owner_" + ownerEmail } 
          value={ "owner_" + ownerEmail }>
          <Checkbox 
            checked={ props.userCheckMp?.get(ownerEmail) }
            onChange={ (e) => handleOnOwnerCheck(e) } 
            />

          { ownerEmail }
        </MenuItem>
      )
    }else {
      return null
    }
  }

  const getCollaboratorMenuItems = () => {
    if (props.userList) {
      const ownerIdx = props.userList.length - 1
      const ownerEmail = props.userList[ownerIdx]

      return props.userList.map((collaboratorEmail) => {
        if(collaboratorEmail !== ownerEmail) {
          return (
            <MenuItem 
              key={ "collbarator_" + collaboratorEmail }
              value={ "collbarator_" + collaboratorEmail }>
              <Checkbox 
                checked={ props.userCheckMp?.get(collaboratorEmail) }
                onChange={ (e) => handleOnCollaboratorCheck(e, collaboratorEmail) } 
                />
  
              { collaboratorEmail }
            </MenuItem>
          )
        }
      })
    }else {
      return null
    }
  } 

  // ------------------ Html template ------------------
  return (
    <Menu
      anchorEl={ props.usersFilterMenuAnchorEl }
      PaperProps={{ style: { maxHeight: "360px" }}}
      open={ props.usersFilterMenuOpen }
      
      onClose={ handleOnClose } >
      { getOwnerMenuItem() }
      { getCollaboratorMenuItems()}
    </Menu>
  )
}

export default UserListMenu;