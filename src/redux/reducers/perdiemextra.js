const initialState = {};

const perdiemextra= (state = initialState, action) => {
  switch (action.type) {
      case "PERDIEMEXTRA":
        return action.payload;
    default:
      return state;
  }
};

export default (perdiemextra);