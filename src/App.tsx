import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LandingPage from "./Pages/LandingPage/LandingPage";
import TeamAddingPage from "./Pages/TeamAddingPage/TeamAddingPage";
import { resetApp } from "./redux/store";
import "./App.css";

const App = () => {
  const [started, setStarted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const isStarted = localStorage.getItem("tournamentStarted");
    setStarted(isStarted === "true");
  }, []);

  const handleClear = () => {
    dispatch(resetApp());
    localStorage.clear();
    setStarted(false);
  };

  return (
    <>
    <div className="font-Gabarito">
      
      {started && (
        <button className="absolute left-12 top-4" onClick={handleClear} style={{ margin: "10px" }}>
          Reset Tournament
        </button>
      )}

      {started ? (
        <LandingPage />
      ) : (
        <TeamAddingPage onStart={() => setStarted(true)} />
      )}
      </div>
    </>
  );
};

export default App;
