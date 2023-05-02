import 'tippy.js/animations/scale-subtle.css'
import { createTippy } from 'svelte-tippy'

export const tippy = createTippy({
	animation: 'scale-subtle',
	duration: 200,
	placement: 'bottom',
	touch: 'hold'
})
