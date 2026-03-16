type ExampleLegendProps = {
	data: {
		group?: string | undefined
		fill?: string | undefined
		label: string
	}[]
}
export const ExampleLegend = ({ data }: ExampleLegendProps) => {
	return (
		<div>
			{data.map((sector) => (
				<div
					key={sector.group}
					aria-hidden={true}
					style={{ flexDirection: "row", alignItems: "center" }}
				>
					<div
						style={{
							width: 12,
							height: 12,
							backgroundColor: sector.fill,
						}}
					/>
					<text>
						{sector.group}: {sector.label}
					</text>
				</div>
			))}
		</div>
	)
}
