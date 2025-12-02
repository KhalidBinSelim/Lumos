import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import Home from "./Components/Home";
import "./App.css";
import ScholarshipDetails from "./Components/ScholarshipDetails";
import PrimaryHome from "./Components/PrimaryHome";
import Discovery from "./Components/Discovery";
import Login from "./Components/Login";
import MyApplications from "./Components/MyApplications";
import EssayCopilot from "./Components/EssayCopilot";
import Calendar from "./Components/Calendar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/details" element={<ScholarshipDetails />} />
        <Route path="/phome" element={<PrimaryHome />} />
        <Route path="/discovery" element={<Discovery />} />
        <Route path="/applications" element={<MyApplications />} />
        <Route path="/essay-copilot" element={<EssayCopilot />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;