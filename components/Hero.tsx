
export default function Hero() {
    return (
        <div>
            <div className="h-[80vh] flex flex-col md:grid md:grid-cols-[1fr_auto_auto_1fr] md:grid-rows-[1fr_auto_1fr] justify-center items-center w-full gap-6 md:gap-12 px-4 md:px-0">
                <div className="flex flex-col gap-0 items-center md:col-start-2 md:row-start-2">
                    <h1 className="text-[clamp(1.8rem,8vw,5rem)] md:whitespace-nowrap text-center">Anton Florendo</h1>
                    <ul className="flex gap-3 text-xl flex-wrap justify-center">
                        <li className="hover:text-[#404080] hover:font-bold"><a href="https://www.linkedin.com/in/antonflorendo">LinkedIn</a></li>
                        <li className="hover:text-[#404080] hover:font-bold"><a href="https://github.com/aaf1007">GitHub</a></li>
                        <li className="hover:text-[#404080] hover:font-bold"><a href="mailto:aaf13@sfu.ca">SFU Email</a></li>
                    </ul>
                </div>
                <img src="./pfp.jpeg" alt="" className="w-[clamp(10rem,16vw,18rem)] md:col-start-3 md:row-start-2 md:row-span-1 shrink-0"/>
            </div>
        </div>
    );
}