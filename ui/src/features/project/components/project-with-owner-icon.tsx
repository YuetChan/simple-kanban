import { Stack } from "@mui/material";

import { truncate } from "../../../libs/text-lib";
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
                { truncate(props.projectName, 18) }
            </div>

            <div data-testid="project-owner-avatar">
                { textToAvatar(props.ownerEmail, 21) }
            </div>
        </Stack>
    )
}

export default ProjectWithOwnerIcon;