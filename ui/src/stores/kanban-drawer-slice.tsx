import { createSlice } from "@reduxjs/toolkit";

interface DrawerState { tick: boolean }

const { reducer, actions } = createSlice({
    name: "KanbanDrawer",

    initialState: { tick: false } as DrawerState,
  
    reducers: {
        refreshDrawer: (state) => {
            state.tick = !state.tick;
        },
    }
});

export { reducer, actions }