import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { setupServerActionHooks, createServerActionsKeyFactory } from 'zsa-react-query'

import { queryKeys } from '@/lib/query-keys'

export const QueryKeyFactory = createServerActionsKeyFactory(queryKeys)

const { useServerActionQuery, useServerActionMutation, useServerActionInfiniteQuery } =
  setupServerActionHooks({
    hooks: {
      useQuery: useQuery,
      useMutation: useMutation,
      useInfiniteQuery: useInfiniteQuery,
    },
    queryKeyFactory: QueryKeyFactory,
  })

export { useServerActionInfiniteQuery, useServerActionMutation, useServerActionQuery }
