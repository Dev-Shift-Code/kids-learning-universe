// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import Activity from "../client/src/pages/Activity";

const setLocation = vi.fn();
const mutateAsync = vi.fn().mockResolvedValue({ completion: { milestone: false, earnedMilestoneBadge: false } });

vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => ({ isAuthenticated: true, loading: false }) }));
vi.mock("@/const", () => ({ startLogin: vi.fn() }));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    learning: {
      childSnapshot: { useQuery: () => ({ data: { profile: { id: 7, ageGroup: "3–5" }, progress: [], activityProgress: [] }, isLoading: false }) },
      completeActivity: { useMutation: () => ({ isPending: false, mutateAsync }) },
    },
  },
}));
vi.mock("wouter", () => ({ useLocation: () => ["/", setLocation], useParams: () => ({ category: "alphabet-phonics" }) }));

beforeAll(() => {
  class AudioMock {
    volume = 0;
    currentTime = 0;
    play = vi.fn().mockResolvedValue(undefined);
    pause = vi.fn();
  }
  Object.defineProperty(window, "Audio", { configurable: true, value: AudioMock });
});

afterEach(() => {
  cleanup();
  mutateAsync.mockClear();
  setLocation.mockClear();
});

describe("Activity completion navigation", () => {
  it("dismisses the celebration and moves to the next level of the same activity", async () => {
    window.history.replaceState({}, "", "/activity/alphabet-phonics?profile=7&activity=learn-alphabet&level=1");
    render(<Activity />);

    fireEvent.click(screen.getByRole("button", { name: "A" }));
    fireEvent.click(screen.getByRole("button", { name: /finish this level/i }));

    const nextLevel = await screen.findByRole("button", { name: /next level/i });
    fireEvent.click(nextLevel);

    expect(setLocation).toHaveBeenCalledWith("/activity/alphabet-phonics?profile=7&activity=learn-alphabet&level=2");
    expect(screen.queryByRole("dialog", { name: /activity celebration/i })).toBeNull();
  });
});
