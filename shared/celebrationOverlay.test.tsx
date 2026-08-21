// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CelebrationOverlay } from "../client/src/components/CelebrationOverlay";

class AudioMock {
  currentTime = 0;
  volume = 1;
  pause = vi.fn();
  play = vi.fn().mockResolvedValue(undefined);
}

Object.defineProperty(window, "Audio", { configurable: true, value: AudioMock });

afterEach(() => cleanup());

describe("CelebrationOverlay actions", () => {
  it("invokes the home callback when Back to Home is clicked", () => {
    const onBackToLevels = vi.fn();
    render(<CelebrationOverlay stars={3} milestone={false} onBackToLevels={onBackToLevels} onNextLevel={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /^back$/i }));
    expect(onBackToLevels).toHaveBeenCalledOnce();
  });

  it("invokes the level callback when Next Level is clicked", () => {
    const onNextLevel = vi.fn();
    render(<CelebrationOverlay stars={3} milestone={true} onBackToLevels={vi.fn()} onNextLevel={onNextLevel} />);
    fireEvent.click(screen.getByRole("button", { name: /next level/i }));
    expect(onNextLevel).toHaveBeenCalledOnce();
  });
});
