import React from "react";
import { cn } from "@/lib/utils";

interface PreviewButtonProps {
    onClick: () => void;
    disabled?: boolean;
    text: string;
}

const PreviewButton: React.FC<PreviewButtonProps> = ({ onClick, disabled = false, text }) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-2 py-1 rounded-lg shadow-md text-white text-sm",
                {
                    "bg-gray-500": disabled,
                    "bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 hover:from-blue-500 hover:via-purple-600 hover:to-blue-700 transform hover:scale-105 transition-transform": !disabled
                }
            )}
            disabled={disabled}
        >
            {text}
        </button>
    );
};

export default PreviewButton;
