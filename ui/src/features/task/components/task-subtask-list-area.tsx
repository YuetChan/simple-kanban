import { useState } from "react";
import { Stack, TextField } from "@mui/material";

import KanbanIconTitle from "../../../components/kanban-Icon-title";
import TaskSubtaskCheckbox from "./task-subtask-checkbox";

import FactCheckIcon from '@mui/icons-material/FactCheck';

interface TaskSubtaskListAreaProps {
    subtasks?: Array<string>,
    checkedValues?: Array<string>

    showDelete?: boolean,

    handleOnSubtaskCheck?: Function,
    handleOnSubtaskChange?: Function
}

const TaskSubtaskListArea = (props: TaskSubtaskListAreaProps) => {
    const [ value, setValue ] = useState<string>("");
    const [ checkedValues, setCheckedValues ] = useState<Array<string>>(props.checkedValues || []);

    const [ subtasks, setSubTasks ] = useState<Array<string>>(props.subtasks || []);

    const handleOnValueChange = (e: any) => {
        setValue(e.target.value);
    }

    const handleOnSubtaskEnter = (e: any) => {
        if(e.keyCode === 13) {
            setValue("");

            if(!subtasks.includes(e.target.value)) {
                const newSubtasks = [ ...subtasks,  e.target.value];

                setSubTasks([ ...subtasks,  e.target.value]);

                if(props.handleOnSubtaskChange) {
                    props.handleOnSubtaskChange(newSubtasks, checkedValues)
                }
            }
        }
    }

    const handleOnSubtaskCheck = (checkedValues: Array<string>) => {
        setCheckedValues(checkedValues);

        if(props.handleOnSubtaskCheck) {
            props.handleOnSubtaskCheck(checkedValues)
        }
    }
    
    const handleOnSubtaskDelete = (subtask: string) => {
        const newSubtasks = subtasks.filter(_subtask => _subtask !== subtask);
        const newCheckedValues = checkedValues.filter(checkedValue => checkedValue != subtask)

        setSubTasks([ ... newSubtasks ]);
        setCheckedValues([ ... newCheckedValues ])

        if(props.handleOnSubtaskChange) {
            props.handleOnSubtaskChange(newSubtasks, newCheckedValues)
        }
    }

    return (
        <Stack 
            direction="column" 
            sx={{ padding: "8px"}}
            >
            <KanbanIconTitle 
                icon={<FactCheckIcon/>} 
                label="Subtasks" 
                />

            <Stack 
                direction="row" 
                sx={{ 
                    width: "180px" 
                }}>
                <div style={{
                    padding: "0px 8px 0px 8px"
                    }}>
                <TextField 
                    label="Enter subtasks" 
                    variant="standard" 
                    size="small"

                    value={ value }

                    onKeyDown={ (e: any) => handleOnSubtaskEnter(e) }
                    onChange={ (e: any) => handleOnValueChange(e) }

                    sx={{
                        width: "100%"
                    }}/>
                </div>
            </Stack>

            <TaskSubtaskCheckbox 
                subtaskList={ subtasks }
                checkedValues={ checkedValues } 

                showDelete={ props.showDelete }

                handleOnSubtaskCheck={ (checkedValues: Array<string>) => handleOnSubtaskCheck(checkedValues) } 
                handleOnSubtaskDelete={ (subtask: string) => handleOnSubtaskDelete(subtask) }
                />
        </Stack>
        
    )
}

export default TaskSubtaskListArea;