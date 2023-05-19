import { MenuItem, MenuList, Paper, TextField } from "@mui/material";
import { useRef, useState } from "react";

interface KanbanInfiniteDropdownProps {
    fetchByPageFunc: any,

    fetchSuccess?: Function,
    fetchFail?:Function,

    handleOnScrollBottom: Function,
    handleOnInputFocus?: Function,
    handleOnDropdownClose?: Function,
    handleOnInputEnter?: Function,
    handleOnItemClick?: Function,

    style?: any
}

const KanbanInfiniteDropdown = (props: KanbanInfiniteDropdownProps) => {
    const [ open, setOpen ] = useState<boolean>(false);
    const [ value, setValue ] = useState<string>("");

    const [ options, setOptions ] = useState<Array<string>>([]);

    const [ page, setPage ] = useState<number>(0);

    const [ loading, setLoading ] = useState<boolean>(false);

    const [ timeoutId, setTimeoutId ] = useState<any>(undefined);

    const [ isMouseOver, setIsMouseOver ] = useState<boolean>(false);

    let inputRef = useRef<HTMLInputElement>();

    const handleOnDropdownScroll = (e: any) => {
        const target = e.target
        
        if (Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 1) {
            if(props.handleOnScrollBottom) {
                props.handleOnScrollBottom(target.scrollHeight, target.scrollTop, target.clientHeight, () => {
                    setLoading(true);

                    props.fetchByPageFunc(value, page).then((res: any) => {
                        setTimeoutId(setTimeout(() => {
                            setLoading(false);
            
                            let scrollTop = target.scrollHeight - target.clientHeight - 10; 
                            scrollTop = scrollTop < 0 ? 0 : scrollTop;
            
                            e.target.scrollTop = scrollTop;

                            if(props.fetchSuccess) {
                                if(page <= props.fetchSuccess(res).totalPage - 1) {
                                    setPage(page + 1);
                                }

                                setOptions(options.concat(props.fetchSuccess(res).options))
                            }
                        }, 1000));
                    }).catch((err: any) => {
                        setLoading(false);

                        if(props.fetchFail) {
                            props.fetchFail(err);
                        }
                    });
                });
            }
        }   
    };

    const handleOnTextfieldChange = (e: any) => {
        setLoading(true);

        clearTimeout(timeoutId)
        
        setValue(e.target.value);
        setPage(0);

        setTimeoutId(setTimeout(() => {
            props.fetchByPageFunc(e.target.value, 0).then((res: any) => {
                setLoading(false);

                if(props.fetchSuccess) {
                    setOptions(props.fetchSuccess(res).options);
                    setPage(1)
                }
            }).catch((err: any) => {
                setLoading(false);

                if(props.fetchFail) {
                    props.fetchFail(err);
                }
            });
        }, 1000));
    }

    const handleOnTextfieldFocus = (e: any) => {
        if(!isMouseOver) {
            setLoading(true);

            setPage(0);
            setOpen(true);
    
            setTimeoutId(setTimeout(() => {
                props.fetchByPageFunc(value, 0).then((res: any) => {
                    setLoading(false);
    
                    if(props.fetchSuccess) {
                        setOptions(props.fetchSuccess(res).options);
                        setPage(1)
                    }
                }).catch((err: any) => {
                    setLoading(false);
    
                    if(props.fetchFail) {
                        props.fetchFail(err);
                    }
                });
            }, 1000));
    
            if(props.handleOnInputFocus){
                props.handleOnInputFocus(e)
            }
        }
    }

    const handleOnDropdownBlur = (e: any) => {
        if(!isMouseOver && open) {
            clearTimeout(timeoutId)

            setOptions([]);
            setPage(0);
    
            setOpen(false);

            if(props.handleOnDropdownClose) {
                props.handleOnDropdownClose(e)
            }
        }
    }

    const handleOnTextfieldBlur = (e: any) => {
        if(!isMouseOver && open) {
            clearTimeout(timeoutId)

            setOptions([]);
            setPage(0);
    
            setOpen(false);

            if(props.handleOnDropdownClose) {
                props.handleOnDropdownClose(e)
            }
        }
    }

    const handleOnKeyDown = (e: any) => {
        if (e.keyCode === 13) {
            if(props.handleOnInputEnter) {
                props.handleOnInputEnter(e.target.value)
            } 
            
            setValue("")
        }
    }

    const handleOnItemClick = (e: any) => {
        if(props.handleOnItemClick) {
            props.handleOnItemClick(e.target.textContent)
        }
    }
  
    return (
        <div style={{ 
            ... props.style,
            position: "relative"
            }}>
            <TextField 
                variant="standard"
                label="Enter tags"
                value={ value }
                size="small"
                placeholder="Enter tags"

                onChange={ (e) => handleOnTextfieldChange(e)}
                onFocus={ (e) => handleOnTextfieldFocus(e) }
                onBlur={ (e) => handleOnTextfieldBlur(e) }
                onKeyDown={ (e) => handleOnKeyDown(e) }

                inputRef={ inputRef }

                sx={{
                    width: "100%",
                }} />

                {
                    open
                    ? (
                        <Paper 
                            sx={{
                                position: "sticky",
                                maxHeight: "200px",
                                width: "100%",

                                overflow: "scroll",
                                zIndex: "999",                           
                            }}

                            onScroll={ (e: any) => handleOnDropdownScroll(e) } 
                            onBlur={ (e: any) => handleOnDropdownBlur(e) }
                            onMouseOver={ (e: any) => { setIsMouseOver(true); } }
                            onMouseMove={ (e: any) => { inputRef.current?.focus() } }
                            onMouseLeave={ (e: any) => { setIsMouseOver(false);  } }
                            >
                            <MenuList variant="menu">
                                {   
                                    options.map(option => (
                                        <MenuItem 
                                            key={ "dropdown_" + option } 
                                            value={ "dropdown_" + option } 

                                            onPointerDown={(e) => { handleOnItemClick(e) } }
                                        
                                            sx={{ 
                                                width: "100%"
                                                }}>
                                            { option }
                                        </MenuItem>
                                    ))
                                }
                    
                                { <MenuItem 
                                    disabled 
                                    sx={{ 
                                        width: "150px"
                                        }}>
                                    {loading?  "Loading..." : "No more"}
                                </MenuItem> }
                            </MenuList>
                        </Paper>
                    )
                    : null
                }
        </div>
    );
}

export default KanbanInfiniteDropdown;