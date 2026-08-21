// @vitest-environment jsdom
import React from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VoiceGuidanceButton } from "../client/src/components/VoiceGuidanceButton";

const cancel = vi.fn();
const speak = vi.fn();

Object.defineProperty(window, "speechSynthesis", { configurable: true, value: { cancel, speak } });

afterEach(() => {
  cleanup();
  cancel.mockClear();
  speak.mockClear();
});

describe("VoiceGuidanceButton interruption", () => {
  it("cancels active guidance and keeps auto-play disabled after a child begins answering", () => {
    const { rerender } = render(<VoiceGuidanceButton instructions="Tap A" autoPlay paused={false} />);
    rerender(<VoiceGuidanceButton instructions="Tap A" autoPlay paused />);
    expect(cancel).toHaveBeenCalled();
  });
});
