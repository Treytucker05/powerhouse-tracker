import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'

export const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            cacheTime: 0,
        },
    },
})

export const renderWithProviders = (ui, options = {}) => {
    const queryClient = options.queryClient || createTestQueryClient()

    const Wrapper = ({ children }) =>
        createElement(QueryClientProvider, { client: queryClient }, children)

    return {
        queryClient,
        ...render(ui, { wrapper: Wrapper, ...options })
    }
}
