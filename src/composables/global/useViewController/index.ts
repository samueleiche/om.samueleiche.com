import { computed, ref, readonly, defineComponent, markRaw } from 'vue'
import MenuView from '../../../components/views/menu/MenuView.vue'
import TimerView from '../../../components/views/timer/TimerView.vue'
import { transitionFromCenter, transitionFromElement } from './viewTransition'

export enum AppView {
	MENU = 'MenuView',
	TIMER = 'TimerView',
}

interface ViewConfig {
	name: AppView
	component: ReturnType<typeof defineComponent>
}

const views: ViewConfig[] = [
	{
		name: AppView.MENU,
		component: markRaw(MenuView),
	},
	{
		name: AppView.TIMER,
		component: markRaw(TimerView),
	},
]

const activeViewName = ref(AppView.MENU)
const activeView = computed(() => views.find((v) => v.name === activeViewName.value) || views[0])

function setActiveView(name: AppView) {
	activeViewName.value = name
}

function transitionToView(name: AppView, fromElement?: HTMLElement) {
	if (fromElement) {
		transitionFromElement(fromElement)
	} else {
		transitionFromCenter()
	}

	setActiveView(name)
}

export function useViewController() {
	return {
		activeView: readonly(activeView),
		transitionToView,
		AppView,
	}
}
