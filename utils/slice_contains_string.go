package utils

func SliceContainsString(slice []string, searchString string) bool {
	for _, element := range slice {
		if element == searchString {
			return true
		}
	}
	return false
}
