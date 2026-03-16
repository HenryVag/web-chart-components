import { memo, useMemo } from "react"
import { computePieChart } from "../utils/piechart/compute-piechart"
import { DEFAULT_COLORS } from "../utils/piechart/defaultColors"
import { filterData } from "../utils/piechart/validate-data"
import PieChartPlaceHolder from "./piechart-placeholder"
import Sector from "./sector"
import SectorLine from "./sector-line"
import SingleSector from "./single-sector"

type PieChartProps = {
	data: { group?: string; value: number; fill?: string }[]
	radius: number
	showLabels: boolean
	labelType?: "value" | "percentage"
	stroke?: string
	strokeWidth?: number
	labelFont?: string
	labelFontSize?: number
	labelDistance?: number
	otherSectorLabel?: string
	sectorStroke?: string
	sectorStrokeWidth: number
	sectorStrokeWidthThreshold?: number
	title?: string
	emptyTitle?: string
	legendPosition?: "top" | "bottom" | "left" | "right"
	legend?: (
		data: { group?: string; fill?: string; label: string }[],
	) => React.ReactNode
}

const PieChart = ({
	data,
	radius,
	stroke,
	strokeWidth,
	showLabels,
	labelType,
	labelFont,
	labelFontSize,
	labelDistance,
	otherSectorLabel,
	sectorStroke,
	sectorStrokeWidth,
	sectorStrokeWidthThreshold,
	title,
	emptyTitle,
	legendPosition,
	legend,
}: PieChartProps) => {
	const width = window.innerWidth
	const height = window.innerHeight
	const safeStrokeWidth = strokeWidth
		? Math.min(width, height) * strokeWidth * 0.002
		: 0
	const safeSectorStrokeWidth = sectorStrokeWidth
		? Math.min(width, height) * sectorStrokeWidth * 0.002
		: 0
	const safeLabelDistance = labelDistance ?? 0
	const safeLabelType = labelType ?? "value"
	const validatedData = useMemo(() => filterData(data), [data])
	const dynamicRadius = radius * Math.min(width, height) * 0.01
	const padding = safeStrokeWidth + safeLabelDistance * 2 + dynamicRadius * 0.1
	const chartTitle = title ?? "pie chart"

	const flexDirection = (
		{
			top: "column-reverse",
			bottom: "column",
			left: "row-reverse",
			right: "row",
		} as const
	)[legendPosition ?? "bottom"]

	if (validatedData.length > 1) {
		const { sectorData, lineData } = computePieChart(
			validatedData,
			dynamicRadius,
			safeStrokeWidth,
			safeLabelType,
			labelFontSize,
			otherSectorLabel,
			sectorStroke,
		)
		const generatedLabel = sectorData
			.map((obj) => `${obj.group}: ${obj.accLabel}`)
			.join(", ")
		if (sectorData.length > 1) {
			return (
				<div
					role="img"
					aria-label={`${chartTitle}. ${generatedLabel}`}
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						flexDirection: flexDirection,
					}}
				>
					<div aria-hidden={true}>
						<svg
							width={dynamicRadius * 2}
							height={dynamicRadius * 2}
							viewBox={`${-padding} ${-padding}  ${dynamicRadius * 2 + padding * 2} ${dynamicRadius * 2 + padding * 2}`}
							aria-hidden={true}
						>
							{sectorData.map((obj) => (
								<Sector
									startX={dynamicRadius}
									startY={dynamicRadius}
									startAngle={obj.startAngle}
									endAngle={obj.endAngle}
									radius={dynamicRadius}
									stroke={stroke}
									strokeWidth={obj.strokeWidth}
									fill={obj.fill}
									label={obj.label}
									showLabels={showLabels}
									labelFont={labelFont}
									labelFontSize={labelFontSize}
									labelDistance={labelDistance}
									key={obj.key}
								/>
							))}

							{lineData.map((line) => (
								<SectorLine
									startX={line.startX}
									startY={line.startY}
									centerX={dynamicRadius}
									centerY={dynamicRadius}
									endX={line.endX}
									endY={line.endY}
									radius={line.radius}
									sectorAngle={line.sectorAngle}
									sectorStroke={line.sectorStroke}
									sectorStrokeWidth={safeSectorStrokeWidth}
									sectorStrokeWidthThreshold={sectorStrokeWidthThreshold}
									key={line.key}
								/>
							))}
						</svg>
					</div>
					{legend && legend(sectorData)}
				</div>
			)
			// Occurs when all but one sector are filtered out by the 2% minimum threshold
		}
		if (sectorData.length === 1) {
			const { fill, group, label } = sectorData[0]
			const singleSectorData = [{ group: group, fill: fill, label: label }]
			return (
				<div
					style={{
						alignItems: "center",
						justifyContent: "center",
						flexDirection: flexDirection,
					}}
				>
					<SingleSector
						data={singleSectorData}
						radius={dynamicRadius}
						stroke={stroke ?? "black"}
						padding={padding}
						strokeWidth={safeStrokeWidth}
						labelFont={labelFont}
						labelFontSize={labelFontSize}
						showLabels={showLabels}
						title={`${chartTitle}, ${generatedLabel}`}
					/>
					{legend && legend(singleSectorData)}
				</div>
			)
		}
	} else if (validatedData.length === 1) {
		const { fill, group, value } = validatedData[0]
		const label = labelType === "percentage" ? "100%" : value.toString()
		const singleSectorData = [
			{ group: group, fill: fill ?? DEFAULT_COLORS[0], label: label },
		]

		return (
			<div
				style={{
					alignItems: "center",
					justifyContent: "center",
					flexDirection: flexDirection,
				}}
			>
				<SingleSector
					data={singleSectorData}
					radius={dynamicRadius}
					stroke={stroke ?? "black"}
					padding={padding}
					strokeWidth={safeStrokeWidth}
					labelFont={labelFont}
					labelFontSize={labelFontSize}
					showLabels={showLabels}
					title={`${chartTitle}. ${group}: ${label}`}
				/>
				{legend && legend(singleSectorData)}
			</div>
		)
	} else {
		return (
			<PieChartPlaceHolder
				radius={dynamicRadius}
				padding={padding}
				strokeWidth={safeStrokeWidth}
				stroke={stroke}
				title={emptyTitle}
			/>
		)
	}
}

/**
 * Renders a pie chart from an array of data objects that are rendered as sectors.
 * - Multiple valid sectors → full pie chart with labels and sector lines
 * - One valid sector → SingleSector (full circle)
 * - No valid data → PieChartPlaceholder
 *
 * @param data - Array of { value, group?, fill? } objects
 * @param radius - Controls chart size, scaled against screen dimensions
 * @param showLabels - Whether to display labels on sectors
 * @param labelType - Display labels as "value" or "percentage"
 * @param sectorStrokeWidthThreshold - Minimum sector angle (degrees) before radius lines are drawn for that sector
 * @param legend - Optional render function receiving the computed sector data
 * @param title - Accessibility label for the chart when data is present
 * @param emptyTitle - Accessibility label shown when no valid data exists
 */
export default memo(PieChart)
