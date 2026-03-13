import { Text, View } from "react-native"

type ExampleLegendProps = {
	data: {
		group?: string | undefined
		fill?: string | undefined
		label: string
	}[]
}
export const ExampleLegend = ({ data }: ExampleLegendProps) => {
	return (
		<View>
			{data.map((sector) => (
				<View
					key={sector.group}
					style={{ flexDirection: "row", alignItems: "center" }}
				>
					<View
						style={{
							width: 12,
							height: 12,
							backgroundColor: sector.fill,
						}}
					/>
					<Text>
						{sector.group}: {sector.label}
					</Text>
				</View>
			))}
		</View>
	)
}
