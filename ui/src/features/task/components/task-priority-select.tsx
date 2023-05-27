import React, { useEffect } from "react";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface TaskPrioritySelectProps {
    value: string,
    
    handleOnSelectChange: Function,

    style?: any
}

const TaskPrioritySelect = (props: TaskPrioritySelectProps) => {
    // ------------------ Priority select ------------------
    const [ priority, setPriority ] = React.useState(props.value);

    const handleOnPrioritySelect = (e: any) =>{
        setPriority(e.target.value);
    
        props.handleOnSelectChange(e);
    }

    useEffect(() => {
        setPriority(props.value);
    }, []);

    // ------------------ Html template ------------------
    return (
        <FormControl 
            variant="standard"
             
            sx={{ 
                ... props?.style, 
            }} >
            <InputLabel id="priority-select">Priority</InputLabel>
      
            <Select
                labelId="priority-select"
                value={ priority }
                
                onChange={ handleOnPrioritySelect }
                >
                <MenuItem value={ "low" } >Low</MenuItem>
                
                <MenuItem value={ "medium" }>Medium</MenuItem>
                
                <MenuItem value={ "high" }>High</MenuItem>
            </Select>
        </FormControl>
    )
}

export default TaskPrioritySelect;