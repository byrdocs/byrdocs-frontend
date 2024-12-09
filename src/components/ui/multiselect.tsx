import { useContext, useState, Dispatch, SetStateAction, createContext, ReactNode, useRef } from 'react'
import { cn } from "@/lib/utils"

import { Check, X, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge";

interface MultiSelectProps {
  children: Array<ReactNode>;
  onChange: Dispatch<SetStateAction<string[]>>;
  className?: string;
  search?: boolean;
  placeholder?: string;
}

const MultiSelectContext = createContext<{
  selected: string[]
  onSelect: (select: string, name: string) => void
}>({ selected: [], onSelect: () => { } });

function MultiSelectOption({ children, value }: {
  children: string;
  value: string;
}) {
  const { onSelect, selected } = useContext(MultiSelectContext);
  return (
    <CommandItem
      className='flex justify-between px-3 cursor-pointer'
      onSelect={() => onSelect(value, children)}
    >
      <span>{children}</span>
      <Check
        className={cn(
          "mr-2 h-4 w-4",
          selected.includes(value) ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  )
}

function MultiSelect({ children, onChange, className, search, placeholder, ...props }: MultiSelectProps) {
  const [selected, setSelected] = useState<string[]>([])
  const selectedName = useRef<Map<string, string>>(new Map())

  const [open, setOpen] = useState(false)

  const handleUnselect = (item: string) => {
    const next = selected.filter((i) => i !== item)
    onChange(next)
    setSelected(next)
  }

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between`}
          onClick={() => setOpen(!open)}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.slice(0, 2).map((item) => {
              const name = selectedName.current.get(item) || item
              return (
                <Badge
                  variant="secondary"
                  key={item}
                  className="mr-1"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUnselect(item)
                  }}
                >
                  {name}
                  <div
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </div>
                </Badge>
              );
            })}
            {selected.length > 2 && (
              <Badge variant="secondary" className="mr-1">
                +{selected.length - 2}
              </Badge>
            )}
            {
              selected.length === 0 &&
              <span className="text-muted-foreground">
                {placeholder || "选择..."}
              </span>
            }
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0 w-48">
        <Command className={className}>
          {search &&
            <CommandInput placeholder="搜索..." />
          }
          <CommandList>
            <CommandEmpty>空</CommandEmpty>
            <CommandGroup className='max-h-64 w-full overflow-auto'>
              <MultiSelectContext.Provider value={{
                selected, onSelect: (select, name) => {
                  const next = selected.includes(select)
                    ? selected.filter((item) => item !== select)
                    : [...selected, select]
                  selectedName.current.set(select, name)
                  setSelected(next)
                  onChange(next)
                  setOpen(true)
                }
              }}>
                {children}
              </MultiSelectContext.Provider>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { MultiSelect, MultiSelectOption }
