
const initialState = 0;

const amount= (state = initialState, action) => {
  switch (action.type) {
      case "AMOUNT":
        return action.payload;
    default:
      return state;
  }
};

export default (amount);
