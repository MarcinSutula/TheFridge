export function logout(state) {
  state.users.forEach((user) => (user.id = ""));
}
