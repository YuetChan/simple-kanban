import { useEffect, useRef, useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import { useCookies } from 'react-cookie';

import { Stack, List, Divider, ListItem, ListItemButton, IconButton, Fab } from '@mui/material';

import { AppState } from '../stores/app-reducers';

import { actions as usersCacheActions } from '../stores/user-cache-slice';
import { actions as projectsCacheActions } from '../stores/projects-cache-slice';
import { actions as projectCreateDialogActions } from '../stores/project-create-dialog-slice';

import UserProfileMini from '../features/user/components/user-profile-mini';

import ProjectWithOwnerIcon from '../features/project/components/project-with-owner-icon';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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

    const userCacheState = useSelector((state: AppState) => state.UserCache);

    // ------------------ Projects cache --------------
    const projectsCacheState = useSelector((state: AppState) => state.ProjectsCache);

    const { updateActiveProject } = projectsCacheActions;

    // ------------------ Projects create dialog --------------
    const { showProjectCreateDialog } = projectCreateDialogActions;

    // ------------------ Kanban drawer ------------------
    const [ minimized, setMinimized ] = useState(false);

    const handleOnMinimize = (e: any) => {
        setMinimized(true)
    }

    const handleOnMaximize = (e: any) => {
        setMinimized(false);
    }

    const listRef = useRef<any>(null);

    const activeProjectRef = useRef<any>(null);

    useEffect(() => {
        scrollToActiveProject();
    }, [ projectsCacheState._activeProject ])

    const handleOnProjectSelect = (projectId: string) => {
        const projects = projectsCacheState._allProjects.filter(project => {
            return project.id === projectId
        });

        dispatch(updateActiveProject(projects.length > 0? projects[0]: undefined));
    };

    const handleOnShareProjectSelect = (projectId: string) => {
        const projects = projectsCacheState._allShareProjects.filter(project => {
            return project.id === projectId
        });

        dispatch(updateActiveProject(projects.length > 0 ? projects[0] : undefined)); 
    }

    const handleOnNotProjectClick = (projectId: string) => {
        const projects = projectsCacheState._allNotProjects.filter(project => {
            return project.id === projectId
        });

        alert(`Project name: ${projects[0].name} \nOwner email: ${projects[0].userEmail}`);
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
            const scrollPosition = targetElement.offsetTop - listElement.offsetTop;
      
            listElement.scrollTop = scrollPosition;
        }
    }

    // ------------------ Html template ------------------
    return (
        <div style={{
            width: minimized? "0px" : "240px",
            height: "100%",
            background: "whitesmoke",
            position: "relative",

            ... props.style
            }}>
            <div style={{ 
                    top: "268px",
                    right: "-8px",
            
                    position: "absolute",
                }}>
                <Fab
                    onClick={ handleOnMinimize }

                    sx={{
                        display: minimized? "none": null,

                        color: "white",
                        background: "rgb(47, 47, 47)",

                        width: "42px",
                        height: "42px",

                        "&:hover": {
                            backgroundColor: "white", 
                            color:"rgb(47, 47, 47)"
                        }}}>
                    { <ArrowBackIcon /> }
                </Fab>
            </div>   

            <div style={{ 
                top: "268px",
                right: "-36px",
            
                position: "absolute",
                }}>
                <Fab
                    onClick={ handleOnMaximize }

                    sx={{
                        display: minimized? null: "none",

                        color: "white",
                        background: "rgb(47, 47, 47)",

                        width: "42px",
                        height: "42px",

                        "&:hover": {
                            backgroundColor: "white", 
                            color:"rgb(47, 47, 47)"
                        }}}>
                    { <ArrowForwardIcon /> }
                </Fab>
            </div> 

            <List sx={{
                display: minimized? "none": null
            }}>
                <ListItem 
                    key={ "kanban-drawer-icon" }
                    sx={{
                        padding: "2px 16px"
                    }}>
                    <div style={{ 
                        width: "210px",
                        transform: "translateY(-4px)",
                        }}>
                        <img 
                            src="https://i.ibb.co/NjWwY0t/Screenshot-from-2023-05-17-19-03-10.png" 
                            width={ 200 } 
                            height={ 65} 
                            />
                    </div>
                </ListItem>

                <ListItem 
                    key={ "kanban-drawer-project-select" }
                    sx={{
                        padding: "2px 0px 2px 24px"
                    }}>
                    <Stack 
                        direction="row" 
                        justifyContent="space-between" 
                        alignItems="center"  
                        
                        sx={{ 
                            width: "100%",
                            paddingLeft: "2px"
                        }}>
                        <div style={{
                            color: "rgb(47, 47, 47)" ,
                            fontFamily:"'Caveat', cursive",
                            fontSize: "24px"
                            }}>
                            <b>Projects: </b>
                        </div>
            
                        <IconButton onClick={ handleOnNewProjectClick }>
                            <AddBoxOutlinedIcon/>
                        </IconButton>
                    </Stack>
                </ListItem>

                <ListItem 
                    key={ "kanban-drawer-yours-label" }
                    sx={{
                        display: "flex",
                        justifyContent: "center"
                    }}>
                    <div style={{
                        color: "rgb(47, 47, 47)",
                        fontFamily:"'Caveat', cursive",
                        fontSize: "24px",
                        }}>
                        <b>Yours: </b>
                    </div>  
               </ListItem>

               <ListItem 
                    key={ "kanban-drawer-yours-list" }
                    sx={{
                        marginBottom: "12px",
                        padding: "0px 0px 0px 16px",
                    }}>
                    <List 
                        ref={ projectsCacheState._allProjects.filter(project => project.name === projectsCacheState._activeProject?.name).length > 0
                            ? listRef
                            : null 
                        }

                        sx={{ 
                            width: "100%",
                            maxHeight: "160px",
                            overflow: "auto",
                            padding: "8px 0px",
                        }}>
                        <ListItem
                            key={ "kanban-drawer-yours-list-placeholder" }

                            sx={{ 
                                padding: "0px 16px",
                                fontFamily:"'Caveat', cursive",
                                fontSize: "24px",
                                display: projectsCacheState._allProjects.length === 0
                                ? "block"
                                : "none" }}>
                                Empty ...
                        </ListItem>
                        {
                            projectsCacheState._allProjects.map(project => 
                                (
                                    <ListItem 
                                        key={ "kanban-drawer-yours-" + project.name }
                                        sx={{  
                                            padding: "0px" ,
                                            fontFamily:"'Caveat', cursive",
                                            fontSize: "22px",
                                            }}>
                                        <ListItemButton  
                                            ref={ 
                                                projectsCacheState._activeProject?.name ===  project.name
                                                ? activeProjectRef
                                                : null 
                                            }

                                            onClick={ (e: any) => handleOnProjectSelect(project.id) }
                                        
                                            sx={{ 
                                                padding: "8px 8px 8px 28px",

                                                borderTopLeftRadius: "45px",
                                                borderBottomLeftRadius: "45px",

                                                background: projectsCacheState._activeProject?.name ===  project.name? "white": null,
                                                color: "black"
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

                <ListItem 
                    key={ "kanban-drawer-your-are-in-label" }
                    sx={{
                        display: "flex",
                        justifyContent: "center"
                    }}>
                    <div style={{
                        color: "rgb(47, 47, 47)" ,
                        fontFamily:"'Caveat', cursive",
                        fontSize: "24px"
                        }}>
                        <b>You are in: </b>
                    </div>  
                </ListItem>

                <ListItem 
                    key={ "kanban-drawer-your-are-in-list" }
                    sx={{
                        marginBottom: "12px",
                        padding: "0px 0px 0px 16px",
                    }}>
                    <List 
                        ref={ 
                            projectsCacheState._allShareProjects.filter(project => project.name === projectsCacheState._activeProject?.name).length > 0
                            ? listRef
                            : null 
                        }

                        sx={{ 
                            width: "100%",
                            maxHeight: "160px",
                            overflow: "auto",
                            padding: "16px 0px"
                        }}>
                        <ListItem 
                            key={ "kanban-drawer-your-are-in-placeholder" }
                            sx={{ 
                            padding: "0px 16px",
                            fontFamily:"'Caveat', cursive",
                            fontSize: "24px",
                            display: projectsCacheState._allShareProjects.length === 0
                            ? "block"
                            : "none" }}>
                                Empty ...
                        </ListItem>

                        {
                            projectsCacheState._allShareProjects.map(project => 
                                (
                                    <ListItem 
                                        key={ "kanban-drawer-your-are-in-" + project.name }
                                        style={{
                                            padding: "0px" ,
                                            fontFamily:"'Caveat', cursive",
                                            fontSize: "24px",
                                        }}
                                        >
                                        <ListItemButton  
                                            ref={ projectsCacheState._activeProject?.name ===  project.name? activeProjectRef: null }

                                            onClick={ (e: any) => handleOnShareProjectSelect(project.id) }
                                        
                                            sx={{ 
                                                padding: "8px 8px 8px 28px",

                                                borderTopLeftRadius: "45px",
                                                borderBottomLeftRadius: "45px",

                                                background: projectsCacheState._activeProject?.name ===  project.name? "white": null,
                                                color: "black"
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

                <ListItem 
                    key={ "kanban-drawer-your-are-not-in-label" }
                    sx={{
                        display: "flex",
                        justifyContent: "center"
                    }}>
                    <div style={{
                        color: "rgb(47, 47, 47)",
                        fontFamily:"'Caveat', cursive",
                        fontSize: "24px",


                        }}>
                        <b>You are not in: </b>
                    </div>  
                </ListItem>

                <ListItem 
                    key={ "kanban-drawer-your-are-not-in-list" }
                    sx={{
                        marginBottom: "12px",
                        padding: "0px 0px 0px 16px",
                    }}>
                    <List 
                        ref={ 
                            projectsCacheState._allNotProjects.filter(project => project.name === projectsCacheState._activeProject?.name).length > 0
                            ? listRef
                            : null 
                        }

                        sx={{ 
                            width: "100%",
                            maxHeight: "160px",
                            overflow: "auto",
                            padding: "16px 0px"
                        }}>
                        <ListItem 
                            key={ "kanban-drawer-your-are-not-in-placeholder" }
                            sx={{ 
                                padding: "0px 16px",
                                fontFamily:"'Caveat', cursive",
                                fontSize: "24px",
                                display: projectsCacheState._allNotProjects.length === 0
                                ? "block"
                                : "none" }}>
                                Empty ...
                        </ListItem>

                        {
                            projectsCacheState._allNotProjects.map(project => 
                                (
                                    <ListItem 
                                        key={ "kanban-drawer-your-are-not-in-" + project.name }
                                        style={{
                                            padding: "0px",
                                            fontFamily:"'Caveat', cursive",
                                            fontSize: "24px",
                                        }}>
                                        <ListItemButton  
                                            ref={ projectsCacheState._activeProject?.name ===  project.name? activeProjectRef: null }

                                            onClick={ (e: any) => handleOnNotProjectClick(project.id) }
                                        
                                            sx={{ 
                                                padding: "8px 8px 8px 28px",

                                                borderTopLeftRadius: "45px",
                                                borderBottomLeftRadius: "45px",

                                                background: projectsCacheState._activeProject?.name ===  project.name? "white": null,
                                                color: "black"
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

                <ListItem 
                    key={ "kanban-drawer-mini-profile" }
                    sx={{ marginTop: "12px"}}>
                    <UserProfileMini 
                        email={userCacheState._loginedUserEmail} 
                        size={ 36 }

                        handleOnSignout={ handleOnSignout }
                        />
                </ListItem>   
            </List>
        </div>
    );
}

export default KanbanDrawer;