import { AppType } from "next/app";
import "config/tailwind.css";
import "fonts/fonts.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;
