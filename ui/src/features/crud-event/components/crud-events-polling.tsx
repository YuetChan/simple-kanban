import { useEffect } from "react";
import { getCrudEventsByProjectId } from "../services/crud-events-service";

import { actions as CrudEventCacheActions } from "../../../stores/crud-event-cache-slice"
import { useDispatch } from "react-redux";

interface CrudEventsPollingProps {
    projectId: string
}

const CrudEventsPolling = (props: CrudEventsPollingProps) => {
    // ------------------ Dispatch ------------------
    const dispatch = useDispatch()

    // ------------------ Crud event cache ------------------
    const { updateCrudEvent } = CrudEventCacheActions;

    useEffect(() => {
        const pollingInterval = setInterval(() => {
            getCrudEventsByProjectId(props.projectId).then(res => {
                // res equal to null when its 404 status code
                if(res === null) {
                    dispatch(updateCrudEvent({ }))
                }
                
            })
        }, 4000);
    
        return () => {
            clearInterval(pollingInterval);
        };
    }, []);

    return (
        <div></div>
    )
}

export default CrudEventsPolling;