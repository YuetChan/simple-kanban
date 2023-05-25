import {useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Stack } from "@mui/material";

import { useCookies } from "react-cookie";

import "./App.css";

import { createTask } from "./features/task/services/tasks-service";
import { createProject, deleteProject, getProjectById, searchProjectsByNotUserEmail, searchProjectsByUserEmail, searchShareProjectsByUserEmail } from "./features/project/services/projects-service";

import { redirectToLoginPage } from "./services/auth.services";

import { Project } from "./types/Project";
import { Task } from "./types/Task";

import KanbanTable from "./layouts/kanban-table";
import KanbanDrawer from "./layouts/kanban-drawer";
import TaskAddButton from "./features/task/components/task-add-button";
import TaskCreateDialog from "./features/task/components/task-create-dialog";
import ProjectCreateDialog from "./features/project/components/project-create-dialog";
import ProjectDeleteDialog from "./features/project/components/project-delete-dialog";

import jwt_decode from "jwt-decode";

import { AppState } from "./stores/app-reducers";

import { actions as usersCacheActions } from "./stores/user-cache-slice";
import { actions as projectsCacheActions } from "./stores/projects-cache-slice";
import { actions as projectDeleteDialogActions } from "./stores/project-delete-dialog-slice";
import { actions as projectCreateDialogActions } from "./stores/project-create-dialog-slice";
import { actions as kanbanTableActions } from "./stores/kanban-table-slice";

import KanbanOauthPage from "./layouts/kanban-oauth-page";
import KanbanEmptyPage from "./layouts/kanban-empty-page";

function App() {
    // ------------------ Dispatch ------------------
    const dispatch = useDispatch();

    // ------------------ Cookies -----------------
    const [ cookies, removeCookie ] = useCookies(["jwt"]);

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
                console.log(err);
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
                console.log(err);
            });

            dispatch(hideProjectCreateDialog());
        })
    }

    const handleOnProjectCreateDialogClose = () => {
        dispatch(hideProjectCreateDialog());
    }

    // ------------------ Task create dialog ------------------ 
    const [ taskCreateDialogOpen, setTaskCreateDialogOpen ] = useState(false);
 
    const handleOnCardCreateDialogApply = (task: Task) => {
        createTaskAndRefresh(task);
        setTaskCreateDialogOpen(false);
    }

    const handleOnCardCreateDialogClose = () => {
        setTaskCreateDialogOpen(false);
    }

    const handleOnTaskAddClick = () => {
        setTaskCreateDialogOpen(true);
    }

    const createTaskAndRefresh = (task: Task) => {
        createTask(task).then((task) => {
            dispatch(refreshTable());
        });
    }

    // ------------------ Kanban table ------------------
    const { refreshTable } = kanbanTableActions;

    // ------------------ Kanban empty page ------------------
    const handleOnCreateProjectClick = () => {
        dispatch(showProjectCreateDialog())
    }

    // ------------------ Auth ------------------
    const [ authed, setAuthed ] = useState(false);

    useEffect(() => {
        if(authed) {
            const loginedUserEmail = userCacheState._loginedUserEmail;

            searchProjectsByUserEmail(loginedUserEmail, 0).then(res => {
                dispatch(updateProjects(res.projects));
            }).catch(err => {
                console.log(err);
            });

            searchProjectsByNotUserEmail(loginedUserEmail, 0).then(res => {
                dispatch(updateNotProjects(res.projects));
            }).catch(err => {
                console.log(err);
            });

            searchShareProjectsByUserEmail(loginedUserEmail, 0).then(res => {
                dispatch(updateShareProjects(res.projects));
            }).catch(err => {
                console.log(err);
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
                    dispatch(updateLoginedUserEmail(decoded.email));
                }else {
                    dispatch(updateLoginedUserEmail(""));
                }
            }else {
                dispatch(updateLoginedUserEmail(""));
            }
        }catch {
            dispatch(updateLoginedUserEmail(""));
        }
    }, []);

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
                        projectsCacheState._allProjects.length === 0
                        ? <KanbanEmptyPage handleOnCreateProjectClick={ handleOnCreateProjectClick } />
                        : <KanbanTable />
                    }
                </Stack>
            </Stack>

            <KanbanOauthPage style={{ display: authed? "none": "flex" }}/>

            <TaskAddButton 
                handleOnClick={ handleOnTaskAddClick }
                         
                style={{
                    position: "fixed",
                    bottom: "4px",
                    left: "244px",
                    display: authed && projectsCacheState._activeProject? "block": "none"
                    }}/>

            <TaskCreateDialog 
                label="Create Kanban Card"
                open={ taskCreateDialogOpen }
                    
                handleOnApply={ (task: Task) => handleOnCardCreateDialogApply(task) }
                handleOnClose={ handleOnCardCreateDialogClose } 
                />
 
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
        </div>
    );
}

export default App;
