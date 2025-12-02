import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import Home from "./Components/Home";
import "./App.css";
import ScholarshipDetails from "./Components/ScholarshipDetails";
import PrimaryHome from "./Components/PrimaryHome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/details" element={<ScholarshipDetails />} />
        <Route path="/phome" element={<PrimaryHome />} />
      </Routes>
    </Router>
  );
}

export default App;