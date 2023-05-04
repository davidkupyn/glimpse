<script lang="ts">
	import { crossfade, fly } from 'svelte/transition'
	import { DoorOpen, Plus, RefreshCw } from 'lucide-svelte'
	import { cubicOut } from 'svelte/easing'
	import { spring } from 'svelte/motion'
	import { tippy } from '$lib/actions/tippy'
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

	let roomsFilter: 'all' | 'joined' = 'all'

	const [send, receive] = crossfade({})
</script>

<div class="flex items-center justify-between w-full mb-6 md:mb-8">
	<div class="flex items-center gap-4">
		<h1 class="text-2xl font-bold md:text-3xl">Join a Room</h1>
		<button
			aria-label="Refresh data"
			on:click={() => {
				$refreshSpinDeg = Math.round($refreshSpinDeg / 360) * 360 + 360 * 1
			}}
			class="rounded-lg p-2 text-base-500 dark:text-base-400 dark:hover:text-base-200 hover:text-base-900 outline-none transition dark:focus-visible:text-base-100 dark:focus-visible:bg-base-900 focus-visible:bg-base-200/50 focus-visible:text-base-900"
			use:tippy={{ content: 'Refresh data', placement: 'bottom' }}
		>
			<RefreshCw size={20} style="rotate: {$refreshSpinDeg}deg" />
		</button>
	</div>
	<div class="flex items-center gap-8">
		<div
			class="flex items-center border rounded-lg h-10 p-1 gap-2 border-base-300 dark:border-base-900"
		>
			<button
				class="outline-none focus-visible:bg-base-300/75 transition dark:focus-visible:bg-base-800 rounded group relative w-16 h-full"
				on:click={() => (roomsFilter = 'all')}
			>
				{#if roomsFilter === 'all'}
					<div
						in:receive={{ key: 'background', easing: cubicOut }}
						out:send={{ key: 'background', easing: cubicOut }}
						class="w-full h-full rounded bg-base-300/50 dark:bg-base-800/75"
					/>
				{/if}
				<span
					class="transition hover:text-base-800 group-focus-visible:text-base-700 dark:group-focus-visible:text-base-300 dark:hover:text-base-100 text-sm font-medium absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 {roomsFilter ===
					'all'
						? 'text-base-800 dark:text-base-100'
						: 'text-base-600 dark:text-base-500'}"
				>
					All
				</span>
			</button>
			<button
				class="outline-none focus-visible:bg-base-300/75 transition dark:focus-visible:bg-base-800 rounded group relative w-16 h-full"
				on:click={() => (roomsFilter = 'joined')}
			>
				{#if roomsFilter === 'joined'}
					<div
						in:receive={{ key: 'background', easing: cubicOut }}
						out:send={{ key: 'background', easing: cubicOut }}
						class="w-full h-full rounded bg-base-300/50 dark:bg-base-800/75"
					/>
				{/if}
				<span
					class="transition hover:text-base-800 group-focus-visible:text-base-700 dark:group-focus-visible:text-base-300 dark:hover:text-base-100 text-sm font-medium absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 {roomsFilter ===
					'joined'
						? 'text-base-800 dark:text-base-100'
						: 'text-base-600 dark:text-base-500'}"
				>
					Joined
				</span>
				<input
					class="absolute opacity-0 w-0 h-0 peer"
					type="radio"
					bind:group={roomsFilter}
					value="joined"
				/>
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
</div>
<div
	class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full"
>
	{#each rooms as room, i (room)}
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

<a
	aria-label="Create a room"
	href="/rooms/create"
	class="fixed bottom-6 right-6 ease-out transition-all z-20 h-14 w-14 rounded-full bg-primary-500/80 dark:bg-primary-600/80 text-base-50 backdrop-blur-sm shadow-xl grid place-items-center sm:hidden"
	use:tippy={{ content: 'Create a room', placement: 'left' }}
>
	<Plus size={24} />
</a>
