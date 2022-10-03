import React, { useEffect } from "react";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const KanbanCardPrioritySelect = (props: any) => {
  const [ priority, setPriority ] = React.useState('low');

  useEffect(() => {
    setPriority(props.value);
  }, []);

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

export default KanbanCardPrioritySelect;