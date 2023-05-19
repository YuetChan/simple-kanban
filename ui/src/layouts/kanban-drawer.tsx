import  React, { useEffect } from 'react';

import { useSelector, useDispatch } from "react-redux";

import { useCookies } from 'react-cookie';

import { Stack, List, Divider, ListItem, ListItemButton,  ListItemText, IconButton } from '@mui/material';

import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

import { AppState } from '../stores/app-reducers';

import { actions as usersCacheActions } from '../stores/user-cache-slice';
import { actions as projectsCacheActions } from '../stores/projects-cache-slice';
import { actions as tasksSearchActions } from '../stores/tasks-search-slice';
import { actions as projectCreateDialogActions } from '../stores/project-create-dialog-slice';

import { redirectToLoginPage } from '../services/auth.services';
import { createProject, getProjectById, updateProjectById } from '../features/project/services/projects-service';
import { generateUserSecretById, getUserByEmail } from "../features/user/services/users-service";
import { User } from '../types/User';

import UserProfileMini from '../features/user/components/user-profile-mini';
import { Project } from '../types/Project';

interface KanbanDrawerProps { }

const KanbanDrawer = (props: KanbanDrawerProps) => {
  // ------------------ Dispatch ------------------
  const dispatch = useDispatch();

  // ------------------ Cookies -----------------
  const [ cookie, removeCookie ] = useCookies(['jwt']);

  // -------------- Tasks search --------------
  const tasksSearchState = useSelector((state: AppState) => state.TasksSearch);

  const {  
    selectActivePriorities,
    addActiveUserEmail, removeActiveUserEmail
  } = tasksSearchActions;

  // -------------- Projects cache --------------
  const projectsCacheState = useSelector((state: AppState) => state.ProjectsCache);

  const { selectActiveProject, updateActiveProject, updateAllProjects } = projectsCacheActions;

  // -------------- Projects create dialog --------------
  const { showProjectCreateDialog, hideProjectCreateDialog } = projectCreateDialogActions;

  // -------------- User cache --------------
  const userCacheState = useSelector((state: AppState) => state.UserCache);

  const { updateLoginedUserEmail, updateLoginedUserSecret } = usersCacheActions;


  // -------------- Project create dialog ----------------
  const handleOnProjectCreate = (name: string, description: string) => {
    const project = {
      name: name,
      description: description,
      userEmail: userCacheState._loginedUserEmail,
    } as Project

    createProject(project).then(res => {
      // console.
      getProjectById(res.id).then(res => {
        dispatch(updateAllProjects([ res, ...projectsCacheState._allProjects ]));
      });

      dispatch(hideProjectCreateDialog());
    })
  }
  
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
    console.log(projectId)
    const projects = projectsCacheState._allProjects.filter(project => {
      return project.id === projectId
    });

    dispatch(selectActiveProject(projects.length > 0 ? projects[0] : undefined));
  };

  const handleOnNewProjectClick = () => {
    dispatch(showProjectCreateDialog());
  }

  const handleOnPrioritySelect = (priority: string) => {
    dispatch(selectActivePriorities(priority));
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

  const handleOnCollaboratorAdd = (collaboratorToAddEmail: string, collaboratorSecret: string) => {
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

  const handleOnCollaboratorRemove = (collaboratorToRemoveEmail: string) => {
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

//   const openCollaboratorsMenu = (e: any) => {
//     setCollaboratorsMenuAnchorEl(e.currentTarget);
//   }

  // ------------------ Html template ------------------

    return (
        <div style={{
                width: "240px",
                background: "whitesmoke"
            }}>
            <List>
                <ListItem>
                    <div style={{ 
                        padding: "8px"
                        }}>
                        <img src="https://i.ibb.co/NjWwY0t/Screenshot-from-2023-05-17-19-03-10.png" width={ 180 } height={ 60 } />
                    </div>
                </ListItem>

                <ListItem>
                    <Stack 
                        direction="row" 
                        justifyContent="space-between" 
                        alignItems="center"  
                        
                        sx={{ 
                            width: "100%" 
                        }}>
                        <div style={{
                            color: "rgb(47, 47, 47)" 
                            }}>
                            <b>Projects: </b>
                        </div>
            
                        <IconButton>
                            <AddBoxOutlinedIcon/>
                        </IconButton>
                    </Stack>
                </ListItem>

               <ListItem>
                    <div style={{
                        color: "rgb(47, 47, 47)" 
                        }}>
                        <b>Yours/You joined: </b>
                    </div>  
               </ListItem>

                <ListItem sx={{
                    marginBottom: "12px"
                }}>
                    <List sx={{ 
                        width: "100%",
                        overflow: "auto",
                        maxHeight: "180px"
                        }}>
                        {
                            projectsCacheState._allProjects.map(project => 
                                (
                                    <ListItem sx={{  padding: "0px"}}>
                                        <ListItemButton  
                                            onClick={ (e: any) => handleOnProjectChange(project.id) }
                                        
                                            sx={{ 
                                                paddingTop: "0px", 
                                                paddingBottom: "0px"
                                                }}>
                                            <ListItemText primary={ project.name }/>
                                        </ListItemButton>
                                    </ListItem>
                                )
                            )
                        }
                    </List>
                </ListItem> 

                <ListItem>
                    <div style={{
                        color: "rgb(47, 47, 47)" 
                        }}>
                        <b>Organization's: </b>
                    </div>  
                </ListItem>




                <Divider />

                <ListItem sx={{
                    marginTop: "12px"
                    }}>
                    <UserProfileMini email="yuetcheukchan@gmail.com" size={ 36 }/>
                </ListItem>   
            </List>
        </div>
    );
}

export default KanbanDrawer;