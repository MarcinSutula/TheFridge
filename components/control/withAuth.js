import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./initFirebase";

function withAuth(WrappedComponent) {
  return function Auth(props) {
    const router = useRouter();
    const dispatch = useDispatch();

    if (typeof window !== "undefined") {
      const getUserId = localStorage.getItem("userId");

      if (getUserId) {
        try {
          async () => {
            const docRef = doc(db, "users", getUserId);
            const docSnap = await getDoc(docRef);
            const getUser = docSnap.data();

            dispatch(
              fridgeActions.login({
                username: getUser.username,
                password: getUser.password,
                id: getUserId,
                foodId: getUser.foodId,
                totalQuantity: getUser.totalQuantity,
                totalWeight: getUser.totalWeight,
                food: getUser.food,
              })
            );
          };
        } catch (err) {
          alert("Something went wrong ! Please try again");
          console.error(err);
        }

        return <WrappedComponent {...props} />;
      } else if (!getUserId) {
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
