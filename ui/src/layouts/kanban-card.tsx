import { useDispatch } from 'react-redux';

import { Avatar, Card, CardContent, CardActionArea, Stack, Typography } from '@mui/material';

import { truncate } from '../libs/text-lib';

import { updateTask } from '../features/task/services/tasks-service';

import { stringToEnum } from '../services/backend-enum-service';
import { textToAvatar } from '../services/avatar-service';

import TagChip from '../features/tag/components/tag-chip';

import { Task } from '../types/Task';

import { actions as kanbanTableActions } from '../stores/kanban-table-slice';

import { useDrag, useDrop } from 'react-dnd';
import { mergeRefs } from "react-merge-refs";

import Moment from 'react-moment';

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

    const [ , drag ] = useDrag(() => {
        return {
            type: 'card',
            item: props.task
        }
    }, [ props.task ]);

    const [ , drop ] = useDrop(() => {
        return { 
            accept: 'card',
            drop: (item: Task) => {
                if(item.id !== props.task?.id) {
                    const updatedTask = {
                        ... item,
                        taskNode: {
                            ... item.taskNode,
                            headUUID: props.task.taskNode.headUUID,
                            tailUUID: props.task.id,
                            status: stringToEnum(props.category)
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

    const getPriorityHTML = (priority: string) => {
        if(priority === stringToEnum('low')) {
            return (
                <Typography
                    variant="body2"                   
                    sx={{
                        textAlign: "center",
                        fontSize: "11px",
                        color: "green"
                    }}>
                    Low
                </Typography>
            )
        }

        if(priority === stringToEnum('medium')) {
            return (
                <Typography
                    variant="body2"                   
                    sx={{
                        textAlign: "center",
                        fontSize: "11px",
                        color: "blue"
                    }}>
                    Medium
                </Typography>
            )
        }

        if(priority === stringToEnum('high')) {
            return (
                <Typography
                    variant="body2"                   
                    sx={{
                        textAlign: "center",
                        fontSize: "11px",
                        color: "red"
                    }}>
                    High
                </Typography>
            )
        }
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

            {/* Circle ui */}
            <div style={{
                position: "absolute",
                width: "8px",
                height: "8px",
                top: "6px",
                right: "5px",
                boxShadow: "inset 0px 0px 1px rgba(0, 0, 0, 0.2)",
                borderRadius: "100px",
                background: "white"

            }}></div>

            <CardActionArea 
                href="javascript:void(0)" 
                onClick={ handleOnCardClick }
                >
            
                <CardContent sx={{ 
                    padding: "5px",    
                    "&:last-child": { 
                        paddingBottom: "5px" 
                        }}}>
                    <div>
                        <Stack 
                            direction="row"
                            alignItems="start"
                            spacing={ 0.5 } 
                            
                            >
                            <Stack 
                                direction="row" 
                                spacing={ 0.5 }
                                flexWrap="wrap">
                                {
                                    props.task?.tagList.map(tag => <TagChip showDelete={ false } tag={ tag.name }/>)
                                }
                            </Stack>
                        </Stack>
                    </div>

                    <div>
                        <div 
                            style={{
                                wordBreak: "break-all",
                                whiteSpace: "normal",
                                textAlign: "left",

                                padding: "4px",
                                
                                fontSize: "28px",
                                fontFamily: "'Caveat', cursive",
                            }}>
                            { props.task?.title } 
                        </div>

                        {
                            (props.showDescription? props.showDescription : false)
                            ? (               
                                <Typography variant="body2" color="text.secondary">
                                    { truncate(props.task?.description, 100) }
                                </Typography> )
                            : null
                        }
                    </div>

                    <div>
                        <Stack 
                            direction="row" 
                            alignItems="end"
                            justifyContent="space-between"
                            sx= {{
                                padding: "4px"
                            }} 
                            >
                            { getAvatarHTML(props.task.assigneeEmail) }

                            {/* { getPriorityHTML(props.task.priority) } */}

                            { getDueAtHTML(props.task.dueAt) }    
                        </Stack>
                    </div>
                </CardContent>
             </CardActionArea>
        </Card>
    )
}

export default KanbanCard;