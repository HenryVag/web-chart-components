import { describe, expect, test } from "bun:test"
import { calcPointX, calcPointY, computeSector } from "./compute-sector"

describe("computeSector", () => {
	test("largeArcFlag is 0 for sectors under 180 degrees", () => {
		const result = computeSector(90, 180, 5)
		expect(result.largeArcFlag).toBe(0)
	})

	test("largeArcFlag is 1 for sectors over 180 degrees", () => {
		const result = computeSector(90, 271, 5)
		expect(result.largeArcFlag).toBe(1)
	})

	test("largeArcFlag is 1 for exactly 180 degree sectors", () => {
		const result = computeSector(0, 180, 5)
		expect(result.largeArcFlag).toBe(1)
	})
})

describe("calcPointX", () => {
	test("returns radius when angle is 0", () => {
		const result = calcPointX(1, 0)
		expect(result).toBe(1)
	})

	test("returns 0 angle is 90", () => {
		const result = calcPointX(1, 90)
		expect(result).toBe(0)
	})

	test("returns -1 when angle is 180", () => {
		const result = calcPointX(1, 180)
		expect(result).toBe(-1)
	})

	test("returns 0 when angle is 270", () => {
		const result = calcPointX(1, 270)
		expect(result).toBe(0)
	})
})

describe("calcPointY", () => {
	test("returns 0 when angle is 0", () => {
		const result = calcPointY(1, 0)
		expect(result).toBe(0)
	})

	test("returns radius when angle is 90", () => {
		const result = calcPointY(1, 90)
		expect(result).toBe(1)
	})

	test("returns 0 when angle is 180", () => {
		const result = calcPointY(1, 180)
		expect(result).toBe(0)
	})

	test("returns - 1 when angle is 270", () => {
		const result = calcPointY(1, 270)
		expect(result).toBe(-1)
	})
})
