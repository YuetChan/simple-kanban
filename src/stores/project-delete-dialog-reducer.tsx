export const initialState = {
  show: false,
};

export const ProjectDeleteDialogReducer = (state: any, action: any) => {
  switch (action.type){
    case 'dialog_show': {
      return {
        ...state,
        show: true,
      };
    }

    case 'dialog_hide': {
      return {
        ...state,
        show: false,
      };
    }

    default : {
      return state
    }
  }
};