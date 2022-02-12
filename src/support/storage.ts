export const storage = {
	store(key: string, value: string) {
		if (!window.localStorage) {
			return false
		}

		try {
			window.localStorage.setItem(key, value)

			return true
		} catch (error) {
			console.error('storage.store(): storing to localStorage failed', error)
			return false
		}
	},

	fetch(key: string) {
		if (!window.localStorage) {
			return undefined
		}

		try {
			const value = window.localStorage.getItem(key)

			if (value === null) {
				return undefined
			}

			return value
		} catch (error) {
			console.error('storage.store(): fetching from localStorage failed', error)
			return undefined
		}
	},
}
