import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ItemCover({ src, alt, index, className, onClick }: { index?: number, src: string; alt: string, className?: string, onClick?: () => void }) {
    const imgRef = useRef(null);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img: HTMLImageElement = entry.target as HTMLImageElement;
                        img.src = img.dataset.src as string;
                        observer.unobserve(img);
                    }
                });
            },
            {
                rootMargin: '50px',
                threshold: 0.01
            }
        );

        const imgElement = imgRef.current;
        if (imgElement) {
            observer.observe(imgElement);
        }

        return () => {
            if (imgElement) {
                observer.unobserve(imgElement);
            }
        };
    }, [src]);

    return (
        <div className="relative group h-full my-auto" onClick={() => {
            if (!isError && onClick) {
                onClick();
            }
        }}>
            <div className="h-full flex">
                <img
                    alt={alt}
                    ref={imgRef}
                    data-src={src}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                        (e.target as HTMLImageElement).style.aspectRatio = "3/4";
                        setIsError(true);
                        if (index === 0) {
                            fetch(src, {
                                redirect: "manual"
                            })
                                .then((res: Response) => {
                                    if (res.type === 'opaqueredirect') {
                                        if (location.origin === "https://byrdocs.org") {
                                            toast("网络环境错误，请刷新以登录", {
                                                description: "您当前的网络似乎不是北邮校园网，我们需要登录来认证您的身份",
                                                duration: 100000,
                                                dismissible: false,
                                                action: {
                                                    label: "登录",
                                                    onClick: () => {
                                                        location.reload();
                                                    }
                                                },
                                            })
                                        } else {
                                            toast("网络环境错误", {
                                                description: "您可以切换到校园网环境，或者访问正式版网站。",
                                                duration: 100000,
                                                action: {
                                                    label: "跳转",
                                                    onClick: () => {
                                                        location.href = location.href.replace(location.origin, "https://byrdocs.org")
                                                    }
                                                },
                                                cancel: {
                                                    label: "关闭",
                                                    onClick: () => {}
                                                }
                                            })
                                        }
                                    }
                                })
                        }
                    }}
                    className={cn(
                        "object-cover transition-opacity duration-100 max-w-full max-h-full w-full my-auto " + className,
                        {
                            "group-hover:opacity-30": !isError,
                        }
                    )}
                />
            </div>
            <div className={cn(
                "absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 transition-opacity duration-100 cursor-pointer",
                {
                    "group-hover:opacity-100": !isError,
                }
            )}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
            </div>
        </div>
    );
}
