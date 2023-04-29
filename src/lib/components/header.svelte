<script>
	import { page } from '$app/stores'
	import { Github } from 'lucide-svelte'
</script>

<header
	class="{$page.url.pathname === '/'
		? 'fixed'
		: 'sticky top-0 bg-zinc-950/50 backdrop-blur-md'} w-full z-20 border-zinc-900"
	class:border-b={$page.url.pathname !== '/'}
>
	<div class="container mx-auto flex justify-between items-center px-6 py-3.5 md:py-5">
		<h1 class="text-xl font-bold">
			<a
				href="/"
				aria-label="Go to home page"
				class="outline-none focus-visible:border-opacity-100 border-b border-zinc-50 py-1 border-opacity-0 transition"
				>Glimpse</a
			>
		</h1>
		<!-- <img
			src="https://api.dicebear.com/6.x/bottts-neutral/svg?radius=50&size=36&backgroundColor=e11d48&seed=roman@gmail.com"
			alt="TS"
		/> -->
		<nav>
			<ul class="inline-flex gap-6 items-center">
				<li>
					<a
						aria-label="Github Link"
						class="inline-flex items-center focus-visible:text-zinc-100 justify-center max-sm:hidden focus-visible:bg-zinc-900 rounded-lg h-9 px-2 outline-none transition text-zinc-400 hover:text-zinc-100 text-sm"
						href="https://github.com/davidkupyn"
						target="_blank"
					>
						<Github size={20} />
					</a>
				</li>
				<span class="max-sm:hidden bg-zinc-800 w-px h-6" />
				<li>
					<a
						class="inline-flex items-center focus-visible:text-zinc-100 justify-center max-sm:hidden focus-visible:bg-zinc-900 rounded-lg h-9 px-3 outline-none transition text-zinc-400 hover:text-zinc-100 text-sm"
						href="/"
						>About
					</a>
				</li>
				<li>
					<a
						class="inline-flex group items-center h-9 px-3 transition-all text-primary-50 justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-zinc-950 bg-primary-600 hover:bg-primary-700"
						href="/login"
					>
						Sign in
					</a>
				</li>
			</ul>
		</nav>
	</div>
</header>
