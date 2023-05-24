import { createSlice } from "@reduxjs/toolkit";

interface DatesCacheState {
    _fromDate: Date,
    _toDate: Date,
    _dueDate: Date
}

const { reducer, actions } = createSlice({
    name: "DatesCache",

    initialState: {
        _fromDate: new Date(),
        _toDate: new Date(),
        _dueDate: new Date()
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
