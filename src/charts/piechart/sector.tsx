import { computeSector } from "../utils/piechart/compute-sector"

type SectorProps = {
	startX: number
	startY: number
	/** 0-360 */
	startAngle: number
	/** 0-360 */
	endAngle: number
	radius: number
	stroke?: string
	strokeWidth?: number
	fill?: string
	showLabels: boolean
	label?: number | string
	labelFont?: string
	labelFontSize?: number
	/** Distance multiplier for label placement from center */
	labelDistance?: number
}

/**
 * Sector component
 *
 * Renders a single pie chart sector with an optional label.
 *
 * @param props.startX - X coordinate of the pie chart center
 * @param props.startY - Y coordinate of the pie chart center
 * @param props.startAngle - Starting angle of the sector (0-360°)
 * @param props.endAngle - Ending angle of the sector (0-360°)
 * @param props.radius - Radius of the sector
 * @param props.stroke - Optional stroke color for the sector border
 * @param props.strokeWidth - Optional stroke width for the sector border
 * @param props.fill - Optional fill color of the sector
 * @param props.showLabels - Whether to display the sector label
 * @param props.label - Label value displayed in the center of the sector
 * @param props.labelFont - Optional font for the label
 * @param props.labelFontSize - Optional font size for the label
 * @param props.labelDistance - Optional distance multiplier for label placement
 *
 *
 */

const Sector = ({
	startX,
	startY,
	startAngle,
	endAngle,
	radius,
	stroke,
	strokeWidth,
	fill,
	label,
	showLabels,
	labelFont,
	labelFontSize,
	labelDistance,
}: SectorProps) => {
	const {
		lineX,
		lineY,
		largeArcFlag,
		arcEndX,
		arcEndY,
		labelX,
		labelY,
		fontSize,
	} = computeSector(startAngle, endAngle, radius, labelFontSize, labelDistance)
	const isFullCircle = Math.abs(endAngle - startAngle) >= 359.9
	return (
		<>
			<path
				d={
					isFullCircle
						? `M${startX} ${startY} m${lineX} ${-lineY} a${radius} ${radius} 0 ${largeArcFlag} 0 ${arcEndX} ${-arcEndY} Z `
						: `M${startX} ${startY} l${lineX} ${-lineY} a${radius} ${radius} 0 ${largeArcFlag} 0 ${arcEndX} ${-arcEndY} Z `
				}
				stroke={stroke ?? "black"}
				strokeWidth={strokeWidth ?? 0}
				fill={fill ?? "none"}
			/>
			{showLabels && (
				<text
					x={labelX}
					y={labelY}
					textAnchor="middle"
					fontFamily={labelFont}
					fontSize={fontSize}
				>
					{label}
				</text>
			)}
		</>
	)
}

export default Sector
