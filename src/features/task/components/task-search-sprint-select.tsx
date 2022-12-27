import { FormControl, InputLabel, Select } from "@mui/material";

interface TasSearchkSprintSelectProps { }

const TaskSearchkSprintSelect = (props: TasSearchkSprintSelectProps) => {
  // ------------------ Html template ------------------
  return (
    <FormControl 
      sx={{ minWidth: "140px" }}
      variant="standard" >
      <InputLabel>Sprint</InputLabel>
      
      <Select disabled={ true }>
      </Select>
    </FormControl>
  )
}

export default TaskSearchkSprintSelect;