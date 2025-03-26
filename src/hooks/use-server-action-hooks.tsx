import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { setupServerActionHooks, createServerActionsKeyFactory } from 'zsa-react-query'

export const QueryKeyFactory = createServerActionsKeyFactory({
  getPosts: () => ['getPosts'],
})

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
