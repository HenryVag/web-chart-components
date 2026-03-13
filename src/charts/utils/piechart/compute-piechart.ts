import { calcPointX, calcPointY } from "./compute-sector"
import { DEFAULT_COLORS } from "./defaultColors"

type SectorDataProps = {
	radius: number
	startAngle: number
	endAngle: number
	fill: string
	label: string
	strokeWidth: number
	key: number
	group?: string
	accLabel?: string
}

type LineDataProps = {
	radius: number
	startX: number
	startY: number
	endX: number
	endY: number
	sectorAngle: number
	sectorStroke: string | undefined
	key: number
}

/**
 * Calculates all values needed for drawing a piechart (angles, coordinates, lines, label positions).
 * @returns Object with:
 *  - sectorData: Array of sector parameters {radius, strokeWidth, startAngle, endAngle, label, fill, key}
 *  - lineData: Array of sector radius line parameters {radius, startX, startY, endX, endY, sectorAngle, sectorStroke, key}
 */

export const computePieChart = (
	data: { group?: string; value: number; fill?: string }[],
	radius: number,
	strokeWidth: number,
	labelType: "value" | "percentage",
	labelFontSize?: number | undefined,
	otherSectorLabel?: string,
	sectorStroke?: string,
) => {
	const sectorData: SectorDataProps[] = []
	const lineData: LineDataProps[] = []

	let startAngle = 90

	let totalChartValue = countTotalChartValue(data)

	//Sort all sectors greater than 2% of the total charts value into a variable.
	const sectors = data.filter((sector) => sector.value / totalChartValue > 0.02)

	//Combine all sectors smaller than 2% of the total charts value into a "other" sector.
	const otherSector = sortToOther(data, otherSectorLabel)

	//Add the normal and "other" sectors into an array and sort them by ascending order.
	let allSectors: { group?: string; value: number; fill?: string }[] = []

	if (otherSector) {
		allSectors = [...sectors, otherSector]
	} else {
		allSectors = [...sectors]
	}

	allSectors = sortByValueAscending(allSectors)
	//Defines endangle, label (if it fits) and the total angle size of the sector
	allSectors.forEach((obj, i) => {
		const endAngle = calculateEndAngle(startAngle, obj.value, totalChartValue)
		const sectorAngle = endAngle - startAngle
		let label = setLabel(obj.value, labelType, sectorAngle)
		const accLabel = label
		if (labelFontSize && sectorAngle < estLabelWidth(labelFontSize, label)) {
			label = ""
		}

		// Returns sectors and their radii lines that consist of 2% of the chart, excludes e.g. the "other" sector if it does not meet this criteria.
		// 7.2 / 360 = 2%
		if (sectorAngle >= 7.2) {
			const startX = radius + calcPointX(radius, startAngle)
			const startY = radius - calcPointY(radius, startAngle)

			const endX = calcPointX(radius, endAngle)
			const endY = calcPointY(-radius, endAngle)

			const fill = obj.fill
				? obj.fill
				: DEFAULT_COLORS[i % DEFAULT_COLORS.length]
			const key = i

			const group = obj.group

			const sector = {
				radius,
				strokeWidth,
				startAngle,
				endAngle,
				label,
				fill,
				key,
				group,
				accLabel,
			}
			const line = {
				radius,
				startX,
				startY,
				endX,
				endY,
				sectorAngle,
				sectorStroke,
				key,
			}
			startAngle = endAngle
			sectorData.push(sector)
			lineData.push(line)
		} else {
			// Exclude this sector and reduce the total so that remaining sectors take up the missing space.
			totalChartValue = totalChartValue - obj.value
		}
	})
	return { sectorData, lineData }
}

const calculateEndAngle = (
	startAngle: number,
	answeredQst: number,
	answeredTotal: number,
) => {
	const endAngle = (answeredQst / answeredTotal) * 360 + startAngle
	return endAngle
}

/**Estimates label width */
export const estLabelWidth = (labelFontSize: number, label: string) => {
	const labelLen = label.toString().length

	return labelFontSize * labelLen - labelFontSize / 2
}

export const setLabel = (
	value: number,
	labelType: "value" | "percentage",
	angle: number,
) => {
	let returnVal = value.toString()
	if (labelType === "percentage") {
		const percentage = Math.round((angle / 360) * 100 * 10) / 10

		returnVal = `${percentage.toString()}%`
	}
	return returnVal
}

const sortByValueAscending = (data: { group?: string; value: number }[]) => {
	const dataAscending = data.sort((a, b) => a.value - b.value)
	return dataAscending
}

export const countTotalChartValue = (
	data: { group?: string; value: number }[],
) => {
	const totalChartValue = data.reduce((acc, curr) => acc + curr.value, 0)
	return totalChartValue
}

/**Combines all sectors that are smaller than 2% of the charts total value into a single "Other" sector */
const sortToOther = (
	data: { group?: string; value: number; fill?: string }[],
	otherSectorLabel?: string,
) => {
	const totalChartValue = countTotalChartValue(data)

	const smallSectors = data.filter(
		(sector) => sector.value / totalChartValue < 0.02,
	)
	if (smallSectors.length === 0) return null

	const otherSectorVal = smallSectors.reduce((acc, curr) => acc + curr.value, 0)

	const otherSectorFill = smallSectors[0]?.fill ?? undefined
	const otherSector = {
		group: otherSectorLabel ?? "Other",
		value: otherSectorVal,
		fill: otherSectorFill,
	}

	return otherSector
}
