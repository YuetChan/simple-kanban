import React from "react";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { useTasksSearchContext } from "../../../providers/tasks-search";

interface TaskSearchPrioritySelectProps { }

const TaskSearchPrioritySelect = (props: TaskSearchPrioritySelectProps) => {
  // ------------------ Drawer ------------------
  const drawerContextDispatch = useTasksSearchContext().Dispatch;

  // ------------------ Priority ------------------
  const [ priority, setPriority ] = React.useState('all');

  const handleOnPriorityChange = (e: any) => {
    setPriority(e.target.value);

    drawerContextDispatch({
      type: 'activePriority_select',
      value: e.target.value
    })
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
        onChange={ e => handleOnPriorityChange(e) }>
        <MenuItem value={ "all" } >All</MenuItem>
        
        <MenuItem value={ "low" } >Low</MenuItem>
        <MenuItem value={ "medium" }>Medium</MenuItem>
        <MenuItem value={ "high" }>High</MenuItem>
      </Select>
    </FormControl>
  )
}

export default TaskSearchPrioritySelect;