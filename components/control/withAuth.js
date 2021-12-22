import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { fridgeActions } from "../../store/index";
import { fetchFirestoreData } from "./initFirebase";
import { ALERT_OTHER } from "./config";
import { FindUser } from "../utils/helpers";

function withAuth(WrappedComponent) {
  return function CheckAuth(props) {
    const router = useRouter();
    const dispatch = useDispatch();
    const foundUser = FindUser();

    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId");

      if (userId) {
        if (!foundUser) {
          try {
            (async () => {
              const userData = await fetchFirestoreData(userId, "get");

              dispatch(
                fridgeActions.autoLogin({
                  user: {...userData},
                  id: userId,
                })
              );
            })();
          } catch (err) {
            alert(ALERT_OTHER);
            console.error(err);
          }
        }
        return <WrappedComponent {...props} />;
      } else if (!userId) {
        router.replace("/");
        return null;
      }
    }
    return null;
  };
}

export default withAuth;
