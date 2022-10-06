import React, { useEffect } from "react";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface TaskPrioritySelectProps {
  value: string,
  handleOnPriorityChange: Function
}

const TaskPrioritySelect = (props: TaskPrioritySelectProps) => {
  // ------------------ Priority ------------------
  const [ priority, setPriority ] = React.useState(props.value);

  useEffect(() => {
    setPriority(props.value);
  }, []);

  // ------------------ Html template ------------------
  return (
    <FormControl 
      variant="standard" 
      sx={{ minWidth: "140px" }}>
      <InputLabel>Priority</InputLabel>
      
      <Select
        value={ priority }
        label="Priority"
        onChange={ e => {
          setPriority(e.target.value);
          props.handleOnPriorityChange(e);
        } }>
        <MenuItem value={ "low" } >Low</MenuItem>
        <MenuItem value={ "medium" }>Medium</MenuItem>
        <MenuItem value={ "high" }>High</MenuItem>
      </Select>
    </FormControl>
  )
}

export default TaskPrioritySelect;