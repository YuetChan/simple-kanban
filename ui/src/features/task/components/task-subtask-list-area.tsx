import { useState } from "react";
import { Stack, TextField } from "@mui/material";

import KanbanIconTitle from "../../../components/kanban-Icon-title";
import TaskSubtaskCheckbox from "./task-subtask-checkbox";

import FactCheckIcon from '@mui/icons-material/FactCheck';

interface TaskSubtaskListAreaProps {
    subtasks?: Array<string>,
    checkedValues?: Array<string>

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

                handleOnSubtaskCheck={ (checkedValues: Array<string>) => handleOnSubtaskCheck(checkedValues) } 
                />
        </Stack>
        
    )
}

export default TaskSubtaskListArea;