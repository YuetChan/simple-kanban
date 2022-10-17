import React, {useEffect } from 'react';

import { Stack } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import { useCookies } from 'react-cookie';

import './App.css';

import { createTask } from './features/task/services/tasks-service';
import { createProject, deleteProject, getProjectById, searchProjectsByUserEmail } from './features/project/services/projects-service';
import { getUserByEmail, getUserSecretById } from './features/user/services/users-service';

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

function App() {
  // ------------------ Dispatch ------------------
  const dispatch = useDispatch();

  // ------------------ Projects cache ------------------
  const projectsCacheContextState = useSelector((state: AppState) => state.ProjectsCache);

  const { updateAllProjects } = projectsCacheActions;

  // ------------------ Project delete dialog ------------------
  const projectDeleteDialogState = useSelector((state: AppState) => state.ProjectDeleteDialog);

  // ------------------ Project create dialog ------------------
  const projectCreateDialogState = useSelector((state: AppState) => state.ProjectCreateDialog);
  
  const { showProjectCreateDialog, hideProjectCreateDialog } = projectCreateDialogActions;

  // ------------------ Tag search result panel ------------------
  const tagsSearchResultPanelContextState = useSelector((state: AppState) => state.TagsSearchResultPanel);

  // ------------------ Tasks search ------------------
  const tasksSearchContextState = useSelector((state: AppState) => state.TasksSearch);

  // ------------------ User cache ------------------
  const userCacheContextState = useSelector((state: AppState) => state.UserCache);
  
  const { updateLoginedUserEmail, updateLoginedUserSecret } = usersCacheActions;

  // ------------------ Kanban table ------------------
  const { refreshTable } = kanbanTableActions;

  // ------------------ Home ------------------
  // ------------------ Cookies -----------------
  const [ cookies ] = useCookies(['jwt']);

  // ------------------ Auth ------------------
  const [ authed, setAuthed ] = React.useState(false);

  useEffect(() => {
    if(authed) {
      const loginedUserEmail = userCacheContextState._loginedUserEmail;

      getUserByEmail(loginedUserEmail).then(res => {
        getUserSecretById(res.id).then(res => {
          dispatch(updateLoginedUserSecret(res))
        })
      });

      searchProjectsByUserEmail(loginedUserEmail, 0).then(res => {
        dispatch(updateAllProjects(res.projects));
      }).catch(err => {
        console.log(err);
      });
    }
  }, [ authed ]);

  useEffect(() => {
    setAuthed(true);
  }, [ userCacheContextState._loginedUserEmail ]);

  useEffect(() => {
    if(cookies.jwt) {
      const decoded = jwt_decode<{ email: string }>(cookies.jwt.toString());
      dispatch(updateLoginedUserEmail(decoded.email));
    }
  }, []);

  // ------------------ Project delete dialog ------------------ 
  const [ projectDeleteDialogOpen, setProjectDeleteDialogOpen ] = React.useState(false);

  const handleOnProjectDeleteDialogClose = () => {
    setProjectDeleteDialogOpen(false);
  }

  const handleOnProjectDeleteDialogDelete = () => {
    const activeProject = projectsCacheContextState._activeProject;
    if(activeProject) {
      deleteProject(activeProject.id).then(res => {
        setProjectDeleteDialogOpen(false);
  
        searchProjectsByUserEmail(userCacheContextState._loginedUserEmail, 0).then(res => {
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
        dispatch(updateAllProjects([ res, ...projectsCacheContextState._allProjects ]));
      });

      dispatch(hideProjectCreateDialog());
    })
  }

  const handleOnProjectCreateDialogClose = () => {
    if(projectsCacheContextState._allProjects.length > 0) {
      dispatch(hideProjectCreateDialog());
    }
  }

  useEffect(() => {
    if(projectsCacheContextState._allProjects.length === 0 && authed) {
      dispatch(showProjectCreateDialog());
    }else {
      dispatch(hideProjectCreateDialog());
    }
  }, [ projectsCacheContextState._allProjects ]);
  
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
    <div className="App">
      <section style={{
        width: "100vw", 
        height: "100vh",
        overflow: "hidden"
        }}>
        {
          authed
          ? (
            <Stack 
              direction="row" 
              style={{ 
                width: "100%", 
                height: "100%" 
              }}>    
              <KanbanDrawer />
  
              <KanbanTable /> 
            </Stack>
          )
          : null
        }  
      </section>
   
      <div style={{ 
        display: tasksSearchContextState._tagsEditAreaFocused || tagsSearchResultPanelContextState._mouseOver
        ? "block" 
        : "none" 
        }}>
        <TagsSearchResultPanel />
      </div>

      {
        authed
        ? (
          <div style={{
            position: "fixed",
            bottom: "4px",
            left: "244px"
            }}>
            <TaskAddButton handleOnClick={ handleOnTaskAddClick }/>
          </div>
        )
        : null
      }  

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
          showLogout={ projectsCacheContextState._allProjects.length === 0 }
          handleOnProjectCreateClick = { (project: Project) => handleOnProjectCreateClick(project) } 
          handleOnClose={ handleOnProjectCreateDialogClose } 
          handleOnLogout={ () => {} }/>  
      </div>

      <div>
        <ProjectDeleteDialog 
         label="Delete Project"
         open={ projectDeleteDialogOpen }
         handleOnClose={ handleOnProjectDeleteDialogClose }
         handleOnDelete={ handleOnProjectDeleteDialogDelete } />
      </div>
    </div>
  );
}

export default App;
