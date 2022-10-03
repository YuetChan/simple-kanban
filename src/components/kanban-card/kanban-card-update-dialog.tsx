import React, { useEffect } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField, Tooltip } from "@mui/material";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useKanbanProjectsContext } from '../../providers/kanban-projects';
import { useKanbanUsersContext } from '../../providers/kanban-users';
import { useKanbanTasksContext } from '../../providers/kanban-tasks';
import { useKanbanCardUpdateContext } from '../../providers/kanban-card-update';

import { stringToEnum } from '../../apis/backend-enum-api';

import KanbanAutosizeTextarea from "../kanban-common/kanban-autosize-textarea";
import KanbanTagsEditArea from "../kanban-common/kanban-tags-edit-area";
import KanbanCardAssignee from "./kanban-card-assignee-select";
import KanbanCardStatusSelect from "./kanban-card-status-select";
import KanbanCardTagsSearchResultPanel from './kanban-card-update-dialog-tags-search-result-panel';
import KanbanCardPrioritySelect from './kanban-card-priority-select';

const KanbanCardUpdateDialog = (props: any) => {
  // ------------------ Project ------------------
  const projectsContextState = useKanbanProjectsContext().state;

  // ------------------ User ------------------
  const usersContextState = useKanbanUsersContext().state;

  // ------------------ Task ------------------
  const tasksContextState = useKanbanTasksContext().state;

  const [ task, setTask ] = React.useState(props.task);

  const [ oPriority, ] = React.useState(props.task.priority);
  const [ oStatus, ] = React.useState(props.task.taskNode.status);
  const [ oTaskNode, ] = React.useState(props.task.taskNode);

  // ------------------ Values for status and priority selects ------------------
  const getStatus = (status) => {
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
  }

  const getPriority = (priority) => {
    if(priority === stringToEnum('low')) {
      return 'low';
    }

    if(priority === stringToEnum('medium')) {
      return 'medium';
    }

    if(priority === stringToEnum('high')) {
      return 'high';
    }
  }

  const [ status, setStatus ] = React.useState(getStatus(props.task.taskNode.status));
  const [ priority, setPriority ] = React.useState(getPriority(props.task.priority));

  useEffect(() => {
    console.log(task)
  }, [ task ]);

  // ------------------ Card update dialog ------------------
  const cardUpdateContextState = useKanbanCardUpdateContext().state;
  const cardUpdateContextDispatch = useKanbanCardUpdateContext().Dispatch;

  const handleOnClose = () => {
    props.handleOnClose();
  };

  const handleOnApply = () => {
    props.handleOnApply(task);
  };

  const handleOnDelete = () => {
    props.handleOnDelete(task);
  }

  // ------------------ Search result panel ------------------
  const handleOnMouseEnter = () => {
    cardUpdateContextDispatch({
      type: 'searchResultPanel_mouseEnter'
    });

    cardUpdateContextDispatch({
      type: 'lastFocusedArea_update',
      value: 'tagsEditArea'
    })
  }

  const handleOnMouseLeave = () => {
    cardUpdateContextDispatch({
      type: 'searchResultPanel_mouseLeave'
    });

    if(cardUpdateContextState._lastFocusedArea === 'tagsEditArea') {
      cardUpdateContextState._tagsEditAreaRef.current.focus();
    }

    cardUpdateContextDispatch({
      type: 'tagsEditArea_focus'
    });
  }

  // ------------------ Tags filter area ------------------
  const tagsEditAreaRef = React.useRef();

  useEffect(() => {
    cardUpdateContextDispatch({
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
    });
  }

  const handleOnTagsFilterAreaFocus = (e) => {
    cardUpdateContextDispatch({
      type: 'tagsEditAreaSearchStr_update',
      value: e.target.value
    });

    cardUpdateContextDispatch({
      type: 'tagsEditArea_focus'
    });
  }

  const handleOnTagsFilterAreaBlur = () => {
    cardUpdateContextDispatch({
      type: 'tagsEditArea_blur'
    });
  }

  const handleOnTagsFilterAreaChange = (e) => {
    cardUpdateContextDispatch({
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
            headUUID: projectsContextState._activeProject.projectUUID.uuid1,
            tailUUID: projectsContextState._activeProject.projectUUID.uuid2
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
            headUUID: projectsContextState._activeProject.projectUUID.uuid3,
            tailUUID: projectsContextState._activeProject.projectUUID.uuid4
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
            headUUID: projectsContextState._activeProject.projectUUID.uuid5,
            tailUUID: projectsContextState._activeProject.projectUUID.uuid6
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
    const priority = e.target.value;

    setTask({
      ... task,
      priority: stringToEnum(priority)
    });

    setPriority(priority);
  }

  // ------------------ Due date ------------------
  const handleOnDueDateChange = (date) => {
    setTask({
      ... task,
      dueAt: new Date(date).getTime()
    });
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
                <KanbanCardStatusSelect 
                  value={ status }
                  showArchive={ true } 
                  handleOnSelectChange={ (e) => handleOnStatusChange(e) } />  
  
                <Stack 
                  direction="column" 
                  justifyContent="flex-end" 
                  spacing={ 0.2 }>
                  <div style={{ fontSize: "13px" }}>Due date</div>

                  <DatePicker 
                    selected={ task.dueAt } 
                    onChange={ (date) => handleOnDueDateChange(date) } />
                </Stack>
              </Stack>
  
              <div style={{ withd: "140px" }}>
                <KanbanCardPrioritySelect 
                  value={ priority }
                  handleOnPriorityChange={ (e) => handleOnPriorityChange(e) } />
              </div>
              
              <KanbanTagsEditArea 
                tags={ task.tagList.map(tag => tag.name) } 
                label="Tags"
                disabled={ false } 
                handleOnTextFieldChange={ (e) => handleOnTagsFilterAreaChange(e) }
                handleTagsChange={ (tags) => handleOnTagsChange(tags) } 
                handleOnFocus={ (e) => handleOnTagsFilterAreaFocus(e) } 
                handleOnBlur={ handleOnTagsFilterAreaBlur } 
                inputRef={ tagsEditAreaRef } />  

              {
                cardUpdateContextState._tagsEditAreaFocused 
                || cardUpdateContextState._searchResultPanelMouseOver
                ? (
                    <section 
                      style={{
                        height: "169px",
                        backgroundColor: "whitesmoke"
                        }}
                      onMouseEnter={ handleOnMouseEnter }
                      onMouseLeave={ handleOnMouseLeave }>
                      { 
                        cardUpdateContextState._tagsEditAreaFocused 
                        || (cardUpdateContextState._lastFocusedArea === "tagsEditArea" 
                        && cardUpdateContextState._searchResultPanelMouseOver === true)
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
                  value={ task?.description }
                  label="Description" 
                  placeholder="Enter the description"
                  handleOnTextareaChange={ (e) => handleOnDescriptionChange(e) } />
  
                <KanbanAutosizeTextarea 
                  value={ task?.note }
                  label="Note" 
                  placeholder="Enter the note" 
                  handleOnTextareaChange={ (e) => handleOnNoteChange(e) }/> 
              </Stack>
  
              <Stack direction="row" justifyContent="start">
                <KanbanCardAssignee  
                  assignee={ task?.assigneeEmail }
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

export default KanbanCardUpdateDialog;