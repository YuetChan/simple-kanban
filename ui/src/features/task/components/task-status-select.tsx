import React, { useEffect } from "react";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface TaskStatusSelectProps {
  value: string,
  showArchive?: boolean,
  
  handleOnSelectChange: Function
}

const StatusSelect = (props: TaskStatusSelectProps) => {
  // ------------------ Status select ------------------
  const [ status, setStatus ] = React.useState<string>(props.value);

  const handleOnStatusSelect = (e: any) => {
    setStatus(e.target.value)
    props.handleOnSelectChange(e); 
  }

  useEffect(() => {
    setStatus(props.value);
  }, []);
  
  const statusMap = new Map();

  statusMap.set('backlog', <span>📇 Backlog</span>);
  statusMap.set('todo', <span>📝 Todo</span>);
  statusMap.set('inProgress', <span>⏳ In Progress</span>);
  statusMap.set('done', <span>✅ Done</span>);

  const statuses = [
    'backlog',
    'todo', 
    'inProgress',
    'done'
  ];

  // ------------------ Html template ------------------
  return (
    <section>
      <FormControl 
        variant="standard" 
        sx={{ minWidth: "140px" }}>
        <InputLabel>Status</InputLabel>

        <Select
          label="status"
          value={ status }
          onChange={ (e) => handleOnStatusSelect(e) }>
          {
            statuses.map(status => (
            <MenuItem value={ status }>{ statusMap.get(status) }</MenuItem>
            ))
          }

          <MenuItem
            style={{ display: props.showArchive? "block": "none" }}
            value={ "archive" } >
            🗳️ Archive
          </MenuItem>
        </Select>
      </FormControl>
    </section>
  )
}

export default StatusSelect;