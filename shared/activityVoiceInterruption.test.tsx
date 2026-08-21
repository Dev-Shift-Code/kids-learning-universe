// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import Activity from "../client/src/pages/Activity";

const setLocation = vi.fn();
const cancel = vi.fn();

vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => ({ isAuthenticated: true, loading: false }) }));
vi.mock("@/const", () => ({ startLogin: vi.fn() }));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    learning: {
      childSnapshot: { useQuery: () => ({ data: { profile: { id: 7, ageGroup: "3–5" }, progress: [], activityProgress: [] }, isLoading: false }) },
      completeActivity: { useMutation: () => ({ isPending: false, mutateAsync: vi.fn() }) },
    },
  },
}));
vi.mock("wouter", () => ({ useLocation: () => ["/", setLocation], useParams: () => ({ category: "alphabet-phonics" }) }));

Object.defineProperty(window, "speechSynthesis", { configurable: true, value: { cancel, speak: vi.fn() } });

beforeAll(() => {
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", { configurable: true, value: () => ({ scale: vi.fn(), beginPath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), stroke: vi.fn(), lineCap: "", lineJoin: "", lineWidth: 0, strokeStyle: "" }) });
  Object.defineProperty(HTMLCanvasElement.prototype, "setPointerCapture", { configurable: true, value: vi.fn() });
  Object.defineProperty(HTMLCanvasElement.prototype, "getBoundingClientRect", { configurable: true, value: () => ({ width: 400, height: 250, left: 0, top: 0 }) });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  cancel.mockClear();
  setLocation.mockClear();
});

beforeEach(() => vi.useFakeTimers());

function renderActivity(activity: string) {
  window.history.replaceState({}, "", `/activity/alphabet-phonics?profile=7&activity=${activity}&level=1`);
  return render(<Activity />);
}

describe("Activity voice interruption", () => {
  it("pauses guidance after a choice answer", () => {
    renderActivity("learn-alphabet");
    fireEvent.click(screen.getByRole("button", { name: "A" }));
    expect(cancel).toHaveBeenCalled();
    const voiceButton = screen.getByRole("button", { name: /listen to the activity instructions/i }) as HTMLButtonElement;
    expect(voiceButton.disabled).toBe(true);
    expect(voiceButton.textContent).toContain("Voice paused");
    vi.advanceTimersByTime(1000);
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
  });

  it("pauses guidance when a drag answer begins", () => {
    const { container } = renderActivity("letter-matching");
    const draggable = container.querySelector('button[draggable="true"]');
    expect(draggable).not.toBeNull();
    fireEvent.dragStart(draggable!, { dataTransfer: { setData: vi.fn() } });
    expect(cancel).toHaveBeenCalled();
    const voiceButton = screen.getByRole("button", { name: /listen to the activity instructions/i }) as HTMLButtonElement;
    expect(voiceButton.disabled).toBe(true);
    expect(voiceButton.textContent).toContain("Voice paused");
    vi.advanceTimersByTime(1000);
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
  });

  it("pauses guidance when drawing begins", () => {
    renderActivity("letter-tracing");
    fireEvent.pointerDown(screen.getByLabelText(/drawing canvas/i), { pointerId: 1, clientX: 24, clientY: 24 });
    expect(cancel).toHaveBeenCalled();
    const voiceButton = screen.getByRole("button", { name: /listen to the activity instructions/i }) as HTMLButtonElement;
    expect(voiceButton.disabled).toBe(true);
    expect(voiceButton.textContent).toContain("Voice paused");
    vi.advanceTimersByTime(1000);
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
  });
});
