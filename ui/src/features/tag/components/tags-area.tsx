import { useEffect, useState } from "react";

import { Stack } from "@mui/material";
import LabelIcon from '@mui/icons-material/Label';

import TagsDropdown from "./tags-dropdown";
import TagChip from "./tag-chip";
import KanbanIconTitle from "../../../components/kanban-Icon-title";

interface TagsAreaProps {
    projectId: string,
    tags?: Array<string>,

    handleOnTagsChange?: Function
}

const TagsArea = (props: TagsAreaProps) => {
    const [ tags, setTags ] = useState<Array<string>>([]);

    useEffect(() => {
        setTags(props.tags? props.tags : []);
    }, [ ])

    const handleOnEnter = (tag: string) => {
        if(!tags.includes(tag)) {
            const newTags = [tag].concat(tags)
            setTags(newTags);

            if(props.handleOnTagsChange) {
                props.handleOnTagsChange(newTags)
            }
        }
    }

    const handleOnItemClick = (tag: string) => {
        if(!tags.includes(tag)) {
            const newTags = [tag].concat(tags)
            setTags(newTags);

            if(props.handleOnTagsChange) {
                props.handleOnTagsChange(newTags)
            }
        }
    }

    const handleOTagDelete = (tag: string) => {
        const newTags = tags.filter(_tag => _tag !== tag);
        setTags(newTags);

        if(props.handleOnTagsChange) {
            props.handleOnTagsChange(newTags)
        }
    }

    return (
        <Stack direction="row">
            <Stack 
                direction="column" 
                sx={{
                    width: "180px",
                    padding: "8px"
                }}>
                <KanbanIconTitle 
                    icon={ <LabelIcon /> }
                    label="Tags"
                    />

                <TagsDropdown 
                    projectId={ props.projectId }

                    handleOnEnter={ (tag: string) => handleOnEnter(tag) }
                    handleOnItemClick = { (tag: string) => handleOnItemClick(tag) }
                    />
            </Stack>

            <div style={{
                width: "240px",
                height: "80px",
                padding: "8px",
                overflow: "auto"
                }}>
                 <Stack 
                    direction="row" 
                    spacing={ 0.5 }
                    sx={{ 
                        flexWrap: 'wrap' 
                    }}>
                    {
                        tags.map(tag => {
                            return (
                                <TagChip 
                                    showDelete={ true } 
                                    tag={ tag } 
                                
                                    handleOnDeleteClick={ (tag: string) => handleOTagDelete(tag) }
                                    />
                                    )
                        })
                    }
                </Stack>
            </div>        
        </Stack>
    )
}

export default TagsArea;