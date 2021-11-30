import { fridgeActions } from ".";

export const authMiddleware =
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
