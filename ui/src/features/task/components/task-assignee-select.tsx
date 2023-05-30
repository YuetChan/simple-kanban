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
        props.handleOnSelectChange(e); 

        setAssignee(e.target.value)
    }

    const getAssigneeHTML = (assignee: string): any => {
        return (
            <Stack 
                direction="row" 
                alignItems="center" 
                spacing={ 3 }>
                <Avatar style={{ height: "24px", width: "24px", background: "white"}} >
                    { textToAvatar(assignee) }
                </Avatar>

                <div>{ truncate(assignee, 18) }</div>
            </Stack>
        )
    }

  // ------------------ Html template ------------------
  return (
        <FormControl 
            variant="standard" 
            sx={{ 
                minWidth: "256px", 
                maxWidth: "256px" 
                }}>
            <InputLabel id="assignee-select">Assignee</InputLabel>

            <Select
                labelId="assignee-select"
                value={ assignee }

                onChange={ (e) => handlOnAssigneeSelect(e) }
                >
                <MenuItem 
                    key={ "assignee-select" + assignee }

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
                        </MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    )
}

export default AssigneeSelect;