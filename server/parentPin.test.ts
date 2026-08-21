import { describe, expect, it } from "vitest";
import { hashParentPin, isValidParentPin, verifyParentPin } from "./parentPin";

describe("parent PIN protection", () => {
  it("accepts only 4 to 6 digit PINs", () => {
    expect(isValidParentPin("1234")).toBe(true);
    expect(isValidParentPin("123456")).toBe(true);
    expect(isValidParentPin("123")).toBe(false);
    expect(isValidParentPin("abcd")).toBe(false);
  });

  it("verifies the correct PIN without storing the raw value", () => {
    const storedHash = hashParentPin("4815");
    expect(storedHash).not.toContain("4815");
    expect(verifyParentPin("4815", storedHash)).toBe(true);
    expect(verifyParentPin("4816", storedHash)).toBe(false);
  });
});
