import { Button, Stack, TextField } from "@mui/material";
import KanbanIconTitle from "../../../components/kanban-Icon-title";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FactCheckIcon from '@mui/icons-material/FactCheck';

interface TaskSubtaskListAreaProps {

}

const SubtaskListArea = () => {
    return (
        <Stack direction="column" sx={{ padding: "8px"}}>
            <KanbanIconTitle icon={<FactCheckIcon/>} label="Subtasks" />

            <Stack direction="row" sx={{ width: "180px" }}>
                <div style={{
                    padding: "0px 8px 0px 8px"
                }}>
                <TextField 
                    label="Enter subtasks" 
                    variant="standard" 
                    size="small"
                    sx={{
                        width: "100%"
                    }}
                    />
                </div>


                {/* <Button>Add</Button> */}
            </Stack>
        </Stack>
        
    )
}

export default SubtaskListArea;