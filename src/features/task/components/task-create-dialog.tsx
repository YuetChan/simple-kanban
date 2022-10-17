import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField } from "@mui/material";

import DatePicker from "react-datepicker";

import { stringToEnum } from '../../../services/backend-enum-service';

import KanbanAutosizeTextarea from "../../../components/kanban-autosize-textarea"
import TagsEditArea from "../../tag/components/tags-edit-area"
import KanbanCardAssignee from "./task-assignee-select"
import StatusSelect from "./task-status-select"
import TagsSearchResultPanel from './task-create-tags-search-result-panel';
import TaskPrioritySelect from './task-priority-select';

import { Task } from '../../../types/Task';

import { AppState } from '../../../stores/app-reducers';

import { actions as taskCreateActions } from "../../../stores/task-create-slice";
import { actions as datesCacheActions } from "../../../stores/dates-cache-slice";

interface TaskCreateDialogProps {
  label?: string,
  open?: boolean,

  handleOnApply?: Function,
  handleOnClose?: Function
}

const TaskCreateDialog = (props: TaskCreateDialogProps) => {
  // ------------------ Dispatch ------------------
  const dispatch = useDispatch();

  // ------------------ Projects cache ------------------
  const projectsCacheContextState = useSelector((state: AppState) => state.ProjectsCache);

  // ------------------ User cache ------------------
  const userCacheContextState = useSelector((state: AppState) => state.UserCache);

  // ------------------ Tasks cache ------------------
  const tasksCacheContextState = useSelector((state: AppState) => state.TasksCache);

  // ------------------ Task create ------------------
  const taskCreateContextState = useSelector((state: AppState) => state.TaskCreate);

  const { 
    updateActiveTags, 
    mouseEnterSearchResultPanel, mouseLeaveSearchResultPanel,

    updateLastFocusedArea, 
    
    focusTagsEditArea,
    blurTagsEditArea,

    setTagsEditAreaRef,

    updateTagsEditAreaSearchStr
  } = taskCreateActions;
 
  // ------------------ Dates cache ------------------
  const datesContextState = useSelector((state: AppState) => state.DatesCache);
  
  const { dueDateUpdate } = datesCacheActions;

  // ------------------ Task create dialog ------------------
  const defaultTask = {
    id: 'pseudo-task-id',
    projectId: '',

    title: '',
    description: '',
    note: '',

    priority: 'LOW',
    dueAt: new Date().getTime(),
    assigneeEmail: 'none',

    tagList: [],
    subTaskList: [],

    taskNode: {
      headUUID: '',
      tailUUID: '',
      status: stringToEnum('backlog'),
      projectId: 'pseudo-project-id'
    }
  };

  const [ task, setTask ] = React.useState<Task>(defaultTask);

  useEffect(() => {
    if(projectsCacheContextState._activeProject) {
      const projectUUID = projectsCacheContextState._activeProject?.projectUUID;

      const allTasks = tasksCacheContextState._allTasks;
      if(allTasks?.backlog.length > 0) {
        setTask({
          ... task,
          taskNode: {
            ... task.taskNode,
            headUUID: allTasks.backlog[0].taskNode.headUUID,
            tailUUID: allTasks.backlog[0].id
          }
        });
      }else {
        setTask({
          ... task,
          taskNode: {
            ... task.taskNode,
            headUUID: projectUUID?.uuid1,
            tailUUID: projectUUID?.uuid2
          }
        });
      }
    }
  }, [ tasksCacheContextState._allTasks ]);

  const handleOnClose = () => {
    dispatch(updateActiveTags([]));

    setTask(defaultTask);

    if(props.handleOnClose) {
      props.handleOnClose();
    }
  };

  const handleOnApply = () => {
    if(props.handleOnApply) {
      props.handleOnApply({
        ...task,
        taskNode: {
          ... task.taskNode,
          projectId: projectsCacheContextState._activeProject?.id
        }
      });
    }

    dispatch(updateActiveTags([]));
    setTask(defaultTask);
  }

  const handleOnMouseEnter = () => {
    dispatch(mouseEnterSearchResultPanel(undefined));
    dispatch(updateLastFocusedArea('tagsEditArea'))
  }

  const handleOnMouseLeave = () => {
    dispatch(mouseLeaveSearchResultPanel());

    if(taskCreateContextState._lastFocusedArea === 'tagsEditArea') {
      taskCreateContextState._tagsEditAreaRef.current.focus();
    }

    dispatch(focusTagsEditArea());
  }

  // ------------------ Tags filter area ------------------
  const tagsEditAreaRef = React.useRef<HTMLInputElement | undefined>(undefined);

  useEffect(() => {
    console.log(tagsEditAreaRef)

    dispatch(setTagsEditAreaRef(tagsEditAreaRef));
  }, [ tagsEditAreaRef ]);

  const handleOnTagsChange = (tags: Array<string>) => {
    setTask({
      ... task, 
      tagList: tags.map(tag => {
        return {
          name: tag
        }
      })
    })

    dispatch(updateActiveTags(tags));
  }

  const handleOnTagsFilterAreaFocus = (e: any) => {
    dispatch(updateTagsEditAreaSearchStr(e.target.value));
    dispatch(focusTagsEditArea());
  }

  const handleOnTagsFilterAreaBlur = () => {
    dispatch(blurTagsEditArea());
  }

  const handleOnTagsFilterAreaChange = (e: any) => {
    dispatch(updateTagsEditAreaSearchStr(e.target.value));
  }

  // ------------------ Title ------------------
  const handleOnTitleChange = (e: any) => {
    setTask({
      ... task,
      title: e.target.value
    });
  }

  // ------------------ Status ------------------
  const handleOnStatusChange = (e: any) => {
    const allTasks = tasksCacheContextState._allTasks;
    const status = e.target.value;

    if(projectsCacheContextState._activeProject) {
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
          })
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
          })
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
          })
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
    }
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
  const handleOnPriorityChange = (e: any) => {
    setTask({
      ... task,
      priority: stringToEnum(e.target.value)
    })
  }

  // ------------------ Due date ------------------
  const handleOnDueDateChange = (date: any) => {
    setTask({
      ... task,
      dueAt: new Date(date).getTime()
    });

    dispatch(dueDateUpdate(new Date(date)));
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

  // ------------------ HTML template ------------------
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
            <div>{ props.label? props.label : ""  }</div>
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
                sx={{ marginBottom: "12px" }}
                onChange={ (e: any) => handleOnTitleChange(e) } />
  
              <Stack 
                direction="row" 
                spacing={ 6 }>
                <StatusSelect 
                  value={ 'backlog' }
                  handleOnSelectChange={ (e: any) => handleOnStatusChange(e) } />  
  
                <Stack 
                  direction="column" 
                  justifyContent="flex-end" 
                  spacing={ 0.2 }>
                  <div style={{ fontSize: "13px" }}>Due date</div>

                  <DatePicker 
                    selected={ datesContextState._dueDate } 
                    onChange={ (date: any) => handleOnDueDateChange(date) } />
                </Stack>
              </Stack>
  
              <div style={{ width: "140px" }}>
                <TaskPrioritySelect
                  value={ 'low' }
                  handleOnPriorityChange={ (e: any) => handleOnPriorityChange(e) } />
              </div>
              
              <TagsEditArea 
                tags={ taskCreateContextState._activeTags } 
                label="Tags"
                disabled={ false } 
                handleOnTextFieldChange={ (e: any) => handleOnTagsFilterAreaChange(e) }
                handleOnTagsChange={ (tags: Array<string>) => handleOnTagsChange(tags) } 
                handleOnFocus={ (e: any) => handleOnTagsFilterAreaFocus(e) } 
                handleOnBlur={ handleOnTagsFilterAreaBlur } 
                inputRef={ tagsEditAreaRef } />  

              {
                taskCreateContextState._tagsEditAreaFocused 
                || taskCreateContextState._searchResultPanelMouseOver
                ? (
                    <section 
                      style={{
                        height: "169px",
                        backgroundColor: "whitesmoke"
                        }}
                      onMouseEnter={ handleOnMouseEnter }
                      onMouseLeave={ handleOnMouseLeave }>
                      { 
                        taskCreateContextState._tagsEditAreaFocused 
                        || (taskCreateContextState._lastFocusedArea === "tagsEditArea" 
                        && taskCreateContextState._searchResultPanelMouseOver === true)
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
                  label="Description" 
                  placeholder="Enter the description"
                  value={ task?.description }
                  handleOnTextareaChange={ (e: any) => handleOnDescriptionChange(e) } />
  
                <KanbanAutosizeTextarea 
                  label="Note" 
                  placeholder="Enter the note" 
                  handleOnTextareaChange={ (e: any) => handleOnNoteChange(e) }/> 
              </Stack>
  
              <Stack direction="row" justifyContent="start">
                <KanbanCardAssignee
                  assignee='none'  
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

export default TaskCreateDialog;