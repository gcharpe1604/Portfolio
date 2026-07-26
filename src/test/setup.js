import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

const storageValues = new Map();
const storage = {
  getItem: vi.fn((key) => storageValues.get(key) ?? null),
  setItem: vi.fn((key, value) => storageValues.set(key, String(value))),
  removeItem: vi.fn((key) => storageValues.delete(key)),
  clear: vi.fn(() => storageValues.clear()),
};

Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: storage,
});

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: IntersectionObserverMock,
});

HTMLDialogElement.prototype.showModal = function showModal() {
  this.setAttribute("open", "");
};

HTMLDialogElement.prototype.close = function close() {
  this.removeAttribute("open");
};

Object.defineProperty(navigator, "clipboard", {
  configurable: true,
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});
