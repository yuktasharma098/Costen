
const initialState ='';

const requestedid= (state = initialState, action) => {
  switch (action.type) {
      case "REQUESTEDID":
        return action.payload;
    default:
      return state;
  }
};

export default (requestedid);
