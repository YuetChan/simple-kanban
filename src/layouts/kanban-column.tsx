import React, { useEffect } from "react";

import { useDrop } from "react-dnd";

import { useKanbanTableContext } from "../providers/kanban-table";
import { useTasksCacheContext } from "../providers/tasks-cache";

import { stringToEnum } from "../services/backend-enum-service";
import { updateTask } from "../features/task/services/tasks-service";

import { Task } from "../types/Task";

interface KanbanColumnProps {
  category: string,
  meta: {
    headUUID: string,
    tailUUID: string
  } | undefined,
  
  children: any
}

const KanbanColumn = (props: KanbanColumnProps) => {
  // ------------------ Tasks cache ------------------
  const tasksCacheContextState = useTasksCacheContext().state;

  // ------------------ Table ------------------
  const tableContextDispatch = useKanbanTableContext().Dispatch;

  // ------------------ Kanban column ------------------
  const [ tasks , setTasks ] = React.useState<Array<Task>>([]);

  useEffect(() => {
    if(tasksCacheContextState._allTasks) {
      if(props.category === 'backlog' 
      || props.category === 'todo' 
      || props.category === 'inProgress' 
      || props.category === 'done') {
        setTasks(tasksCacheContextState._allTasks[ props.category ]);
      }
    }
  }, [ tasksCacheContextState._allTasks ]);

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
      tableContextDispatch({
        type: 'table_refresh'
      });
    }).catch(err => {
      console.log(err);
    });
  }

  // ------------------ HTML template ------------------
  return (
    <div 
      ref={ drop }
      style={{
        width: "100%",
        height: "100%"
      }}>
      { props.children }
    </div>
  )
}

export default KanbanColumn;