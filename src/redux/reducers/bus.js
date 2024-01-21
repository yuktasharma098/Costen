const initialState = {};

const bus= (state = initialState, action) => {
  switch (action.type) {
      case "BUS":
        return action.payload;
    default:
      return state;
  }
};

export default (bus);