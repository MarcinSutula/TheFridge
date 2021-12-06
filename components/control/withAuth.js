import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import { fetchFirestoreData } from "./initFirebase";
import { ALERT_OTHER } from "./config";

function withAuth(WrappedComponent) {
  return function checkAuth(props) {
    const router = useRouter();
    const dispatch = useDispatch();

    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          async () => {
            const userData = await fetchFirestoreData(userId, "get");

            dispatch(
              fridgeActions.login({
                username: userData.username,
                id: userId,
                foodId: userData.foodId,
                recipesId: userData.recipesId,
                totalQuantity: userData.totalQuantity,
                totalWeight: userData.totalWeight,
                food: userData.food,
                recipes: userData.recipes,
              })
            );
          };
        } catch (err) {
          alert(ALERT_OTHER);
          console.error(err);
        }

        return <WrappedComponent {...props} />;
      } else if (!userId) {
        router.replace("/");

        //Difficulty connecting withAuth when !getUserId && router.asPath='/'
        //Workaround in Header

        return null;
      }
    }
    return null;
  };
}

export default withAuth;
