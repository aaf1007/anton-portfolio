import { Gap, PageHead } from "@/components/site/Section";
import { delay } from "@/lib/stagger";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";

const RESUME_PDF = "/resume.pdf";
const RESUME_IMAGE = "/resume.png";
const DOWNLOAD_NAME = "Anton_Florendo_Resume.pdf";

/** The resume as an image on the page, with the PDF one click away. */
export default function ResumePage() {
  return (
    <>
      <PageHead title="Resume" lede="Data science at SFU, software engineer at SAP, and the projects in between. One page.">
        <div className="s-btns">
          <a href={RESUME_PDF} download={DOWNLOAD_NAME} className="s-btn s-btn--solid">
            <ArrowDownToLine size={15} strokeWidth={2} /> Download PDF
          </a>
          <a href={RESUME_PDF} target="_blank" rel="noopener noreferrer" className="s-btn">
            Open in a new tab <ArrowUpRight size={15} strokeWidth={2} />
          </a>
        </div>
      </PageHead>
      <Gap />
      <div className="s-sheet s-in" style={delay(2)}>
        <img src={RESUME_IMAGE} alt="Resume of Anton Florendo" width={1700} height={2200} />
      </div>
    </>
  );
}
