import classes from "./NavlinksLoggedIn.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

function NavlinksLoggedIn(props) {
  const router = useRouter();

  return (
    <div className={classes.navigation}>
      <div
        className={
          router.asPath === "/shoppinglist"
            ? classes.navlinks_highlight
            : classes.navlinks
        }
      >
        <Link href="/shoppinglist">My Shopping List</Link>
      </div>
      <div
        className={
          router.asPath === "/recipes"
            ? classes.navlinks_highlight
            : classes.navlinks
        }
      >
        <Link href="/recipes">My Recipes</Link>
      </div>
      <div
        className={
          router.asPath === "/food"
            ? classes.navlinks_highlight
            : classes.navlinks
        }
      >
        <Link href="/food">My Food</Link>
      </div>
      <button className={classes.logout} onClick={props.logoutHandler}>
        Logout
      </button>
    </div>
  );
}

export default NavlinksLoggedIn;
