import React from "react";

import { Avatar, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";

import { truncate } from "../../../libs/text-lib";

import { textToAvatar } from "../../../services/avatar-service";

interface AssigneeSelectProps {
  assignee: string,
  allAssignees: Array<string>,
  handleOnSelectChange: Function
}

const AssigneeSelect = (props: AssigneeSelectProps) => {
  // ------------------ Assignee select ------------------
  const [ assignee, setAssignee ] = React.useState<string>(props.assignee? props.assignee : 'none');

  const handlOnAssigneeSelect = (e: any) => {
    setAssignee(e.target.value)
    props.handleOnSelectChange(e); 
  }

  const getAssigneeHTML = (assignee: string): any => {
    return (
      <Stack 
        direction="row" 
        alignItems="center" 
        spacing={ 3 }>
        <Avatar style={{ height: "24px", width: "24px"}} >
          { textToAvatar(assignee) }
        </Avatar>

        <div>{ truncate(assignee, 18) }</div>
      </Stack>
    )
  }

  // ------------------ Html template ------------------
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
          label="Status"
          onChange={ (e) => handlOnAssigneeSelect(e) }>

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

export default AssigneeSelect;