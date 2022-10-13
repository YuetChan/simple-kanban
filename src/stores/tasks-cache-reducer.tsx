export const initialState = {
  _allTasks: undefined
};

export const TasksCacheReducer = (state: any, action: any) => {
  switch (action.type){
    case 'allTasks_update': {
      return {
        ...state,
        _allTasks: action.value,
      };
    }

    default : {
      return state
    }
  }
};