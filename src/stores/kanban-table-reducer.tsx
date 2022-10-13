export const initialState = { };

export const TableReducer = (state: any, action: any) => {
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