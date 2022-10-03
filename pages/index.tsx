import React, { useEffect } from 'react';

import { Stack } from '@mui/material'

import type { NextPage } from 'next';
import Head from 'next/head';

import { useKanbanTagsSearchResultPanelContext } from '../src/providers/kanban-tags-search-result-panel';
import { useKanbanProjectsContext } from '../src/providers/kanban-projects';
import { useKanbanUsersContext } from '../src/providers/kanban-users';
import { useKanbanDrawerContext } from '../src/providers/kanban-drawer';
import { useKanbanProjectCreateDialogContext } from '../src/providers/kanban-project-create-dialog';
import { useKanbanCardCreateContext } from '../src/providers/kanban-card-create';
import { useKanbanTasksContext } from '../src/providers/kanban-tasks';
import { useKanbanTableContext } from '../src/providers/kanban-table';
import { useKanbanProjectDeleteDialogContext } from '../src/providers/kanban-project-delete-dialog';

import { createProject, deleteProject, getProjectById, searchProjectsByUserEmail } from '../src/apis/projects-api';
import { createTask } from '../src/apis/tasks-api';
import { getUserByEmail, getUserSecretById } from '../src/apis/users-api';

import KanbanDrawer from '../src/components/kanban-drawer/kanban-drawer';
import KanbanTable from '../src/components/kanban-table/kanban-table';
import KanbanTagsResultPanel from '../src/components/kanban-tags-search-result-panel';
import KanbanTaskAddButton from '../src/components/kanban-task-add-button';
import KanbanCardCreateDialog from '../src/components/kanban-card/kanban-card-create-dialog';
import KanbanFirstProjectCreateDialog from '../src/components/kanban-project-create-dialog';
import KanbanDrawerDeleteDialog from '../src/components/kanban-project-delete-dialog';

import { getCookie } from 'cookies-next';
import jwt_decode from "jwt-decode";

const Home: NextPage = () => { 
  // ------------------ Auth ------------------
  const [ authed, setAuthed ] = React.useState(false);

  // ------------------ Project ------------------
  const projectsContextState = useKanbanProjectsContext().state;
  const projectsContextDispatch = useKanbanProjectsContext().Dispatch;

  // ------------------ Task ------------------
  const tasksContextState = useKanbanTasksContext().state;

  // ------------------ User ------------------
  const usersContextState = useKanbanUsersContext().state;
  const usersContextDispatch = useKanbanUsersContext().Dispatch;

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
  const drawerContextState = useKanbanDrawerContext().state;

  // ------------------ Table ------------------
  const tableContextDispatch = useKanbanTableContext().Dispatch;

  // ------------------ Card create dialog ------------------
  const cardCreateContextState = useKanbanCardCreateContext().state;

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
  const projectDeleteDialogState = useKanbanProjectDeleteDialogContext().state;
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
  const tagsSearchResultPanelContextState = useKanbanTagsSearchResultPanelContext().state;

  // ------------------ Project create dialog ------------------
  const projectCreateDialogState = useKanbanProjectCreateDialogContext().state;
  const projectCreateDialogDispatch = useKanbanProjectCreateDialogContext().Dispatch;

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
            <KanbanTaskAddButton handleOnClick={ handleOnTaskAddClick }/>
          </div>
        )
        : null
      }  

      <div>
        <KanbanCardCreateDialog 
          label="Create Kanban Card"
          open={ cardCreateOpen }
          handleOnApply={ (task) => handleOnCardCreateDialogApply(task) }
          handleOnClose={ handleOnCardCreateDialogClose } />
      </div>    

      <div>
        <KanbanFirstProjectCreateDialog 
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
