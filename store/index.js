import { createSlice, configureStore } from "@reduxjs/toolkit";
import { COLUMNS } from "../components/control/config";
import { sortDateHelper } from "../components/utils/helpers";

const invertDirection = {
  asc: "desc",
  desc: "asc",
};

const initialState = {
  sortedField: "",
  sortDirection: "desc",
  users: [],
};

///////////////////////REDUX

const fridgeSlice = createSlice({
  name: "fridge",
  initialState,
  reducers: {
    ////////USER////////////
    login(state, action) {
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
          totalWeight: action.payload.totalWeight
            ? action.payload.totalWeight
            : 0,
          food: action.payload.food ? action.payload.food : [],
          recipes: action.payload.recipes ? action.payload.recipes : [],
        });
      }
    },
    logout(state) {
      state.users.forEach((user) => (user.id = null));
    },
    createUser(state, action) {
      state.users.push({
        username: action.payload.username,
        foodId: action.payload.foodId ? action.payload.foodId : 0,
        recipesId: action.payload.recipesId ? action.payload.recipesId : 0,
        id: null,
        totalQuantity: action.payload.totalQuantity
          ? action.payload.totalQuantity
          : 0,
        totalWeight: action.payload.totalWeight
          ? action.payload.totalWeight
          : 0,
        food: action.payload.food ? action.payload.food : [],
        recipes: action.payload.recipes ? action.payload.recipes : [],
      });
    },

    ///////FOOD////////////////
    addFood(state, action) {
      const foundUser = state.users.find(
        (user) => user.username === action.payload.username
      );

      if (foundUser) {
        foundUser.food.push({
          name: action.payload.name,
          type: action.payload.type,
          quantity: action.payload.quantity,
          weight: action.payload.weight,
          expDate: action.payload.expDate,
          key: action.payload.key,
          id: action.payload.key,
        });
        foundUser.foodId++;
        foundUser.totalQuantity += +action.payload.quantity;
        foundUser.totalWeight += +action.payload.weight;
      }
    },
    editFood(state, action) {
      const foundUser = state.users.find(
        (user) => user.username === action.payload.username
      );
      const foundUserFood = foundUser.food.find(
        (ele) => +ele.id === +action.payload.id
      );

      foundUser.totalQuantity =
        foundUser.totalQuantity -
        foundUserFood.quantity +
        +action.payload.quantity;
      foundUser.totalWeight =
        foundUser.totalWeight - foundUserFood.weight + +action.payload.weight;

      if (foundUser) {
        foundUserFood.name = action.payload.name;
        foundUserFood.type = action.payload.type;
        foundUserFood.quantity = action.payload.quantity;
        foundUserFood.weight = action.payload.weight;
        foundUserFood.expDate = action.payload.expDate;
      }
    },
    removeFood(state, action) {
      const foundUser = state.users.find(
        (user) => user.username === action.payload.username
      );
      foundUser.food = foundUser.food.filter((item) => {
        return item.key != action.payload.foodToRemove.key;
      });
      foundUser.totalQuantity -= +action.payload.foodToRemove.quantity;
      foundUser.totalWeight -= +action.payload.foodToRemove.weight;
    },
    sortByColumn(state, action) {
      const clickedColumn = COLUMNS.find(
        (column) => column.label === action.payload.columnName
      );

      if (!clickedColumn.id || clickedColumn.id === "action") {
        return;
      }
      const foundUser = state.users.find(
        (user) => user.username === action.payload.username
      );

      state.sortDirection =
        state.sortedField === clickedColumn.id
          ? invertDirection[state.sortDirection]
          : "asc";
      state.sortedField = clickedColumn.id;

      foundUser.food.sort((a, b) => {
        if (
          state.sortedField === "quantity" ||
          state.sortedField === "weight"
        ) {
          if (+a[state.sortedField] > +b[state.sortedField]) {
            return state.sortDirection === "asc" ? 1 : -1;
          } else if (+a[state.sortedField] < +b[state.sortedField]) {
            return state.sortDirection === "asc" ? -1 : 1;
          } else {
            return 0;
          }
        } else if (state.sortedField === "expDate") {
          if (
            sortDateHelper(a[state.sortedField]) >
            sortDateHelper(b[state.sortedField])
          ) {
            return state.sortDirection === "asc" ? 1 : -1;
          } else if (
            sortDateHelper(a[state.sortedField]) <
            sortDateHelper(b[state.sortedField])
          ) {
            return state.sortDirection === "asc" ? -1 : 1;
          } else {
            return 0;
          }
        } else {
          if (a[state.sortedField] > b[state.sortedField]) {
            return state.sortDirection === "asc" ? 1 : -1;
          } else if (a[state.sortedField] < b[state.sortedField]) {
            return state.sortDirection === "asc" ? -1 : 1;
          } else {
            return 0;
          }
        }
      });
    },
    //////////////////////////////////RECIPES//////
    addRecipe(state, action) {
      const foundUser = state.users.find(
        (user) => user.username === action.payload.username
      );

      if (foundUser) {
        foundUser.recipes.push({
          name: action.payload.name,
          servings: action.payload.servings,
          time: action.payload.time,
          difficulty: action.payload.difficulty,
          url: action.payload.url,
          ingredients: action.payload.ingredients,
          description: "",
          id: action.payload.id,
        });
        foundUser.recipesId++;
      }
    },
    editRecipe(state, action) {
      const foundUser = state.users.find(
        (user) => user.username === action.payload.username
      );
      const foundRecipe = foundUser.recipes.find(
        (recipe) => recipe.id === +action.payload.id
      );
      if (foundUser) {
        foundRecipe.name = action.payload.name;
        foundRecipe.servings = action.payload.servings;
        foundRecipe.time = action.payload.time;
        foundRecipe.difficulty = action.payload.difficulty;
        foundRecipe.url = action.payload.url;
        foundRecipe.ingredients = action.payload.ingredients;
      }
    },
    removeRecipe(state,action){
      const foundUser = state.users.find(
        (user) => user.username === action.payload.username
      );

      foundUser.recipes = foundUser.recipes.filter((recipe)=>{
        recipe.id !== action.payload.recipeId
      })
    },
    addDescription(state, action) {
      const foundUser = state.users.find(
        (user) => user.username === action.payload.username
      );
      const foundRecipe = foundUser.recipes.find(
        (recipe) => recipe.id === +action.payload.recipeId
      );

      foundRecipe.description = action.payload.description;
    },
    removeDescription(state, action) {
      const foundUser = state.users.find(
        (user) => user.username === action.payload.username
      );
      const foundRecipe = foundUser.recipes.find(
        (recipe) => recipe.id === +action.payload.recipeId
      );
      foundRecipe.description = "";
    },
  },
});

const authMiddleware =
  ({ dispatch, store }) =>
  (next) =>
  (action) => {
    if (fridgeActions.login.match(action)) {
      localStorage.setItem("userId", action.payload.id);
    } else if (fridgeActions.logout.match(action)) {
      localStorage.removeItem("userId");
    }
    return next(action);
  };

const store = configureStore({
  reducer: fridgeSlice.reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});

export const fridgeActions = fridgeSlice.actions;

export default store;
