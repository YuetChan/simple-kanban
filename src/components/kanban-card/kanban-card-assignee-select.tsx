import React from "react";
import { Avatar, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";

import { textToAvatar } from "../../apis/avatar-api";
import { truncate } from "../../apis/text-api"

const KanbanCardAssigneeSelect = (props: any) => {
  const [ assignee, setAssignee ] = React.useState(props.assignee? props.assignee : 'none');

  const getAssigneeHTML = (assignee) => {
    return (
      <Stack 
        direction="row" 
        alignItems="center" 
        spacing={ 3 }>
        <Avatar style={{
          width: "24px",
          height: "24px"}}>
          { textToAvatar(assignee) }
        </Avatar>

        <div>{ truncate(assignee, 18) }</div>
      </Stack>
    )
  }

  return (
    <section>
      <FormControl 
        variant="standard" 
        sx={{ 
          minWidth: "256px", 
          maxWidth: "256px" 
          }}>
        <InputLabel>Assignee</InputLabel>

        <Select
          value={ assignee }
          label="status"
          onChange={(e) => {
            setAssignee(e.target.value)
            props.handleOnSelectChange(e); 
            }}>

          <MenuItem 
            value={ "none" }
            style={{
            minWidth: "256px", 
            maxWidth: "360px", 
            overflowX: "auto"
            }}>
              { getAssigneeHTML("none") }
            </MenuItem>    
          {
            props.allAssignees.map(assignee => (
            <MenuItem 
              value={ assignee }
              style={{
                minWidth: "256px", 
                maxWidth: "360px", 
                overflowX: "auto"
                }}>
              { getAssigneeHTML(assignee) }
            </MenuItem>))
          }
        </Select>
      </FormControl>
    </section>
  )
}

export default KanbanCardAssigneeSelect;