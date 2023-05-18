import { createSlice } from '@reduxjs/toolkit';

interface ProjectDeleteDialogState { 
  	show: boolean 
}

const { reducer, actions } = createSlice({
  	name: 'ProjectDeleteDialog',

  	initialState: { show: false } as ProjectDeleteDialogState,
  
  	reducers: {
    	showProjectDeleteDialog: (state) => {
      		state.show = true 
    	},

    	hideProjectDeleteDialog: (state) => {
			state.show = false
    	}
  	}
});

export { reducer, actions };