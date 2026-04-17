import Footer from "@/components/Footer";
import { TechStack } from "@/components/TechStack";
import { LinkPreview } from "@/components/ui/link-preview";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const coursework = [
  "Intro to Artificial Intelligence",
  "Intro to Software Engineering",
  "Linear Algebra",
  "Business Statistics",
];

const hobbies = ["gym", "cooking", "eating", "coding"];

const digesting = [
  {
    name: "PyTorch Fundamentals",
    url: "https://www.learnpytorch.io/00_pytorch_fundamentals/",
  },
  {
    name: "RAG Made Simple",
    url: "https://www.amazon.ca/dp/B0D76734SZ?ref=ppx_yo2ov_dt_b_fed_digi_asin_title_351",
    image: "https://m.media-amazon.com/images/I/71zKbtDCWyL._SL1500_.jpg"
  },
  {
    name: "The Pragmatic Programmer",
    url: "https://www.amazon.ca/Pragmatic-Programmer-journey-mastery-Anniversary/dp/0135957052/ref=pd_lpo_d_sccl_1/132-1954098-3434648?pd_rd_w=TsM1m&content-id=amzn1.sym.d3f44101-6e04-446e-916c-a6ec5616982b&pf_rd_p=d3f44101-6e04-446e-916c-a6ec5616982b&pf_rd_r=JAWBGHBEZN6TJZS2N3GX&pd_rd_wg=N04GB&pd_rd_r=7838ce9c-ea90-441b-9162-4b5a2dc0666c&pd_rd_i=0135957052&psc=1",
    image: "https://m.media-amazon.com/images/I/71f1jieYHNL.jpg"
  },
  {
    name: "AI Engineering by Chip Huyen",
    url: "https://www.amazon.ca/AI-Engineering-Building-Applications-Foundation/dp/1098166302",
    image: "https://learning.oreilly.com/library/cover/9781098166298/250w/"
  },
  {
    name: "Stanford Lecture on AI Engineering",
    url: "https://x.com/RohOnChain/status/2043014662883786812?s=20",
  },
];

const learning = ["FastAPI", "Pytorch", "Claude Code"];

export default function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el =
          hash === "#contact"
            ? document.getElementById("contact")
            : hash === "#home"
            ? document.getElementById("home")
            : null;
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    return () => cancelAnimationFrame(id);
  }, [hash]);

  return (
    <div id="home" className="max-w-[740px] mx-auto flex flex-col gap-12 pb-20">
      {/* Intro */}
      <section>
        <h1 className="text-2xl font-semibold mb-3 text-foreground">
          hi, i'm Anton.
        </h1>
        <p className="text-foreground/75 text-md leading-relaxed">
          Data Science student at SFU. <br />
          Building full-stack applications, exploring AI/ML Engineering, and AI workflows.
        </p>
      </section>

      {/* Currently Focused On */}
      <section className="flex flex-col gap-2 text-md">
        <p className="text-xs font-medium uppercase tracking-widest text-primary/50 mb-2">
          currently...
        </p>
        <p className="text-foreground/75 leading-relaxed">
          <span className="font-medium">Exploring </span> AI Engineering, RAG Pipelines, and Deep Learning.
        </p>
        <p className="text-foreground/75">
          <span className="font-medium">Learning </span>
          {learning.join(", ")}
        </p>
        <div className="text-foreground/75">
          <span className="font-medium">Digesting</span>
          <ul className="space-y-1 mt-1 ml-4 list-none">
            {digesting.map(({ name, url, image }) => (
              <li key={name}>
                {image ? (
                  <LinkPreview
                    url={url}
                    isStatic={true}
                    imageSrc={image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-60 transition-colors hover:text-primary"
                  >
                    {name}
                  </LinkPreview>
                ) : (
                  <LinkPreview
                    url={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-60 transition-colors hover:text-primary"
                  >
                    {name}
                  </LinkPreview>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Coursework + Hobbies */}
      <section className="flex gap-40 flex-wrap">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary/50 mb-2">
            coursework
          </p>
          <ul className="space-y-1 text-foreground/75">
            {coursework.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary/50 mb-2">
            hobbies
          </p>
          <ul className="space-y-1 text-foreground/75">
            {hobbies.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tech Stack */}
      <section>
        <p className="text-xs font-medium uppercase tracking-widest text-primary/50">
          tech stack
        </p>
        <TechStack />
      </section>

      <Footer />
    </div>
  );
}
