import { LogoIcon } from "../utils/icons";
import classes from "./Logo.module.css";
import { useRouter } from "next/router";

function Logo() {
  const router = useRouter();

  const logoRedirectHandler = () => {
    router.push("/");
  };

  return (
    <div className={classes.logo}>
      <LogoIcon logoRedirect={logoRedirectHandler} />
      <h2 onClick={logoRedirectHandler}>The Fridge</h2>
    </div>
  );
}

export default Logo;
