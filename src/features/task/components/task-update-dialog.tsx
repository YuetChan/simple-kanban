import React, { useEffect } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField, Tooltip } from "@mui/material";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useProjectsCacheContext } from '../../../providers/projects-cache';
import { useUserCacheContext } from '../../../providers/user-cache';
import { useTasksCacheContext } from '../../../providers/tasks-cache';
import { useTaskUpdateContext } from '../../../providers/task-update';

import { stringToEnum } from '../../../services/backend-enum-service';

import KanbanAutosizeTextarea from "../../../components/kanban-autosize-textarea";
import TagsEditArea from "../../tag/components/tags-edit-area";
import KanbanCardAssignee from "./task-assignee-select";
import StatusSelect from "./task-status-select";
import TagsSearchResultPanel from './task-update-tags-search-result-panel';
import TaskPrioritySelect from './task-priority-select';

import { Tag } from '../../Tag';
import { Task } from '../../Task';

interface TaskUpdateDialog {
  open?: boolean,
  label?: string,

  task: Task,

  handleOnClose?: Function,
  handleOnApply?: Function,
  handleOnDelete?: Function
}

const TaskUpdateDialog = (props: TaskUpdateDialog) => {
  // ------------------ Projects cache ------------------
  const projectsCacheContextState = useProjectsCacheContext().state;

  // ------------------ User cache ------------------
  const userCacheContextState = useUserCacheContext().state;

  // ------------------ Tasks cache------------------
  const tasksCacheContextState = useTasksCacheContext().state;

  // ------------------ Task uppdate------------------
  const taskUpdateContextState = useTaskUpdateContext().state;
  const taskUpdateContextDispatch = useTaskUpdateContext().Dispatch;

  // ------------------ Task update dialog ------------------
  const [ task, setTask ] = React.useState(props.task);

  const [ oStatus, ] = React.useState(props.task.taskNode.status);
  const [ oTaskNode, ] = React.useState(props.task.taskNode);

  const handleOnClose = () => {
    if(props.handleOnClose) {
      props.handleOnClose();
    } 
  };

  const handleOnApply = () => {
    if(props.handleOnApply) {
      props.handleOnApply(task);
    }
  };

  const handleOnDelete = () => {
    if(props.handleOnDelete) {
      props.handleOnDelete(task);
    }
  }

  const handleOnMouseEnter = () => {
    taskUpdateContextDispatch({
      type: 'searchResultPanel_mouseEnter'
    });

    taskUpdateContextDispatch({
      type: 'lastFocusedArea_update',
      value: 'tagsEditArea'
    })
  }

  const handleOnMouseLeave = () => {
    taskUpdateContextDispatch({
      type: 'searchResultPanel_mouseLeave'
    });

    if(taskUpdateContextState._lastFocusedArea === 'tagsEditArea') {
      taskUpdateContextState._tagsEditAreaRef.current.focus();
    }

    taskUpdateContextDispatch({
      type: 'tagsEditArea_focus'
    });
  }

  // ------------------ Tags filter area ------------------
  const tagsEditAreaRef = React.useRef();

  useEffect(() => {
    taskUpdateContextDispatch({
      type: 'tagsEditArea_setRef',
      value: tagsEditAreaRef
    });
  }, [ tagsEditAreaRef ]);

  const handleOnTagsChange = (tags: Array<string>) => {
    setTask({
      ... task, 
      tagList: tags.map(tag => {
        return {
          name: tag
        }
      })
    });
  }

  const handleOnTagsFilterAreaFocus = (e: any) => {
    taskUpdateContextDispatch({
      type: 'tagsEditAreaSearchStr_update',
      value: e.target.value
    });

    taskUpdateContextDispatch({
      type: 'tagsEditArea_focus'
    });
  }

  const handleOnTagsFilterAreaBlur = () => {
    taskUpdateContextDispatch({
      type: 'tagsEditArea_blur'
    });
  }

  const handleOnTagsFilterAreaChange = (e: any) => {
    taskUpdateContextDispatch({
      type: 'tagsEditAreaSearchStr_update',
      value: e.target.value
    });
  }

  // ------------------ Title ------------------
  const handleOnTitleChange = (e: any) => {
    setTask({
      ... task,
      title: e.target.value
    });
  }

  // ------------------ Status ------------------
  const getStatus = (status: string): string => {
    if(status === stringToEnum('backlog')) {
      return 'backlog';
    }

    if(status === stringToEnum('todo')) {
      return 'todo';
    }

    if(status === stringToEnum('inProgress')) {
      return 'inProgress';
    }

    if(status === stringToEnum('done')) {
      return 'done';
    }

    return 'backlog';
  }

  const [ status, setStatus ] = React.useState(
    props.task.taskNode.status
    ? getStatus(props.task.taskNode.status) 
    : 'backlog');

  const handleOnStatusChange = (e: any) => {
    const allTasks = tasksCacheContextState._allTasks;
    const status = e.target.value;

    if(stringToEnum(status) === oStatus) {
      setTask({
        ...task,
        taskNode: oTaskNode
      });

      setStatus(status);
      return;
    }

    if(status === 'backlog') {
      const backlogEnum = stringToEnum('backlog');

      if(allTasks.backlog.length === 0) {
        setTask({
          ... task,
          taskNode: {
            ... task.taskNode,
            status: backlogEnum,
            headUUID: projectsCacheContextState._activeProject.projectUUID.uuid1,
            tailUUID: projectsCacheContextState._activeProject.projectUUID.uuid2
          }
        });
      }else {
        setTask({
          ... task,
          taskNode: {
            ... task.taskNode,
            status: backlogEnum,
            headUUID: allTasks.backlog[0].taskNode.headUUID,
            tailUUID: allTasks.backlog[0].id
          }
        });
      }
    }

    if(status === 'todo') {
      const todoEnum = stringToEnum('todo');

      if(allTasks.todo.length === 0) {
        setTask({
          ... task,
          taskNode: {
            ... task.taskNode,
            status: todoEnum,
            headUUID: projectsCacheContextState._activeProject.projectUUID.uuid3,
            tailUUID: projectsCacheContextState._activeProject.projectUUID.uuid4
          }
        });
      }else {
        setTask({
          ... task,
          taskNode: {
            ... task.taskNode,
            status: todoEnum,
            headUUID: allTasks.todo[0].taskNode.headUUID,
            tailUUID: allTasks.todo[0].id
          }
        });
      }
    }

    if(status === 'inProgress') {
      const inProgressEnum = stringToEnum('inProgress');

      if(allTasks.inProgress.length === 0) {
        setTask({
          ... task,
          taskNode: {
            ... task.taskNode,
            status: inProgressEnum,
            headUUID: projectsCacheContextState._activeProject.projectUUID.uuid5,
            tailUUID: projectsCacheContextState._activeProject.projectUUID.uuid6
          }
        });
      }else {
        setTask({
          ... task,
          taskNode: {
            ... task.taskNode,
            status: inProgressEnum,
            headUUID: allTasks.inProgress[0].taskNode.headUUID,
            tailUUID: allTasks.inProgress[0].id
          }
        });
      }
    }

    if(status === 'done') {
      const doneEnum = stringToEnum('done');

      if(allTasks.done.length === 0) {
        setTask({
          ... task,
          taskNode: {
            ... task.taskNode,
            status: doneEnum,
            headUUID: projectsCacheContextState._activeProject.projectUUID.uuid7,
            tailUUID: projectsCacheContextState._activeProject.projectUUID.uuid8
          }
        })
      }else {
        setTask({
          ... task,
          taskNode: {
            ... task.taskNode,
            status: doneEnum,
            headUUID: allTasks.done[0].taskNode.headUUID,
            tailUUID: allTasks.done[0].id
          }
        });
      }
    }

    if(status === 'archive') {
      const archiveEnum = stringToEnum('archive');

      setTask({
        ... task,
        taskNode: {
          ... task.taskNode,
          status: archiveEnum,
        }
      });
    }

    setStatus(status);
  }

  // ------------------ Note ------------------
  const handleOnNoteChange = (e: any) => {
    setTask({
      ... task,
      note: e.target.value
    })
  }

  // ------------------ Description ------------------
  const handleOnDescriptionChange = (e: any) => {
    setTask({
      ... task,
      description: e.target.value
    })
  }

  // ------------------ Priority ------------------
  const getPriority = (priority: string): string => {
    if(priority === stringToEnum('low')) {
      return 'low';
    }

    if(priority === stringToEnum('medium')) {
      return 'medium';
    }

    if(priority === stringToEnum('high')) {
      return 'high';
    }

    return 'low';
  }

  const [ priority, setPriority ] = React.useState(
    props.task.priority
    ? getPriority(props.task.priority)
    : 'low');

  const handleOnPriorityChange = (e: any) => {
    const priority = e.target.value;

    setTask({
      ... task,
      priority: stringToEnum(priority)
    });

    setPriority(priority);
  }

  // ------------------ Due date ------------------
  const handleOnDueDateChange = (date: Date) => {
    setTask({
      ... task,
      dueAt: new Date(date).getTime()
    });
  }

  // ------------------ Assignee ------------------
  const [ allAssignees, setAllAssignees ] = React.useState<Array<string>>([]);

  const handleOnAssigneeChange = (e: any) => {
    setTask({
      ... task,
      assigneeEmail: e.target.value
    });
  }

  useEffect(() => {
    if(projectsCacheContextState._activeProject) {
      setAllAssignees([
        ... projectsCacheContextState._activeProject.collaboratorList.map(collaborator => collaborator.email),
        userCacheContextState._loginedUserEmail
      ])
    }
  }, [ projectsCacheContextState._activeProject ]);

  // ------------------ Html template ------------------
  return (
    <section>
      <Dialog
        open={ props.open? props.open : false }
        onClose={ handleOnClose }
        scroll={ "paper" }
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              minWidth: "300px",
              width: "100%"
            },
          },
        }}>
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between">
            <div>{ props.label? props.label : "" }</div>
            <Tooltip title="Permanently delete task">
              <Button 
                color="error" 
                variant="outlined"
                onClick={ handleOnDelete }>
                Delete
              </Button>
            </Tooltip>

          </Stack>
        </DialogTitle>
  
        <DialogContent dividers={ true }>
          <DialogContentText
            tabIndex={ -1 }
            sx={{ marginBottom:"12px" }}>
            <Stack 
              direction="column" 
              spacing={ 1.5 }>
              <TextField 
                label="Title" 
                variant="standard"
                value={ task?.title } 
                sx={{ marginBottom: "12px" }}
                onChange={ (e) => handleOnTitleChange(e) } />
  
              <Stack 
                direction="row" 
                spacing={6}>
                <StatusSelect 
                  value={ status }
                  showArchive={ true } 
                  handleOnSelectChange={ (e: any) => handleOnStatusChange(e) } />  
  
                <Stack 
                  direction="column" 
                  justifyContent="flex-end" 
                  spacing={ 0.2 }>
                  <div style={{ fontSize: "13px" }}>Due date</div>

                  <DatePicker 
                    selected={ task.dueAt } 
                    onChange={ (date: Date) => handleOnDueDateChange(date) } />
                </Stack>
              </Stack>
  
              <div style={{ width: "140px" }}>
                <TaskPrioritySelect 
                  value={ priority }
                  handleOnPriorityChange={ (e: any) => handleOnPriorityChange(e) } />
              </div>
              
              <TagsEditArea 
                tags={ task.tagList.map((tag: Tag) => tag.name) } 
                label="Tags"
                disabled={ false } 
                handleOnTextFieldChange={ (e: any) => handleOnTagsFilterAreaChange(e) }
                handleOnTagsChange={ (tags: Array<string>) => handleOnTagsChange(tags) } 
                handleOnFocus={ (e: any) => handleOnTagsFilterAreaFocus(e) } 
                handleOnBlur={ handleOnTagsFilterAreaBlur } 
                inputRef={ tagsEditAreaRef } />  

              {
                taskUpdateContextState._tagsEditAreaFocused 
                || taskUpdateContextState._searchResultPanelMouseOver
                ? (
                    <section 
                      style={{
                        height: "169px",
                        backgroundColor: "whitesmoke"
                        }}
                      onMouseEnter={ handleOnMouseEnter }
                      onMouseLeave={ handleOnMouseLeave }>
                      { 
                        taskUpdateContextState._tagsEditAreaFocused 
                        || (taskUpdateContextState._lastFocusedArea === "tagsEditArea" 
                        && taskUpdateContextState._searchResultPanelMouseOver === true)
                        ? <TagsSearchResultPanel />
                        : null
                      }
                    </section>
                  )
                : null
              }

              <br></br>

              <Stack 
                direction="column" 
                spacing={ 0.5 }>
                <KanbanAutosizeTextarea 
                  value={ task?.description }
                  label="Description" 
                  placeholder="Enter the description"
                  handleOnTextareaChange={ (e: any) => handleOnDescriptionChange(e) } />
  
                <KanbanAutosizeTextarea 
                  value={ task?.note }
                  label="Note" 
                  placeholder="Enter the note" 
                  handleOnTextareaChange={ (e: any) => handleOnNoteChange(e) }/> 
              </Stack>
  
              <Stack direction="row" justifyContent="start">
                <KanbanCardAssignee  
                  assignee={ task?.assigneeEmail }
                  allAssignees={ allAssignees }  
                  handleOnSelectChange={ (e: any) => handleOnAssigneeChange(e) } />
              </Stack>
            </Stack>
          </DialogContentText>
        </DialogContent>
  
        <DialogActions>
          <Button onClick={ handleOnClose }>Cancel</Button>
          <Button onClick={ handleOnApply }>Apply</Button>
        </DialogActions>
      </Dialog>
    </section>
    )
}

export default TaskUpdateDialog;