import React from "react";

import { Avatar, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";

import { truncate } from "../../../libs/text-lib";

import { textToAvatarDataUrl } from "../../../services/avatar-service";

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
        const isNone = assignee === "none";
        const truncatedAssignee = truncate(assignee, 18);
      
        return (
            <Stack direction="row" alignItems="center" spacing={3}>
                <Avatar 
                    alt={ assignee } 
                    src={ isNone ? "" : textToAvatarDataUrl(assignee) } 
                    style={{ 
                        height: "24px", 
                        width: "24px" 
                        }} />
                <div>{ isNone ? "none" : truncatedAssignee }</div>
            </Stack>
        );
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
                    key={ "assignee-select-none" }
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
                            key={ `assignee-select-${ assignee }` }
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