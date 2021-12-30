import { ref } from 'vue'

export enum ModalName {
	CountDown = 'countDown',
}

const modals = ref([] as ModalName[])

function openModal(name: ModalName) {
	modals.value.push(name)
}

function closeModal(name: ModalName) {
	modals.value = modals.value.filter((modal) => modal !== name)
}

function toggleModal(name: ModalName) {
	if (isModalActive(name)) {
		closeModal(name)
	} else {
		openModal(name)
	}
}

function isModalActive(name: ModalName) {
	return modals.value.includes(name)
}

export function useModalController() {
	return {
		isModalActive,
		openModal,
		closeModal,
		toggleModal,
	}
}
