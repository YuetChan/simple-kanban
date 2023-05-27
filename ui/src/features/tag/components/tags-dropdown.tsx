import axios from 'axios';

import KanbanInfiniteDropdown from '../../../components/kanban-infinite-dropdown';

import { Tag } from "../../../types/Tag"

const localhost = "http://localhost:8080/tags";

interface TagsDropdownProps {
    projectId?: string,
    handleOnEnter?: Function,
    handleOnItemClick?: Function 
}

const TagsDropdown = (props: TagsDropdownProps) => {
    const searchTagsByProjectId = (prefix: string, start: number) => 
    axios.get(`${localhost}?projectId=${props.projectId}&prefix=${prefix}&start=${start}`)

    const handleOnScrollBottom = (
        scrollHeight: number, scrollTop: number, clientHeight: number, 
        callback: Function) => {
            // Custom imple 

            callback();
    }
    
    const fetchSuccess = (res: any) => {
        const tags = res.data.data.tags
        return {
            totalPage: res.data.data.totalPage,
            options: tags.map((tag: Tag) => tag.name)
        }
    }

    const handleOnEnter = (tag: string) => {
        if(props.handleOnEnter) {
            props.handleOnEnter(tag)
        }
    }

    const handleOnItemClick = (tag: string) => {
        if(props.handleOnItemClick) {
            props.handleOnItemClick(tag)
        } 
    }

    return (
        <KanbanInfiniteDropdown  
            fetchByPageFunc={ searchTagsByProjectId }
            fetchSuccess={ (res: any) => fetchSuccess(res)} 

            handleOnScrollBottom={ handleOnScrollBottom }
            handleOnInputEnter={ (tag: string) => handleOnEnter(tag) }
            handleOnItemClick={ (tag: string) =>  handleOnItemClick(tag)}  
        
            style={{
                padding: "0px 8px 0px 8px"
            }}
            />
    )
}

export default TagsDropdown;