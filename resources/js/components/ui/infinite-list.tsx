import React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import api from "@/lib/api"

export interface InfiniteListProps<T = any> {
  endpoint: string
  params?: Record<string, string | number | boolean | undefined>
  pageSize?: number
  search?: string
  transform?: (item: any) => T
  keyExtractor?: (item: T, index: number) => string
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  listClassName?: string
  emptyState?: React.ReactNode
  loadingItem?: React.ReactNode
  onItemsChange?: (items: T[]) => void
}

export function InfiniteList<T = any>({
  endpoint,
  params = {},
  pageSize = 15,
  search = "",
  transform,
  keyExtractor,
  renderItem,
  className,
  listClassName,
  emptyState,
  loadingItem,
  onItemsChange,
}: InfiniteListProps<T>) {
  const [items, setItems] = React.useState<T[]>([])
  const [page, setPage] = React.useState(1)
  const [hasNext, setHasNext] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const sentinelRef = React.useRef<HTMLDivElement | null>(null)

  const mapItem = React.useCallback(
    (raw: any): T => {
      return (transform ? transform(raw) : (raw as T))
    },
    [transform]
  )

  const fetchPage = React.useCallback(
    async (nextPage: number, replace: boolean) => {
      setLoading(true)
      try {
        const query: Record<string, any> = { page: nextPage, pageSize }
        if (search !== undefined && search !== null) query.search = search
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

        const dataArr: any[] = Array.isArray(payload?.data) ? payload.data : []
        const mapped = dataArr.map(mapItem)
        setItems((prev) => (replace ? mapped : [...prev, ...mapped]))

        const currentPage = payload?.current_page ?? nextPage
        const lastPage = payload?.last_page ?? (dataArr.length < pageSize ? currentPage : currentPage + 1)
        setHasNext(currentPage < lastPage)
        setPage(currentPage)
      } catch {
        // erros já tratados globalmente
      } finally {
        setLoading(false)
      }
    },
    [endpoint, mapItem, pageSize, params, search]
  )

  // Load first page and when search changes
  React.useEffect(() => {
    setItems([])
    setPage(1)
    setHasNext(true)
    fetchPage(1, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, JSON.stringify(params), endpoint])

  // Notify parent when items change
  React.useEffect(() => {
    onItemsChange?.(items)
  }, [items, onItemsChange])

  // IntersectionObserver to load more
  React.useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasNext && !loading) {
          fetchPage(page + 1, false)
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [fetchPage, hasNext, loading, page])

  return (
    <div className={cn("relative", className)}>
      <div className={cn("overflow-y-auto", listClassName)}>
        {items.length === 0 && !loading && (emptyState ?? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            Nenhum resultado
          </div>
        ))}

        {items.map((item, index) => (
          <React.Fragment key={keyExtractor ? keyExtractor(item, index) : String((item as any)?.id ?? index)}>
            {renderItem(item, index)}
          </React.Fragment>
        ))}

        <div ref={sentinelRef} />

        {loading && (
          loadingItem ?? (
            <div className="flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Carregando...
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default InfiniteList


