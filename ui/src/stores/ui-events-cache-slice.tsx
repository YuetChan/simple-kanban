import { createSlice } from '@reduxjs/toolkit';

interface UiEventState {
	_uiEvent: string,
}

const { reducer, actions } = createSlice({
    name: "UiEventCache",

    initialState: {
        _uiEvent: {},
    } as UiEventState,
  
    reducers: {
        updateUiEvent: (state, action) => {
            state._uiEvent = action.payload;
        }
    }
});

export { reducer, actions }