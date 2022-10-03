export const initialState = {
  _loginedUserSecret: '',
  _loginedUserEmail: '',
};

export const UserReducer = (state, action) => {
  switch (action.type){
    case 'loginedUserEmail_update': {
      return {
        ...state,
        _loginedUserEmail: action.value
      }
    }

    case 'loginedUserSecret_update': {
      return {
        ...state,
        _loginedUserSecret: action.value
      }
    }

    default : {
      return state
    }
  }
};