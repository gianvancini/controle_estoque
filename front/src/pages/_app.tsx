import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import FooterBar from "./components/FooterBar";
import { Container } from "react-bootstrap";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="d-flex" style={{backgroundColor: '#e3e3e3', marginTop: "50px"}}>
      <SideBar/>
      <div style={{ flexGrow: 1, marginLeft: '250px'}}>
        <NavBar/>
        <Container className="flex-grow-1 d-flex justify-content-center align-items-center">
          <Component {...pageProps} />
        </Container>
        <FooterBar />
      </div>
    </div>
  );
}
