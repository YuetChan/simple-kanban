import { Stack } from "@mui/material";
import { textToAvatar } from "../../../services/avatar-service";

interface ProjectWithOwnerIconProps {
    projectName: string,
    ownerEmail: string
}

const ProjectWithOwnerIcon = (props: ProjectWithOwnerIconProps) => {
    return (
        <Stack 
            direction="row" 
            justifyContent="space-between"
            
            style={{
                width: "100%",
                padding: "2px"
            }}>
            <div>
                { props.projectName }
            </div>

            <div>
                 { textToAvatar(props.ownerEmail, 21) }
            </div>
        </Stack>
    )
}

export default ProjectWithOwnerIcon;