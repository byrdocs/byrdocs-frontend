import { cn } from "@/lib/utils"

export function LoadingIcon({ className }: { className?: string }) {
    return (
        <svg stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={cn("animate-spin w-20 h-20 mx-auto select-none", className)}>
            <g className="loading_spinner"><circle cx="12" cy="12" r="9.5" fill="none" stroke-width="1"></circle></g>
        </svg>
    )
}

export function SuccessIcon() {
    return (
        <svg
            className="mx-auto h-24 w-24 text-green-500 select-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M5 13l4 4L19 7"
            ></path>
        </svg>
    )
}

export function ErrorIcon() {
    return (
        <svg
            className="mx-auto h-24 w-24 text-red-500 select-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M6 18L18 6M6 6l12 12"
            ></path>
        </svg>
    )
}
