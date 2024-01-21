const initialState = {};

const taxi= (state = initialState, action) => {
  switch (action.type) {
      case "TAXI":
        return action.payload;
    default:
      return state;
  }
};

export default (taxi);