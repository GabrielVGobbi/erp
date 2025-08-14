import React from "react"
import { Loader2, Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import api from "@/lib/api"

type Option = { label: string; value: string; [key: string]: unknown }

interface AsyncSelectProps {
  endpoint: string
  multiple?: boolean
  value: string | null | string[]
  onChange: (value: string | string[] | null) => void
  placeholder?: string
  searchParam?: string
  pageSize?: number
  params?: Record<string, string | number | boolean | undefined>
  transform?: (item: any) => Option
  renderOption?: (option: Option, selected: boolean) => React.ReactNode
  className?: string
  triggerClassName?: string
  disabled?: boolean
}

export function AsyncSelect({
  endpoint,
  multiple = false,
  value,
  onChange,
  placeholder = "Selecionar...",
  searchParam = "search",
  pageSize = 10,
  params = {},
  transform,
  renderOption,
  className,
  triggerClassName,
  disabled,
}: AsyncSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [options, setOptions] = React.useState<Option[]>([])
  const [labelCache, setLabelCache] = React.useState<Record<string, string>>({})
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [hasNext, setHasNext] = React.useState(true)

  const selectedValues = React.useMemo<string[]>(() => {
    if (multiple) return Array.isArray(value) ? value : []
    return value ? [value as string] : []
  }, [value, multiple])

  const debounceRef = React.useRef<NodeJS.Timeout | null>(null)

  const mapItemToOption = React.useCallback(
    (item: any): Option => {
      if (transform) return transform(item)
      return {
        label: item.name ?? item.label ?? item.description ?? String(item.id),
        value: String(item.id),
        ...item,
      }
    },
    [transform]
  )

  const fetchPage = React.useCallback(
    async (nextPage: number, currentSearch: string, append: boolean) => {
      setLoading(true)
      try {
        const query: Record<string, any> = { page: nextPage, pageSize }
        if (currentSearch) query[searchParam] = currentSearch
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== "") query[k] = v
        })

        let payload: any
        if (endpoint.startsWith("/")) {
          const qs = new URLSearchParams(query as Record<string, string>).toString()
          const res = await fetch(`${endpoint}?${qs}`, { credentials: "same-origin" })
          payload = await res.json()
        } else {
          const { data } = await api.get(endpoint, { params: query })
          payload = data
        }

        const items: any[] = Array.isArray(payload?.data) ? payload.data : []
        const newOptions = items.map(mapItemToOption)

        setOptions((prev) => (append ? [...prev, ...newOptions] : newOptions))
        setLabelCache((prev) => {
          const next = { ...prev }
          for (const opt of newOptions) {
            next[opt.value] = opt.label
          }
          return next
        })

        const currentPage = payload?.current_page ?? nextPage
        const lastPage = payload?.last_page ?? (items.length < pageSize ? currentPage : currentPage + 1)
        setHasNext(currentPage < lastPage)
        setPage(currentPage)
      } catch (e) {
        // silencioso: erros já tratados no interceptor
      } finally {
        setLoading(false)
      }
    },
    [endpoint, mapItemToOption, pageSize, params, searchParam]
  )

  const debouncedSearch = React.useCallback(
    (text: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        fetchPage(1, text, false)
      }, 350)
    },
    [fetchPage]
  )

  React.useEffect(() => {
    if (open && options.length === 0) {
      fetchPage(1, search, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const toggle = React.useCallback(
    (val: string) => {
      if (multiple) {
        const set = new Set(selectedValues)
        if (set.has(val)) set.delete(val)
        else set.add(val)
        onChange(Array.from(set))
      } else {
        onChange(val === selectedValues[0] ? null : val)
        setOpen(false)
      }
    },
    [multiple, onChange, selectedValues]
  )

  const clearAll = React.useCallback(() => {
    onChange(multiple ? [] : null)
  }, [onChange, multiple])

  const selectedLabels = React.useMemo(() => {
    return selectedValues.map((v) => labelCache[v] ?? v)
  }, [labelCache, selectedValues])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("w-full justify-between", triggerClassName)}
          disabled={disabled}
        >
          <span className="truncate text-left">
            {selectedLabels.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : multiple ? (
              <span className="flex flex-wrap gap-1">
                {selectedLabels.slice(0, 3).map((lbl, i) => (
                  <Badge key={i} variant="secondary" className="max-w-[140px] truncate">
                    {lbl}
                  </Badge>
                ))}
                {selectedLabels.length > 3 && (
                  <Badge variant="secondary">+{selectedLabels.length - 3}</Badge>
                )}
              </span>
            ) : (
              selectedLabels[0]
            )}
          </span>
          {selectedValues.length > 0 ? (
            <X
              className="ml-2 h-4 w-4 opacity-60 hover:opacity-90"
              onClick={(e) => {
                e.stopPropagation()
                clearAll()
              }}
            />
          ) : (
            <Search className="ml-2 h-4 w-4 opacity-50" />)
          }
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className={cn("w-[380px] p-0", className)}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar..."
            value={search}
            onValueChange={(val) => {
              setSearch(val)
              debouncedSearch(val)
            }}
          />
          <CommandList
            onScroll={(e) => {
              const el = e.currentTarget
              if (!loading && hasNext && el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
                fetchPage(page + 1, search, true)
              }
            }}
          >
            {options.length === 0 && !loading && (
              <CommandEmpty>Nenhum resultado encontrado</CommandEmpty>
            )}
            <CommandGroup>
              {options.map((opt) => {
                const selected = selectedValues.includes(opt.value)
                return (
                  <CommandItem
                    key={opt.value}
                    onSelect={() => toggle(opt.value)}
                    className={cn("cursor-pointer", selected && "bg-accent")}
                  >
                    {renderOption ? renderOption(opt, selected) : (
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          selected ? "bg-primary text-primary-foreground" : "opacity-50"
                        )}>
                          <div className="h-2 w-2 rounded-sm bg-current" />
                        </div>
                        <span className="truncate">{opt.label}</span>
                      </div>
                    )}
                  </CommandItem>
                )
              })}
              {hasNext && !loading && (
                <div className="px-3 py-2 text-center text-sm text-muted-foreground">
                  Role para carregar mais...
                </div>
              )}
              {loading && (
                <div className="flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Carregando...
                </div>
              )}
            </CommandGroup>
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <div
                  className="cursor-pointer px-3 py-2 text-center text-sm hover:bg-accent"
                  onClick={clearAll}
                >
                  Limpar seleção
                </div>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default AsyncSelect


