import { staggerContainer, useMotionVariants } from "@/lib/motion";
import { ArrowUpRight, Download } from "lucide-react";
import { motion } from "motion/react";

const RESUME_PDF = "/resume.pdf";
const RESUME_IMAGE = "/resume.png";
const DOWNLOAD_NAME = "Anton_Florendo_Resume.pdf";

export default function ResumePage() {
  const item = useMotionVariants();

  return (
    <motion.main
      className="flex flex-col gap-6 mx-auto pb-28 w-full max-w-3xl"
      variants={staggerContainer(0.06)}
      initial="hidden"
      animate="show"
    >
      <motion.div
        className="flex sm:flex-row flex-col sm:justify-between sm:items-end gap-4"
        variants={item}
      >
        <div>
          <h1 className="font-bold text-3xl sm:text-4xl tracking-tight">Resume</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Data Science at SFU, building full-stack and AI/ML projects.
          </p>
        </div>
        <a
          href={RESUME_PDF}
          download={DOWNLOAD_NAME}
          className="inline-flex justify-center items-center gap-2 bg-primary shadow-sm px-4 border ring-border/20 border-border rounded-xl ring-2 h-10 font-medium text-primary-foreground text-sm hover:opacity-90 transition-opacity shrink-0"
        >
          <Download className="size-4" />
          Download PDF
        </a>
      </motion.div>

      <motion.div
        className="bg-white shadow-sm border ring-border/20 border-border rounded-xl ring-2 overflow-hidden"
        variants={item}
      >
        <img
          src={RESUME_IMAGE}
          alt="Resume of Anton Florendo"
          className="w-full h-auto"
          width={1700}
          height={2200}
        />
      </motion.div>

      <motion.div variants={item}>
        <a
          href={RESUME_PDF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Open PDF in a new tab <ArrowUpRight className="size-3.5" />
        </a>
      </motion.div>
    </motion.main>
  );
}
