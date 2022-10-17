import {  useDispatch } from 'react-redux';

import { Avatar, Card, CardContent, CardActionArea, Stack, Typography } from '@mui/material';

import { useDrag, useDrop } from 'react-dnd';
import { mergeRefs } from "react-merge-refs";

import Moment from 'react-moment';

import { truncate } from '../libs/text-lib';

import { updateTask } from '../features/task/services/tasks-service';

import { stringToEnum } from '../services/backend-enum-service';
import { textToAvatar } from '../services/avatar-service';

import TagArea from '../features/tag/components/tag-area';

import { Task } from '../types/Task';

import { actions as kanbanTableActions } from '../stores/kanban-table-slice';

interface KanbanCardProps {
  task: Task,

  category: string,
  highlight?: boolean,
  showDescription?: boolean,

  handleOnCardClick?: Function
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
    return <Avatar style={{
      width: "24px",
      height: "24px"}}>
        { textToAvatar(value) }
      </Avatar>
  }

  const getPriorityHTML = (priority: string) => {
    if(priority === stringToEnum('low')) {
      return (
        <Typography                   
          sx={{
            textAlign: "center",
            fontSize: "11px",
            color: "green"
          }} 
          variant="body2">
          Low
        </Typography>
      )
    }

    if(priority === stringToEnum('medium')) {
      return (
        <Typography                   
          sx={{
            textAlign: "center",
            fontSize: "11px",
            color: "blue"
          }} 
          variant="body2">
          Medium
        </Typography>
      )
    }

    if(priority === stringToEnum('high')) {
      return (
        <Typography                   
          sx={{
            textAlign: "center",
            fontSize: "11px",
            color: "red"
          }} 
          variant="body2">
          High
        </Typography>
      )
    }
  }

  const getDueAtHTML = (dueAt: number) => {
    return (
      <Typography 
        sx={{
          textAlign: "right",
          fontSize: "11px"
        }} 
        variant="body2">
        Due at: &nbsp; 
        <Moment format="YYYY/MM/DD">
          { dueAt }
        </Moment>
      </Typography>
    )
  }

  return (
      <Card 
        ref={ mergeRefs([ drag, drop ]) }
        sx={{ width: "100%", background: props.highlight? "#FFA59B": null }}>
        <CardActionArea 
          href="javascript:void(0)" 
          onClick={ handleOnCardClick }>
          <CardContent sx={{ 
            padding: "5px",    
            "&:last-child": { paddingBottom: "5px" }}
            }>
            <div>
              <Stack spacing={ 0.5 } alignItems="start">
                <Stack direction="row" spacing={ 0.5 }>
                  {
                    props.task?.tagList.map(tag => <TagArea showDelete={ false } tag={ tag.name }/>)
                  }
                </Stack>
              </Stack>
            </div>

            <div>
              <Typography 
                variant="body1" 
                style={{
                    wordBreak: "break-all",
                    whiteSpace: "normal",
                    fontWeight: "bold",
                    fontSize: "16px" 
                    }}>
                { props.task?.title } 
              </Typography>

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
                justifyContent="space-between" 
                alignItems="end">
                { getAvatarHTML(props.task.assigneeEmail) }

                { getPriorityHTML(props.task.priority) }

                { getDueAtHTML(props.task.dueAt) }    
              </Stack>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
  )
}

export default KanbanCard;