import { Stack } from "@mui/material";
import { cloneElement } from "react";

interface KanbanIconTitleProps {
    icon: any,
    label: string,
}

const KanbanIconTitle = (props: KanbanIconTitleProps) => {
    return (
        <Stack 
            direction="row"  
            alignItems="center" 
            spacing={ 1.2 }
            >
                {
                    cloneElement(
                        props.icon, 
                        {
                            sx: { 
                                color: "rgb(47, 47, 47)",
                            }
                        })
                }

            <div>
                { props.label }:
            </div>
        </Stack>
        )
}

export default KanbanIconTitle;