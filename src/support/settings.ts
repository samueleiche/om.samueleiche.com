const timerOptions = [
	{ id: 60000, text: '1 min' },
	{ id: 120000, text: '2 min' },
	{ id: 180000, text: '3 min' },
	{ id: 240000, text: '4 min' },
	{ id: 300000, text: '5 min' },
	{ id: 600000, text: '10 min' },
	{ id: 1200000, text: '20 min' },
	{ id: 1800000, text: '30 min' },
	{ id: 3600000, text: '60 min' },
]

if (process.env.NODE_ENV === 'development') {
	timerOptions.unshift({ id: 5000, text: '5 sec' })
}

export { timerOptions }
