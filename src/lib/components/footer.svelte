<script>
	import { page } from '$app/stores'
	import { Copyright, Github, Twitter } from 'lucide-svelte'
</script>

<footer
	class="{$page.url.pathname === '/'
		? 'fixed bottom-0'
		: 'sticky bottom-0 dark:bg-base-950/50 bg-base-50/50 backdrop-blur-md'} w-full z-20 dark:border-base-900 border-base-300"
	class:border-t={$page.url.pathname !== '/'}
>
	<div class="flex flex-col items-center justify-center py-4">
		<span class="flex items-center gap-2"> <Copyright size={16} /> 2023 Glimpse </span>
	</div>
</footer>
