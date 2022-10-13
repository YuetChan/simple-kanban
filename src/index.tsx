import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';

import reportWebVitals from './reportWebVitals';

import { DndProvider } from 'react-dnd';
import { ProjectDeleteDialogProvider } from './providers/project-delete-dialog';
import { ProjectCreateDialogProvider } from './providers/project-create-dialog';
import { TaskUpdateProvider } from './providers/task-update';
import { KanbanTableProvider } from './providers/kanban-table';
import { TasksSearchProvider } from './providers/tasks-search';
import { DatesCacheProvider } from './providers/dates-cache';
import { TasksCacheProvider } from './providers/tasks-cache';
import { ProjectsCacheProvider } from './providers/projects-cache';
import { TaskCreateProvider } from './providers/task-create';
import { TagsSearchResultPanelProvider } from './providers/tags-search-result-panel';
import { UserCacheProvider } from './providers/user-cache';

import { HTML5Backend } from 'react-dnd-html5-backend';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <DndProvider backend={ HTML5Backend }>
    <KanbanTableProvider>
          <ProjectDeleteDialogProvider>
          <ProjectCreateDialogProvider>
          <TaskCreateProvider>
          <TaskUpdateProvider>
       
          <TasksSearchProvider>
          <DatesCacheProvider>
          <UserCacheProvider>
          <ProjectsCacheProvider>
            <TasksCacheProvider>
            <TagsSearchResultPanelProvider>
    <App />
    </TagsSearchResultPanelProvider>
            </TasksCacheProvider>
          </ProjectsCacheProvider>
          </UserCacheProvider>
          </DatesCacheProvider>
          </TasksSearchProvider>
          </TaskUpdateProvider> 
          </TaskCreateProvider>
          </ProjectCreateDialogProvider>
          </ProjectDeleteDialogProvider>
          </KanbanTableProvider>  
          </DndProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
