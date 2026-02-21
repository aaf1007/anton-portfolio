export default function HomePage() {
    return (
        <div className="flex flex-col gap-10">
            <div className="flex items-center">
                <div>
                    <p className="font-medium text-[2rem] tracking-wider text-accent">Hi I'm Anton</p>
                    <p>
                    I'm a Data Science student at SFU who enjoys building full-stack web apps and recently got into AI/ML. Some of my hobbies include playing tennis and basketball and spend way too much time at the gym.
                    </p>
                </div>
                <img src="./src/assets/P6140340.png" alt="" className="w-56 h-auto" />
            </div>
            <div>
                <p className="font-medium text-[1.4rem] text-accent-light">Interested In</p>
                <p>AI/ML and Distributed System. I am always excited to explore new ideas and learn modern technologies and frameworks. I am working on projects that combine impact and technical challenges.</p>
            </div>
            <div>
                <p className="font-medium text-[1.4rem] text-accent-light">Hobbies</p>
                <ul className="list-disc m-0 pl-5">
                    <li>gymming</li>
                    <li>cooking</li>
                    <li>eating</li>
                    <li>coding</li>
                </ul>
            </div>

        </div>
    )
}