import { ANNIVERSARY_URL } from "@/config"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

const Confetti = () => {
    const [confetti, setConfetti] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const colors = ['#3b82f6', '#facc15', '#f97316', '#22c55e', '#9333ea', '#ec4899', '#6366f1', '#eab308', '#fbbf24', '#34d399'];
        const confettiElements: JSX.Element[] = [];

        const positions = [
            { left: '25%', top: '80%' },
            { left: '35%', top: '120%' },
            { left: '40%', top: '5%' },
            { left: '45%', top: '20%' },
            { left: '50%', top: '-20%' },
            { left: '55%', top: '10%' },
            { left: '65%', top: '5%' },
            { left: '74%', top: '15%' },
            { left: '78%', top: '50%' },
            { left: '71%', top: '10%' },
            { left: '20%', top: '30%' },
            { left: '30%', top: '-10%' },
            { left: '50%', top: '90%' },
            { left: '70%', top: '85%' },
            { left: '72%', top: '100%' }
        ];

        const animations = [
            'float1',
            'float2',
            'float3',
            'float4',
            'float5'
        ];

        positions.forEach((pos, i) => {
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const animationDuration = `${Math.random() * 3 + 2}s`;
            const animationDelay = `${Math.random() * 2}s`;
            const rotate = Math.random() * 10 - 5;
            const animation = animations[Math.floor(Math.random() * animations.length)];

            confettiElements.push(
                <div
                    key={i}
                    className="absolute pointer-events-none -z-10 transition-all"
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        left: pos.left,
                        top: pos.top,
                        backgroundColor: color,
                        transform: `rotate(${rotate}deg)`, 
                        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                        animation: `${animation} ${animationDuration} ease-in-out infinite`,
                        animationDelay: animationDelay,
                        opacity: Math.random() * 0.5 + 0.3 
                    }}
                />
            );
        });
        
        setConfetti(confettiElements);
    }, []);

    return <>{confetti}</>;
}

function T365() {
    return <Link
        to={ANNIVERSARY_URL}
        className="text-primary hover:text-primary/80"
        target="_blank"
        onClick={(e) => e.stopPropagation()}
    >
        365
    </Link>
}

export function Logo({
    className,
    size = 3
}: {
    className?: string,
    size?: number
}) {
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @keyframes float1 {
                0%, 100% { }
                50% { transform: translateY(-3px) scale(0.95); }
            }
            @keyframes float2 {
                0%, 100% { }
                50% { transform: translateY(3px) rotate(10deg) scale(0.95); }
            }
            @keyframes float3 {
                0%, 100% { }
                50% { transform: translateY(-5px) rotate(-10deg) scale(1); }
            }
            @keyframes float4 {
                0%, 100% { }
                50% { transform: translateY(5px) scale(1.05); }
            }
            @keyframes float5 {
                0%, 100% { }
                50% { transform: translateY(-5px) scale(0.95); }
            }
        `;
        document.head.appendChild(styleElement);
        
        return () => {
            document.head.removeChild(styleElement);
        };
    }, []);
    
    let logoElement;
    
    switch (size) {
        case 0:
            logoElement = (
                <h1 className={`text-3xl md:text-4xl text-center font-bold italic select-none ` + className} style={{ fontFamily: "'Saira Variable', sans-serif" }}>
                    byrdocs<span className={`text-xl md:text-2xl`}>.<T365 /></span>
                </h1>
            );
            break;
        case 1:
            logoElement = (
                <h1 className={`text-3xl sm:text-4xl md:text-5xl text-center font-bold italic select-none ` + className} style={{ fontFamily: "'Saira Variable', sans-serif" }}>
                    byrdocs<span className={`text-xl sm:text-2xl md:text-3xl`}>.<T365 /></span>
                </h1>
            );
            break;
        case 2:
            logoElement = (
                <h1 className={`text-5xl md:text-6xl text-center font-bold italic select-none ` + className} style={{ fontFamily: "'Saira Variable', sans-serif" }}>
                    byrdocs<span className={`text-3xl md:text-4xl`}>.<T365 /></span>
                </h1>
            );
            break;
        default:
            logoElement = (
                <h1 className={`text-5xl sm:text-6xl md:text-7xl text-center font-bold italic select-none ` + className} style={{ fontFamily: "'Saira Variable', sans-serif" }}>
                    byrdocs<span className={`text-3xl sm:text-4xl md:text-5xl`}>.<T365 /></span>
                </h1>
            );
            break;
    }
    
    return (
        <div className="relative">
            <Confetti />
            {logoElement}
        </div>
    );
}