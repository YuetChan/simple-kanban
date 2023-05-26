import { configureStore } from "@reduxjs/toolkit";

import { reducer as DatesCacheReducers }  from "../src/stores/dates-cache-slice";
import { reducer as KanbanTableReducers }  from "../src/stores/kanban-table-slice";
import { reducer as KanbanDrawerReducers }  from "../src/stores/kanban-drawer-slice";
import { reducer as ProjectCreateDialogReducers } from "../src/stores/project-create-dialog-slice";
import { reducer as ProjectDeleteDialogReducers } from "../src/stores/project-delete-dialog-slice";
import { reducer as ProjectsCacheReducers } from "../src/stores/projects-cache-slice";
import { reducer as TaskCreateReducers } from "../src/stores/task-create-slice";
import { reducer as TaskUpdateReducers} from "../src/stores/task-update-slice";
import { reducer as TasksCacheReducers} from "../src/stores/tasks-cache-slice";
import { reducer as TasksSearchReducers} from "../src/stores/tasks-search-slice";
import { reducer as UserCacheReducers} from "../src/stores/user-cache-slice";
import { reducer as UiEventsCacheReducers } from "../src/stores/ui-events-cache-slice"

import logger from 'redux-logger'

export const store = configureStore({
  reducer: {
    DatesCache: DatesCacheReducers, 
    
    KanbanTable: KanbanTableReducers, 
    KanbanDrawer: KanbanDrawerReducers, 
    
    ProjectCreateDialog: ProjectCreateDialogReducers, 
    ProjectDeleteDialog: ProjectDeleteDialogReducers, 
    ProjectsCache: ProjectsCacheReducers,
    
    TaskCreate: TaskCreateReducers,
    TaskUpdate: TaskUpdateReducers, 
    TasksSearch: TasksSearchReducers, 
    TasksCache: TasksCacheReducers,
    
    UserCache: UserCacheReducers,
  
    UiEventCache: UiEventsCacheReducers
  },
  
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
})