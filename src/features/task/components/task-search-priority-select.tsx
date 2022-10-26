import React from "react";

import { useDispatch } from "react-redux";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { actions as taskSearchActions } from '../../../stores/tasks-search-slice';

interface TaskSearchPrioritySelectProps { }

const TaskSearchPrioritySelect = (props: TaskSearchPrioritySelectProps) => {
  // ------------------ Dispatch ------------------
  const dispatch = useDispatch();

  // ------------------ Tasks search ------------------
  const { selectActivePriority } = taskSearchActions;

  // ------------------ Priority select ------------------
  const [ priority, setPriority ] = React.useState<String>('all');

  const handleOnPrioritySelect = (e: any) => {
    setPriority(e.target.value);
    dispatch(selectActivePriority(e.target.value));
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