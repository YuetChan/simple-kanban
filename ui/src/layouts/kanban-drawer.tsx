import { useEffect, useRef } from "react";

import { useSelector, useDispatch } from "react-redux";

import { useCookies } from 'react-cookie';

import { Stack, List, Divider, ListItem, ListItemButton, IconButton } from '@mui/material';

import { AppState } from '../stores/app-reducers';

import { actions as usersCacheActions } from '../stores/user-cache-slice';
import { actions as projectsCacheActions } from '../stores/projects-cache-slice';
import { actions as projectCreateDialogActions } from '../stores/project-create-dialog-slice';

import { redirectToLoginPage } from '../services/auth.services';
import { createProject, getProjectById } from '../features/project/services/projects-service';

import UserProfileMini from '../features/user/components/user-profile-mini';

import ProjectWithOwnerIcon from '../features/project/components/project-with-owner-icon';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

interface KanbanDrawerProps { 
    style?: any
}

const KanbanDrawer = (props: KanbanDrawerProps) => {
    // ------------------ Dispatch ------------------
    const dispatch = useDispatch();

    // ------------------ Cookies -----------------
    const [ cookie, removeCookie ] = useCookies(['jwt']);

    // ------------------ User cache --------------
    const { updateLoginedUserEmail } = usersCacheActions;

    // ------------------ Projects cache --------------
    const projectsCacheState = useSelector((state: AppState) => state.ProjectsCache);

    const { updateActiveProject } = projectsCacheActions;

    // ------------------ Projects create dialog --------------
    const { showProjectCreateDialog } = projectCreateDialogActions;

    // ------------------ Kanban drawer ------------------
    const listRef = useRef<any>(null);

    const activeProjectRef = useRef<any>(null);

    useEffect(() => {
        scrollToActiveProject();
    }, [ projectsCacheState._activeProject ])

    const handleOnProjectChange = (projectId: string) => {
        const projects = projectsCacheState._allProjects.filter(project => {
            return project.id === projectId
        });

        dispatch(updateActiveProject(projects.length > 0 ? projects[0] : undefined));
    };

    const handleOnOrgProjectClick = (projectId: string) => {
        const projects = projectsCacheState._allProjects.filter(project => {
            return project.id === projectId
        });

        alert(`Name: ${projects[0].name} \n Owner email: ${projects[0].userEmail}` );
    }

    const handleOnNewProjectClick = () => {
        dispatch(showProjectCreateDialog());
    }

    const handleOnSignout = () => {
        removeCookie('jwt', '/');

        dispatch(updateLoginedUserEmail(''));
    }

    const scrollToActiveProject = () => {
        const targetProjectRef = activeProjectRef.current;

        if (listRef.current && targetProjectRef) {
          const listElement = listRef.current;
          const targetElement = targetProjectRef.parentElement;
      
          // Calculate the scroll position
          const scrollPosition =
            targetElement.offsetTop - listElement.offsetTop;
      
          // Scroll to the position
          listElement.scrollTop = scrollPosition;
        }
    }

    // ------------------ Html template ------------------
    return (
        <div style={{
            width: "240px",
            height: "100%",
            background: "whitesmoke",
            ... props.style
            }}>
            <List>
                <ListItem>
                    <div style={{ 
                        padding: "8px"
                        }}>
                        <img 
                            src="https://i.ibb.co/NjWwY0t/Screenshot-from-2023-05-17-19-03-10.png" 
                            width={ 180 } 
                            height={ 60 } 
                            />
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
            
                        <IconButton onClick={ handleOnNewProjectClick }>
                            <AddBoxOutlinedIcon/>
                        </IconButton>
                    </Stack>
                </ListItem>

               <ListItem>
                    <div style={{
                        color: "rgb(47, 47, 47)" 
                        }}>
                        <b>Yours: </b>
                    </div>  
               </ListItem>

               <ListItem sx={{
                        marginBottom: "12px"
                    }}>
                    <List 
                        ref={ projectsCacheState._allProjects.filter(project => project.name === projectsCacheState._activeProject?.name).length > 0
                            ? listRef
                            : null 
                        }

                        sx={{ 
                            width: "100%",
                            maxHeight: "180px",
                            overflow: "auto",
                            background: "white",
                            borderLeft: "2px solid rgba(48, 48, 48, 0.25)",
                            borderRight: "2px solid rgba(48, 48, 48, 0.25)"
                        }}>
                        <ListItem sx={{ 
                            padding: "0px 16px",
                            display: projectsCacheState._allProjects.length === 0
                            ? "block"
                            : "none" }}>
                                Empty ...
                        </ListItem>
                        {
                            projectsCacheState._allProjects.map(project => 
                                (
                                    <ListItem sx={{  padding: "0px" }}>
                                        <ListItemButton  
                                            ref={ projectsCacheState._activeProject?.name ===  project.name? activeProjectRef: null }

                                            onClick={ (e: any) => handleOnProjectChange(project.id) }
                                        
                                            sx={{ 
                                                paddingTop: "0px", 
                                                paddingBottom: "0px",
                                                background: projectsCacheState._activeProject?.name ===  project.name? "orange": null,
                                                borderRadius: "2px"
                                                }}>

                                            <ProjectWithOwnerIcon 
                                                projectName={ project.name } 
                                                ownerEmail={ project.userEmail }
                                                />
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
                        <b>You are in: </b>
                    </div>  
                </ListItem>

                <ListItem sx={{
                        marginBottom: "12px"
                    }}>
                    <List 
                        ref={ 
                            projectsCacheState._allShareProjects.filter(project => project.name === projectsCacheState._activeProject?.name).length > 0
                            ? listRef
                            : null 
                        }

                        sx={{ 
                            width: "100%",
                            maxHeight: "180px",
                            overflow: "auto",
                            background: "white",
                            borderLeft: "2px solid rgba(48, 48, 48, 0.25)",
                            borderRight: "2px solid rgba(48, 48, 48, 0.25)"
                        }}>
                        <ListItem sx={{ 
                            padding: "0px 16px",
                            display: projectsCacheState._allShareProjects.length === 0
                            ? "block"
                            : "none" }}>
                                Empty ...
                        </ListItem>

                        {
                            projectsCacheState._allShareProjects.map(project => 
                                (
                                    <ListItem >
                                        <ListItemButton  
                                            ref={ projectsCacheState._activeProject?.name ===  project.name? activeProjectRef: null }

                                            onClick={ (e: any) => handleOnProjectChange(project.id) }
                                        
                                            sx={{ 
                                                paddingTop: "0px", 
                                                paddingBottom: "0px",
                                                background: projectsCacheState._activeProject?.name ===  project.name? "orange": null,
                                                borderRadius: "2px"
                                                }}>

                                            <ProjectWithOwnerIcon 
                                                projectName={ project.name } 
                                                ownerEmail={ project.userEmail }
                                                />
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
                        <b>You are not in: </b>
                    </div>  
                </ListItem>

                <ListItem sx={{
                        marginBottom: "12px"
                    }}>
                    <List 
                        ref={ 
                            projectsCacheState._allNotProjects.filter(project => project.name === projectsCacheState._activeProject?.name).length > 0
                            ? listRef
                            : null 
                        }

                        sx={{ 
                            width: "100%",
                            maxHeight: "180px",
                            overflow: "auto",
                            background: "white",
                            borderLeft: "2px solid rgba(48, 48, 48, 0.25)",
                            borderRight: "2px solid rgba(48, 48, 48, 0.25)"
                        }}>
                        <ListItem sx={{ 
                            padding: "0px 16px",
                            display: projectsCacheState._allNotProjects.length === 0
                            ? "block"
                            : "none" }}>
                                Empty ...
                        </ListItem>

                        {
                            projectsCacheState._allNotProjects.map(project => 
                                (
                                    <ListItem >
                                        <ListItemButton  
                                            ref={ projectsCacheState._activeProject?.name ===  project.name? activeProjectRef: null }

                                            onClick={ (e: any) => handleOnOrgProjectClick(project.id) }
                                        
                                            sx={{ 
                                                paddingTop: "0px", 
                                                paddingBottom: "0px",
                                                background: projectsCacheState._activeProject?.name ===  project.name? "orange": null,
                                                borderRadius: "2px"
                                                }}>

                                                
                                            <ProjectWithOwnerIcon 
                                                projectName={ project.name } 
                                                ownerEmail={ project.userEmail }
                                                />
                                        </ListItemButton>
                                    </ListItem>
                                )
                            )
                        }
                    </List>
                </ListItem> 

                <Divider />

                <ListItem sx={{ marginTop: "12px"}}>
                    <UserProfileMini 
                        email="yuetcheukchan@gmail.com" 
                        size={ 36 }

                        handleOnSignout={ handleOnSignout }
                        />
                </ListItem>   
            </List>
        </div>
    );
}

export default KanbanDrawer;