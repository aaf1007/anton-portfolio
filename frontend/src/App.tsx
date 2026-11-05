import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./Layout";
import ReadingLayout from "./ReadingLayout";
import ExperiencePage from "./pages/ExperiencePage";
import HomePage from "./pages/HomePage";
import PhotosPage from "./pages/PhotosPage";
import ProjectsPage from "./pages/ProjectsPage";
import ResumePage from "./pages/ResumePage";
import BSCodePage from "./pages/projects/BSCodePage";
import CareerConnectPage from "./pages/projects/CareerConnectPage";
import MyProfessorPage from "./pages/projects/MyProfessorPage";
import TumorClassifierPage from "./pages/projects/TumorClassifierPage";
import VerifAIPage from "./pages/projects/VerifAIPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="experience" element={<ExperiencePage />} />
          <Route path="photos" element={<PhotosPage />} />
          <Route path="resume" element={<ResumePage />} />
          {/* old addresses */}
          <Route path="profile" element={<Navigate to="/experience" replace />} />
          <Route path="about" element={<Navigate to="/experience" replace />} />
          <Route path="contact" element={<Navigate to="/" replace />} />
          <Route path="quests" element={<Navigate to="/photos" replace />} />
          <Route path="life" element={<Navigate to="/photos" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="/projects" element={<ReadingLayout />}>
          <Route path="verifai" element={<VerifAIPage />} />
          <Route path="bscode" element={<BSCodePage />} />
          <Route path="careerconnect" element={<CareerConnectPage />} />
          <Route path="myprofessor" element={<MyProfessorPage />} />
          <Route path="tumor-classifier" element={<TumorClassifierPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
