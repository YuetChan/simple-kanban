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
import TagsSearchResultPanel from '../src/features/task/components/task-search-tags-search-result-panel';
import TaskAddButton from '../src/features/task/components/task-add-button';
import TaskCreateDialog from '../src/features/task/components/task-create-dialog';
import ProjectCreateDialog from '../src/features/project/components/project-create-dialog';
import KanbanDrawerDeleteDialog from '../src/features/project/components/project-delete-dialog';

import { getCookie } from 'cookies-next';
import jwt_decode from "jwt-decode";

import { Project } from '../src/types/Project';
import { Task } from '../src/types/Task';

const Home: NextPage = () => { 
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

  // ------------------ Tasks cache------------------
  const tasksCacheContextState = useTasksCacheContext().state;

  // ------------------ Tasks search ------------------
  const tasksSearchContextState = useTasksSearchContext().state;

  // ------------------ Task create ------------------
  const taskCreateContextState = useTaskCreateContext().state;

  // ------------------ User cache ------------------
  const userCacheContextState = useUserCacheContext().state;
  const userCacheContextDispatch = useUserCacheContext().Dispatch;

  // ------------------ Table ------------------
  const tableContextDispatch = useKanbanTableContext().Dispatch;
  
  // ------------------ Home ------------------
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
    if(getCookie('jwt')) {
      const decoded = jwt_decode(getCookie("jwt").toString());

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
    deleteProject(projectsCacheContextState._activeProject.id).then(res => {
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

  // ------------------- State logger ------------------------
  useEffect(() => {
    console.log(projectsCacheContextState);
  }, [ projectsCacheContextState ]);

  useEffect(() => {
    console.log(tasksCacheContextState)
  }, [ tasksCacheContextState ])

  useEffect(() => {
    console.log(tasksCacheContextState._allTask)
  }, [ tasksCacheContextState._allTask ])

  useEffect(() => {
    console.log(tasksSearchContextState);
  }, [ tasksSearchContextState ]);

  useEffect(() => {
    console.log(taskCreateContextState);
  }, [ taskCreateContextState ]);

  useEffect(() => {
    console.log(tagsSearchResultPanelContextState);
  }, [ tagsSearchResultPanelContextState ]);

  useEffect(() => {
    console.log(userCacheContextState);
  }, [ userCacheContextState ]);


  // ------------------- Html template ------------------------
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
