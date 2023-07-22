import { Checkbox, FormGroup, FormControlLabel, Menu, Stack } from "@mui/material";

import Groups3Icon from '@mui/icons-material/Groups3';
import KanbanIconTitle from "../../../components/kanban-Icon-title";

// Ps: last element of user list is assumed to be the logined user
interface UserListMenuProps {
    shallowOpen: boolean,
    userListMenuAnchorEl?: any,

    userCheckMp?: Map<string, boolean>, 
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

    const handleOnOwnerCheck = (e: any, ownerEmail: string) => {
        if(props.handleOnOwnerCheck) {
            props.handleOnOwnerCheck(e.target.checked, ownerEmail)
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
                <Stack direction="column">
                    <FormGroup 
                        sx={{ 
                            marginTop: "8px", 
                            padding: "0px 8px 0px 8px" 
                            }}>
                        <FormControlLabel
                            control={
                                <Checkbox 
                                    checked={ props.userCheckMp?.get(ownerEmail) }
                                    value={ ownerEmail }

                                    onChange={ (e: any) => handleOnOwnerCheck(e, ownerEmail) } 

                                    sx={{ 
                                        '& .MuiSvgIcon-root': { 
                                            fontSize: "18px" 
                                        } 
                                    }} />}
                            style={{ fontSize: "12px" }}
                            label={ ownerEmail }
                            />
                    </FormGroup>
                </Stack>
            );
        }else {
            return null;
        }
    }

    const getCollaboratorMenuItems = () => {
        if (props.userList && props.userList.length > 1) {
            const ownerIdx = props.userList.length - 1
            const ownerEmail = props.userList[ownerIdx]

            return (
                    <Stack direction="column">
                        <FormGroup 
                            sx={{ 
                                marginTop: "8px", 
                                padding: "0px 8px 0px 8px" 
                            }}>
                                {
                                    props.userList.map((collaboratorEmail) => {
                                        if(collaboratorEmail !== ownerEmail) {
                                            return (
                                                <FormControlLabel
                                                    key={`collaborator-menu-item-${collaboratorEmail}`}
                                                    control={
                                                        <Checkbox 
                                                            checked={ props.userCheckMp?.get(collaboratorEmail) }
                                                            value={ collaboratorEmail }
                                    
                                                            onChange={ (e: any) => handleOnCollaboratorCheck(e, collaboratorEmail) } 
                                    
                                                            sx={{ 
                                                                "& .MuiSvgIcon-root": { 
                                                                    fontSize: "18px" 
                                                                } 
                                                            }} />}
                                                        style={{ fontSize: "12px" }}
                                                        label={ collaboratorEmail }
                                                        />)
                                        }
                                    })
                                }
                        </FormGroup>
                    </Stack>
                )
        }else {
            return null;
        }
    } 

  // ------------------ Html template ------------------
  return (
    <Menu
        anchorEl={ props.userListMenuAnchorEl }
        open={ Boolean(props.userListMenuAnchorEl) }
      
        onClose={ handleOnClose } 
      
        PaperProps={{ 
            style: { 
                width: "330px" 
            }}}

        sx={{
            padding: "8px 0px 8px 0px",
            display: props.shallowOpen? "block" : "none"
        }}
        
        MenuListProps={{
            onKeyDown: (event) => {
                if (event.key === 'Tab') {
                    event.preventDefault(); // Prevent the default action of the Tab key
                }
            },
        }}>
        <div style={{ padding: "8px" }}>
            <KanbanIconTitle 
                icon={<Groups3Icon />}
                label="Team members"
                />

            { getOwnerMenuItem() }

            { getCollaboratorMenuItems() }
        </div>
    </Menu>
  )
}

export default UserListMenu;