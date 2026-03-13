import { describe, expect, test } from "bun:test"
import {
	computePieChart,
	countTotalChartValue,
	estLabelWidth,
	setLabel,
} from "./compute-piechart"

describe("computePieChart", () => {
	test("returns sectorData with correct amount of objects when no sectors under 2% of the total chart value exist", () => {
		const { sectorData } = computePieChart(
			[{ value: 5 }, { value: 5 }, { value: 5 }],
			1,
			1,
			"value",
		)
		const result = sectorData.length
		expect(result).toBe(3)
	})

	test("returns sectorData with correct amount of objects when sectors under 2% get combined into 'other' ", () => {
		const { sectorData } = computePieChart(
			[{ value: 100 }, { value: 2 }, { value: 1 }],
			1,
			1,
			"value",
		)
		const result = sectorData.length
		expect(result).toBe(2)
	})

	test("returns sectorData with correct amount of objects when the 'other' sector is not large enough to display", () => {
		const { sectorData } = computePieChart(
			[{ value: 100 }, { value: 1 }, { value: 1 }],
			1,
			1,
			"value",
		)
		const result = sectorData.length
		expect(result).toBe(1)
	})

	test("input data with no fill properties returns sectorData objects with defined fill properties", () => {
		const { sectorData } = computePieChart(
			[{ value: 5 }, { value: 1 }, { value: 1 }],
			1,
			1,
			"value",
		)
		expect(sectorData[0].fill).toBeDefined()
		expect(sectorData[1].fill).toBeDefined()
		expect(sectorData[2].fill).toBeDefined()
	})

	test("returns lineData with correct amount of objects when no sectors under 2% of the total chart value exist", () => {
		const { lineData } = computePieChart(
			[{ value: 5 }, { value: 5 }, { value: 5 }],
			1,
			1,
			"value",
		)
		const result = lineData.length
		expect(result).toBe(3)
	})

	test("returns lineData with correct amount of objects when sectors under 2% get combined into 'other'", () => {
		const { lineData } = computePieChart(
			[{ value: 100 }, { value: 2 }, { value: 1 }],
			1,
			1,
			"value",
		)
		const result = lineData.length
		expect(result).toBe(2)
	})

	test("returns lineData with correct amount of objects when the 'other' sector is not large enough to display", () => {
		const { lineData } = computePieChart(
			[{ value: 100 }, { value: 1 }, { value: 1 }],
			1,
			1,
			"value",
		)
		const result = lineData.length
		expect(result).toBe(1)
	})
})

describe("estLabelWidth", () => {
	test("returns correct label width", () => {
		const result = estLabelWidth(5, "hi")
		expect(result).toBe(7.5)
	})
})

describe("setLabel", () => {
	test("returns value as string when labelType is value", () => {
		const result = setLabel(5, "value", 90)
		expect(result).toBe("5")
	})

	test("returns value as percentage string when labelType is percentage", () => {
		const result = setLabel(5, "percentage", 90)
		expect(result).toBe("25%")
	})
})

describe("countTotalChartValue", () => {
	test("returns sum of single object", () => {
		const result = countTotalChartValue([{ value: 5 }])
		expect(result).toBe(5)
	})

	test("returns sum of multiple objects", () => {
		const result = countTotalChartValue([
			{ value: 5 },
			{ value: 1 },
			{ value: 3 },
		])
		expect(result).toBe(9)
	})
})
