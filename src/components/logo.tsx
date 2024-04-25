export function Logo({
    className,
    size = 3
}: {
    className?: string,
    size?: number
}) {
    switch (size) {
        case 0:
            return (
                <h1 className={`text-2xl sm:text-3xl md:text-4xl text-center font-bold italic select-none ` + className} style={{ fontFamily: "'Saira Variable', sans-serif" }}>
                    byrdocs<span className={`sm:text-xl md:text-2xl`}>.org</span>
                </h1>
            )
        case 1:
            return (
                <h1 className={`text-3xl sm:text-4xl md:text-5xl text-center font-bold italic select-none ` + className} style={{ fontFamily: "'Saira Variable', sans-serif" }}>
                    byrdocs<span className={`text-xl sm:text-2xl md:text-3xl`}>.org</span>
                </h1>
            )
        case 2:
            return (
                <h1 className={`text-4xl sm:text-5xl md:text-6xl text-center font-bold italic select-none ` + className} style={{ fontFamily: "'Saira Variable', sans-serif" }}>
                    byrdocs<span className={`text-2xl sm:text-3xl md:text-4xl`}>.org</span>
                </h1>
            )
        default:
            return (
                <h1 className={`text-5xl sm:text-6xl md:text-7xl text-center font-bold italic select-none ` + className} style={{ fontFamily: "'Saira Variable', sans-serif" }}>
                    byrdocs<span className={`text-3xl sm:text-4xl md:text-5xl`}>.org</span>
                </h1>
            )
    }
}