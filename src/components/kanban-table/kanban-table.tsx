import React, { useEffect } from "react";

import { Stack } from "@mui/material";

import { useKanbanDatesContext } from "../../providers/kanban-dates";
import { useKanbanDrawerContext } from "../../providers/kanban-drawer";
import { useKanbanProjectsContext } from "../../providers/kanban-projects";
import { useKanbanTasksContext } from "../../providers/kanban-tasks";
import { useKanbanTableContext } from "../../providers/kanban-table";

import { deleteTask, searchTasksByFilterParams, updateTask } from "../../apis/tasks-api";
import { stringToEnum } from "../../apis/backend-enum-api";

import KanbanColumn from "./kanban-column";
import KanbanCard from "../kanban-card/kanban-card";
import KanbanCardUpdateDialog from "../kanban-card/kanban-card-update-dialog";

const KanbanTable = () => {
  // ------------------ Project ------------------
  const projectsContextState = useKanbanProjectsContext().state;

  // ------------------ Task ------------------
  const tasksContextState = useKanbanTasksContext().state;
  const tasksContextDispatch = useKanbanTasksContext().Dispatch;

  // ------------------ Table ------------------
  const tableContextState = useKanbanTableContext().state;
  const tableContextDispatch = useKanbanTableContext().Dispatch;

  // ------------------ Card update dialog ------------------
  const [ taskToUpdate, setTaskToUpdate ] = React.useState(undefined);

  const handleOnCardClick = (task) => {
    setTaskToUpdate(task);
  }

  const handleOnCardUpdateDialogClose = () => {
    setTaskToUpdate(undefined);
  }

  const handleOnCardUpdateDialogApply = (task) => {
    updateTask(task).then(res => {
      tableContextDispatch({
        type: 'table_refresh'
      });
    })

    setTaskToUpdate(undefined);
  }

  const handleOnCardUpdateDialogDelete = (task) => {
    deleteTask(task.id).then(res => {
      tableContextDispatch({
        type: 'table_refresh'
      });
    });

    setTaskToUpdate(undefined);
  }

  // ------------------ Drawer ------------------
  const drawerContextState = useKanbanDrawerContext().state;

  // ------------------ Date ------------------
  const datesContextState = useKanbanDatesContext().state;

  // ------------------ Meta ------------------
  const [ metaMp, setMetaMp ] = React.useState(undefined);

  // ------------------ HTML ------------------
  const [ columnMp, setColumnMp ] = React.useState(undefined);

  useEffect(() => {
    if(metaMp) {
      fetchTasks(0);
    }
  }, [ 
    metaMp, 
    tableContextState,
  ]);

  useEffect(() => {
    const columnMp = new Map();

    const matchPriority = (task) => {
      return task.priority === stringToEnum(drawerContextState._activePriority);
    }

    const matchPriorityAll = () => {
      return drawerContextState._activePriority === 'all';
    }

    const matchTags = (task) => {
      return drawerContextState._activeTags.every(t => task.tagList.map(tag => tag.name).includes(t));
    }

    const isTagsEmpty = drawerContextState._activeTags.length === 0;

    const matchAssignee = (task) => {
      return drawerContextState._activeUserEmails.includes(task.assigneeEmail);
    }

    const isAssigneeEmpty = drawerContextState._activeUserEmails.length === 0;
    
    const matchAll = (task) => {
      return !(isTagsEmpty && matchPriorityAll() && isAssigneeEmpty) &&  (
        (matchTags(task) && (matchPriorityAll() || matchPriority(task)) && isAssigneeEmpty) 
      || (matchTags(task) && (matchPriorityAll() || matchPriority(task)) && matchAssignee(task))
      );
    }

    const backlog = 'backlog';
    const backlogCardStacks = tasksContextState._allTasks?.backlog.map(task => {
      return (getCardStack(<KanbanCard 
        highlight={ matchAll(task) } 
        task={ task } 
        category={ backlog }
        handleOnCardClick={ handleOnCardClick } />))
    });

    const todo = 'todo';  
    const todoCardStacks = tasksContextState._allTasks?.todo.map(task => {
      return (getCardStack(<KanbanCard 
        highlight={ matchAll(task) } 
        task={ task } 
        category={ todo }  
        handleOnCardClick={ handleOnCardClick }/>));
    });  

    const inProgress = 'inProgress';
    const inProgressCardStacks = tasksContextState._allTasks?.inProgress.map(task => {
      return (getCardStack(<KanbanCard 
        highlight={ matchAll(task) } 
        task={ task } 
        category={ inProgress } 
        handleOnCardClick={ handleOnCardClick }/>));
    });

    const done = 'done';  
    const doneCardStacks = tasksContextState._allTasks?.done.map(task => {
      return (getCardStack(<KanbanCard 
        highlight={ matchAll(task) } 
        task={ task } 
        category={ done } 
        handleOnCardClick={ handleOnCardClick }/>))
    });    

    columnMp.set('backlog', getColumn(backlogCardStacks, backlog)); 
    columnMp.set('todo', getColumn(todoCardStacks, todo));
    columnMp.set('inProgress', getColumn(inProgressCardStacks, inProgress));
    columnMp.set('done', getColumn(doneCardStacks, done));
    
    setColumnMp(columnMp);
  }, [ 
    tasksContextState._allTasks, 
    drawerContextState._activeTags, 
    drawerContextState._activePriority,
    drawerContextState._activeUserEmails 
  ]);
  
  useEffect(() => {
    if(projectsContextState._activeProject) {
      const projectUUID = projectsContextState._activeProject.projectUUID;
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
  }, [ 
    projectsContextState._activeProject, 
    drawerContextState._activeTags, 
    datesContextState._fromDate,
    datesContextState._toDate,
  ]);

  // ------------------ Util func ------------------
  const fetchTasks = (page) => {
    const timeout = setTimeout(() => {  
      if(projectsContextState._activeProject) {
        searchTasksByFilterParams(page, 5000,
        projectsContextState._activeProject.id, 
        drawerContextState._activeTags).then(res => {
          const tasks = res.tasks;

          tasksContextDispatch({
            type: "allTasks_update",
            value: {
              backlog: extractTasksForCategory(tasks, 'backlog'),
              todo: extractTasksForCategory(tasks, 'todo'),
              inProgress: extractTasksForCategory(tasks, 'inProgress'),
              done: extractTasksForCategory(tasks, 'done')
            }
          });
        });
      }
    });
    
    return () => clearTimeout(timeout);
  }

  const extractTasksForCategory = (tasks, category) => {
    const unsortedTasks = tasks.filter(task => task.taskNode.status === stringToEnum(category));
    console.log(metaMp)
    
    const meta = metaMp.get(category);

    let headTask = undefined;
    const idTaskMp = new Map();

    unsortedTasks.forEach(task => {
      if(task.taskNode.headUUID === meta.headUUID) {
        headTask = task;
      }
  
      idTaskMp.set(task.id, task);
    });

    const sortedTasks = [];

    if(unsortedTasks.length > 0) {
      sortedTasks.push(headTask);

      let nthTask = headTask;

      console.log(category, unsortedTasks)
      while(nthTask.taskNode.tailUUID !== meta.tailUUID) {
        nthTask = idTaskMp.get(nthTask.taskNode.tailUUID);
        sortedTasks.push(nthTask);
      }
    }

    return sortedTasks;
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
  const getHeader = (header) => {
    return (
      <div style={{
        padding: "2px 2px 2px 8px",
        borderBottom: "1px solid #9e9e9e"
        }}>
        <b>{ header }</b>
      </div>
    )
  }

  const getColumn = (children, category) => {
    return (
      <div style={ columnStyle }>
        <KanbanColumn 
          children={ children } 
          category={ category } 
          meta={ metaMp?.get(category) }/>
      </div>
    )
  }

  const getCardStack = (children) => {
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
        <KanbanCardUpdateDialog 
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