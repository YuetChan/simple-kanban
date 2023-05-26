import { combineReducers } from "redux";

import { reducer as DatesCacheReducers }  from "./dates-cache-slice";
import { reducer as KanbanTableReducers }  from "./kanban-table-slice";
import { reducer as ProjectCreateDialogReducers } from "./project-create-dialog-slice";
import { reducer as ProjectDeleteDialogReducers } from "./project-delete-dialog-slice";
import { reducer as ProjectsCacheReducers } from "./projects-cache-slice";
import { reducer as TaskCreateReducers } from "./task-create-slice";
import { reducer as TaskUpdateReducers} from "./task-update-slice";
import { reducer as TasksCacheReducers} from "./tasks-cache-slice";
import { reducer as TasksSearchReducers} from "./tasks-search-slice";
import { reducer as UserCacheReducers} from "./user-cache-slice";

import { Project } from "../types/Project";
import { Task } from "../types/Task";

export interface AppState {
    DatesCache: {
      _fromDate: Date,
      _toDate: Date,
      _dueDate: Date
    },

    KanbanTable: { },
    KanbanDrawer: {},

    ProjectCreateDialog: { show: boolean },
    ProjectDeleteDialog: { show: boolean },

    ProjectsCache: {
      _activeProject: Project | undefined,

      _allShareProjects: Array<Project>,
      _allNotProjects: Array<Project>,
      _allProjects: Array<Project>
    },

    TaskCreate: {
      _activeTags: Array<string>,
  
      _task: Task | undefined,
    },

    TaskUpdate: {  
      _task: Task | undefined,
    },

    TasksSearch: {
      _activeTab: string,

      _activeTags: Array<string>,
      _activePriorities: Array<string>,
      _activeUserEmails: Array<string>
    },

    TasksCache: {
      _allTasks: {
        "backlog": Array<Task>,
        "todo": Array<Task>,
        "inProgress": Array<Task>,
        "done": Array<Task>
      }
    },

    UserCache: {
      _loginedUserEmail: string,
    },

    CrudEventCache: {
      crudEvent: { }
    }
}

export const appReducers = combineReducers({
  DatesCacheReducers, 
  KanbanTableReducers, 
  ProjectCreateDialogReducers, ProjectDeleteDialogReducers, ProjectsCacheReducers,
  TaskCreateReducers,TaskUpdateReducers, TasksSearchReducers, 
  TasksCacheReducers,
  UserCacheReducers
});
