import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import RawDataPage from "./pages/RawDataPage";
import ChartPage from "./pages/ChartPage";
import Navbar from "./components/NavBar";
import MyCharts from "./pages/MyCharts";

const AppRoutes: React.FC = () => {
  const location = useLocation();

  const showNavbar = location.pathname !== "/";

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/raw-data" element={<RawDataPage />} />
        <Route path="/build-chart" element={<ChartPage />} />
        <Route path="/my-charts" element={<MyCharts />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
