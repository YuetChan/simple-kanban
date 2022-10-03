import React, { useEffect } from "react";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const KanbanCardStatusSelect = (props: any) => {
  const [ status, setStatus ] = React.useState(props.value? props.value : 'backlog');

  useEffect(() => {
    console.log(props.value)
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

  return (
    <section>
      <FormControl 
        variant="standard" 
        sx={{ minWidth: "140px" }}>
        <InputLabel>Status</InputLabel>

        <Select
          value={ status }
          label="status"
          onChange={
            (e) => { 
              setStatus(e.target.value)
              props.handleOnSelectChange(e); 
              }}>
          {
            statuses.map(status => (
            <MenuItem value={ status }>{ statusMap.get(status) }</MenuItem>
            ))
          }

          <MenuItem
            style={{
              display: props.showArchive? "block": "none"
            }}
            value={ "archive" } >
            🗳️ Archive
          </MenuItem>
        </Select>
      </FormControl>
    </section>
  )
}

export default KanbanCardStatusSelect;