import { Logos3 } from "@/components/blocks/Logos3";

const demoData = {
  logos: [
    {
      id: "logo-3",
      description: "Next.js",
      image: "https://www.shadcnblocks.com/images/block/logos/nextjs.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-4",
      description: "React",
      image: "https://www.svgrepo.com/show/354259/react.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-5",
      description: "shadcn/ui",
      image: "https://www.shadcnblocks.com/images/block/logos/shadcn-ui.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-7",
      description: "Tailwind CSS",
      image: "https://www.shadcnblocks.com/images/block/logos/tailwind.svg",
      className: "h-6 w-auto",
    },
    {
      id: "logo-8",
      description: "Vercel",
      image: "https://www.svgrepo.com/show/354512/vercel.svg",
      className: "h-20 w-auto",
    },
    {
      id: "logo-9",
      description: "Python",
      image: "https://www.shadcnblocks.com/images/block/logos/python.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-10",
      description: "SpringBoot",
      image: "https://www.svgrepo.com/show/376350/spring.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-11",
      description: "NodeJS",
      image: "https://www.vectorlogo.zone/logos/nodejs/nodejs-ar21.svg",
      className: "h-10 w-auto",
    },
  ],
};

function TechStack() {
  return <Logos3 {...demoData} />;
}

export { TechStack };
