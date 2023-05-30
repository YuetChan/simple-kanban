import { useEffect, useState } from "react";
import { Checkbox, FormControl, FormControlLabel, FormGroup, IconButton, Stack } from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';

interface TaskSubtaskCheckboxProps {
    subtaskList: Array<string>,
    checkedValues: Array<string>,

    showDelete?: boolean,

    handleOnSubtaskCheck?: Function,
    handleOnSubtaskDelete?: Function,
}

const TaskSubtaskCheckbox = (props: TaskSubtaskCheckboxProps) => {
    const [ checkedValues, setCheckedValues ] = useState<Array<string>>(props.checkedValues || []);

    useEffect(() => {
        setCheckedValues(props.checkedValues || []);
      }, [ props.checkedValues ]);

    const handleCheckboxChange = (e: any) => {
        const { value } = e.target;

        const newValues = checkedValues.includes(value)
        ? checkedValues.filter((val) => val !== value) 
        : [...checkedValues, value]

        setCheckedValues(newValues);

        if(props.handleOnSubtaskCheck) {
            props.handleOnSubtaskCheck(newValues);
        }
    };

    const handleOnSubtaskDelete = (subtask: string) => {
        if(props.handleOnSubtaskDelete){
            props.handleOnSubtaskDelete(subtask);
        }
    }

    return (
        <FormControl sx={{ 
            display:"flex",
            flexDirection: "column", 
            alignItems:"flex-start",

            padding: "8px" 
            }}>
            <FormGroup  
                sx={{ 
                    marginTop: "8px", 
                    padding: "0px 8px 0px 8px" 
                    }}>
                {
                    props.subtaskList.map(subtask => {
                        return (
                            <Stack 
                                direction="row" 
                                alignItems="center"
                                key={ "subtask-" +  subtask}
                                >
                                <FormControlLabel
                                    label={ subtask }
                                    control={
                                        <Checkbox 
                                            checked={ checkedValues.includes(subtask) } 
                                            value={ subtask } 
                                        
                                            onChange={ handleCheckboxChange } 

                                            sx={{ 
                                                "& .MuiSvgIcon-root": { 
                                                    fontSize: "18px",
                                                    fontFamily: "'Caveat', cursive"
                                                } 
                                            }}/>
                                        }/>

                                <IconButton 
                                    data-testid={ subtask+ "-subtask-close-icon-button" }
                                    onClick={ (e: any) => handleOnSubtaskDelete(subtask) }
                                    sx={{ display: props.showDelete? null: "none" }}>
                                    <CloseIcon />
                                </IconButton>
                            </Stack>
                        )
                    })

                }
            </FormGroup>
        </FormControl>
    )
}

export default TaskSubtaskCheckbox;