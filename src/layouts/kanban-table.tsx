import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Stack } from "@mui/material";

import { deleteTask, searchTasksByFilterParams, updateTask } from "../features/task/services/tasks-service";
import { stringToEnum } from "../services/backend-enum-service";

import KanbanColumn from "./kanban-column";
import KanbanCard from "./kanban-card";
import TaskUpdateDialog from "../features/task/components/task-update-dialog";

import { Task } from "../types/Task";

import { AppState } from "../stores/app-reducers";

import { actions as kanbanTableActions } from "../stores/kanban-table-slice";
import { actions as TasksCacheActions } from "../stores/tasks-cache-slice";

interface KanbanTableProps { }

const KanbanTable = (props: KanbanTableProps) => {
  // // ------------------ Dispatch ------------------
  const dispatch = useDispatch();

  // ------------------ Project cache ------------------
  const projectsCacheState = useSelector((state: AppState) => state.ProjectsCache);

  // ------------------ Task cache ------------------
  const tasksState = useSelector((state: AppState) => state.TasksCache);
  const { allTasksUpdate } = TasksCacheActions;

  // ------------------ Tasks search ------------------
  const tasksSearchState = useSelector((state: AppState) => state.TasksSearch);

  // ------------------ Table ------------------
  const tableState = useSelector((state: AppState) => state.KanbanTable);
  const { refreshTable } = kanbanTableActions;

  // ------------------ Task update dialog ------------------
  const [ taskToUpdate, setTaskToUpdate ] = React.useState<Task | undefined >(undefined);

  const handleOnCardClick = (task: Task) => {
    setTaskToUpdate(task);
  }

  const handleOnCardUpdateDialogClose = () => {
    setTaskToUpdate(undefined);
  }

  const handleOnCardUpdateDialogApply = (task: Task) => {
    updateTask(task).then(res => {
      dispatch(refreshTable());
    })

    setTaskToUpdate(undefined);
  }

  const handleOnCardUpdateDialogDelete = (task: Task) => {
    deleteTask(task.id).then(res => {
      dispatch(refreshTable());
    });

    setTaskToUpdate(undefined);
  }

  // ------------------ Meta ------------------
  const [ metaMp, setMetaMp ] = React.useState<Map<string, { headUUID: string, tailUUID: string }> | undefined>(undefined);

  // ------------------ Html util ------------------
  const [ columnMp, setColumnMp ] = React.useState<Map<string, any> | undefined>(undefined);

  useEffect(() => {
    const projectId = projectsCacheState._activeProject?.id;
    if(projectId && metaMp) {
      fetchTasks(projectId, 0);
    }
  }, [ 
    metaMp, 
    tableState,
  ]);

  useEffect(() => {
    const backlogMeta = metaMp?.get('backlog');
    const todoMeta = metaMp?.get('todo');
    const inProgressMeta = metaMp?.get('inProgress');
    const doneMeta = metaMp?.get('done');

    if(backlogMeta && todoMeta && inProgressMeta && doneMeta) {
      const columnMp = new Map();

      const matchPriority = (task: Task) => { return task.priority === stringToEnum(tasksSearchState._activePriority); }
      const matchPriorityAll = () => { return tasksSearchState._activePriority === 'all'; }
  
      const matchTags = (task: Task) => { return tasksSearchState._activeTags.every(t => task.tagList.map(tag => tag.name).includes(t)); }
      const isTagsEmpty = tasksSearchState._activeTags.length === 0;
  
      const matchAssignee = (task: Task) => { return tasksSearchState._activeUserEmails.includes(task.assigneeEmail); }
      const isAssigneeEmpty = tasksSearchState._activeUserEmails.length === 0
      
      const matchAll = (task: Task) => {
        return !(isTagsEmpty && matchPriorityAll() && isAssigneeEmpty) &&  (
          (matchTags(task) && (matchPriorityAll() || matchPriority(task)) && isAssigneeEmpty) 
        || (matchTags(task) && (matchPriorityAll() || matchPriority(task)) && matchAssignee(task))
        );
      }
  
      const backlog = 'backlog';
      const backlogCardStacks = tasksState._allTasks?.backlog.map(task => {
        return getCardStack(<KanbanCard 
          highlight={ matchAll(task) } 
          task={ task } 
          category={ backlog }
          handleOnCardClick={ handleOnCardClick } />)
      });
  
      const todo = 'todo';  
      const todoCardStacks = tasksState._allTasks?.todo.map(task => {
        return getCardStack(<KanbanCard 
          highlight={ matchAll(task) } 
          task={ task } 
          category={ todo }  
          handleOnCardClick={ handleOnCardClick }/>);
      });  
  
      const inProgress = 'inProgress';
      const inProgressCardStacks = tasksState._allTasks?.inProgress.map(task => {
        return getCardStack(<KanbanCard 
          highlight={ matchAll(task) } 
          task={ task } 
          category={ inProgress } 
          handleOnCardClick={ handleOnCardClick }/>);
      });
  
      const done = 'done';  
      const doneCardStacks = tasksState._allTasks?.done.map(task => {
        return getCardStack(<KanbanCard 
          highlight={ matchAll(task) } 
          task={ task } 
          category={ done } 
          handleOnCardClick={ handleOnCardClick }/>);
      });    
  
      columnMp.set('backlog', getColumn(backlogCardStacks, backlog, backlogMeta)); 
      columnMp.set('todo', getColumn(todoCardStacks, todo, todoMeta));
      columnMp.set('inProgress', getColumn(inProgressCardStacks, inProgress, inProgressMeta));
      columnMp.set('done', getColumn(doneCardStacks, done, doneMeta));
      
      setColumnMp(columnMp);
    }
  }, [ 
    tasksState._allTasks, 
    tasksSearchState._activeTags, 
    tasksSearchState._activePriority,
    tasksSearchState._activeUserEmails 
  ]);
  
  useEffect(() => {
    if(projectsCacheState._activeProject) {
      const projectUUID = projectsCacheState._activeProject.projectUUID;
      const metaMp = new Map();
    
      metaMp.set('backlog', {
        headUUID: projectUUID.uuid1,
        tailUUID: projectUUID.uuid2
      });
  
      metaMp.set('todo', {
        headUUID: projectUUID.uuid3,
        tailUUID: projectUUID.uuid4
      });
  
      metaMp.set('inProgress', {
        headUUID: projectUUID.uuid5,
        tailUUID: projectUUID.uuid6
      });
  
      metaMp.set('done', {
        headUUID: projectUUID.uuid7,
        tailUUID: projectUUID.uuid8
      });
  
      setMetaMp(metaMp);
    }
  }, [ projectsCacheState._activeProject ]);

  // ------------------ Task utils ------------------
  const fetchTasks = (projectId: string, page: number) => {
    const timeout = setTimeout(() => {  
      if(projectsCacheState._activeProject) {
        searchTasksByFilterParams(page, 5000,
        projectId, 
        tasksSearchState._activeTags).then(res => {
          const tasks = res.tasks;

          const backlogMeta = metaMp?.get('backlog');
          const todoMeta = metaMp?.get('todo');
          const inProgressMeta = metaMp?.get('inProgress');
          const doneMeta = metaMp?.get('done');

          if(backlogMeta && todoMeta && inProgressMeta && doneMeta) {
            dispatch(allTasksUpdate({
              backlog: extractTasksForCategory(tasks, 'backlog', backlogMeta),
              todo: extractTasksForCategory(tasks, 'todo', todoMeta),
              inProgress: extractTasksForCategory(tasks, 'inProgress', inProgressMeta),
              done: extractTasksForCategory(tasks, 'done', doneMeta)
            }));
          }
        });
      }
    });
    
    return () => clearTimeout(timeout);
  }

  const extractTasksForCategory = (tasks: Array<Task>, category: string, 
    meta: { headUUID: string, tailUUID: string }) => {
    const unsortedTasks = tasks.filter(task => task.taskNode.status === stringToEnum(category));

    if(tasks.length > 0) {
      let headTask = undefined;
      const idTaskMp = new Map();
  
      unsortedTasks.forEach(task => {
        if(task.taskNode.headUUID === meta.headUUID) {
          headTask = task;
        }
    
        idTaskMp.set(task.id, task);
      });
  
      const sortedTasks = [];
  
      if(unsortedTasks.length > 0 && headTask) {
        sortedTasks.push(headTask);
  
        let nthTask = headTask as Task;
  
        while(nthTask.taskNode.tailUUID !== meta.tailUUID) {
          nthTask = idTaskMp.get(nthTask.taskNode.tailUUID);
          sortedTasks.push(nthTask);
        }
      }
  
      return sortedTasks;
    }

    return [];
  }

  // ------------------ Style ------------------
  const cardContainerStyle = { margin: "4px" }

  const columnStyle = {
    height: "calc(100vh - 33px)",
    overflow: "auto"
  }

  const columnContainerStyle = {
    flexBasis: "25%",
    borderRight: "1px solid #9e9e9e"
  }

  // ------------------ HTML template ------------------
  const getHeader = (header: any) => {
    return (
      <div style={{
        padding: "2px 2px 2px 8px",
        borderBottom: "1px solid #9e9e9e"
        }}>
        <b>{ header }</b>
      </div>
    )
  }

  const getColumn = (children: any, category: string, meta: { headUUID: string, tailUUID: string }) => {
    return (
      <div style={ columnStyle }>
        <KanbanColumn 
          children={ children } 
          category={ category } 
          meta={ meta } />
      </div>
    )
  }

  const getCardStack = (children: any) => {
    return (
      <Stack 
        direction="column" 
        style={ cardContainerStyle }>
        <div style={{
          width: "70%",
          minWidth: "200px"
          }}>
          { children }
        </div>
      </Stack> 
    )
  }

  return (
    <Stack 
      direction="row" 
      style={{
        background: "whitesmoke",
        width: "100%",
        }}>
      <div style={ columnContainerStyle }>
        {
          getHeader("📇 Backlog")
        }

        {
          columnMp?.get('backlog')
        } 
      </div>

      <div style={ columnContainerStyle }>
        {
          getHeader("📝 Todo")
        }

        {
          columnMp?.get('todo')
        } 
      </div>

      <div style={ columnContainerStyle }>
        {
          getHeader("⏳ In Progress")
        }

        {
          columnMp?.get('inProgress')
        }   
      </div>

      <div style={ columnContainerStyle }>
        {
          getHeader("✅ Done")
        }

        {
          columnMp?.get('done')
        } 
      </div>

      {
        taskToUpdate?
        <TaskUpdateDialog 
          label="Edit Kanban Card"
          open={ true }
          task={ taskToUpdate }
          handleOnClose={ handleOnCardUpdateDialogClose }
          handleOnApply={ handleOnCardUpdateDialogApply }
          handleOnDelete={ handleOnCardUpdateDialogDelete } />
        : null

      }
    </Stack>
  )
}

export default KanbanTable;