import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function isValidParentPin(pin: string) {
  return /^\d{4,6}$/.test(pin);
}

export function hashParentPin(pin: string) {
  if (!isValidParentPin(pin)) {
    throw new Error("Parent PINs must contain 4 to 6 digits.");
  }
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pin, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyParentPin(pin: string, storedHash: string) {
  if (!isValidParentPin(pin)) return false;
  const [salt, storedValue] = storedHash.split(":");
  if (!salt || !storedValue) return false;
  const calculated = scryptSync(pin, salt, 64);
  const stored = Buffer.from(storedValue, "hex");
  return stored.length === calculated.length && timingSafeEqual(stored, calculated);
}
