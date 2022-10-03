import React from "react";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { useKanbanDrawerContext } from "../../providers/kanban-drawer";

const KanbanDrawerPrioritySelect = () => {
  const drawerContextDispatch = useKanbanDrawerContext().Dispatch;

  const [ priority, setPriority ] = React.useState('all');

  const handleOnPriorityChange = (e) => {
    setPriority(e.target.value);

    drawerContextDispatch({
      type: 'activePriority_select',
      value: e.target.value
    })
  }

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

export default KanbanDrawerPrioritySelect;