<script>
	import { page } from '$app/stores'
	import { Github } from 'lucide-svelte'
</script>

<header
	class="h-20 flex justify-between items-center p-6 md:px-24 fixed w-full z-20 border-zinc-900"
	class:border-b={$page.url.pathname !== '/'}
>
	<h1 class="text-2xl font-bold">
		<a href="/">Glimpse</a>
	</h1>
	<nav>
		<ul class="inline-flex gap-8 items-center">
			<li>
				<a
					class="max-sm:hidden text-zinc-400 hover:text-zinc-100 transition-colors text-sm"
					href="/"
				>
					<Github size={20} />
				</a>
			</li>
			<span class="max-sm:hidden bg-zinc-800 w-px h-6" />
			<li>
				<a
					class="max-sm:hidden text-zinc-400 hover:text-zinc-100 transition-colors text-sm"
					href="/">About</a
				>
			</li>
			<li>
				<a
					class="inline-flex group items-center h-10 py-2 px-4 transition-all text-primary-50 justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-zinc-950 bg-primary-600 hover:bg-primary-700"
					href="/login"
				>
					Sign in
				</a>
			</li>
		</ul>
	</nav>
</header>
