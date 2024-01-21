
const initialState = {};

const travelHeader= (state = initialState, action) => {
  switch (action.type) {
      case "TRAVELHEADER":
        return action.payload;
    default:
      return state;
  }
};

export default (travelHeader);
