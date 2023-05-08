import  React, { useEffect } from 'react';

import { useSelector, useDispatch } from "react-redux";

import { useCookies } from 'react-cookie';

import { Stack, Tooltip, Typography, Drawer, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import LogoutIcon from '@mui/icons-material/Logout';
import CancelIcon from '@mui/icons-material/Cancel';

import TagsEditArea from '../features/tag/components/tags-edit-area';
import ProjectCollaboratorMenu from '../features/project/components/project-collaborator-menu';
import ProjectOwnerMenu from '../features/project/components/project-owner-menu';
import UserList from '../features/user/components/user-list';
import ProjectSelect from '../features/project/components/project-select';
import UserListMenu from '../features/user/components/user-list-menu';
import UserSecretMenu from '../features/user/components/user-secret-menu';
import TaskSearchPrioritySelect from '../features/task/components/task-search-priority-select';
import TaskSearchSprintSelect from '../features/task/components/task-search-sprint-select';

import { AppState } from '../stores/app-reducers';

import { actions as usersCacheActions } from '../stores/user-cache-slice';
import { actions as projectsCacheActions } from '../stores/projects-cache-slice';
import { actions as tasksSearchActions } from '../stores/tasks-search-slice';
import { actions as projectCreateDialogActions } from '../stores/project-create-dialog-slice';

import { redirectToLoginPage } from '../services/auth.services';
import { getProjectById, updateProjectById } from '../features/project/services/projects-service';
import { generateUserSecretById, getUserByEmail } from "../features/user/services/users-service";
import { User } from '../types/User';
import { textToAvatar } from '../services/avatar-service';
import KanbanInfiniteDropdown from '../components/kanban-infinite-dropdown';

interface KanbanDrawerProps { }

const KanbanDrawer = (props: KanbanDrawerProps) => {
  // ------------------ Dispatch ------------------
  const dispatch = useDispatch();

  // ------------------ Cookies -----------------
  const [ cookie, removeCookie ] = useCookies(['jwt']);

  // -------------- Tasks search --------------
  const tasksSearchState = useSelector((state: AppState) => state.TasksSearch);

  const { 
    focusTagsEditArea, blurTagsEditArea,
    updateTagsEditAreaSearchStr, 
    updateActiveTags, 
    setTagsEditAreaRef, 
    selectActivePriority,
    addActiveUserEmail, removeActiveUserEmail
  } = tasksSearchActions;

  // -------------- Projects cache --------------
  const projectsCacheState = useSelector((state: AppState) => state.ProjectsCache);

  const { selectActiveProject, updateActiveProject } = projectsCacheActions;

  // -------------- Projects create dialog --------------
  const { showProjectCreateDialog, hideProjectCreateDialog } = projectCreateDialogActions;

  // -------------- User cache --------------
  const userCacheState = useSelector((state: AppState) => state.UserCache);

  const { updateLoginedUserEmail, updateLoginedUserSecret } = usersCacheActions;

  // -------------- Kanban drawer --------------
  const [ yourProjectDisabled, setYourProjectDisabled ] = React.useState(true);

  useEffect(() => {
    if(projectsCacheState._allProjects.length > 0) {
      setYourProjectDisabled(true);
    }else {
      setYourProjectDisabled(false);
    }
  }, [ projectsCacheState._allProjects ]);

  const handleOnProjectChange = (projectId: string) => {
    const projects = projectsCacheState._allProjects.filter(project => {
      return project.id === projectId
    });

    dispatch(selectActiveProject(projects.length > 0 ? projects[0] : undefined));
  };

  const handleOnNewProjectClick = () => {
    dispatch(showProjectCreateDialog());
  }

  const handleOnPrioritySelect = (priority: string) => {
    dispatch(selectActivePriority(priority));
  }

  const handleOnLogoutClick = () => {
    removeCookie('jwt', '/');

    dispatch(updateLoginedUserEmail(''));
  }

  const handleOnDeleteClick = () => {
    dispatch(hideProjectCreateDialog());
  }

  // -------------- User list menu --------------
  const [ usersFilterMenuAnchorEl, setUsersFilterMenuAnchorEl ] = React.useState(null);
  const usersFilterMenuOpen = Boolean(usersFilterMenuAnchorEl);

  const [ userCheckMp, setUserCheckMp ] =  React.useState<Map<string, boolean> | undefined>(undefined);
  
  const [ userList, setUserList ] = React.useState<Array<string>>([])

  useEffect(() => {
    if(projectsCacheState._activeProject) {
      const checkMp = new Map();
      checkMp.set(projectsCacheState._activeProject.userEmail, false);

      setUserCheckMp(checkMp);

      const _userList = projectsCacheState._activeProject.collaboratorList.map(user => user.email)
      _userList.push(projectsCacheState._activeProject.userEmail)

      setUserList(_userList)
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

  const handleOnUsersFilterMenuClose = () => {
    setUsersFilterMenuAnchorEl(null);
  }

  const handleOnUserAvatarsClick = (e: any) => {
    setUsersFilterMenuAnchorEl(e.currentTarget);
  }

  const handleOnOwnerCheck = (checked: boolean) => {
    const activeProject = projectsCacheState._activeProject;

    if(activeProject) {
      const userEmail = activeProject.userEmail;

      if(checked) {
        dispatch(addActiveUserEmail(userEmail));
      }else {
        dispatch(removeActiveUserEmail(userEmail));
      }
    }
  }

  const handleOnCollaboratorCheck = (checked: boolean, email: string) => {
    if(checked) {
      dispatch(addActiveUserEmail(email));
    }else {
      dispatch(removeActiveUserEmail(email));
    }
  }

  // -------------- Project owner menu --------------
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
    if(userCacheState._loginedUserEmail === projectsCacheState._activeProject?.userEmail) {
      setIsOwner(true);
    }else {
      setIsOwner(false);
    }
  }, [ userCacheState ]);

  // -------------- Project collaborators menu --------------
  const [ collaboratorsMenuAnchorEl, setCollaboratorsMenuAnchorEl ] = React.useState(null);
  const collaboratorsMenuOpen = Boolean(collaboratorsMenuAnchorEl);

  const handleOnCollaboratorsMenuClose = () => {
    setCollaboratorsMenuAnchorEl(null);
  }

  const handleOnQuitProjectClick = () => {
    const activeProject = projectsCacheState._activeProject;

    if(activeProject) {
      const activeCollaboratorEmails = activeProject.collaboratorList.map(collaborator => collaborator.email);
      
      const updatedCollaboratorEmails = activeCollaboratorEmails.filter(email => 
        email !== userCacheState._loginedUserEmail);

      const updatedCollaborators = updatedCollaboratorEmails.map(email => {
        return { 
          email: email 
        } as User;
      });
  
      const updatedProject = {
        ... activeProject,
        collaboratorList: updatedCollaborators
      }
  
      updateProjectById(updatedProject.id, updatedProject).then(res => {
        alert('You are removed from project');

        dispatch(updateActiveProject(undefined));
      }).catch(err => {
        console.log(err);

        alert('Opps, failed to remove yourself from project')
      });
    }
  }

  const handleOnCollaboratorAddClick = (collaboratorToAddEmail: string, collaboratorSecret: string) => {
    const activeProject = projectsCacheState._activeProject;

    if(activeProject) {
      const collaboratorEmails = activeProject.collaboratorList.map(collaborator =>  collaborator.email);

      if(collaboratorEmails.indexOf(collaboratorToAddEmail) !== -1) {
        alert("Collaborator already added to the project");

        return;
      }
  
      const updatedCollaboratorEmails = [ ...collaboratorEmails, collaboratorToAddEmail];
      const updatedCollaborators = updatedCollaboratorEmails.map(email => {
        return { email: email } as User;
      })
  
      const updatedProject = {
        ... activeProject,
        collaboratorList: updatedCollaborators
      }
  
      updateProjectById(activeProject.id, updatedProject).then(res => {
        alert("Collaborator added");
  
        getProjectById(activeProject.id).then(res => {
          dispatch(updateActiveProject(res));
        });
      }).catch(err => {
        console.log(err);
        
        alert("Opps, failed to add collaborator")
      });
    }
  }

  const handleOnCollaboratorRemoveClick = (collaboratorToRemoveEmail: string) => {
    const activeProject = projectsCacheState._activeProject;

    if(activeProject) {
      const collaboratorEmails = activeProject.collaboratorList.map(collaborator =>  collaborator.email);
      const updatedCollaboratorEmails = collaboratorEmails.filter(email => {
        return email !== collaboratorToRemoveEmail;
      })
  
      if(updatedCollaboratorEmails.length === collaboratorEmails.length) {
        alert("Collaborator not in project");

        return;
      }
  
      const updatedCollaborators = updatedCollaboratorEmails.map(email => {
        return { email: email } as User;
      })
  
      const updatedProject = {
        ... activeProject,
        collaboratorList: updatedCollaborators
      }
  
      updateProjectById(activeProject.id, updatedProject).then(res => {
        alert("Collaborator removed");
  
        getProjectById(activeProject.id).then(res => {
          dispatch(updateActiveProject(res));
        })
      }).catch(err => {
        console.log(err);

        alert("Opps, failed to remove collaborator")
      });
    }
  }

  const openCollaboratorsMenu = (e: any) => {
    setCollaboratorsMenuAnchorEl(e.currentTarget);
  }

  // ------------------ User secret menu ------------------
  const [ secretMenuAnchorEl, setSecretMenuAnchorEl ] = React.useState<null | HTMLElement>(null);
  const secretMenuOpen = Boolean(secretMenuAnchorEl);

  const handleSecretMenuClose = () => {
    setSecretMenuAnchorEl(null);
  }

  const handleOnRenewSecretClick = () => {
    getUserByEmail(userCacheState._loginedUserEmail).then((res: any) => {
      generateUserSecretById(res.id).then((res: any) => {
        dispatch(updateLoginedUserSecret(res));
      });
    });
  }

  const openSecretMenu = (e: any) => {
    setSecretMenuAnchorEl(e.currentTarget);
  }

  // ------------------ Tags filter areas ------------------
  const tagsEditAreaRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
   dispatch(setTagsEditAreaRef(tagsEditAreaRef));
  }, [ tagsEditAreaRef ]);

  const handleOnTagsChange = (tags: Array<string>) => {
    dispatch(updateActiveTags(tags));
  }

  const handleOnTagsFilterAreaChange = (e: any) => {
    dispatch(updateTagsEditAreaSearchStr(e.target.value));
  }

  const handleOnTagsFilterAreaKeyPress = (e: any) => {
    if(e.keyCode === 13) {
      dispatch(updateTagsEditAreaSearchStr(e.target.value));
    }
  }

  const handleOnTagsFilterAreaFocus = (e: any) => {
    dispatch(updateTagsEditAreaSearchStr(e.target.value));
    dispatch(focusTagsEditArea());
  }

  const handleOnTagsFilterAreaBlur = (e: any) => {
    dispatch(blurTagsEditArea());
  }

  // ------------------ Html template ------------------
  const drawerWidth = 240;

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
          <KanbanInfiniteDropdown />

          <div><b>Projects: </b></div>

          <ProjectSelect
            activeProject={ projectsCacheState._activeProject } 
            projects = { projectsCacheState._allProjects }
            yourProjectDisabled={ yourProjectDisabled } 
            
            handleOnProjectChange={ (projectId: string) => handleOnProjectChange(projectId) }/>
        </ListItem>

        <ListItem key={ "New Project" } disablePadding>
          <ListItemButton onClick={ handleOnNewProjectClick }>
            <ListItemIcon>
              <AddBoxOutlinedIcon/>
            </ListItemIcon>
            <ListItemText primary={ "New Project" } />
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

          handleOnUserAvatarsClick={ handleOnUserAvatarsClick } 
          />  

        <TaskSearchPrioritySelect 
          handleOnPrioritySelect={ (priority: string) => handleOnPrioritySelect(priority) }
          />

        <TagsEditArea 
          label="Tags" 
          tags={ tasksSearchState._activeTags }
          disabled={ false } 

          handleOnTagsChange={ (tags: Array<string>) => handleOnTagsChange(tags) }
          handleOnTextFieldChange={ (e: any) => handleOnTagsFilterAreaChange(e) }
          handleOnKeyPress={ (e: any) => handleOnTagsFilterAreaKeyPress(e) }
          handleOnFocus={ (e: any) => handleOnTagsFilterAreaFocus(e) }
          handleOnBlur={ handleOnTagsFilterAreaBlur } 

          inputRef={ tagsEditAreaRef } 
          /> 

          <Tooltip title="Coming soon.">
            <div>
              <TaskSearchSprintSelect />
            </div>
          </Tooltip>
             
      </Stack>

      <Divider />

      <List>
        <ListItem >
          <b>User:</b> 
        </ListItem>
        
        <ListItem key={ "User" } >
          { userCacheState._loginedUserEmail }
        </ListItem>

        <ListItem 
          style={{ display: projectsCacheState._allProjects.length > 0? "block": "none" }}
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


      </List>

      <ProjectOwnerMenu 
        ownerMenuAnchorEl={ ownerMenuAnchorEl }
        ownerMenuOpen={ ownerMenuOpen }

        handleOnOwnerMenuClose={ handleOnOwnerMenuClose } 

        handleOnCollaboratorAddClick={ (collaboratorToAddEmail: string, collaboratorSecret: string) => 
          handleOnCollaboratorAddClick(collaboratorToAddEmail, collaboratorSecret) } 

        handleOnCollaboratorRemoveClick={ (collaboratorToRemoveEmail: string) => 
          handleOnCollaboratorRemoveClick(collaboratorToRemoveEmail) }
        />

      <ProjectCollaboratorMenu
        collaboratorsMenuAnchorEl={ collaboratorsMenuAnchorEl }
        collaboratorsMenuOpen={ collaboratorsMenuOpen }

        handleOnCollaboratorsMenuClose={ handleOnCollaboratorsMenuClose } 
        handleOnQuitProjectClick={ handleOnQuitProjectClick }
        />

      <UserListMenu 
        usersFilterMenuAnchorEl={ usersFilterMenuAnchorEl }
        usersFilterMenuOpen={ usersFilterMenuOpen }

        userCheckMp={ userCheckMp }
        userList={ userList }

        handleOnUsersFilterMenuClose={ handleOnUsersFilterMenuClose } 

        handleOnOwnerCheck={ (checked: boolean) => 
          handleOnOwnerCheck(checked) }

        handleOnCollaboratorCheck={ (checked: boolean, email: string) => 
          handleOnCollaboratorCheck(checked, email) }
        />  

      <UserSecretMenu 
        secretMenuAnchorEl={ secretMenuAnchorEl }
        secretMenuOpen={ secretMenuOpen }

        secret={ userCacheState._loginedUserSecret }

        handleSecretMenuClose={ handleSecretMenuClose } 
        handleOnRenewSecretClick={ handleOnRenewSecretClick }
        />  
    </Drawer>
  );
}

export default KanbanDrawer;