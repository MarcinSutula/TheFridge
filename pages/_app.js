import "../styles/globals.css";
import Header from "../components/header/Header";
import { Provider } from "react-redux";
import store from "../store/index";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Header />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
