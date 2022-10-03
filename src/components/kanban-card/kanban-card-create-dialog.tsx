import React, { useEffect } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField } from "@mui/material";

import DatePicker from "react-datepicker";

import { useKanbanCardCreateContext } from '../../providers/kanban-card-create';
import { useKanbanProjectsContext } from '../../providers/kanban-projects';
import { useKanbanUsersContext } from '../../providers/kanban-users';
import { useKanbanDatesContext } from '../../providers/kanban-dates';
import { useKanbanTasksContext } from '../../providers/kanban-tasks';

import { stringToEnum } from '../../apis/backend-enum-api';

import KanbanAutosizeTextarea from "../kanban-common/kanban-autosize-textarea"
import KanbanTagsEditArea from "../kanban-common/kanban-tags-edit-area"
import KanbanCardAssignee from "./kanban-card-assignee-select"
import KanbanCardStatusSelect from "./kanban-card-status-select"
import KanbanCardTagsSearchResultPanel from './kanban-card-create-dialog-tags-search-result-panel';
import KanbanCardPrioritySelect from './kanban-card-priority-select';

const KanbanCardCreateDialog = (props: any) => {
  // ------------------ Project ------------------
  const projectsContextState = useKanbanProjectsContext().state;

  // ------------------ User ------------------
  const usersContextState = useKanbanUsersContext().state;

  // ------------------ Task ------------------
  const tasksContextState = useKanbanTasksContext().state;

  const defaultTask = {
    projectId: '',

    title: '',

    dueAt: new Date().getTime(),
    priority: 'LOW',
    tagList: [],

    note: '',
    description: '',

    subTaskList: [],
    assigneeEmail: 'none',

    taskNode: {
      headUUID: '',
      tailUUID: '',
      status: stringToEnum('backlog')
    }
  };

  const [ task, setTask ] = React.useState(defaultTask);

  useEffect(() => {
    const projectUUID = projectsContextState._activeProject?.projectUUID;

    const allTasks = tasksContextState._allTasks;
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
  }, [ tasksContextState._allTasks ]);

  // ------------------ Card create dialog ------------------
  const cardCreateContextState = useKanbanCardCreateContext().state;
  const cardCreateContextDispatch = useKanbanCardCreateContext().Dispatch;

  const handleOnClose = () => {
    cardCreateContextDispatch({
      type: 'activeTags_update',
      value: []
    });

    setTask(defaultTask);

    props.handleOnClose();
  };

  const handleOnApply = () => {
    props.handleOnApply({
      ...task,
      taskNode: {
        ... task.taskNode,
        projectId: projectsContextState._activeProject?.id
      }
    });

    cardCreateContextDispatch({
      type: 'activeTags_update',
      value: []
    });

    setTask(defaultTask);
  }

  // ------------------ Search result panel ------------------
  const handleOnMouseEnter = () => {
    cardCreateContextDispatch({
      type: 'searchResultPanel_mouseEnter'
    });

    cardCreateContextDispatch({
      type: 'lastFocusedArea_update',
      value: 'tagsEditArea'
    })
  }

  const handleOnMouseLeave = () => {
    cardCreateContextDispatch({
      type: 'searchResultPanel_mouseLeave'
    });

    if(cardCreateContextState._lastFocusedArea === 'tagsEditArea') {
      cardCreateContextState._tagsEditAreaRef.current.focus();
    }

    cardCreateContextDispatch({
      type: 'tagsEditArea_focus'
    });
  }

  // ------------------ Tags filter area ------------------
  const tagsEditAreaRef = React.useRef();

  useEffect(() => {
    cardCreateContextDispatch({
      type: 'tagsEditArea_setRef',
      value: tagsEditAreaRef
    });
  }, [ tagsEditAreaRef ]);

  const handleOnTagsChange = (tags) => {
    setTask({
      ... task, 
      tagList: tags.map(tag => {
        return {
          name: tag
        }
      })
    })

    cardCreateContextDispatch({
      type: 'activeTags_update',
      value: tags
    });
  }

  const handleOnTagsFilterAreaFocus = (e) => {
    cardCreateContextDispatch({
      type: 'tagsEditAreaSearchStr_update',
      value: e.target.value
    });

    cardCreateContextDispatch({
      type: 'tagsEditArea_focus'
    });
  }

  const handleOnTagsFilterAreaBlur = () => {
    cardCreateContextDispatch({
      type: 'tagsEditArea_blur'
    });
  }

  const handleOnTagsFilterAreaChange = (e) => {
    cardCreateContextDispatch({
      type: 'tagsEditAreaSearchStr_update',
      value: e.target.value
    });
  }

  // ------------------ Title ------------------
  const handleOnTitleChange = (e) => {
    setTask({
      ... task,
      title: e.target.value
    });
  }

  // ------------------ Status ------------------
  const handleOnStatusChange = (e) => {
    const allTasks = tasksContextState._allTasks;
    const status = e.target.value;

    if(status === 'backlog') {
      const backlogEnum = stringToEnum('backlog');

      if(allTasks.backlog.length === 0) {
        setTask({
          ... task,
          taskNode: {
            ... task.taskNode,
            status: backlogEnum,
            headUUID: projectsContextState._activeProject.projectUUID.uuid1,
            tailUUID: projectsContextState._activeProject.projectUUID.uuid2
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
            headUUID: projectsContextState._activeProject.projectUUID.uuid3,
            tailUUID: projectsContextState._activeProject.projectUUID.uuid4
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
            headUUID: projectsContextState._activeProject.projectUUID.uuid5,
            tailUUID: projectsContextState._activeProject.projectUUID.uuid6
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
            headUUID: projectsContextState._activeProject.projectUUID.uuid7,
            tailUUID: projectsContextState._activeProject.projectUUID.uuid8
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

  // ------------------ Note ------------------
  const handleOnNoteChange = (e) => {
    setTask({
      ... task,
      note: e.target.value
    })
  }

  // ------------------ Description ------------------
  const handleOnDescriptionChange = (e) => {
    setTask({
      ... task,
      description: e.target.value
    })
  }

  // ------------------ Priority ------------------
  const handleOnPriorityChange = (e) => {
    setTask({
      ... task,
      priority: stringToEnum(e.target.value)
    })
  }

  // ------------------ Due date ------------------
  const datesContextState = useKanbanDatesContext().state;
  const datesContextDispatch = useKanbanDatesContext().Dispatch;

  const handleOnDueDateChange = (date) => {
    setTask({
      ... task,
      dueAt: new Date(date).getTime()
    });

    datesContextDispatch({
      type: 'dueDate_update',
      value: new Date(date)
    })
  }

  // ------------------ Assignee ------------------
  const [ allAssignees, setAllAssignees ] = React.useState([]);

  const handleOnAssigneeChange = (e) => {
    setTask({
      ... task,
      assigneeEmail: e.target.value
    });
  }

  useEffect(() => {
    if(projectsContextState._activeProject) {
      setAllAssignees([
        ... projectsContextState._activeProject.collaboratorList.map(collaborator => collaborator.email),
        usersContextState._loginedUserEmail
      ])
    }
  }, [ projectsContextState._activeProject ]);

  // ------------------ HTML template ------------------
  return (
    <section>
      <Dialog
        open={ props.open }
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
            <div>{ props.label }</div>
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
                onChange={ (e) => handleOnTitleChange(e) } />
  
              <Stack 
                direction="row" 
                spacing={6}>
                <KanbanCardStatusSelect 
                  value={ 'backlog' }
                  handleOnSelectChange={ (e) => handleOnStatusChange(e) } />  
  
                <Stack 
                  direction="column" 
                  justifyContent="flex-end" 
                  spacing={ 0.2 }>
                  <div style={{ fontSize: "13px" }}>Due date</div>

                  <DatePicker 
                    selected={ datesContextState._dueDate } 
                    onChange={ (date) => handleOnDueDateChange(date) } />
                </Stack>
              </Stack>
  
              <div style={{ withd: "140px" }}>
                <KanbanCardPrioritySelect
                  value={ 'low' }
                  handleOnPriorityChange={ (e) => handleOnPriorityChange(e) } />
              </div>
              
              <KanbanTagsEditArea 
                tags={ cardCreateContextState._activeTags } 
                label="Tags"
                disabled={ false } 
                handleOnTextFieldChange={ (e) => handleOnTagsFilterAreaChange(e) }
                handleTagsChange={ (tags) => handleOnTagsChange(tags) } 
                handleOnFocus={ (e) => handleOnTagsFilterAreaFocus(e) } 
                handleOnBlur={ handleOnTagsFilterAreaBlur } 
                inputRef={ tagsEditAreaRef } />  

              {
                cardCreateContextState._tagsEditAreaFocused 
                || cardCreateContextState._searchResultPanelMouseOver
                ? (
                    <section 
                      style={{
                        height: "169px",
                        backgroundColor: "whitesmoke"
                        }}
                      onMouseEnter={ handleOnMouseEnter }
                      onMouseLeave={ handleOnMouseLeave }>
                      { 
                        cardCreateContextState._tagsEditAreaFocused 
                        || (cardCreateContextState._lastFocusedArea === "tagsEditArea" 
                        && cardCreateContextState._searchResultPanelMouseOver === true)
                        ? <KanbanCardTagsSearchResultPanel />
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
                  handleOnTextareaChange={ (e) => handleOnDescriptionChange(e) } />
  
                <KanbanAutosizeTextarea 
                  label="Note" 
                  placeholder="Enter the note" 
                  handleOnTextareaChange={ (e) => handleOnNoteChange(e) }/> 
              </Stack>
  
              <Stack direction="row" justifyContent="start">
                <KanbanCardAssignee  
                  allAssignees={ allAssignees }  
                  handleOnSelectChange={ (e) => handleOnAssigneeChange(e) } />
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

export default KanbanCardCreateDialog;