import {useState} from "react";
import Header from "./components/Header";
import Main from "./components/Main/Main";
import Background from "./components/Background";
import Footer from "./components/Footer";

function App() {
  const [useBackground, setUseBackground] = useState(localStorage.getItem("useBackground") || "true");
  function toggleBackgroundHandler() {
    localStorage.setItem("useBackground", !useBackground);
    setUseBackground((hasBackground) => (hasBackground === "true" ? "false" : "true"));
  }
  return (
    <>
      {useBackground === "true" && <Background />}
      <div className="z-50 bg-neutral-600">
        <Header onToggleBackground={toggleBackgroundHandler} />
        <Main />
        <Footer />
      </div>
    </>
  );
}

export default App;
