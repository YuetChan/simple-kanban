import React, { useEffect } from "react";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface TaskPrioritySelectProps {
  value: string,
  handleOnPriorityChange: Function
}

const TaskPrioritySelect = (props: TaskPrioritySelectProps) => {
  // ------------------ Priority select ------------------
  const [ priority, setPriority ] = React.useState(props.value);

  const handleOnPrioritySelect = (e: any) =>{
    setPriority(e.target.value);
    
    props.handleOnPriorityChange(e);
  }

  useEffect(() => {
    setPriority(props.value);
  }, []);

  // ------------------ Html template ------------------
  return (
    <FormControl 
      sx={{ minWidth: "140px" }}
      variant="standard" >
      <InputLabel>Priority</InputLabel>
      
      <Select
        label="Priority"
        value={ priority }
        onChange={ handleOnPrioritySelect }>
        <MenuItem value={ "low" } >Low</MenuItem>
        <MenuItem value={ "medium" }>Medium</MenuItem>
        <MenuItem value={ "high" }>High</MenuItem>
      </Select>
    </FormControl>
  )
}

export default TaskPrioritySelect;