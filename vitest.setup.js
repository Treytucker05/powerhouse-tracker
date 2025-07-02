global.document ||= global.window?.document
global.React ||= (await import('react')).default

import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

// clean the jsdom between tests
afterEach(() => cleanup());

// helper: use in tests: renderWithProviders(<MyComp />)
const queryClient = new QueryClient();
global.renderWithProviders = function (ui, options) {
  // This function must not contain JSX at the top level in this file.
  // Instead, dynamically require React and return a render function.
  const React = require("react");
  return render(
    React.createElement(
      BrowserRouter,
      null,
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        ui
      )
    ),
    options
  );
};

// polyfills for jsdom gaps
if (!global.ResizeObserver) {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
if (!global.IntersectionObserver) {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

