
const initialState = {};

const perdiem= (state = initialState, action) => {

  switch (action.type) {
      case "PERDIEM":
        return action.payload;

    default:
      return state;
  }
};

export default (perdiem);
