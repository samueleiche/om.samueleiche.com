import { computed, ref, readonly, defineComponent, markRaw } from 'vue'
import MenuView from '../../views/MenuView.vue'
import TimerView from '../../views/TimerView.vue'

enum AppView {
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
const activeView = computed(() => views.find((v) => v.name === activeViewName.value))

function setActiveView(name: AppView) {
	activeViewName.value = name
}

export function useViewController() {
	return {
		activeView: readonly(activeView),
		setActiveView,
		AppView,
	}
}
