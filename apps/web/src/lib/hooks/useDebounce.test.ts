import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useDebounce } from "./useDebounce"

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300))
    expect(result.current).toBe("hello")
  })

  it("should debounce value with 300ms delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 300 } }
    )

    expect(result.current).toBe("initial")

    // Update the value
    rerender({ value: "updated", delay: 300 })
    // Value should still be old one before timer runs
    expect(result.current).toBe("initial")

    // Advance timers by 300ms
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Now the debounced value should be updated
    expect(result.current).toBe("updated")
  })

  it("should reset timer when value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 300 } }
    )

    expect(result.current).toBe("a")

    rerender({ value: "b", delay: 300 })
    expect(result.current).toBe("a")

    // Change value again before timer fires
    rerender({ value: "c", delay: 300 })
    expect(result.current).toBe("a")

    // Advance timers - should get the latest value
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe("c")
  })

  it("should work with numeric values", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 300 } }
    )

    expect(result.current).toBe(0)

    rerender({ value: 100, delay: 300 })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe(100)
  })
})