import React from "react";
import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import ThemeToggle from "../../tracker-ui/src/components/ui/ThemeToggle.jsx";

describe("ThemeToggle", () => {
  it("adds .dark on click", () => {
    const { getByRole } = render(<ThemeToggle />);
    const btn = getByRole("button");
    fireEvent.click(btn);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
