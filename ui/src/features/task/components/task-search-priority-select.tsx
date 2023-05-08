import React from "react";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface TaskSearchPrioritySelectProps {
  handleOnPrioritySelect: Function
}

const TaskSearchPrioritySelect = (props: TaskSearchPrioritySelectProps) => {
  // ------------------ Priority select ------------------
  const [ priority, setPriority ] = React.useState<String>('all');

  const handleOnPrioritySelect = (e: any) => {
    if(props.handleOnPrioritySelect){
      props.handleOnPrioritySelect(e.target.value)
    }

    setPriority(e.target.value);
  }

  // ------------------ Html template ------------------
  return (
    <FormControl 
      variant="standard" 
      sx={{ minWidth: "140px" }}>
      <InputLabel>Priority</InputLabel>

      <Select
        value={ priority }
        label="Priority"
        onChange={ e => handleOnPrioritySelect(e) }>
        <MenuItem value={ "all" } >All</MenuItem>
        
        <MenuItem value={ "low" } >Low</MenuItem>
        <MenuItem value={ "medium" }>Medium</MenuItem>
        <MenuItem value={ "high" }>High</MenuItem>
      </Select>
    </FormControl>
  )
}

export default TaskSearchPrioritySelect;