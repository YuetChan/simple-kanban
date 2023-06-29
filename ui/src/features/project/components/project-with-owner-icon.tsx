import { Avatar, Stack } from "@mui/material";

import { truncate } from "../../../libs/text-lib";
import { textToAvatarDataUrl } from "../../../services/avatar-service";

interface ProjectWithOwnerIconProps {
    projectName: string,
    ownerEmail: string
}

const ProjectWithOwnerIcon = (props: ProjectWithOwnerIconProps) => {
    return (
        <Stack 
            direction="row" 
            justifyContent="space-between"
            alignItems="center"

            style={{
                width: "100%",
                padding: "2px",
            }}>
            <div>
                { truncate(props.projectName, 16) }
            </div>

            <Avatar 
                alt={props.ownerEmail} 
                src={textToAvatarDataUrl(props.ownerEmail)} 
                data-testid="project-owner-avatar" 
                
                style={{
                    height: "21px",
                    width: "21px"
                }}
                />
        </Stack>
    )
}

export default ProjectWithOwnerIcon;