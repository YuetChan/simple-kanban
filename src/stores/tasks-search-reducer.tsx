export const initialState = {
  _activeTab: '',

  _tagsEditAreaFocused: false,
  _tagsEditAreaRef: undefined,
  _tagsEditAreaSearchStr: '',
  _activeTags: [],

  _activePriority: 'all',

  _activeUserEmails: []
};

export const TasksSearchReducer = (state, action) => {
  switch (action.type){
    case 'activeTab_select': {
      return {
        ...state,
        _activeTab: action.value,
      };
    }

    // ------------------ Priority select ------------------
    case 'activePriority_select': {
      return {
        ... state,
        _activePriority: action.value
      }
    }

    // ------------------ Tags edit area ------------------
    case 'tagsEditArea_focus': {
      return {
        ...state,
        _tagsEditAreaFocused: true,
      };
    }

    case 'tagsEditArea_blur': {
      return {
        ...state,
        _tagsEditAreaFocused: false
      } 
    }

    case 'tagsEditArea_setRef': {
      return {
        ... state,
        _tagsEditAreaRef: action.value
      }
    }

    case 'tagsEditArea_setFocus': {
      state._tagsEditAreaRef?.current?.focus();
      return {
        ... state,
        _tagsEditAreaFocused: true
      };
    }

    case 'activeTags_update': {
      return {
        ...state,
        _activeTags: action.value,
      };
    }

    case 'tagsEditAreaSearchStr_update' : {
      return {
        ...state,
        _tagsEditAreaSearchStr: action.value
      } 
    }

    // --------------- User filter -----------------
    case 'activeUserEmails_add': {
      let updatedActiveUserEmails = state._activeUserEmails;
      if(!state._activeUserEmails.includes(action.value)) {
        updatedActiveUserEmails = state._activeUserEmails.concat(action.value);
      }
      
      return {
        ...state,
        _activeUserEmails: updatedActiveUserEmails,
      };
    }

    case 'activeUserEmails_remove': {
      const activeUserEmails = state._activeUserEmails;
      const idx = state._activeUserEmails.indexOf(action.value);
      
      return {
        ...state,
        _activeUserEmails: activeUserEmails.splice(idx, 1)
      };
    }

    default : {
      return state
    }
  }
};