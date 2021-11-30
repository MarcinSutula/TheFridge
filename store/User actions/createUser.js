export function createUser(state, action) {
  state.users.push({
    username: action.payload.username,
    foodId: action.payload.foodId ? action.payload.foodId : 0,
    recipesId: action.payload.recipesId ? action.payload.recipesId : 0,
    id: '',
    totalQuantity: action.payload.totalQuantity
      ? action.payload.totalQuantity
      : 0,
    totalWeight: action.payload.totalWeight ? action.payload.totalWeight : 0,
    food: action.payload.food ? action.payload.food : [],
    recipes: action.payload.recipes ? action.payload.recipes : [],
  });
}
