import  React, { useEffect } from 'react';

import { Stack, Tooltip, Typography } from '@mui/material';

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import LogoutIcon from '@mui/icons-material/Logout';
import CancelIcon from '@mui/icons-material/Cancel';

import { useProjectsCacheContext } from '../providers/projects-cache';
import { useUserCacheContext } from '../providers/user-cache';
import { useTasksSearchContext } from '../providers/tasks-search';
import { useProjectCreateDialogContext } from '../providers/project-create-dialog';
import { useProjectDeleteDialogContext } from '../providers/project-delete-dialog';

import TagsEditArea from '../features/tag/components/tags-edit-area';
import ProjectCollaboratorMenu from '../features/project/components/project-collaborator-menu';
import ProjectOwnerMenu from '../features/project/components/project-owner-menu';
import UserList from '../features/user/components/user-list';
import ProjectSelect from '../features/project/components/project-select';
import UserListMenu from '../features/user/components/user-list-menu';
import UserSecretMenu from '../features/user/components/user-secret-menu';
import TaskSearchPrioritySelect from '../features/task/components/task-search-priority-select';
import TaskSearchkSprintSelect from '../features/task/components/task-search-sprint-select';


const KanbanDrawer = () => {
  // -------------- Project --------------
  const projectsContextState = useProjectsCacheContext().state;
  const projectsContextDispatch = useProjectsCacheContext().Dispatch;

  const handleOnProjectChange = (e: any) => {
    const projects = projectsContextState._allProjects.filter(project => {
      return project.id === e.target.value
    });

    projectsContextDispatch({
      type: 'activeProject_select', 
      value: projects.length > 0 ? projects[0] : undefined
    });
  };

  // -------------- Project select --------------
  const [ yourProjectDisabled, setYourProjectDisabled ] = React.useState(true);

  useEffect(() => {
    if(projectsContextState._allProjects.length > 0) {
      setYourProjectDisabled(true);
    }else {
      setYourProjectDisabled(false);
    }
  }, [ projectsContextState._allProjects ]);

  // -------------- User --------------
  const usersContextState = useUserCacheContext().state;

  // -------------- New project --------------
  const projectCreateDialogDispatch = useProjectCreateDialogContext().Dispatch;

  const handleOnNewProjectClick = () => {
    projectCreateDialogDispatch({
      type: 'dialog_show'
    });
  }

  // -------------- Logout --------------
  const handleOnLogoutClick = () => {

   }

  // -------------- Delete --------------
  const projectDeleteDialogDispatch = useProjectDeleteDialogContext().Dispatch;

  const handleOnDeleteClick = () => {
    projectDeleteDialogDispatch({
      type: 'dialog_show'
    });
  }

  // -------------- User filter menu --------------
  const [ usersFilterMenuAnchorEl, setUsersFilterMenuAnchorEl ] = React.useState(null);
  const usersFilterMenuOpen = Boolean(usersFilterMenuAnchorEl);

  const handleOnUsersFilterMenuClose = () => {
    setUsersFilterMenuAnchorEl(null);
  }

  const handleOnUserAvatarsClick = (e: any) => {
    setUsersFilterMenuAnchorEl(e.currentTarget);
  }

  // -------------- Owner menu --------------
  const [ ownerMenuAnchorEl, setOwnerMenuAnchorEl ] = React.useState(null);
  const ownerMenuOpen = Boolean(ownerMenuAnchorEl);

  const handleOnOwnerMenuClose = () => {
    setOwnerMenuAnchorEl(null);
  }

  const openOwnerMenu = (e: any) => {
    setOwnerMenuAnchorEl(e.currentTarget);
  }

  const [ isOwner, setIsOwner ] = React.useState(false);

  useEffect(() => {
    if(usersContextState._loginedUserEmail === projectsContextState._activeProject?.userEmail) {
      setIsOwner(true);
    }else {
      setIsOwner(false);
    }
  }, [ usersContextState ]);

  // -------------- Collaborators menu --------------
  const [ collaboratorsMenuAnchorEl, setCollaboratorsMenuAnchorEl ] = React.useState(null);
  const collaboratorsMenuOpen = Boolean(collaboratorsMenuAnchorEl);

  const handleOnCollaboratorsMenuClose = () => {
    setCollaboratorsMenuAnchorEl(null);
  }

  const openCollaboratorsMenu = (e: any) => {
    setCollaboratorsMenuAnchorEl(e.currentTarget);
  }

  // ------------------ Secret menu ------------------
  const [ secretMenuAnchorEl, setSecretMenuAnchorEl ] = React.useState<null | HTMLElement>(null);
  const secretMenuOpen = Boolean(secretMenuAnchorEl);

  const handleSecretMenuClose = () => {
    setSecretMenuAnchorEl(null);
  }

  const openSecretMenu = (e: any) => {
    setSecretMenuAnchorEl(e.currentTarget);
  }

  // ------------------ Tags edit areas ------------------
  const drawerContextState = useTasksSearchContext().state;
  const drawerContextDispatch = useTasksSearchContext().Dispatch;

  const tagsEditAreaRef = React.useRef(undefined);

  useEffect(() => {
    drawerContextDispatch({
      type: 'tagsEditArea_setRef',
      value: tagsEditAreaRef
    });
  }, [ tagsEditAreaRef ]);

  const handleOnTagsChange = (tags: Array<string>) => {
    drawerContextDispatch({
      type: 'activeTags_update',
      value: tags
    });
  }

  const handleOnTagsFilterAreaChange = (e: any) => {
    drawerContextDispatch({
      type: 'tagsEditAreaSearchStr_update',
      value: e.target.value
    });
  }

  const handleOnTagsFilterAreaKeyPress = (e: any) => {
    if(e.keyCode === 13) {
      drawerContextDispatch({
        type: 'tagsEditAreaSearchStr_update',
        value: ''
      });
    }
  }

  const handleOnTagsFilterAreaFocus = (e: any) => {
    drawerContextDispatch({
      type: 'tagsEditAreaSearchStr_update',
      value: e.target.value
    });

    drawerContextDispatch({
      type: 'tagsEditArea_focus'
    });
  }

  const handleOnTagsFilterAreaBlur = (e: any) => {
    drawerContextDispatch({
      type: 'tagsEditArea_blur'
    });
  }

  const drawerWidth = 240;

  // ------------ HTML template --------------
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        }
      }}
      variant="permanent"
      anchor="left">
      <List>
        <ListItem>
          <div><b>Projects: </b></div>

          <ProjectSelect 
            handleOnProjectChange={ handleOnProjectChange }
            yourProjectDisabled={ yourProjectDisabled } />
        </ListItem>

        <ListItem key={ "New Project" } disablePadding>
          <ListItemButton onClick={ handleOnNewProjectClick }>
            <ListItemIcon>
              <AddBoxOutlinedIcon/>
            </ListItemIcon>
            <ListItemText primary={ "New Project" } />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />

      <List>
        <ListItem 
          key={ "Kanban" } 
          disablePadding 
          style={{ borderRight: "3px solid black" }}>
          <ListItemButton>
            <ListItemIcon >
              <DashboardOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={ <Typography style={{ fontWeight: "bold" }}>Kanban</Typography> }/>
          </ListItemButton>
        </ListItem>

        <ListItem 
          key={ "Calendar" } 
          disablePadding 
          disabled={ true }>
          <Tooltip title="Coming soon. Tasks are displayed in calender format.">
          <ListItemButton>
            <ListItemIcon>
              <CalendarMonthOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={ "Calendar" } />
          </ListItemButton>
          </Tooltip>
        </ListItem>

        <ListItem 
          key={ "Archive" } 
          disablePadding 
          disabled={ true }>
          <Tooltip title="Coming soon. Archived tasks can be found here.">
          <ListItemButton>
            <ListItemIcon>
              <HistoryEduIcon />
            </ListItemIcon>
            <ListItemText primary={ "Archive" } />
          </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>

      <Divider />

      <List>
        <ListItem key={ "Search Filter" }>
          <ListItemIcon>
            <ManageSearchIcon />
          </ListItemIcon>
          <ListItemText primary={ "Search Filter" } />
        </ListItem>
      </List>

      <Stack 
        direction="column"
        spacing={ 1 } 
        style={{
          margin: "4px 0px 16px 0px",
          padding: "0px 0px 0px 21px",
          borderLeft: "3px solid"
        }}
        alignItems="start">
        <UserList
          isOwner={ isOwner }
          openOwnerMenu={ openOwnerMenu }
          openCollaboratorsMenu={ openCollaboratorsMenu }
          handleOnUserAvatarsClick={ handleOnUserAvatarsClick } />  

        <TaskSearchPrioritySelect />

        <TagsEditArea 
          label="Tags" 
          tags={ drawerContextState._activeTags }
          disabled={ false } 
          handleOnTagsChange={ (tags: Array<string>) => handleOnTagsChange(tags) }
          handleOnTextFieldChange={ (e: any) => handleOnTagsFilterAreaChange(e) }
          handleOnKeyPress={ (e: any) => handleOnTagsFilterAreaKeyPress(e) }
          handleOnFocus={ (e: any) => handleOnTagsFilterAreaFocus(e) }
          handleOnBlur={ handleOnTagsFilterAreaBlur } 
          inputRef={ tagsEditAreaRef } /> 

          <Tooltip title="Coming soon.">
            <div>
              <TaskSearchkSprintSelect />
            </div>
          </Tooltip>
             
      </Stack>

      <Divider />

      <List>
        <ListItem 
          key={ "Secret" } 
          disablePadding 
          onClick={ (e) => openSecretMenu(e) } >
          <ListItemButton>
            <ListItemIcon>
              <KeyOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={ "Secret" } />
          </ListItemButton>
        </ListItem>

        <ListItem 
          style={{ display: projectsContextState._allProjects.length > 0? "block": "none" }}
          key={ "Logout" } 
          disablePadding 
          onClick={ handleOnLogoutClick } >
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={ "Logout" } />
          </ListItemButton>
        </ListItem>

        <ListItem key={ "Help" } disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <HelpOutlineOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={ "Help" } />
          </ListItemButton>
        </ListItem>

        <ListItem key={ "Delete" } disablePadding>
          <ListItemButton onClick={ handleOnDeleteClick }>
            <ListItemIcon>
              <CancelIcon />
            </ListItemIcon>
            <ListItemText primary={ "Delete" } />
          </ListItemButton>
        </ListItem>
      </List>

      <ProjectOwnerMenu 
        ownerMenuAnchorEl={ ownerMenuAnchorEl }
        ownerMenuOpen={ ownerMenuOpen }
        handleOnOwnerMenuClose={ handleOnOwnerMenuClose } />

      <ProjectCollaboratorMenu
        collaboratorsMenuAnchorEl={ collaboratorsMenuAnchorEl }
        collaboratorsMenuOpen={ collaboratorsMenuOpen }
        handleOnCollaboratorsMenuClose={ handleOnCollaboratorsMenuClose } />

      <UserListMenu 
        usersFilterMenuAnchorEl={ usersFilterMenuAnchorEl }
        usersFilterMenuOpen={ usersFilterMenuOpen }
        handleOnUsersFilterMenuClose={ handleOnUsersFilterMenuClose } />  

      <UserSecretMenu 
        secretMenuAnchorEl={ secretMenuAnchorEl }
        secretMenuOpen={ secretMenuOpen }
        handleSecretMenuClose={ handleSecretMenuClose } />  
    </Drawer>
  );
}

export default KanbanDrawer;