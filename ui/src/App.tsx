import React, {useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Stack } from '@mui/material';

import { useCookies } from 'react-cookie';

import './App.css';

import { createTask } from './features/task/services/tasks-service';
import { createProject, deleteProject, getProjectById, searchProjectsByUserEmail } from './features/project/services/projects-service';
import { getUserByEmail, getUserSecretById } from './features/user/services/users-service';

import { redirectToLoginPage } from './services/auth.services';

import { Project } from './types/Project';
import { Task } from './types/Task';

import TagsSearchResultPanel from './features/task/components/task-search-tags-search-result-panel';
import KanbanTable from './layouts/kanban-table';
import KanbanDrawer from './layouts/kanban-drawer';
import TaskAddButton from './features/task/components/task-add-button';
import TaskCreateDialog from './features/task/components/task-create-dialog';
import ProjectCreateDialog from './features/project/components/project-create-dialog';
import ProjectDeleteDialog from './features/project/components/project-delete-dialog';

import jwt_decode from "jwt-decode";

import { AppState } from './stores/app-reducers';

import { actions as usersCacheActions } from './stores/user-cache-slice';
import { actions as projectsCacheActions } from './stores/projects-cache-slice';
import { actions as projectCreateDialogActions } from './stores/project-create-dialog-slice';
import { actions as kanbanTableActions } from './stores/kanban-table-slice';
import KanbanOauthPage from './layouts/kanban-oauth-page';

