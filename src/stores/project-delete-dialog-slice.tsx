import { createSlice } from '@reduxjs/toolkit';

interface ProjectDeleteDialogState { show: boolean }

const { reducer, actions } = createSlice({
  name: 'ProjectDeleteDialog',

  initialState: { show: false } as ProjectDeleteDialogState,
  
  reducers: {
    showProjectDeleteeDialog: (state, action) => {
      state.show = true;
    },

    hideProjectDeleteDialog: (state, action) => {
      state.show = false;
    }
  }
});

export { reducer, actions };