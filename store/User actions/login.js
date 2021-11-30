export function login(state, action) {
  const foundUser = state.users.find(
    (user) => user.username === action.payload.username
  );
  if (foundUser) {
    foundUser.id = action.payload.id;
  } else {
    state.users.push({
      username: action.payload.username,
      id: action.payload.id,
      foodId: action.payload.foodId ? action.payload.foodId : 0,
      recipesId: action.payload.recipesId ? action.payload.recipesId : 0,
      totalQuantity: action.payload.totalQuantity
        ? action.payload.totalQuantity
        : 0,
      totalWeight: action.payload.totalWeight ? action.payload.totalWeight : 0,
      food: action.payload.food ? action.payload.food : [],
      recipes: action.payload.recipes ? action.payload.recipes : [],
    });
  }
}
