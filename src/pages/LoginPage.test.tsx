import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";
import { useAuthStore } from "../stores/authStore";

describe("LoginPage", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isLoading: false,
      error: null,
      loadUser: vi.fn().mockResolvedValue(null),
      logout: vi.fn().mockResolvedValue(undefined)
    });
  });

  it("hiba nélkül elindul és megjeleníti a bejelentkezési oldalt", () => {
    expect(() => {
      render(
        <MemoryRouter initialEntries={["/login"]}>
          <LoginPage />
        </MemoryRouter>
      );
    }).not.toThrow();

    expect(screen.getByRole("heading", { name: "Bejelentkezés" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Belépés Google-lal" })).toBeInTheDocument();
  });
});
