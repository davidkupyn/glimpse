<script lang="ts">
	import { page } from '$app/stores'
	import { ChevronLeft } from 'lucide-svelte'
</script>

<div class="flex gap-6 items-center mb-8">
	<button
		aria-label="Go back"
		class="inline-flex items-center px-2 focus-visible:text-zinc-100 h-9 text-zinc-400 outline-none focus-visible:bg-zinc-900 hover:text-zinc-100 transition-colors text-sm hover:bg-zinc-900 rounded-lg"
		on:click={() => window.history.back()}
	>
		<ChevronLeft size={20} />
	</button>
	<h1 class="text-2xl font-bold md:text-3xl">{$page.params.roomId}</h1>
</div>
<div class="flex flex-wrap gap-4" />
