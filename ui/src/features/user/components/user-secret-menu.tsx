import { useDispatch, useSelector } from "react-redux";

import { Menu, MenuItem, Stack, Button } from "@mui/material";

import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';

import { generateUserSecretById, getUserByEmail } from "../services/users-service";

import { AppState } from "../../../stores/app-reducers";

import { actions as userCacheActions } from "../../../stores/user-cache-slice";

import { CopyToClipboard } from 'react-copy-to-clipboard';

interface UserSecretProps {
  secretMenuAnchorEl?: any,
  secretMenuOpen?: any,

  secret: string,

  handleSecretMenuClose?: Function,
  handleOnRenewSecretClick?:Function
}

const UserSecretMenu = (props: UserSecretProps) => {
  // ------------------ User cache ------------------
  const userCacheState = useSelector(state => (state as AppState).UserCache);

  // ------------------ User secret menu ------------------
  const handleOnClose = () => {
    if(props.handleSecretMenuClose) {
      props.handleSecretMenuClose();
    }
  }

  const handleOnRenewSecretClick = () => {
    if(props.handleOnRenewSecretClick) {
      props.handleOnRenewSecretClick()
    }
  }

  const handleOnCopyClick = () => {
    alert('copied');
  }
  
  // ------------------ Html template ------------------
  return (
    <Menu
      PaperProps={{ style: { maxHeight: "360px" } }}
      anchorEl={ props.secretMenuAnchorEl }
      open={ props.secretMenuOpen }
      onClose={ handleOnClose } >
      <MenuItem 
        key={ "secret" } 
        value={ "secret" }
        style={{ margin: "0px 0px 8px 0px" }}>
        <CopyToClipboard 
          text={ userCacheState._loginedUserSecret }
          onCopy={ handleOnCopyClick }>
          <Stack 
            direction="row" 
            justifyContent="space-between"
            style={{ minWidth: "150px" }}>
            <div>
              <i>{ userCacheState._loginedUserSecret }</i>
            </div>

            <ContentCopyOutlinedIcon />
          </Stack>  
        </CopyToClipboard>
      </MenuItem>
    
      <Stack 
        direction="row" 
        justifyContent="flex-end"
        style={{ margin: "0px 4px 0px 0px" }}>
        <Button 
          variant="outlined"
          size="small"
          onClick={ handleOnRenewSecretClick }>
          Renew Secret
        </Button>    
      </Stack>
    </Menu> 
  )
}

export default UserSecretMenu;