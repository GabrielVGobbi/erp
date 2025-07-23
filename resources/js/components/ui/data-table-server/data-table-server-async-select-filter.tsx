import * as React from "react"
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons"
import { Loader2, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

interface AsyncSelectOption {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
}

interface DataTableServerAsyncSelectFilterProps {
    title?: string
    apiEndpoint: string
    selectedValues?: string[]
    onValueChange?: (values: string[]) => void
    transformData?: (data: any) => AsyncSelectOption[]
    searchPlaceholder?: string
}

export function DataTableServerAsyncSelectFilter({
    title,
    apiEndpoint,
    selectedValues = [],
    onValueChange,
    transformData,
    searchPlaceholder = "Buscar..."
}: DataTableServerAsyncSelectFilterProps) {
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [options, setOptions] = React.useState<AsyncSelectOption[]>([])
    const [searchValue, setSearchValue] = React.useState('')
    const [hasNextPage, setHasNextPage] = React.useState(true)
    const [currentPage, setCurrentPage] = React.useState(1)

    // Debounce timeout ref
    const debounceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

    // Função para buscar dados da API
    const fetchData = React.useCallback(async (page: number = 1, search: string = '', append: boolean = false) => {
        if (!apiEndpoint) return

        setLoading(true)

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                pageSize: '10',
                search: search
            })

            const response = await fetch(`${apiEndpoint}?${params}`)
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`)
            }

            const responseData = await response.json()
            
            // Transformar dados se necessário
            const newOptions = transformData 
                ? transformData(responseData.data)
                : responseData.data.map((item: any) => ({
                    label: item.name || item.label || item.search,
                    value: item.id.toString()
                }))

            // Verificar se há próxima página
            const hasMore = responseData.current_page < responseData.last_page

            setOptions(prevOptions => append ? [...prevOptions, ...newOptions] : newOptions)
            setHasNextPage(hasMore)
            setCurrentPage(page)
        } catch (error) {
            console.error("Error fetching async select data:", error)
        } finally {
            setLoading(false)
        }
    }, [apiEndpoint, transformData])

    // Função com debounce para busca
    const debouncedSearch = React.useCallback((search: string) => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }

        debounceTimeoutRef.current = setTimeout(() => {
            setCurrentPage(1)
            fetchData(1, search, false)
        }, 300)
    }, [fetchData])

    // Busca inicial quando abre o popover
    React.useEffect(() => {
        if (open && options.length === 0) {
            fetchData(1, searchValue, false)
        }
    }, [open, fetchData, searchValue, options.length])

    // Função para carregar mais itens (infinite scroll)
    const loadMore = React.useCallback(() => {
        if (!loading && hasNextPage) {
            fetchData(currentPage + 1, searchValue, true)
        }
    }, [loading, hasNextPage, currentPage, searchValue, fetchData])

    // Manipulador para alternar uma opção de filtro
    function toggleOption(value: string) {
        if (!onValueChange) return

        const newValues = selectedValues.includes(value)
            ? selectedValues.filter(v => v !== value)
            : [...selectedValues, value]

        onValueChange(newValues)
    }

    // Função para verificar se um valor está selecionado
    function isSelected(value: string) {
        return selectedValues.includes(value)
    }

    // Limpa todos os filtros
    function clearFilters() {
        if (onValueChange) {
            onValueChange([])
        }
        setOpen(false)
    }

    // Handler para mudança no input de busca
    const handleSearchChange = (value: string) => {
        setSearchValue(value)
        debouncedSearch(value)
    }

    // Obter labels das opções selecionadas para exibir
    const selectedLabels = React.useMemo(() => {
        return options
            .filter(option => selectedValues.includes(option.value))
            .map(option => option.label)
    }, [options, selectedValues])

    const selectedCount = selectedValues.length

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                    {title}
                    {selectedCount > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal lg:hidden"
                            >
                                {selectedCount}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selectedCount > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal"
                                    >
                                        {selectedCount} selecionados
                                    </Badge>
                                ) : (
                                    selectedLabels.map((label, index) => (
                                        <Badge
                                            variant="secondary"
                                            key={index}
                                            className="rounded-sm px-1 font-normal"
                                        >
                                            {label}
                                        </Badge>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command shouldFilter={false}>
                    <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                        {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    </div>
                    <CommandList>
                        <CommandGroup>
                            {options.length === 0 && !loading && (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                    Nenhum resultado encontrado
                                </div>
                            )}
                            {options.map((option) => {
                                const selected = isSelected(option.value)
                                return (
                                    <div
                                        key={option.value}
                                        className="flex cursor-pointer items-center px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground"
                                        onClick={() => toggleOption(option.value)}
                                        role="button"
                                        tabIndex={0}
                                        aria-selected={selected}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault()
                                                toggleOption(option.value)
                                            }
                                        }}
                                        data-value={option.value}
                                        data-selected={selected}
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                selected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <CheckIcon className={cn("h-4 w-4")} />
                                        </div>
                                        {option.icon && (
                                            <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span>{option.label}</span>
                                    </div>
                                )
                            })}
                            {hasNextPage && !loading && (
                                <div
                                    className="flex cursor-pointer items-center justify-center px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    onClick={loadMore}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault()
                                            loadMore()
                                        }
                                    }}
                                >
                                    Carregar mais...
                                </div>
                            )}
                        </CommandGroup>
                        {selectedCount > 0 && (
                            <>
                                <CommandSeparator />
                                <div
                                    className="flex cursor-pointer items-center justify-center px-2 py-1.5 text-sm text-center hover:bg-accent hover:text-accent-foreground"
                                    onClick={clearFilters}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault()
                                            clearFilters()
                                        }
                                    }}
                                >
                                    Limpar filtros
                                </div>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
} 