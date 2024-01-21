
const initialState = {};

const hoteldata= (state = initialState, action) => {
  switch (action.type) {
      case "HOTELDATA":
        return action.payload;
    default:
      return state;
  }
};

export default (hoteldata);
