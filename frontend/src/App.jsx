import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AnalysisPage from "./pages/AnalysisPage";
import HomePage from "./pages/HomePage";
import RoundsPage from "./pages/RoundsPage";

import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import RoundDetailPage from "./pages/RoundDetailPage";

export default function App() {
  return (
    <div className="flex flex-col bg-base-200">
      {/* Navbar at the top */}
      <Navbar />
      {/* Content div with the sidebar on the left */}
      <div className="flex flex-1 top-16">
        <Sidebar />
        <main className="flex-1 ml-16 lg:ml-40 mt-16 overflow-auto p-3 transition-all duration-300 ">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rounds" element={<RoundsPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/round/:roundId/hole/:holeNum" element={<RoundDetailPage />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </div>
  )
}
