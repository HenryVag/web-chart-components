type SectorLineProps = {
	startX: number
	startY: number
	centerX: number
	centerY: number
	endY: number
	endX: number
	radius: number
	/**Difference between the startangle and endangle of the sector */
	sectorAngle: number
	sectorStroke?: string
	/**Strokewidth of sector radius lines (optional) */
	sectorStrokeWidth?: number
	/**Threshold that defines at which angle the lines are drawn (optional) */
	sectorStrokeWidthThreshold?: number
}

/**
 * Renders a dividing line from the pie chart center to the sector edge.
 * Only renders if sectorAngle >= sectorStrokeWidthThreshold.
 *
 * @param props.startX - X coordinate of the sector start point (edge of the sector)
 * @param props.startY - Y coordinate of the sector start point (edge of the sector)
 * @param props.centerX - X coordinate of the pie chart center
 * @param props.centerY - Y coordinate of the pie chart center
 * @param props.endX - X offset for the end of the line relative to the start
 * @param props.endY - Y offset for the end of the line relative to the start
 * @param props.radius - Pie chart radius, used for default strokeWidth calculation
 * @param props.sectorAngle - Angle span of the sector in degrees
 * @param props.sectorStroke - Optional stroke color of the line
 * @param props.sectorStrokeWidth - Optional stroke width of the line
 * @param props.sectorStrokeWidthThreshold - Optional threshold angle (degrees) for drawing the line
 *
 */

const SectorLine = ({
	startX,
	startY,
	centerX,
	centerY,
	endX,
	endY,
	radius,
	sectorAngle,
	sectorStroke,
	sectorStrokeWidth,
	sectorStrokeWidthThreshold,
}: SectorLineProps) => {
	return (
		sectorAngle >= (sectorStrokeWidthThreshold ?? 361) && (
			<path
				d={`M${startX} ${startY} L${centerX} ${centerY} l ${endX} ${endY} `}
				stroke={sectorStroke ?? "black"}
				strokeWidth={sectorStrokeWidth ?? radius * 0.0375}
				fill={"none"}
			/>
		)
	)
}

export default SectorLine
