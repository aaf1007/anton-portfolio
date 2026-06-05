import { HoverEffect } from "@/components/ui/card-hover-effect";
import { lifePhotos } from "@/data/portfolio";

const items = lifePhotos.map((img) => ({ img }));

export default function LifeCards() {
  return (
    <div className="mx-auto">
      <HoverEffect items={items} />
    </div>
  );
}
