import { useDispatch, useSelector } from "react-redux";

import { Menu, MenuItem, Stack, Button } from "@mui/material";

import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';

import { generateUserSecretById, getUserByEmail } from "../services/users-service";

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { AppState } from "../../../stores/app-reducers";

import { actions as userCacheActions } from "../../../stores/user-cache-slice";

interface UserSecretProps {
  secretMenuAnchorEl?: any,
  secretMenuOpen?: any,

  handleSecretMenuClose?: Function
}

const UserSecretMenu = (props: UserSecretProps) => {
  // ------------------ Dispatch ------------------
  const dispatch = useDispatch();

  // ------------------ User cache ------------------
  const userCacheContextState = useSelector(state => (state as AppState).UserCache);

  const { updateLoginedUserSecret } = userCacheActions;

  // ------------------ User secret menu ------------------
  const handleOnRenewSecretClick = () => {
    getUserByEmail(userCacheContextState._loginedUserEmail).then(res => {
      generateUserSecretById(res.id).then(res => {
        dispatch(updateLoginedUserSecret(res));
      });
    });
  }
  
  // ------------------ Html template ------------------
  return (
    <Menu
      anchorEl={ props.secretMenuAnchorEl }
      open={ props.secretMenuOpen }
      onClose={ () => {
        if(props.handleSecretMenuClose) {
          props.handleSecretMenuClose();
        }
      } }
      PaperProps={{ style: { maxHeight: "360px" } }}>
      <MenuItem 
        key={ "secret" } 
        value={ "secret" }
        style={{ margin: "0px 0px 8px 0px" }}>
        <CopyToClipboard 
          text={ userCacheContextState._loginedUserSecret }
          onCopy={() => { alert('copied') }}>
          <Stack 
            direction="row" 
            justifyContent="space-between"
            style={{ minWidth: "150px" }}>
            <div>
              <i>{ userCacheContextState._loginedUserSecret }</i>
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