import { Link } from "react-router-dom";
import { useState } from "react";

export default function SideBar() {
    const [current, setCurrent] = useState("");

    return (
        <div className="flex flex-col min-h-screen w-full pl-10 gap-4">
            <p className="font-extrabold text-[1.3rem] text-accent" onClick={()=>setCurrent("")}><Link to="/">Anton Florendo</Link></p>
            <ul className="flex flex-col gap-2">
                {/* <li className={`hover:text-accent-light ${current === "about" ? "font-bold text-accent-light" : ""}`} onClick={() => setCurrent("about")}>
                    <Link to="/about">about</Link>
                </li> */}
                <li className={`hover:text-accent-light ${current === "projects" ? "font-bold text-accent-light" : ""}`} onClick={() => setCurrent("projects")}>
                    <Link to="/projects">projects</Link>
                </li>
                <li className={`hover:text-accent-light ${current === "experience" ? "font-bold text-accent-light" : ""}`} onClick={() => setCurrent("experience")}>
                    <Link to="/projects">experience</Link>
                </li>
                <li className={`hover:text-accent-light ${current === "contact" ? "font-bold text-accent-light" : ""}`} onClick={() => setCurrent("contact")}>
                    <Link to="/contact">contact</Link>
                </li>
                <li className={`hover:text-accent-light ${current === "chat" ? "font-bold text-accent-light" : ""}`} onClick={() => setCurrent("chat")}>
                    <Link to="/contact">chat</Link>
                </li>
            </ul>
        </div>
    );
}
