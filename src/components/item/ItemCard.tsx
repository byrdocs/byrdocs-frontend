import { Card } from "@/components/ui/card";

export function ItemCard({ children, progress, onCancel }: { children: React.ReactNode, progress?: number, onCancel?: () => void }) {
    return (
        <Card className="w-full rounded-none md:rounded-lg shadow-sm md:hover:shadow-md transition-shadow overflow-hidden relative group/card">
            {progress ? (
                <>
                    <div className="h-[5px] left-[150px] hidden md:block absolute bg-primary" style={{
                        width: `calc(${progress} * (100% - 150px))`
                    }}>
                    </div>
                    <div className="h-[5px] left-[112.5px] block md:hidden absolute bg-primary " style={{
                        width: `calc(${progress} * (100% - 112.5px))`
                    }}></div>
                    <div className=" absolute right-0 top-[5px] italic text-muted-foreground bg-muted px-1 rounded-l-md shadow-sm font-mono text-sm md:text-md">
                        {(progress * 100).toFixed(1)}%
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-1 mb-[1px] w-5 h-5 inline-block cursor-pointer" onClick={onCancel}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </div>
                </>) : null}
            <div className="grid grid-cols-[112.5px_1fr] md:grid-cols-[150px_1fr] gap-2 md:gap-6 min-h-[150px] md:min-h-[200px]">
                {children}
            </div>
        </Card>
    );
}
