import { createSlice } from "@reduxjs/toolkit";

interface DatesCacheState {
    _fromDate: string,
    _toDate: string,
    _dueDate: string
}

const { reducer, actions } = createSlice({
    name: "DatesCache",

    initialState: {
        _fromDate: new Date().toISOString(),
        _toDate: new Date().toISOString(),
        _dueDate: new Date().toISOString(),
    } as DatesCacheState,
  
    reducers: {
        fromDateUpdate: (state, action) => {
            state._fromDate = action.payload
        },
    
        toDateUpdate: (state, action) => {
            state._toDate = action.payload
        },

        dueDateUpdate: (state, action) => {
            state._dueDate = action.payload
        },
    }
});

export { reducer, actions }
