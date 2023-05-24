import { createSlice } from '@reduxjs/toolkit';

interface TasksSearchState {
	_activeTab: string,


  	_activeTags: Array<string>,
  	_activePriorities: Array<string>,
  _activeUserEmails: Array<string>
}

const { reducer, actions } = createSlice({
  name: 'TasksSearch',

  initialState: {
    _activeTab: '',

    _activeTags: [],
    _activePriorities: [],
    _activeUserEmails: []
  } as TasksSearchState,
  
  reducers: {
    selectActivePriorities: (state, action) => {
      state._activePriorities = action.payload;
    },

    updateActiveTags: (state, action) => {
      state._activeTags = action.payload;
    },

    addActiveUserEmail: (state, action) => {
      state._activeUserEmails = !state._activeUserEmails.includes(action.payload)
      ? state._activeUserEmails.concat(action.payload)
      : state._activeUserEmails;
    },  

    removeActiveUserEmail: (state, action) => {
      let activeUserEmails = state._activeUserEmails;

      const idx = activeUserEmails.indexOf(action.payload);
      
      if (idx !== -1) {
        activeUserEmails.splice(idx, 1);
        state._activeUserEmails = activeUserEmails;
      }
      

      console.log(state._activeUserEmails)
    }
  }
});

export { reducer, actions }