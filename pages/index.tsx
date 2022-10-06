import React, { useEffect } from 'react';

import { Stack } from '@mui/material'

import type { NextPage } from 'next';
import Head from 'next/head';

import { useTagsSearchResultPanelContext } from '../src/providers/tags-search-result-panel';
import { useProjectsCacheContext } from '../src/providers/projects-cache';
import { useUserCacheContext } from '../src/providers/user-cache';
import { useTasksSearchContext } from '../src/providers/tasks-search';
import { useProjectCreateDialogContext } from '../src/providers/project-create-dialog';
import { useTaskCreateContext } from '../src/providers/task-create';
import { useTasksCacheContext } from '../src/providers/tasks-cache';
import { useKanbanTableContext } from '../src/providers/kanban-table';
import { useProjectDeleteDialogContext } from '../src/providers/project-delete-dialog';

import { createProject, deleteProject, getProjectById, searchProjectsByUserEmail } from '../src/features/project/services/projects-service';
import { createTask } from '../src/features/task/services/tasks-service';
import { getUserByEmail, getUserSecretById } from '../src/features/user/services/users-service';

import KanbanDrawer from '../src/layouts/kanban-drawer';
import KanbanTable from '../src/layouts/kanban-table';
import KanbanTagsResultPanel from '../src/features/task/components/task-search-tags-search-result-panel';
import TaskAddButton from '../src/features/task/components/task-add-button';
import TaskCreateDialog from '../src/features/task/components/task-create-dialog';
import ProjectCreateDialog from '../src/features/project/components/project-create-dialog';
import KanbanDrawerDeleteDialog from '../src/features/project/components/project-delete-dialog';

import { getCookie } from 'cookies-next';
import jwt_decode from "jwt-decode";

