import React from 'react';

import Moment from 'react-moment';

import { Avatar, Card, CardContent, CardActionArea, Stack, Typography } from '@mui/material';

import { useDrag, useDrop } from 'react-dnd';
import { mergeRefs } from "react-merge-refs";

import { useKanbanTableContext } from '../../providers/kanban-table';

import { updateTask } from '../../apis/tasks-api';
import { truncate } from '../../libs/text-lib';
import { stringToEnum } from '../../apis/backend-enum-api';

import KanbanTagArea from '../kanban-common/kanban-tags-area';
import { textToAvatar } from '../../apis/avatar-api';
import { Task } from '../../features/Task';

interface CardProps {
  task: Task,
  category: string,
  highlight?: boolean,
  showDescription?: boolean,

  handleOnCardClick?: Function
}

const KanbanCard = (props: CardProps) => {
  // ------------------ Table ------------------
  const tableContextDispatch = useKanbanTableContext().Dispatch;

  // ------------------ Card edit dialog ------------------
  const handleOnCardClick = () => {
    if(props.handleOnCardClick) {
      props.handleOnCardClick(props.task);
    }
  };

  // ------------------ DnD ------------------
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
  const getAvatarHTML = (email: string) => {
    return (
      <Avatar
        sx={{ 
          width: "22px",
          height: "22px"
        }}>
        { textToAvatar(email) }
      </Avatar>
    )
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
    console.log(dueAt);
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
            <div className='kanban-card__tag-container'>
              <Stack spacing={ 0.5 } alignItems="start">
                <Stack direction="row" spacing={ 0.5 }>
                  {
                    props.task?.tagList.map(tag => {
                      return (
                        <KanbanTagArea showDelete={ false } tag={ tag.name }/>
                      )
                    })
                  }
                </Stack>
              </Stack>
            </div>

            <div className="kanban-card__text-container">
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

            <div className="kanban-card__meta-container">
              <Stack 
                direction="row" 
                justifyContent="space-between" 
                alignItems="end">
                { getAvatarHTML(props.task?.assigneeEmail) }

                { getPriorityHTML(props.task?.priority) }

                { getDueAtHTML(props.task?.dueAt) }    
              </Stack>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
  )
}

export default KanbanCard;