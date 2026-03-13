/**
 * Filters input array for valid PieChart elements
 * @param inputArr - any array of objects, expected to contain { value: number }
 * @returns Array of objects that have a finite number value > 0
 */

export const filterData = (inputArr: unknown) => {
	//Check if input is of type: Array
	if (!Array.isArray(inputArr)) {
		console.warn(
			"Piechart input data is not of type: Array. Rendering placeholder instead.",
		)
		return []
	}

	//Create new array from the objects in inputArr that contain the key: "value" that matches the criteria
	const acceptedArr = inputArr.filter((item, i) => {
		const isObject = typeof item === "object" && item !== null
		let hasValidValue = false
		let hasValueKey = false
		let hasValGtZero = false
		let valIsNum = false
		let hasFiniteVal = false

		if (isObject) {
			hasValueKey = "value" in item
			if (hasValueKey) {
				valIsNum = typeof item.value === "number"
				if (valIsNum) {
					hasValGtZero = item.value > 0
					hasFiniteVal = Number.isFinite(item.value)
				}

				hasValidValue = valIsNum && hasValGtZero && hasFiniteVal
			}
		}
		if (!hasValidValue) {
			const reasons = []
			if (!isObject) {
				reasons.push(`invalid type: ${typeof item}`)
			}
			if (!hasValueKey) {
				reasons.push(`missing key: "value"`)
			}
			if (!valIsNum) {
				reasons.push("value must be a number")
			} else {
				if (!hasValGtZero) {
					reasons.push("value must be > 0")
				}
				if (!hasFiniteVal) {
					reasons.push("value must be finite")
				}
			}

			console.warn(
				`Excluding element ${i} from PieChart: ${reasons.join(" and ")}`,
			)
		}

		return hasValidValue
	}) as { group?: string; value: number; fill?: string }[]

	return acceptedArr
}
