export const initialState = { };

export const TableReducer = (state, action) => {
  switch (action.type){
    case 'table_refresh': {
      return {
        ...state
      };
    }

    default : {
      return state
    }
  }
};