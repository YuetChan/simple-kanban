import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField, Tooltip } from "@mui/material";

import { stringToEnum } from "../../../services/backend-enum-service";

import KanbanAutosizeTextarea from "../../../components/kanban-autosize-textarea";
import KanbanCardAssignee from "./task-assignee-select";
import StatusSelect from "./task-status-select";
import TaskPrioritySelect from "./task-priority-select";
import TagsArea from "../../tag/components/tags-area";

import { Task } from "../../../types/Task";
import { Tag } from "../../../types/Tag";

import { AppState } from "../../../stores/app-reducers";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import TaskSubtaskListArea from "./task-subtask-list-area";

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
    const projectsCacheState = useSelector((state: AppState) => state.ProjectsCache);

    // ------------------ User cache ------------------
    const userCacheState = useSelector((state: AppState) => state.UserCache);

    // ------------------ Tasks cache------------------
    const tasksCacheState = useSelector((state: AppState) => state.TasksCache);

    // ------------------ Task update dialog ------------------
    const [ task, setTask ] = React.useState(props.task);

    // prefix 'o' stand for 'original'
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

    // ------------------ Title ------------------
    const handleOnTitleChange = (e: any) => {
        setTask({
            ... task,
            title: e.target.value
        });
    }

    // ------------------ Status ------------------
    const getStatus = (status: string): string => {
        if(status === stringToEnum("backlog")) {
            return "backlog";
        }

        if(status === stringToEnum("todo")) {
            return "todo";
        }

        if(status === stringToEnum("inProgress")) {
            return "inProgress";
        }

        if(status === stringToEnum("done")) {
            return "done";
        }

        return "backlog";
    }

    const [ status, setStatus ] = useState(
        props.task.taskNode.status
        ? getStatus(props.task.taskNode.status) 
        : "backlog");

    const handleOnStatusChange = (e: any) => {
        if(projectsCacheState._activeProject) {
            const allTasks = tasksCacheState._allTasks;
            const status = e.target.value;
  
            if(stringToEnum(status) === oStatus) {
                setTask({
                    ...task,
                    taskNode: oTaskNode
                });
  
                setStatus(status);

                return;
            }
  
            if(status === "backlog") {
                const backlogEnum = stringToEnum("backlog");
  
                if(allTasks.backlog.length === 0) {
                    setTask({
                        ... task,
                        taskNode: {
                            ... task.taskNode,
                            status: backlogEnum,
                            headUUID: projectsCacheState._activeProject.projectUUID.uuid1,
                            tailUUID: projectsCacheState._activeProject.projectUUID.uuid2
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
  
            if(status === "todo") {
                const todoEnum = stringToEnum("todo");
  
                if(allTasks.todo.length === 0) {
                    setTask({
                        ... task,
                        taskNode: {
                            ... task.taskNode,
                            status: todoEnum,
                            headUUID: projectsCacheState._activeProject.projectUUID.uuid3,
                            tailUUID: projectsCacheState._activeProject.projectUUID.uuid4
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
  
            if(status === "inProgress") {
                const inProgressEnum = stringToEnum("inProgress");
  
                if(allTasks.inProgress.length === 0) {
                    setTask({
                        ... task,
                        taskNode: {
                            ... task.taskNode,
                            status: inProgressEnum,
                            headUUID: projectsCacheState._activeProject.projectUUID.uuid5,
                            tailUUID: projectsCacheState._activeProject.projectUUID.uuid6
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
  
            if(status === "done") {
                const doneEnum = stringToEnum("done");
  
                if(allTasks.done.length === 0) {
                    setTask({
                        ... task,
                        taskNode: {
                            ... task.taskNode,
                            status: doneEnum,
                            headUUID: projectsCacheState._activeProject.projectUUID.uuid7,
                            tailUUID: projectsCacheState._activeProject.projectUUID.uuid8
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
  
            if(status === "archive") {
                const archiveEnum = stringToEnum("archive");
  
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
    }

    // ------------------ Note ------------------
    const handleOnNoteChange = (e: any) => {
        setTask({
            ... task,
            note: e.target.value
        });
    }

    // ------------------ Description ------------------
    const handleOnDescriptionChange = (e: any) => {
        setTask({
            ... task,
            description: e.target.value
        });
    }

    // ------------------ Priority ------------------
    const getPriority = (priority: string): string => {
        if(priority === stringToEnum("low")) { 
            return "low"; 
        }
        
        if(priority === stringToEnum("medium")) { 
            return "medium"; 
        }

        if(priority === stringToEnum("high")) { 
            return "high"; 
        }

        return "low";
    }

    const [ priority, setPriority ] = useState(
        props.task.priority
        ? getPriority(props.task.priority)
        : "low");

    const handleOnPriorityChange = (e: any) => {
        const priority = e.target.value;

        setTask({
            ... task,
            priority: stringToEnum(priority)
        });

        setPriority(priority);
    }

    // ------------------ Tag ------------------
    const handleOnTagsChange = (tags: Array<string>) => {
        setTask({
            ... task, 
            tagList: tags.map(tag => {
              return { name: tag }
            })
        });
    }

    // ------------------ Subtask ------------------
    const handleOnSubtaskCheck = (checkedValues: Array<string>) => {
        setTask({
            ... task,
            subTaskList: task.subTaskList.map(subtask => {
                return {
                    title: subtask.title,
                    completed: checkedValues.includes(subtask.title),
                }
            })
        });
    }

    const handleOnSubtaskChange = (subtasks: Array<string>, checkedValues: Array<string>) => {
        setTask({
            ... task,
            subTaskList: subtasks.map(subtask => {
                return {
                    title: subtask,
                    completed: checkedValues.includes(subtask),
                }
            })
        });
    }
        
    // ------------------ Due date ------------------
    const handleOnDueDateChange = (date: Date) => {
        setTask({
            ... task,
            dueAt: new Date(date).getTime()
        });
    }

    const getDueAtInDate = (dueAt: number) => {
        return new Date(dueAt);
    }

    // ------------------ Assignee ------------------
    const [ allAssignees, setAllAssignees ] = useState<Array<string>>([]);

    const handleOnAssigneeChange = (e: any) => {
        setTask({
            ... task,
            assigneeEmail: e.target.value
        });
    }

    useEffect(() => {
        if(projectsCacheState._activeProject) {
            setAllAssignees([
                ... projectsCacheState._activeProject.collaboratorList.map(collaborator => 
                    collaborator.email),
                userCacheState._loginedUserEmail
            ])
        }
    }, [ projectsCacheState._activeProject ]);

    // ------------------ Html template ------------------
    return (
        <Dialog
            open={ props.open? props.open : false }
            scroll={ "paper" }

            onClose={ handleOnClose } 
            >
            <DialogTitle>
                <Stack 
                    direction="row" 
                    justifyContent="space-between"
                    >
                    <div>
                        { props.label? props.label : "" }
                    </div>

                    <Tooltip title="Permanently delete task">
                        <Button 
                            color="error" 
                            variant="outlined"
                            
                            onClick={ handleOnDelete }
                            >
                            Delete
                        </Button>
                    </Tooltip>
                </Stack>
            </DialogTitle>
  
            <DialogContent dividers={ true } >
                <DialogContentText
                    tabIndex={ -1 }

                    sx={{ 
                        marginBottom:"12px" 
                        }}>
                    <Stack 
                        direction="column" 
                        spacing={ 1.5 } 
                        >
                        <TextField 
                            label="Title" 
                            variant="standard"
                            value={ task?.title }

                            onChange={ (e: any) => handleOnTitleChange(e) } 
                                
                            sx={{ 
                                marginBottom: "12px" 
                            }} 
                                
                            inputProps={{
                                style: { 
                                    fontSize: "24px", 
                                    fontFamily: "'Caveat', cursive"
                                }
                            }} />
  
                        <Stack 
                            direction="row" 
                            spacing={ 6 }
                            >
                            <StatusSelect 
                                showArchive={ true } 
                                value={ status }

                                handleOnSelectChange={ (e: any) => handleOnStatusChange(e) } 

                                style={{
                                    width: "120px"
                                }} />  
  
                            <Stack 
                                direction="column" 
                                justifyContent="flex-end" 
                                spacing={ 0.2 }
                                >
                                <div style={{ fontSize: "13px" }}>Due date</div>

                                <DatePicker 
                                    selected={ getDueAtInDate(task.dueAt) } 

                                    onChange={ (date: Date) => handleOnDueDateChange(date) } 
                                    />
                            </Stack>
                        </Stack>
  
                        <TaskPrioritySelect 
                            value={ priority }

                            handleOnPriorityChange={ (e: any) => handleOnPriorityChange(e) }
                                
                            style={{
                                width: "120px"
                            }}/>

                        {
                            projectsCacheState._activeProject?.id
                            ? (
                                <TagsArea 
                                    projectId={ projectsCacheState._activeProject.id } 
                                    tags={ task.tagList.map((tag: Tag) => tag.name) }

                                    handleOnTagsChange={ (tags: Array<string>) => handleOnTagsChange(tags) }
                                    />)
                            : null
                        }

                        <TaskSubtaskListArea 
                            subtasks={ task.subTaskList.map(subtask => subtask.title) } 
                            checkedValues={ task.subTaskList.filter(subtask => subtask.completed).map(subtask => subtask.title) } 

                            handleOnSubtaskCheck={ (checkedValues: Array<string>) => handleOnSubtaskCheck(checkedValues) }

                            handleOnSubtaskChange={ (subtasks: Array<string>, checkedValues: Array<string>) => 
                                handleOnSubtaskChange(subtasks, checkedValues)}
                            />

                        <br></br>

                        <Stack 
                            direction="column" 
                            spacing={ 0.5 }
                            >
                            <KanbanAutosizeTextarea 
                                value={ task?.description }
                                label="Description" 
                                placeholder="Enter the description"

                                handleOnTextareaChange={ (e: any) => handleOnDescriptionChange(e) } 
                                />
  
                            <KanbanAutosizeTextarea 
                                value={ task?.note }
                                label="Note" 
                                placeholder="Enter the note"

                                handleOnTextareaChange={ (e: any) => handleOnNoteChange(e) } 
                                /> 
                        </Stack>
  
                        <Stack direction="row" justifyContent="start" >
                            <KanbanCardAssignee  
                                assignee={ task?.assigneeEmail }
                                allAssignees={ allAssignees }

                                handleOnSelectChange={ (e: any) => handleOnAssigneeChange(e) } 
                                />
                        </Stack>
                    </Stack>
                </DialogContentText>
            </DialogContent>
  
            <DialogActions>
                <Button onClick={ handleOnClose } >Cancel</Button>
                <Button onClick={ handleOnApply } >Apply</Button>
            </DialogActions>
        </Dialog>
    )
}

export default TaskUpdateDialog;