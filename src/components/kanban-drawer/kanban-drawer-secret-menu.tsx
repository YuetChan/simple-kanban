import { Menu, MenuItem, Stack, Button } from "@mui/material";

import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { useKanbanUsersContext } from "../../providers/kanban-users";
import { generateUserSecretById, getUserByEmail } from "../../apis/users-api";

const KanbanDrawerSecretMenu = (props: any) => {
  const usersContextState = useKanbanUsersContext().state;
  const usersContextDispatch = useKanbanUsersContext().Dispatch;

  const handleOnRenewSecretClick = () => {
    getUserByEmail(usersContextState._loginedUserEmail).then(res => {
      generateUserSecretById(res.id).then(res => {
        usersContextDispatch({
          type: 'loginedUserSecret_update',
          value: res
        });
      });
    });
  }
  
  return (
    <Menu
      anchorEl={ props.secretMenuAnchorEl }
      open={ props.secretMenuOpen }
      onClose={ props.handleSecretMenuClose }
      PaperProps={{ style: { maxHeight: "360px" } }}>
      <MenuItem 
        key={ "secret" } 
        value={ "secret" }
        style={{ margin: "0px 0px 8px 0px" }}>
        <CopyToClipboard 
          text={ usersContextState._loginedUserSecret }
          onCopy={() => { alert('copied') }}
        >
          <Stack 
            direction="row" 
            justifyContent="space-between"
            style={{ minWidth: "150px" }}>
            <div>
              <i>{ usersContextState._loginedUserSecret }</i>
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

export default KanbanDrawerSecretMenu;