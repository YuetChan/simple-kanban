import { useEffect, useState } from "react";

import { Checkbox, FormControl, FormControlLabel, FormGroup } from "@mui/material";

import EqualizerIcon from "@mui/icons-material/Equalizer";
import KanbanIconTitle from "../../../components/kanban-Icon-title";

interface TaskPriorityCheckBoxProps {
    checkedValues?: Array<string>,

    handleOnPrioritiesCheck?: Function
}

const TaskPriorityCheckbox = (props: TaskPriorityCheckBoxProps) => {
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

        if(props.handleOnPrioritiesCheck) {
            props.handleOnPrioritiesCheck(newValues);
        }
    };
  
    return (
        <FormControl sx={{ 
            display:"flex",
            flexDirection: "column", 
            alignItems:"flex-start",
            padding: "8px" 
            }}>
            <KanbanIconTitle 
                icon={ <EqualizerIcon /> }
                label="Priorities"
                />        

            <FormGroup 
                row 
                sx={{ 
                    marginTop: "8px", 
                    padding: "0px 8px 0px 8px" 
                    }}>
                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={ checkedValues.includes("low") } 
                            onChange={ handleCheckboxChange } 
                            value="low" 
                            sx={{ "& .MuiSvgIcon-root": { fontSize: "18px" } }}
                            />}
                    style={{ fontSize: "12px" }}
                    label="Low"
                    />

                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={ checkedValues.includes("medium") } 
                            onChange={ handleCheckboxChange } 
                            value="medium" 
                            sx={{ "& .MuiSvgIcon-root": { fontSize: "18px" } }}
                            />}
                    style={{ fontSize: "12px" }}
                    label="Medium"
                    />
                    
                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={ checkedValues.includes("high") } 
                            onChange={ handleCheckboxChange } 
                            value="high" 
                            sx={{ "& .MuiSvgIcon-root": { fontSize: "18px" } }}
                            />}
                    style={{ fontSize: "12px" }}
                    label="High"
                    />
            </FormGroup>
        </FormControl>
    );
}

export default TaskPriorityCheckbox;