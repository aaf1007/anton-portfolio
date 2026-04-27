import { HoverEffect } from "@/components/ui/card-hover-effect";

const items = [
  { img: "/pics/CE6AF28C-C289-46D7-9B0F-A2ED5C044787_1_105_c.jpeg" },
  { img: "/pics/5C821F67-8063-40E8-B669-C140862B3E88_1_105_c.jpeg" },
  { img: "/pics/045253D8-EFEA-4267-8B96-18CC2C75D6C6_1_105_c.jpeg" },
  { img: "/pics/0EF88007-1299-4AE3-AB79-4DFEDA5C6E5B_1_105_c.jpeg" },
  { img: "/pics/A6731119-E06D-41A8-8496-4922D9E9544B_4_5005_c.jpeg" },
  { img: "/pics/A278DBBD-0FC0-4514-A803-CD4DEB3914A0_4_5005_c.jpeg" },
];

export default function LifeCards() {
  return (
    <div className="mx-auto">
      <HoverEffect items={items} />
    </div>
  );
}
