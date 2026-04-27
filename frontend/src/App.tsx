import { ThemeProvider } from "@/context/ThemeContext";
import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import LifePage from "./pages/LifePage";
import ProjectsPage from "./pages/ProjectsPage";
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
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/verifai" element={<VerifAIPage />} />
            <Route path="projects/bscode" element={<BSCodePage />} />
            <Route path="projects/careerconnect" element={<CareerConnectPage />} />
            <Route path="projects/myprofessor" element={<MyProfessorPage />} />
            <Route path="projects/tumor-classifier" element={<TumorClassifierPage />} />
            <Route path="life" element={<LifePage />} />
            <Route path="contact" element={<Navigate to="/#contact" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
