
const initialState = {};

const general= (state = initialState, action) => {
  switch (action.type) {
      case "GENERAL":
        return action.payload;
    default:
      return state;
  }
};

export default (general);
