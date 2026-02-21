import { Outlet } from "react-router-dom";
import SideBar from "./components/SideBar";
import Footer from "./components/Footer"
export default function Layout() {
  return (
    <div className="grid md:grid-cols-[300px_1fr_260px] w-full min-h-screen antialiased scroll-smooth">
      <div className="col-start-1 col-span-1 h-full pt-[15vh] fixed">
        <SideBar />
      </div>
      <main className="col-start-2 col-span-1 pt-[5vh]">
        <Outlet />
        <Footer />
      </main>
    </div>
  );
}
