import { expect } from 'vitest'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, createElement } from '@testing-library/react'
import React from 'react'
import { JSDOM } from 'jsdom'

console.log('🟢 Test setup loading - timestamp:', Date.now())

/* 1 · Universal JSDOM window */
const { window } = new JSDOM('', { url: 'http://localhost/' })
global.window = window
global.document = window.document
global.navigator = window.navigator
global.location = window.location
global.self = window        // fixes some legacy tests
global.globalThis = window        // ditto

/* 2 · Browser-only APIs polyfills */
global.HTMLElement = window.HTMLElement
global.ResizeObserver = class { observe() { } unobserve() { } disconnect() { } }

/* 3 · React in global scope for JSX tests */
global.React = React

/* 4 · Minimal Supabase env so client factories don't blow up */
process.env.VITE_SUPABASE_URL ||= 'https://stub.supabase.co'
process.env.VITE_SUPABASE_ANON_KEY ||= 'stub-anon-key'

/* 5 · Mock Chart.js to prevent errors */
global.Chart = {
    register: () => { },
    defaults: {
        global: {
            responsive: true
        }
    }
}

console.log('🟢 Test setup complete - environment ready')
