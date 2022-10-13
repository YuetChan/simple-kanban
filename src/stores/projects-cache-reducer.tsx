export const initialState = {
  _activeProject: undefined,
  _allProjects: []
};

export const ProjectsCacheReducer = (state: any, action: any) => {
  switch (action.type){
    case 'activeProject_select': {
      return {
        ...state,
        _activeProject: action.value,
      };
    }

    case 'activeProject_update': {
      return {
        ...state,
        _activeProject: action.value,
      };
    }

    case 'allProjects_update' : {
      return {
        ...state,
        _allProjects: action.value,
        _activeProject: action.value.length > 0 ? action.value[0] : undefined
      } 
    }

    default : {
      return state
    }
  }
};