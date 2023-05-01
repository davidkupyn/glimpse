<script lang="ts">
	import { fly } from 'svelte/transition'
	import { DoorOpen, Plus, RefreshCw } from 'lucide-svelte'
	import { cubicOut } from 'svelte/easing'
	import { spring } from 'svelte/motion'

	const rooms = [
		'Room 1',
		'Room 2',
		'Room 3',
		'Room 4',
		'Room 5',
		'Room 6',
		'Room 7',
		'Room 8',
		'Room 9',
		'Room 10'
	]
	let refreshSpinDeg = spring(0, {
		stiffness: 0.1
	})
</script>

<div class="flex items-center justify-between w-full mb-6 md:mb-8">
	<div class="flex items-center gap-6">
		<h1 class="text-2xl font-bold md:text-3xl">Join a Room</h1>
		<button
			aria-label="Refresh data"
			on:click={() => {
				$refreshSpinDeg = Math.round($refreshSpinDeg / 360) * 360 + 360 * 1
			}}
			class="rounded-lg p-2 text-base-500 dark:text-base-400 dark:hover:text-base-200 hover:text-base-900 outline-none transition dark:focus-visible:text-base-100 dark:focus-visible:bg-base-900 focus-visible:bg-base-200/50 focus-visible:text-base-900"
			style="rotate: {$refreshSpinDeg}deg"
		>
			<RefreshCw size={20} />
		</button>
	</div>
	<a
		href="/rooms/create"
		class="max-sm:hidden inline-flex items-center h-10 py-2 group px-4 transition-all text-base-50 justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-base-50 dark:ring-offset-base-950 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
	>
		<Plus class="w-4 h-4 mr-2 transition" size={16} />
		Create a Room
	</a>
</div>
<div
	class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full"
>
	{#each rooms as room, i (room)}
		<!-- {#if i % 2 === 0}
				<div class="w-full sm:w-1/2" />
			{/if} -->
		<a
			in:fly={{ y: 100, easing: cubicOut, delay: 25 * i }}
			href="/rooms/{room}"
			class="border outline-none focus-visible:bg-base-200 dark:focus-visible:bg-base-900 dark:focus-visible:text-base-50 focus-visible:text-base-800 border-base-300 dark:border-base-900 rounded-lg p-4 h-20 w-full flex items-center dark:hover:bg-base-900 hover:bg-base-100 hover:text-base-800 dark:hover:text-base-50 dark:text-base-300 text-base-600 transition"
		>
			{room}
			<DoorOpen class="ml-auto" />
		</a>
	{/each}
</div>
