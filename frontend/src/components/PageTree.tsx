type PageTree = {
    page: string
}

export default function PageTree({ page }: PageTree) {
  return <div className="text-primary/40 text-[0.8rem]">/home/anton {'>'} <span className="text-primary/60">{page}.md</span></div>;
}