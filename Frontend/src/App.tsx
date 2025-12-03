import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./Components/Home";
import "./App.css";
import ScholarshipDetails from "./Components/ScholarshipDetails";
import PrimaryHome from "./Components/PrimaryHome";
import Discovery from "./Components/Discovery";
import Login from "./Components/Login";
import MyApplications from "./Components/MyApplications";
import EssayCopilot from "./Components/EssayCopilot";
import EssayCopilot2 from "./Components/EssayCopilot2";
import CalendarView from "./Components/CalendarView";
import Saved from "./Components/Saved";
import ApiTest from "./Components/ApiTest";
import Admin from "./Components/admin/AdminPanel";

import Application from "./Components/Application";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/details/:id" element={<ScholarshipDetails />} />
          <Route path="/phome" element={<PrimaryHome />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/applications" element={<Application />} />
          <Route path="/application" element={<Application />} />
          <Route path="/essay-copilot" element={<EssayCopilot />} />
          <Route path="/essay-copilot2" element={<EssayCopilot2 />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/login" element={<Login />} />
          <Route path="/api-test" element={<ApiTest />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;