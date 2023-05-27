import { IconButton, Stack } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

interface TagChipProps {
    tag: string,
    showDelete?: boolean,

    handleOnDeleteClick?: Function
}

const TagChip = (props: TagChipProps) => {
    const handleOnDeleteClick = (e: any) => {
        if(props.handleOnDeleteClick) {
            props.handleOnDeleteClick(props.tag)
        }
    }

    // ------------------ Html template ------------------ 
    return (
        <Stack 
            direction="row" 
            alignItems="center" 
            sx={{
                height: "20px",
                fontSize: "14px",

                borderRadius: "4px",
                padding: "4px",
                background: "whitesmoke",
            }}>
            <div>{ props.tag? props.tag : "" }&nbsp;</div>
            
            {
                (props.showDelete !== undefined? props.showDelete : false)
                ? (
                    <IconButton 
                        data-testid={props.tag + "tag-chip-delete-icon-button"}
                        onClick={ e => handleOnDeleteClick(e) }

                        sx={{ padding: "0px" }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                )
                : null
            }
        </Stack>
    )
}

export default TagChip;