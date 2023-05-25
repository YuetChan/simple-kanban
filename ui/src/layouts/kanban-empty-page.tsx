import { Stack } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

interface KanbanEmptyPageProps {
    handleOnCreateProjectClick?: Function
}

const KanbanEmptyPage = (props: KanbanEmptyPageProps) => {
    const handleOnCreateProjectClick = () => {
        if(props.handleOnCreateProjectClick) {
            props.handleOnCreateProjectClick()
        }
    }

    return (
        <Stack 
            direction="row" 
            justifyContent="center" 
            alignItems="center"
            sx={{ width: "100%" }}>
            <a 
                href="javascript:void(0)" 

                onClick={ handleOnCreateProjectClick }

                style={{ 
                    textDecoration: "none", 
                    color: "rgb(47, 48, 48)" 
                    }}>
                <Stack 
                    direction="row" 
                    alignItems="center" 
                    sx={{ 
                        border: "4px dashed rgba(48, 48, 48, 0.75)", 
                        padding: "8px 32px 8px 8px" 
                        }}>
                    <AddIcon sx={{ fontSize: "72px" }}/>
                    <div style={{ fontSize: "24px" }}>Create Project</div>
                </Stack>
            </a>
        </Stack>
    )
}

export default KanbanEmptyPage;