import React, { useEffect } from 'react';

import { Stack } from '@mui/material';

import logo from './logo.svg';
import './App.css';

import { useProjectsCacheContext } from './providers/projects-cache';
import { useProjectDeleteDialogContext } from './providers/project-delete-dialog';
import { useProjectCreateDialogContext } from './providers/project-create-dialog';
import { useTagsSearchResultPanelContext } from './providers/tags-search-result-panel';
import { useTasksCacheContext } from './providers/tasks-cache';
import { useTaskCreateContext } from './providers/task-create';
import { useUserCacheContext } from './providers/user-cache';
import { useTasksSearchContext } from './providers/tasks-search';
import { useKanbanTableContext } from './providers/kanban-table';

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

import { useCookies } from 'react-cookie';
import jwt_decode from "jwt-decode";

function App() {
  // ------------------ Projects cache ------------------
  const projectsCacheContextState = useProjectsCacheContext().state;
  const projectsCacheContextDispatch = useProjectsCacheContext().Dispatch;

  // ------------------ Project delete dialog ------------------
  const projectDeleteDialogState = useProjectDeleteDialogContext().state;

  // ------------------ Project create dialog ------------------
  const projectCreateDialogState = useProjectCreateDialogContext().state;
  const projectCreateDialogDispatch = useProjectCreateDialogContext().Dispatch;
  
  // ------------------ Tag search result panel ------------------
  const tagsSearchResultPanelContextState = useTagsSearchResultPanelContext().state;

  // ------------------ Tasks search ------------------
  const tasksSearchContextState = useTasksSearchContext().state;

  // ------------------ User cache ------------------
  const userCacheContextState = useUserCacheContext().state;
  const userCacheContextDispatch = useUserCacheContext().Dispatch;

  // ------------------ Table ------------------
  const tableContextDispatch = useKanbanTableContext().Dispatch;
  
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
          userCacheContextDispatch({
            type: 'loginedUserSecret_update',
            value: res
          })
        })
      });

      searchProjectsByUserEmail(loginedUserEmail, 0).then(res => {
        projectsCacheContextDispatch({
          type: 'allProjects_update', 
          value: res.projects
        });
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

      userCacheContextDispatch({
        type: 'loginedUserEmail_update',
        value: decoded.email
      });
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
          projectsCacheContextDispatch({
            type: 'allProjects_update', 
            value: res.projects
          });
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
        projectsCacheContextDispatch({
          type: "allProjects_update",
          value: [ res, ...projectsCacheContextState._allProjects ]
        });
      });

      projectCreateDialogDispatch({
        type: 'dialog_hide'
      });
    })
  }

  const handleOnProjectCreateDialogClose = () => {
    if(projectsCacheContextState._allProjects.length > 0) {
      projectCreateDialogDispatch({
        type: 'dialog_hide'
      });
    }
  }

  useEffect(() => {
    if(projectsCacheContextState._allProjects.length === 0 && authed) {
      projectCreateDialogDispatch({
        type: 'dialog_show'
      });
    }else {
      projectCreateDialogDispatch({
        type: 'dialog_hide'
      });
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
      tableContextDispatch({
        type: 'table_refresh'
      });
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
        display: tasksSearchContextState._tagsEditAreaFocused || tagsSearchResultPanelContextState.mouseOver
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
