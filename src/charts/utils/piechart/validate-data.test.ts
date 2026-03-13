import { describe, expect, test } from "bun:test"
import { filterData } from "./validate-data"

describe("filterData", () => {
	test("accepts valid data as input", () => {
		const input = [{ value: 10 }]
		const result = filterData(input)
		expect(result).toHaveLength(1)
	})

	test("rejects empty array as input", () => {
		const input: [] = []
		const result = filterData(input)
		expect(result).toHaveLength(0)
	})

	test("rejects string as input", () => {
		const input = "hello"
		const result = filterData(input)
		expect(result).toHaveLength(0)
	})

	test("rejects number as input", () => {
		const input = 2
		const result = filterData(input)
		expect(result).toHaveLength(0)
	})

	test("rejects object missing value key", () => {
		const input = [{}]
		const result = filterData(input)
		expect(result).toHaveLength(0)
	})

	test("rejects value that is string", () => {
		const input = [{ value: "1" }]
		const result = filterData(input)
		expect(result).toHaveLength(0)
	})

	test("rejects objects with value = 0", () => {
		const input = [{ value: 0 }]
		const result = filterData(input)
		expect(result).toHaveLength(0)
	})

	test("rejects objects with value < 0", () => {
		const input = [{ value: -1 }]
		const result = filterData(input)
		expect(result).toHaveLength(0)
	})

	test("rejects objects with value = Infinity", () => {
		const input = [{ value: Number.POSITIVE_INFINITY }]
		const result = filterData(input)
		expect(result).toHaveLength(0)
	})

	test("rejects objects with value = NaN", () => {
		const input = [{ value: Number.NaN }]
		const result = filterData(input)
		expect(result).toHaveLength(0)
	})

	test("accepts correct objects from mixed array", () => {
		const input = [
			{ value: 10 },
			{},
			{ value: "1" },
			{ value: 0 },
			{ value: -1 },
			{ value: Number.POSITIVE_INFINITY },
			{ value: Number.NaN },
		]
		const result = filterData(input)
		expect(result).toHaveLength(1)
	})
})
