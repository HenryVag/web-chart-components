import "./App.css"
import Piechart from "./charts/piechart/piechart"
import { ExampleLegend } from "./charts/utils/default-props"
import testData from "./charts/utils/test-data"

function App() {
	return (
		<div>
			<h1 className="app-header">React Charts</h1>
			<Piechart
				data={testData}
				radius={20}
				showLabels={true}
				labelDistance={1.3}
				stroke="black"
				strokeWidth={0.5}
				otherSectorLabel="Muut"
				sectorStrokeWidthThreshold={90}
				sectorStrokeWidth={3}
				legend={(data) => <ExampleLegend data={data} />}
				legendPosition="right"
				title="piirakkakaavio"
			/>
		</div>
	)
}

export default App
