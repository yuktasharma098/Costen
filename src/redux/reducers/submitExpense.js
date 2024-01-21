
const initialState = {
    objects: [],
  };
  
  const submitExpense = (state = initialState, action) => {

    switch (action.type) {
      case "SUBMITEXPENSEADD":
        const existingObjectIndex = state.objects.findIndex(
            (obj) => obj.id === action.payload.id
          );
    
          if (existingObjectIndex !== -1) {
            // If it exists, you can decide whether to replace or ignore the new object
            // In this example, we replace the existing object
            const updatedObjects = [...state.objects];
            updatedObjects[existingObjectIndex] = action.payload;
    
            return {
              ...state,
              objects: updatedObjects,
            };
          } else {
            // If it doesn't exist, add the new object
            return {
              ...state,
              objects: [...state.objects, action.payload],
            };
          }
      case "SUBMITEXPENSEREMOVE":
        return {
          ...state,
          objects: state.objects.filter((obj) => obj.category !== action.payload),
        };
      case "SUBMITEXPENSEUPDATE":
        return {
          ...state,
          objects: state.objects.map((obj) =>
            obj.id === action.payload.category ? action.payload : obj
          ),
        };
      default:
        return state;
    }
  };
  
  export default (submitExpense);