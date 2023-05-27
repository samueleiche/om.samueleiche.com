export const MIN_VISIBLE_PROGRESS = 0.0005 // min progress that can render on rewind; helps avoid flickering when starting progress from 0
export const TRANSITION_IN_MS = 150 // initial circle transition in time
export const REWIND_DURATION_MS = 2000

export const CIRCLE_COLOR = 'rgb(249, 249, 249)'
export const CIRCLE_BACKGROUND_COLOR = 'rgb(42, 55, 49)'

export const backgroundImage = new Image()
backgroundImage.src = new URL('../../../../assets/timer-background-2.jpg', import.meta.url).href
