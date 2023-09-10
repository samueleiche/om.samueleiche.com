const timerOptions = [
	{ id: 60000, text: '1 min' },
	{ id: 120000, text: '2 min' },
	{ id: 300000, text: '5 min' },
	{ id: 600000, text: '10 min' },
	{ id: 1200000, text: '20 min' },
	{ id: 1800000, text: '30 min' },
	{ id: 3600000, text: '60 min' },
]

if (import.meta.env.MODE === 'development') {
	timerOptions.unshift({ id: 5000, text: '5 sec' })
}

export { timerOptions }
