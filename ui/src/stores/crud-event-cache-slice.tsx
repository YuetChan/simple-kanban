import { createSlice } from '@reduxjs/toolkit';

interface CrudEventState {
	_crudEvent: string,
}

const { reducer, actions } = createSlice({
    name: "CrudEventCache",

    initialState: {
        _crudEvent: { },
    } as CrudEventState,
  
    reducers: {
        updateCrudEvent: (state, action) => {
            state._crudEvent = action.payload;
        }
    }
});

export { reducer, actions }