function App() {
  // ------------------ Dispatch ------------------
  const dispatch = useDispatch();

  // ------------------ Cookies -----------------
  const [ cookies, removeCookie ] = useCookies(['jwt']);

  // ------------------ Projects cache ------------------
  const projectsCacheState = useSelector((state: AppState) => state.ProjectsCache);

  const { updateAllProjects } = projectsCacheActions;

  // ------------------ User cache ------------------
  const userCacheState = useSelector((state: AppState) => state.UserCache);
  
  const { updateLoginedUserEmail, updateLoginedUserSecret } = usersCacheActions;

  // ------------------ Project delete dialog ------------------
  const projectDeleteDialogState = useSelector((state: AppState) => state.ProjectDeleteDialog);

  // ------------------ Project create dialog ------------------
  const projectCreateDialogState = useSelector((state: AppState) => state.ProjectCreateDialog);

  const { showProjectCreateDialog, hideProjectCreateDialog } = projectCreateDialogActions;

  const handleOnLogoutClick = () => {
    removeCookie('jwt', '/');
  }

  // ------------------ Tag search result panel ------------------
  const tagsSearchResultPanelState = useSelector((state: AppState) => state.TagsSearchResultPanel);

  // ------------------ Tasks search ------------------
  const tasksSearchState = useSelector((state: AppState) => state.TasksSearch);

  // ------------------ Kanban table ------------------
  const { refreshTable } = kanbanTableActions;

  // ------------------ Home ------------------

  
  // ------------------ Auth ------------------
  const [ authed, setAuthed ] = React.useState(false);

  useEffect(() => {
    if(authed) {
      const loginedUserEmail = userCacheState._loginedUserEmail;

      getUserByEmail(loginedUserEmail).then(res => {
        getUserSecretById(res.id).then(res => {
          dispatch(updateLoginedUserSecret(res))
        });
      });

      searchProjectsByUserEmail(loginedUserEmail, 0).then(res => {
        dispatch(updateAllProjects(res.projects));
      }).catch(err => {
        console.log(err);
      });
    } 
  }, [ authed ]);

  useEffect(() => {
    setAuthed(userCacheState._loginedUserEmail !== '');
  }, [ userCacheState._loginedUserEmail ]);

  useEffect(() => {
    try {
      if(cookies.jwt) {
        const decoded = jwt_decode<{ email: string }>(cookies.jwt.toString());
        if(decoded.email) {
          dispatch(updateLoginedUserEmail(decoded.email));
        }else {
          dispatch(updateLoginedUserEmail(''));
        }
      }else {
        dispatch(updateLoginedUserEmail(''));
      }
    }catch {


      dispatch(updateLoginedUserEmail(''));
    }
  }, []);

  // ------------------ Project delete dialog ------------------ 
  const [ projectDeleteDialogOpen, setProjectDeleteDialogOpen ] = React.useState(false);

  const handleOnProjectDeleteDialogClose = () => {
    setProjectDeleteDialogOpen(false);
  }

  const handleOnProjectDeleteDialogDelete = () => {
    const activeProject = projectsCacheState._activeProject;
    if(activeProject) {
      deleteProject(activeProject.id).then(res => {
        setProjectDeleteDialogOpen(false);
  
        searchProjectsByUserEmail(userCacheState._loginedUserEmail, 0).then(res => {
          dispatch(updateAllProjects(res.projects));
        })
      }).catch(err => {
        console.log(err);
      });
    }
  }

  useEffect(() => {
    setProjectDeleteDialogOpen(projectDeleteDialogState.show);
  }, [ projectDeleteDialogState ])


  // ------------------ Project create dialog ------------------
  const handleOnProjectCreateClick = (project: Project) => {
    createProject(project).then(res => {
      getProjectById(res.id).then(res => {
        dispatch(updateAllProjects([ res, ...projectsCacheState._allProjects ]));
      });

      dispatch(hideProjectCreateDialog());
    })
  }

  const handleOnProjectCreateDialogClose = () => {
    if(projectsCacheState._allProjects.length > 0) {
      dispatch(hideProjectCreateDialog());
    }
  }

  useEffect(() => {
    if(projectsCacheState._allProjects.length === 0 && authed) {
      dispatch(showProjectCreateDialog());
    }else {
      dispatch(hideProjectCreateDialog());
    }
  }, [ projectsCacheState._allProjects ]);
  
  // ------------------ Task create dialog ------------------ 
  const [ taskCreateDialogOpen, setTaskCreateDialogOpen ] = React.useState(false);
 
  const handleOnCardCreateDialogApply = (task: Task) => {
    createTaskAndRefresh(task);
    setTaskCreateDialogOpen(false);
  }

  const handleOnCardCreateDialogClose = () => {
    setTaskCreateDialogOpen(false);
  }

  const createTaskAndRefresh = (task: Task) => {
    createTask(task).then((task) => {
      dispatch(refreshTable());
    });
  }

  const handleOnTaskAddClick = () => {
    setTaskCreateDialogOpen(true);
  }

  return (
   
    (
      <div className="App" >
        <section style={{
          width: "100vw", 
          height: "100vh",
          overflow: "hidden",
          display: authed? "block": "none"
        }}>
          <Stack 
            direction="row" 
            style={{ 
              width: "100%", 
              height: "100%" 
            }}>    
            <KanbanDrawer />
  
            <KanbanTable /> 
          </Stack>
      </section>
      <div style={{
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          display: authed? "none": "flex"
      }}>
<KanbanOauthPage />
      </div>
   
      <div style={{ 
        display: tasksSearchState._tagsEditAreaFocused || tagsSearchResultPanelState._mouseOver
        ? "block" 
        : "none" 
        }}>
        <TagsSearchResultPanel />
      </div>

      <div style={{
        position: "fixed",
        bottom: "4px",
        left: "244px",
        display: authed? "block": "none"
      }}>
        <TaskAddButton handleOnClick={ handleOnTaskAddClick }/>
      </div>

      <div>
        <TaskCreateDialog 
          label="Create Kanban Card"
          open={ taskCreateDialogOpen }
          handleOnApply={ (task: Task) => handleOnCardCreateDialogApply(task) }
          handleOnClose={ handleOnCardCreateDialogClose } />
      </div>    

      <div>
        <ProjectCreateDialog 
          title="Create Project"
          description="Please enter the project name to create your project."
          open={ projectCreateDialogState.show } 
          showLogout={ projectsCacheState._allProjects.length === 0 }
          handleOnProjectCreateClick = { (project: Project) => handleOnProjectCreateClick(project) } 
          handleOnClose={ handleOnProjectCreateDialogClose } 
          handleOnLogout={ handleOnLogoutClick }/>  
      </div>

      <div>
        <ProjectDeleteDialog 
         label="Delete Project"
         open={ projectDeleteDialogOpen }
         handleOnClose={ handleOnProjectDeleteDialogClose }
         handleOnDelete={ handleOnProjectDeleteDialogDelete } />
      </div>
    </div>
    )
  );
}

export default App;
