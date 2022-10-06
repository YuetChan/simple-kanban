import React, { useEffect } from "react";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface CardPrioritySelectProps {
  value: string,
  handleOnPriorityChange: Function
}

const KanbanCardPrioritySelect = (props: CardPrioritySelectProps) => {
  const [ priority, setPriority ] = React.useState(props.value);

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