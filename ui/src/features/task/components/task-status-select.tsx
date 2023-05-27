import React, { useEffect } from "react";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface TaskStatusSelectProps {
    value: string,
    handleOnSelectChange: Function,
    style?: any
}

const TaskStatusSelect = (props: TaskStatusSelectProps) => {
    // ------------------ Status select ------------------
    const [ status, setStatus ] = React.useState<string>(props.value);

    const handleOnTaskStatusSelect = (e: any) => {
        setStatus(e.target.value);

        props.handleOnSelectChange(e); 
    }

    useEffect(() => {
        setStatus(props.value);
    }, []);

    const getStatus = (text: string) => {
        return (
            <span style={{ 
                fontSize: "21px", 
                fontFamily: "'Caveat', cursive" 
            }}>
                { text }
            </span>
        )
    }

    const statusMap = new Map();

    statusMap.set("backlog", getStatus("Backlog"));
    statusMap.set("todo", getStatus("To Do"));
    statusMap.set("inProgress", getStatus("In Progress"));
    statusMap.set("done", getStatus("Done"));

    const statuses = [
        "backlog",
        "todo", 
        "inProgress",
        "done"
    ];

    // ------------------ Html template ------------------
    return (
        <FormControl 
            variant="standard" 
            
            sx={{ 
            ...props?.style,
            }}>
            <InputLabel id="status-select">Status</InputLabel>

            <Select
                labelId="status-select"
                value={ status }
                
                onChange={ (e) => handleOnTaskStatusSelect(e) }>
                {
                    statuses.map(status => (
                        <MenuItem value={ status }>{ statusMap.get(status) }</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    )
}

export default TaskStatusSelect;