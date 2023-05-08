import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useDrop } from "react-dnd";

import { updateTask } from "../features/task/services/tasks-service";
import { stringToEnum } from "../services/backend-enum-service";

import { Task } from "../types/Task";

import { AppState } from "../stores/app-reducers";

import { actions as kanbanTableActions } from "../stores/kanban-table-slice";

interface KanbanColumnProps {
  category: string,
  meta: {
    headUUID: string,
    tailUUID: string
  } | undefined,
  
  children: any
}

const KanbanColumn = (props: KanbanColumnProps) => {
  // ------------------ Dispatch ------------------
  const dispatch = useDispatch();

  // ------------------ Tasks cache ------------------
  const tasksCacheState = useSelector((state: AppState) => state.TasksCache);

  // ------------------ Kanban Table ------------------
  const { refreshTable } = kanbanTableActions;

  // ------------------ Kanban column ------------------
  const [ tasks , setTasks ] = React.useState<Array<Task>>([]);

  useEffect(() => {
    if(tasksCacheState._allTasks) {
      if(props.category === 'backlog' 
      || props.category === 'todo' 
      || props.category === 'inProgress' 
      || props.category === 'done') {
        setTasks(tasksCacheState._allTasks[ props.category ]);
      }
    }
  }, [ tasksCacheState._allTasks ]);

  const [ , drop ] = useDrop(() => {
    return { 
      accept: 'card',
      drop: (item: Task, monitor) => {
        if(!monitor.didDrop() && props.meta) {
          const statusEnum = stringToEnum(props.category);

          if(item.taskNode.status !== statusEnum) {
            if(tasks.length === 0 ) {
              const updatedTask = {
                ... item,
                taskNode: {
                  ... item.taskNode,
                  headUUID: props.meta.headUUID,
                  tailUUID: props.meta.tailUUID,
                  status: statusEnum
                }
              }
              
              updateTaskAndRefresh(updatedTask);
            }else {
              const bottomTask = tasks[ tasks.length - 1 ];
              const updatedTask = {
                ... item,
                taskNode: {
                  ... item.taskNode,
                  headUUID: bottomTask.id,
                  tailUUID: bottomTask.taskNode.tailUUID,
                  status: statusEnum
                }
              }

              updateTaskAndRefresh(updatedTask);
            }
          }else {
            if(tasks.length !== 0 && tasks.length !== 1) {
              const bottomTask = tasks[ tasks.length - 1 ];
              
              if(bottomTask.id === item.id) {
                return;
              }

              const updatedTask = {
                ... item,
                taskNode: {
                  ... item.taskNode,
                  headUUID: bottomTask.id,
                  tailUUID: bottomTask.taskNode.tailUUID,
                  status: statusEnum
                }
              }

              updateTaskAndRefresh(updatedTask);
            }
          }
        }
      }
    }
  }, [ tasks, props.meta ]);
  
  const updateTaskAndRefresh = (task: Task) => {
    updateTask(task).then(res => {
      dispatch(refreshTable());
    }).catch(err => {
      console.log(err);
    });
  }

  // ------------------ HTML template ------------------
  return (
    <div 
      style={{
        width: "100%",
        height: "100%"
      }}
      ref={ drop } >
      { props.children }
    </div>
  )
}

export default KanbanColumn;