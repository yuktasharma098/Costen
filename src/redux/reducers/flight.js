const initialState = {};

const flight= (state = initialState, action) => {
  switch (action.type) {
      case "FLIGHT":
        return action.payload;
    default:
      return state;
  }
};

export default (flight);