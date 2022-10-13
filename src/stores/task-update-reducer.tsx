export const initialState = {
  _tagsEditAreaFocused: false,
  _tagsEditAreaSearchStr: '',

  _tagsEditAreaRef: undefined,

  _task: undefined,

  _searchResultPanelMouseOver: false,
  _lastFocusedArea: ''
};

export const TaskUpdateReducer = (state: any, action: any) => {
  switch (action.type){
    case 'tagsEditArea_focus': {
      return {
        ...state,
        _tagsEditAreaFocused: true,
      };
    }

    case 'tagsEditArea_blur': {
      return {
        ...state,
        _tagsEditAreaFocused: false,
      };
    }

    case 'tagsEditAreaSearchStr_update': {
      return {
        ...state,
        _tagsEditAreaSearchStr: action.value,
      };
    }

    // case 'activeTags_update': {
    //   return {
    //     ...state,
    //     _activeTags: action.value,
    //   };
    // }

    case 'task_update': {
      return {
        ...state,
        _task: action.value
      }
    }

    case 'searchResultPanel_mouseEnter': {
      return {
        ...state,
        _searchResultPanelMouseOver: true,
        lastFocusedArea: action.value
      }
    }

    case 'searchResultPanel_mouseLeave': {
      return {
        ...state,
        _searchResultPanelMouseOver: false
      }
    }

    case 'tagsEditArea_setRef': {
      return {
        ...state,
        _tagsEditAreaRef: action.value
      }
    }

    case 'lastFocusedArea_update': {
      return {
        ...state,
        _lastFocusedArea: action.value
      }
    }

    default : {
      return state
    }
  }
};