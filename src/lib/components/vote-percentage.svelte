<script lang="ts">
	import { cubicOut } from 'svelte/easing'
	import { tweened } from 'svelte/motion'
	export let votes = 0
	export let total = 0

	$: percentage = Math.round((votes / total) * 100) || 0

	const tweenedPercentage = tweened(0, {
		duration: 300,
		easing: cubicOut
	})

	$: {
		tweenedPercentage.set(percentage)
	}
</script>

<div class="absolute inset-0 h-full w-full flex justify-end items-center">
	<div
		style="width: {$tweenedPercentage}%"
		class="h-full absolute left-0 bg-primary-500/20 dark:bg-primary-600/10"
	/>
	<span class="tabular-nums text-sm mr-8">
		{Math.round($tweenedPercentage)}%
	</span>
</div>
