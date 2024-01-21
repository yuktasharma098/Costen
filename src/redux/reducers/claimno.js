
const initialState ='';

const claimno= (state = initialState, action) => {
  switch (action.type) {
      case "CLAIMNO":
        return action.payload;
    default:
      return state;
  }
};

export default (claimno);
