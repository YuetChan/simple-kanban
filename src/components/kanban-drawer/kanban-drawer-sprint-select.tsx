import { FormControl, InputLabel, Select } from "@mui/material";

const KanbanDrawerSprintSelect = () => {
  return (
    <FormControl 
      variant="standard" 
      sx={{ minWidth: "140px" }}>
      <InputLabel>Sprint</InputLabel>
      
      <Select disabled={ true }>
      </Select>
    </FormControl>
  )
}

export default KanbanDrawerSprintSelect;