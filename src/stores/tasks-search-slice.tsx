import { createSlice } from '@reduxjs/toolkit';

interface TasksSearchState {
  _activeTab: string,

  _tagsEditAreaFocused: boolean,
  _tagsEditAreaRef: any,
  _tagsEditAreaSearchStr: string,

  _activeTags: Array<string>,
  _activePriority: string,
  _activeUserEmails: Array<string>
}

const { reducer, actions } = createSlice({
  name: 'TasksSearch',

  initialState: {
    _activeTab: '',

    _tagsEditAreaFocused: false,
    _tagsEditAreaRef: undefined,
    _tagsEditAreaSearchStr: '',

    _activeTags: [],
    _activePriority: 'all',
    _activeUserEmails: []
  } as TasksSearchState,
  
  reducers: {
    selectActivePriority: (state, action) => {
      state._activePriority = action.payload;
    },

    focusTagsEditArea: (state) => {
      state._tagsEditAreaFocused = true;
    },

    blurTagsEditArea: (state) => {
      state._tagsEditAreaFocused = false;
    },

    setTagsEditAreaRef: (state, action) => {
      state._tagsEditAreaRef = action.payload;
    },

    setTagsEditAreaFocused: (state) => {
      state._tagsEditAreaRef?.current?.focus();
      state._tagsEditAreaFocused = true;
    },

    updateActiveTags: (state, action) => {
      state._activeTags = action.payload;
    },

    updateTagsEditAreaSearchStr: (state, action) => {
      state._tagsEditAreaSearchStr = action.payload;
    }, 

    addActiveUserEmail: (state, action) => {
      let updatedActiveUserEmails = state._activeUserEmails;
      if(!state._activeUserEmails.includes(action.payload)) {
        updatedActiveUserEmails = state._activeUserEmails.concat(action.payload);
      }

      state._activeUserEmails = updatedActiveUserEmails;
    },  

    removeActiveUserEmail: (state, action) => {
      const activeUserEmails = state._activeUserEmails;
      const idx = activeUserEmails.indexOf(action.payload);

      console.log(idx, activeUserEmails.splice(idx, 1))

      state._activeUserEmails = activeUserEmails.splice(idx, 1);
    }
  }
});

export { reducer, actions }