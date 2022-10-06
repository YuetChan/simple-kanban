const getInitialFromDate = () => {
  var dateOffset = (24 * 60 * 60 * 1000) * 365;
  var fromDate = new Date();
  fromDate.setTime(fromDate.getTime() - dateOffset);

  return fromDate;
}

export const initialState = {
  _fromDate: getInitialFromDate(),
  _toDate: new Date(),
  _dueDate: new Date()
};

export const DatesCacheReducer = (state, action) => {
  switch (action.type){
    case 'fromDate_update': {
      return {
        ...state,
        _fromDate: action.value,
      };
    }

    case 'toDate_update': {
      return {
        ...state,
        _toDate: action.value,
      };
    }

    case 'dueDate_update': {
      return {
        ...state,
        _dueDate: action.value,
      };
    }

    default : {
      return state
    }
  }
};