const Home: NextPage = () => { 
  // ------------------ Auth ------------------
  const [ authed, setAuthed ] = React.useState(false);

  // ------------------ Project ------------------
  const projectsContextState = useProjectsCacheContext().state;
  const projectsContextDispatch = useProjectsCacheContext().Dispatch;

  // ------------------ Task ------------------
  const tasksContextState = useTasksCacheContext().state;

  // ------------------ User ------------------
  const usersContextState = useUserCacheContext().state;
  const usersContextDispatch = useUserCacheContext().Dispatch;

  useEffect(() => {
    if(authed) {
      const loginedUserEmail = usersContextState._loginedUserEmail;

      getUserByEmail(loginedUserEmail).then(res => {
        getUserSecretById(res.id).then(res => {
          usersContextDispatch({
            type: 'loginedUserSecret_update',
            value: res
          })
        })
      });

      searchProjectsByUserEmail(loginedUserEmail, 0).then(res => {
        projectsContextDispatch({
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
  }, [ usersContextState._loginedUserEmail ]);

  useEffect(() => {
    if(getCookie('jwt')) {
      const decoded = jwt_decode(getCookie("jwt").toString());

      usersContextDispatch({
        type: 'loginedUserEmail_update',
        value: decoded.email
      });
    }
  }, []);

  // ------------------ Drawer ------------------
  const drawerContextState = useTasksSearchContext().state;

  // ------------------ Table ------------------
  const tableContextDispatch = useKanbanTableContext().Dispatch;

  // ------------------ Card create dialog ------------------
  const cardCreateContextState = useTaskCreateContext().state;

  const [ cardCreateOpen, setCardCreateOpen ] = React.useState(false);
 
  const handleOnCardCreateDialogApply = (task) => {
    createTaskAndRefresh(task);
    setCardCreateOpen(false);
  }

  const handleOnCardCreateDialogClose = () => {
    setCardCreateOpen(false);
  }

  const createTaskAndRefresh = (task) => {
    createTask(task).then((task) => {
      tableContextDispatch({
        type: 'table_refresh'
      });
    });
  }

  // ------------------ Project delete dialog ------------------ 
  const projectDeleteDialogState = useProjectDeleteDialogContext().state;
  const [ projectDeleteDialogOpen, setProjectDeleteDialogOpen ] = React.useState(false);

  const handleOnProjectDeleteDialogClose = () => {
    setProjectDeleteDialogOpen(false);
  }

  const handleOnProjectDeleteDialogDelete = () => {
    deleteProject(projectsContextState._activeProject.id).then(res => {
      setProjectDeleteDialogOpen(false);

      searchProjectsByUserEmail(usersContextState._loginedUserEmail, 0).then(res => {
        projectsContextDispatch({
          type: 'allProjects_update', 
          value: res.projects
        });
      })
    }).catch(err => {
      console.log(err);
    });
  }

  useEffect(() => {
    setProjectDeleteDialogOpen(projectDeleteDialogState.show);
  }, [ projectDeleteDialogState ])

  // ------------------ Tag search result panel ------------------
  const tagsSearchResultPanelContextState = useTagsSearchResultPanelContext().state;

  // ------------------ Project create dialog ------------------
  const projectCreateDialogState = useProjectCreateDialogContext().state;
  const projectCreateDialogDispatch = useProjectCreateDialogContext().Dispatch;

  const handleOnProjectCreateClick = (project) => {
    createProject(project).then(res => {
      getProjectById(res.id).then(res => {
        projectsContextDispatch({
          type: "allProjects_update",
          value: [ res, ...projectsContextState._allProjects ]
        });
      });

      projectCreateDialogDispatch({
        type: 'dialog_hide'
      });
    })
  }

  const handleOnProjectCreateDialogClose = () => {
    if(projectsContextState._allProjects.length > 0) {
      projectCreateDialogDispatch({
        type: 'dialog_hide'
      });
    }
  }

  useEffect(() => {
    if(projectsContextState._allProjects.length === 0 && authed) {
      projectCreateDialogDispatch({
        type: 'dialog_show'
      });
    }else {
      projectCreateDialogDispatch({
        type: 'dialog_hide'
      });
    }
  }, [ projectsContextState._allProjects ]);
  
  // ------------------- Card create dialog -------------------
  const handleOnTaskAddClick = () => {
    setCardCreateOpen(true);
  }

  // ------------------- State logger ------------------------
  useEffect(() => {
    console.log(projectsContextState);
  }, [ projectsContextState ]);

  useEffect(() => {
    console.log(tasksContextState)
  }, [ tasksContextState ])

  useEffect(() => {
    console.log(tasksContextState._allTask)
  }, [ tasksContextState._allTask ])

  useEffect(() => {
    console.log(drawerContextState);
  }, [ drawerContextState ]);

  useEffect(() => {
    console.log(cardCreateContextState);
  }, [ cardCreateContextState ]);

  useEffect(() => {
    console.log(tagsSearchResultPanelContextState);
  }, [ tagsSearchResultPanelContextState ]);

  useEffect(() => {
    console.log(usersContextState);
  }, [ usersContextState ]);

  return (
    <div>
      <Head>
        <title>Cup Todo</title>
        <meta name="description" content="Cup Todo App" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

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
        display: drawerContextState._tagsEditAreaFocused || tagsSearchResultPanelContextState.mouseOver
        ? "block" 
        : "none" 
        }}>
        <KanbanTagsResultPanel />
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
          open={ cardCreateOpen }
          handleOnApply={ (task) => handleOnCardCreateDialogApply(task) }
          handleOnClose={ handleOnCardCreateDialogClose } />
      </div>    

      <div>
        <ProjectCreateDialog 
          title="Create Project"
          description="Please enter the project name to create your project."
          open={ projectCreateDialogState.show } 
          showLogout={ projectsContextState._allProjects.length === 0 }
          handleOnProjectCreateClick = { (project) => handleOnProjectCreateClick(project) } 
          handleOnClose={ handleOnProjectCreateDialogClose } 
          handleOnLogout={ () => {} }/>  
      </div>

      <div>
        <KanbanDrawerDeleteDialog 
         label="Delete Project"
         open={ projectDeleteDialogOpen }
         handleOnClose={ handleOnProjectDeleteDialogClose }
         handleOnDelete={ handleOnProjectDeleteDialogDelete } />
      </div>    
    </div>
  )
}

export default Home
