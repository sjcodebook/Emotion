import { useState, useEffect, useCallback, useRef } from 'react'

export const useLimitQuery = ({ limitDuration = 100 }: { limitDuration?: number }) => {
  const [queries, setQueries] = useState<(() => void)[]>([])
  const latestQueryRef = useRef<(() => void) | null>(null)

  const addQuery = useCallback((query: () => void) => {
    latestQueryRef.current = query

    setQueries((prev) => [...prev, query])
  }, [])

  const executeCb = useCallback(() => {
    if (queries.length === 0) return

    const latestQuery = queries[queries.length - 1]

    try {
      latestQuery()
    } catch (error) {
      console.error('Error executing query:', error)
    }

    setQueries([])
  }, [queries])

  useEffect(() => {
    return () => {
      if (latestQueryRef.current) {
        latestQueryRef.current()
      }
    }
  }, [])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined

    if (queries.length > 0) {
      timeoutId = setTimeout(() => {
        executeCb()
      }, limitDuration)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [executeCb, limitDuration, queries])

  return addQuery
}
