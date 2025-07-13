import React from 'react'
import { JSDOM } from 'jsdom'

/* ---------- 1 · Browser globals ---------- */
const { window } = new JSDOM('', { url: 'http://localhost/' })
global.window   = window
global.document = window.document
global.navigator = { userAgent: 'node.js' }
global.ResizeObserver = class { observe(){} unobserve(){} disconnect(){} }

/* ---------- 2 · React in global scope ---------- */
global.React = React  // fixes "React is not defined" in JSX tests

/* ---------- 3 · Basic Supabase env stubs ---------- */
process.env.VITE_SUPABASE_URL      ||= 'http://test.supabase'
process.env.VITE_SUPABASE_ANON_KEY ||= 'test-anon-key'
