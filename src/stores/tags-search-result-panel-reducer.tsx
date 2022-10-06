export const initialState = {
  mouseOver: false
};

export const TagsSearchResultPanelReducer = (state, action) => {
  switch (action.type){
    case 'mouse_enter': {
      return {
        ...state,
        mouseOver: true,
      };
    }

    case 'mouse_leave': {
      return {
        ...state,
        mouseOver: false
      } 
    }

    default : {
      return state
    }
  }
};