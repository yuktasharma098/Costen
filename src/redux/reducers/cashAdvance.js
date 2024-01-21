
const initialState = {};

const cashAdvance= (state = initialState, action) => {
  switch (action.type) {
      case "CASHADVANCE":
        return action.payload;
    default:
      return state;
  }
};

export default (cashAdvance);
