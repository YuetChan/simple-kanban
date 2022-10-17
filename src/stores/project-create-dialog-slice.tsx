import { createSlice } from '@reduxjs/toolkit';

interface ProjectCreateDialogState {
  show: boolean
}

const { reducer, actions } = createSlice({
  name: 'ProjectCreateDialog',

  initialState: {
    show: false,
  } as ProjectCreateDialogState,
  
  reducers: {
    showProjectCreateDialog: (state) => {
      state.show = true;
    },
    
    hideProjectCreateDialog: (state) => {
      state.show = false;
    }
  }
});

export { reducer, actions }