const initialState = {};

const carRental= (state = initialState, action) => {
  switch (action.type) {
      case "CARRENTAL":
      
        return action.payload;
    default:
      return state;
  }
};

export default (carRental);