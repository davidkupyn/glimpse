<script lang="ts">
	import { page } from '$app/stores'
	import { ChevronLeft } from 'lucide-svelte'
</script>

<div class="flex gap-6 items-center mb-6 md:mb-8">
	<button
		aria-label="Go back"
		class="inline-flex items-center px-3 h-9 focus-visible:text-base-900 dark:focus-visible:text-base-100 text-base-500 dark:text-base-400 justify-center dark:focus-visible:bg-base-900 focus-visible:bg-base-200/50 outline-none hover:text-base-800 dark:hover:text-base-100 transition-colors text-sm hover:bg-base-200/50 dark:hover:bg-base-900 rounded-lg"
		on:click={() => window.history.back()}
	>
		<ChevronLeft size={20} class="mr-2 w-4 h-4" />
		Go Back
	</button>
	<!-- <h1 class="text-2xl font-bold md:text-3xl">{$page.params.roomId}</h1> -->
</div>
<div class="flex flex-wrap gap-4" />
