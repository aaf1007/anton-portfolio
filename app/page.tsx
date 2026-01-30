
export default function Home() {
  return (
   <div>
      <div className="flex h-screen justify-center items-center gap-2 flex-col">
        <img src="./pfp.jpeg" alt="" className="w-46 rounded-full"/>
        <h1 className="text-6xl">Anton Florendo</h1>
        <ul className="flex gap-3 text-xl">
          <li className="hover:text-[#404080] hover:font-bold"><a href="https://www.linkedin.com/in/antonflorendo">LinkedIn</a></li>
          <li className="hover:text-[#404080] hover:font-bold"><a href="https://github.com/aaf1007">GitHub</a></li>
          <li className="hover:text-[#404080] hover:font-bold"><a href="mailto:aaf13@sfu.ca">SFU Email</a></li>
        </ul>
      </div>
   </div>
  );
}
