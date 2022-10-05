import React, { useEffect } from "react";

import { useDrop } from "react-dnd";

import { useKanbanTableContext } from "../../providers/kanban-table";
import { useKanbanTasksContext } from "../../providers/kanban-tasks";

import { stringToEnum } from "../../apis/backend-enum-api";
import { updateTask } from "../../apis/tasks-api";
import { Task } from "../../features/Task";

interface ColumnProps {
  category: string,
  meta: {
    headUUID: string,
    tailUUID: string
  },
  
  children: any
}

const KanbanColumn = (props: ColumnProps) => {
  // ------------------ Task ------------------
  const tasksContextState = useKanbanTasksContext().state;

  const [ tasks , setTasks ] = React.useState<Array<Task>>([]);

  // ------------------ Table ------------------
  const tableContextDispatch = useKanbanTableContext().Dispatch;

  useEffect(() => {
    setTasks(tasksContextState._allTasks? tasksContextState._allTasks[ props.category ] : []);
  }, [ tasksContextState._allTasks ]);

  // ------------------ DnD ------------------
  const [ , drop ] = useDrop(() => {
    return { 
      accept: 'card',
      drop: (item: Task, monitor) => {
        if(!monitor.didDrop()) {
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
  }, [ tasks ]);
  
  // ------------------ Helper func ------------------
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