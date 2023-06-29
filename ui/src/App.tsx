import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Stack } from "@mui/material";

import { useCookies } from "react-cookie";

import "./App.css";

import { createProject, deleteProject, getProjectById, searchProjectsByNotUserEmail, searchProjectsByUserEmail, searchShareProjectsByUserEmail } from "./features/project/services/projects-service";

import { Project } from "./types/Project";

import KanbanTable from "./layouts/kanban-table";
import KanbanDrawer from "./layouts/kanban-drawer";
import ProjectCreateDialog from "./features/project/components/project-create-dialog";
import ProjectDeleteDialog from "./features/project/components/project-delete-dialog";

import jwt_decode from "jwt-decode";

import { AppState } from "./stores/app-reducers";

import { actions as usersCacheActions } from "./stores/user-cache-slice";
import { actions as projectsCacheActions } from "./stores/projects-cache-slice";
import { actions as projectDeleteDialogActions } from "./stores/project-delete-dialog-slice";
import { actions as projectCreateDialogActions } from "./stores/project-create-dialog-slice";

import KanbanOauthPage from "./layouts/kanban-oauth-page";
import KanbanEmptyPage from "./layouts/kanban-empty-page";

import CrudEventsPolling from "./features/crud-event/components/crud-events-polling";
import KanbanEventNotifier from "./layouts/kanban-event-notifier";

import { getUserByEmail } from "./features/user/services/users-service";

