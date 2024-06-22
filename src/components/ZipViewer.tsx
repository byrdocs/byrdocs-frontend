// ZipViewer.tsx
import React from "react";

const ZipViewer: React.FC<{ files: string[] }> = ({ files }) => {
    return (
        <div className="p-4">
            <h3 className="text-lg font-bold mb-2">ZIP 文件内容</h3>
            <ul className="list-disc pl-5 space-y-1">
                {files.map((file, index) => (
                    <li key={index} className="text-sm">
                        {file}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ZipViewer;
