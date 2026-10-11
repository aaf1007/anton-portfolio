import { Label, PageTitle, Reveal } from "@/components/Typography";

const RESUME_PDF = "/resume.pdf";
const RESUME_IMAGE = "/resume.png";
const DOWNLOAD_NAME = "Anton_Florendo_Resume.pdf";

export default function ResumePage() {
  return (
    <div className="grid gap-x-12 gap-y-12 lg:grid-cols-3">
      <PageTitle className="lg:col-span-3">resume</PageTitle>

      <Reveal delay={0.25} className="lg:sticky lg:top-12 lg:self-start">
        <Label>one page</Label>
        <p className="max-w-[40ch] text-muted-foreground">
          Data science at SFU, software developer at SAP, and the projects in between.
        </p>
        <ul className="mt-6 border-t border-rule">
          <li>
            <a
              href={RESUME_PDF}
              download={DOWNLOAD_NAME}
              className="group flex items-center justify-between border-b border-rule py-3 transition-colors hover:bg-muted"
            >
              <span className="pl-1">download pdf</span>
              <span className="pr-1 text-signal transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
            </a>
          </li>
          <li>
            <a
              href={RESUME_PDF}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between border-b border-rule py-3 transition-colors hover:bg-muted"
            >
              <span className="pl-1">open in a new tab</span>
              <span className="pr-1 text-signal transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
            </a>
          </li>
        </ul>
      </Reveal>

      <Reveal delay={0.35} className="lg:col-span-2">
        <div className="overflow-hidden rounded-[6px] border border-rule bg-white shadow-[0_30px_80px_-40px_rgb(0_0_0/0.7)] dark:brightness-[0.92]">
          <img src={RESUME_IMAGE} alt="Resume of Anton Florendo" className="h-auto w-full" width={1700} height={2200} />
        </div>
      </Reveal>
    </div>
  );
}
