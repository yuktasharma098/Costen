const initialState = {};

const train= (state = initialState, action) => {
  switch (action.type) {
      case "TRAIN":
        return action.payload;
    default:
      return state;
  }
};

export default (train);