function App() {
    // ------------------ Dispatch ------------------
    const dispatch = useDispatch();

    // ------------------ Cookies -----------------
    const [ cookies, setCookie ] = useCookies(["jwt"]);
    
    // ------------------ Query param ------------------
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);

        const jwt = searchParams.get("jwt");
        
        if(jwt !== null && cookies.jwt !== null && cookies.jwt === jwt) {
            const url = new URL(window.location.href);

            searchParams.delete("jwt");
            
            const newUrl = `${url.origin}${url.pathname}?${searchParams.toString()}`;
    
            window.history.replaceState(null, "", newUrl);
        }else if(jwt !== null && cookies.jwt !== null && cookies.jwt !== jwt) {
            const url = new URL(window.location.href);

            searchParams.delete("jwt");
            
            const newUrl = `${url.origin}${url.pathname}?${searchParams.toString()}`;
    
            window.history.replaceState(null, "", newUrl);
            setCookie("jwt", jwt);
        }else if(jwt !== null && cookies.jwt === null) {
            const url = new URL(window.location.href);

            searchParams.delete("jwt");
            
            const newUrl = `${url.origin}${url.pathname}?${searchParams.toString()}`;
    
            window.history.replaceState(null, "", newUrl);
            setCookie("jwt", jwt);
        }else if(jwt === null && cookies.jwt !== null) { 

        }else if(jwt === null && cookies.jwt === null) {
            setCookie("jwt", "");
        }
    }, []);

    // ------------------ Projects cache ------------------
    const projectsCacheState = useSelector((state: AppState) => state.ProjectsCache);

    const { 
        updateActiveProject, 
        updateProjects, updateNotProjects, updateShareProjects 
    } = projectsCacheActions;

    // ------------------ User cache ------------------
    const userCacheState = useSelector((state: AppState) => state.UserCache);
  
    const { updateLoginedUserEmail } = usersCacheActions;

    // ------------------ Project delete dialog ------------------
    const projectDeleteDialogState = useSelector((state: AppState) => state.ProjectDeleteDialog);

    const {  hideProjectDeleteDialog } = projectDeleteDialogActions;

    const [ projectDeleteDialogOpen, setProjectDeleteDialogOpen ] = useState(false);

    useEffect(() => {
        setProjectDeleteDialogOpen(projectDeleteDialogState.show);
    }, [ projectDeleteDialogState.show ]);

    const handleOnProjectDeleteDialogClose = () => {
        dispatch(hideProjectDeleteDialog());
    }

    const handleOnProjectDeleteDialogDelete = () => {
        const activeProject = projectsCacheState._activeProject;
    
        if(activeProject) {
            deleteProject(activeProject.id).then(res => {
                searchProjectsByUserEmail(userCacheState._loginedUserEmail, 0).then(res => {
                    dispatch(updateProjects(res.projects));
                    dispatch(hideProjectDeleteDialog())
                });
            }).catch(err => {
                console.error(err);
            });
        }
    }

    // ------------------ Project create dialog ------------------
    const projectCreateDialogState = useSelector((state: AppState) => state.ProjectCreateDialog);

    const { showProjectCreateDialog, hideProjectCreateDialog } = projectCreateDialogActions;

    const handleOnProjectCreate = (name: string, description: string) => {
        const project = {
            name: name,
            description: description,
            userEmail: userCacheState._loginedUserEmail,
        } as Project

        createProject(project).then(res => {
            getProjectById(res.id).then(res => {
                dispatch(updateProjects([ ... projectsCacheState._allProjects, res ]));
                dispatch(updateActiveProject(res));
            }).catch(err => {
                console.error(err);
            });

            dispatch(hideProjectCreateDialog());
        })
    }

    const handleOnProjectCreateDialogClose = () => {
        dispatch(hideProjectCreateDialog());
    }


    // ------------------ Empty page ------------------
    const handleOnCreateProjectClick = () => {
        dispatch(showProjectCreateDialog());
    }

    // ------------------ Ui events ------------------
    // In progress ...

    // ------------------ Auth ------------------
    const [ authed, setAuthed ] = useState(false);

    useEffect(() => {
        if(authed) {
            const loginedUserEmail = userCacheState._loginedUserEmail;

            searchProjectsByUserEmail(loginedUserEmail, 0).then(res => {
                dispatch(updateProjects(res.projects));
            }).catch(err => {
                console.error(err);
            });

            searchProjectsByNotUserEmail(loginedUserEmail, 0).then(res => {
                console.log(res)
                dispatch(updateNotProjects(res.projects));
            }).catch(err => {
                console.error(err);
            });

            searchShareProjectsByUserEmail(loginedUserEmail, 0).then(res => {
                console.log(res)
                dispatch(updateShareProjects(res.projects));
            }).catch(err => {
                console.error(err);
            });
        } 
    }, [ authed ]);

    useEffect(() => {
        setAuthed(userCacheState._loginedUserEmail !== "");
    }, [ userCacheState._loginedUserEmail ]);

    useEffect(() => {
        try {
            if(cookies.jwt) {
                const decoded = jwt_decode<{ email: string }>(cookies.jwt.toString());
                
                if(decoded.email) {
                    getUserByEmail(decoded.email).then(res => {
                        dispatch(updateLoginedUserEmail(decoded.email));
                    }).catch(err => {
                        console.error(err);
                        dispatch(updateLoginedUserEmail(""));
                    })
                }else {
                    dispatch(updateLoginedUserEmail(""));
                }
            }else {
                dispatch(updateLoginedUserEmail(""));
            }
        }catch {
            dispatch(updateLoginedUserEmail(""));
        }
    }, [ cookies ]);

    return (
        <div className="App" >
            <Stack 
                direction="column" 
                sx={{ 
                    width: "100vw", 
                    height: "100vh",
                    overflow: "hidden",
                    display: authed? "block": "none"
                }}>    
                <Stack direction="row">
                    <KanbanDrawer style={{ height: "100vh" }}/>

                    {
                        projectsCacheState._allProjects.length === 0 && projectsCacheState._activeProject === undefined
                        ? <KanbanEmptyPage handleOnCreateProjectClick={ handleOnCreateProjectClick } />
                        : <KanbanTable />
                    }
                </Stack>
            </Stack>

            <KanbanOauthPage style={{ display: authed? "none": "flex" }}/>
 
            <ProjectCreateDialog 
                title="Create Project"
                description="Please enter the project name to create your project."
                open={ projectCreateDialogState.show } 

                handleOnProjectCreate = { (name: string, description: string) => 
                    handleOnProjectCreate(name, description) } 

                handleOnClose={ handleOnProjectCreateDialogClose } 
                /> 

            <ProjectDeleteDialog 
                label="Delete Project"
                open={ projectDeleteDialogOpen }
                
                handleOnClose={ handleOnProjectDeleteDialogClose }
                handleOnDelete={ handleOnProjectDeleteDialogDelete } 
                />

            {/* Real time event notification feature, in progress */}
            {/* {
                projectsCacheState._activeProject
                ?(
                    <CrudEventsPolling projectId={projectsCacheState._activeProject.id}/>
                )
                : null
            }

            <KanbanEventNotifier />         */}
                
        </div>
    );
}

export default App;
