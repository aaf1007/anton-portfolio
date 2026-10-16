import { useRaster } from "@/lib/raster";
import "@/styles/resume.css";
import { useRef } from "react";

const RESUME_PDF = "/resume.pdf";
const RESUME_IMAGE = "/resume.png";
const DOWNLOAD_NAME = "Anton_Florendo_Resume.pdf";

/** The resume as a page on the desk, with the PDF one click away. Not on the reference site (hers links out to a PDF). */
export default function ResumePage() {
  const heading = useRef<HTMLHeadingElement>(null);
  useRaster(heading);
  return (
    <div className="resume">
      <header className="resume-head">
        <h1 ref={heading} className="resume-title">
          Resume
        </h1>
        <p className="resume-sub">Data science at SFU, software developer at SAP, and the projects in between. One page.</p>
        <div className="resume-actions">
          <a href={RESUME_PDF} download={DOWNLOAD_NAME} className="badge resume-btn">
            Download PDF ↓
          </a>
          <a href={RESUME_PDF} target="_blank" rel="noopener noreferrer" className="badge resume-btn">
            Open in a new tab ↗
          </a>
        </div>
      </header>
      <div className="resume-sheet">
        <img src={RESUME_IMAGE} alt="Resume of Anton Florendo" width={1700} height={2200} />
      </div>
    </div>
  );
}
