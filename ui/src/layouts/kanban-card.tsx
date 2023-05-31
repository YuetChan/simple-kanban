import { useDispatch } from "react-redux";

import { Avatar, Card, CardContent, CardActionArea, Stack, Typography } from "@mui/material";

import { updateTask } from "../features/task/services/tasks-service";

import { stringToEnum } from "../services/backend-enum-service";
import { textToAvatar } from "../services/avatar-service";

import TagChip from "../features/tag/components/tag-chip";

import { Task } from "../types/Task";

import { actions as kanbanTableActions } from "../stores/kanban-table-slice";

import { useDrag, useDrop } from "react-dnd";
import { mergeRefs } from "react-merge-refs";

import Moment from "react-moment";

import TaskSubtaskList from "../features/task/components/task-subtask-checkbox";
import KanbanPunchHole from "../components/kanban-punch-hole";

interface KanbanCardProps {
    category: string,
    highlight?: boolean,
    showDescription?: boolean,

    task: Task,

    handleOnCardClick?: Function,

    style?: any
}

const KanbanCard = (props: KanbanCardProps) => {
    // ------------------ Dispatch ------------------
    const dispatch = useDispatch();

    // ------------------ Kanban table ------------------
    const { refreshTable } = kanbanTableActions;

    // ------------------ Kanban card ------------------
    const handleOnCardClick = () => {
        if(props.handleOnCardClick) {
            props.handleOnCardClick(props.task);
        }
    };

    const getColorByPriority = () => {
        const priority = props.task.priority;
        
        if(priority === stringToEnum("low")) {
            return "#7bed9f"
        }

        if(priority === stringToEnum("medium")) {
            return "#ffa502"
        }

        if(priority === stringToEnum("high")) {
            return "#ff6348"
        }
    }

    const handleOnSubtaskCheck = (checkedValues: Array<string>) => {
        const updatedTask = {
            ... props.task,
            subTaskList: props.task.subTaskList.map(subtask => { 
                return {
                    ... subtask,
                    completed: checkedValues.includes(subtask.title)
                } 
            })
        }

        updateTaskAndRefresh(updatedTask)
    }

    const [ , drag ] = useDrag(() => {
        return {
            type: "card",
            item: props.task
        }
    }, [ props.task ]);

    const [ , drop ] = useDrop(() => {
        return { 
            accept: "card",
            drop: (item: Task) => {
                if(item.id !== props.task?.id) {
                    console.log(item)

                    let updatedTask = {
                        ... item
                    }

                    updatedTask = {
                        ... item,
                        taskNode: {
                            ... item.taskNode,
                            headUUID: props.task.taskNode.headUUID,
                            tailUUID: props.task.id,
                            status: stringToEnum(props.category)
                        }
                    }

                    if(props.task?.taskNode.headUUID === item.id) {
                        updatedTask = {
                            ... item,
                            taskNode: {
                                ... item.taskNode,
                                headUUID: props.task.id,
                                tailUUID: props.task.taskNode.tailUUID
                            }
                        }
                    }

                    if(props.task?.taskNode.tailUUID === item.id) {
                        updatedTask = {
                            ... item,
                            taskNode: {
                                ... item.taskNode,
                                headUUID: props.task.taskNode.headUUID,
                                tailUUID: props.task.id,
                            }
                        }
                    }

                    updateTaskAndRefresh(updatedTask);
                }
            }
        }
    }, [ props.task ]);

    const updateTaskAndRefresh = (task: Task): void => {
        updateTask(task).then(res => {
            dispatch(refreshTable());
        }).catch(err => {
            console.log(err);
        });
    }

    // ------------------ Html template ------------------  
    const getAvatarHTML = (value: string) => {
        return (
            <Avatar style={{
                width: "24px",
                height: "24px"}} >
                { textToAvatar(value) }
            </Avatar>
            )
    }

    const getSubtaskCheckboxHTML= (subtasks: Array<string>, checkedValues: Array<string>) => {
        return (
            subtasks.length > 0
            ? (
                <TaskSubtaskList 
                subtaskList={ subtasks } 
                checkedValues={ checkedValues }

                handleOnSubtaskCheck={ handleOnSubtaskCheck }
                />
            ): null
        )
    }

    const getDueAtHTML = (dueAt: number) => {
        return (
            <Typography 
                variant="body2"
                sx={{
                    textAlign: "right",
                    fontSize: "11px"
                }}>
                Due at: &nbsp; 
                <Moment format="YYYY/MM/DD">{ dueAt }</Moment>
            </Typography>
        )
    }

    return (
        <Card 
            ref={ mergeRefs([ drag, drop ]) }

            sx={{ 
                width: "100%",
                position: "relative", 
                borderRadius: "3px",
                
                background: props.highlight? "ghostwhite": getColorByPriority(),

                ... props.style
                }}>

            <KanbanPunchHole />

            {
                getSubtaskCheckboxHTML(
                    props.task.subTaskList.map(subtask => subtask.title), 
                    props.task.subTaskList.filter(subtask => subtask.completed).map(subtask => subtask.title)
                    )
            }           

            <CardActionArea 
                href="javascript:void(0)" 
                onClick={ handleOnCardClick }
                >
                <CardContent sx={{ 
                    padding: "5px",    
                    "&:last-child": { 
                        paddingBottom: "5px" 
                        }}}>
                    <Stack 
                        direction="row"
                        alignItems="start"
                        spacing={ 0.5 } 
                        >
                        <Stack 
                            direction="row" 
                            flexWrap="wrap"
                            spacing={ 0.5 }
                            >
                            {
                                props.task?.tagList.map(tag => <TagChip showDelete={ false } tag={ tag.name } />)
                            }
                        </Stack>
                    </Stack>

                    <div style={{
                        wordBreak: "break-all",
                        whiteSpace: "normal",
                        textAlign: "left",

                        padding: "4px",
                                
                        fontSize: "28px",
                        fontFamily: "'Caveat', cursive",
                        }}>
                        { props.task?.title } 
                    </div>

                    <Stack 
                        direction="row" 
                        alignItems="end"
                        justifyContent="space-between"
                        
                        sx= {{
                            padding: "4px"
                        }}>
                        { getAvatarHTML(props.task.assigneeEmail) }

                        { getDueAtHTML(props.task.dueAt) }    
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default KanbanCard;