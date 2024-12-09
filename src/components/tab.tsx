import { cn } from "@/lib/utils";
import { createContext, useContext } from "react";

const TabContext = createContext<{
    selected: string | null,
    onSelect: (select: string) => void
}>({
    selected: null,
    onSelect: () => {}
})

export function TabItem({ children, value }: { children: string, value?: string }) {
    const context = useContext(TabContext)
    return (
        <div className={cn(
            "text-lg cursor-pointer py-1 px-2 md:px-4 transition-colors duration-100",
            {
                "text-primary font-bold border-b-2 border-primary": context.selected == (value ?? children),
                "text-muted-foreground": context.selected != (value ?? children),
            }
        )} onClick={() => {
            context.onSelect(value ?? children)
        }}>
            {children}
        </div>
    )
}

export function TabList({ onSelect: parentOnSelect, children, active }: { onSelect: (select: string) => void, children: React.ReactNode, active: string }) {
    return (
        <TabContext.Provider value={{ onSelect: (select) => {
            parentOnSelect(select)
        }, selected: active }}>
            {children}
        </TabContext.Provider>
    )
}
