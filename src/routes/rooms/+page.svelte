<script lang="ts">
	import { fly } from 'svelte/transition'
	import { DoorOpen, Plus } from 'lucide-svelte'
	import { cubicOut } from 'svelte/easing'

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
</script>

<div class="flex items-center justify-between w-full mb-8">
	<h1 class="text-2xl font-bold md:text-3xl">Join a Room</h1>
	<a
		href="/rooms/create"
		class="inline-flex items-center h-10 py-2 group px-4 transition-all text-primary-50 justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-zinc-950 bg-primary-600 hover:bg-primary-700"
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
			class="border outline-none focus-visible:bg-zinc-900 focus-visible:text-zinc-50 border-zinc-900 rounded-lg p-4 h-20 w-full flex items-center hover:bg-zinc-900 hover:text-zinc-50 text-zinc-300 transition"
		>
			{room}
			<DoorOpen class="ml-auto" />
		</a>
	{/each}
</div>
