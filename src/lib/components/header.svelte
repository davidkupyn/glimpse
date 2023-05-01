<script>
	import { page } from '$app/stores'
	import { Github } from 'lucide-svelte'
</script>

<header
	class="{$page.url.pathname === '/'
		? 'fixed'
		: 'sticky top-0 dark:bg-base-950/50 bg-base-50/50 backdrop-blur-md'} w-full z-20 dark:border-base-900 border-base-300"
	class:border-b={$page.url.pathname !== '/'}
>
	<div class="container mx-auto flex justify-between items-center px-6 py-3.5 md:py-5">
		<h1 class="text-lg font-bold">
			<a
				href="/"
				aria-label="Go to home page"
				class="outline-none focus-visible:border-opacity-100 border-b border-base-950 dark:border-base-50 py-1 dark:border-opacity-0 border-opacity-0 transition"
				>Glimpse</a
			>
		</h1>
		<!-- <img
			src="https://api.dicebear.com/6.x/bottts-neutral/svg?radius=50&size=36&backgroundColor=e11d48&seed=roman@gmail.com"
			alt="TS"
		/> -->
		<nav>
			<ul class="inline-flex gap-4 sm:gap-6 items-center">
				<li>
					<a
						aria-label="Github Link"
						class="inline-flex items-center focus-visible:text-base-900 dark:focus-visible:text-base-100 justify-center max-sm:hidden dark:focus-visible:bg-base-900 focus-visible:bg-base-200/50 rounded-lg h-9 px-2 outline-none transition text-base-500 dark:text-base-400 dark:hover:text-base-100 hover:text-base-900 text-sm"
						href="https://github.com/davidkupyn"
						target="_blank"
					>
						<Github size={20} />
					</a>
				</li>
				<!-- <span class="max-sm:hidden bg-base-800 w-px h-6" />
				<li>
					<a
						class="inline-flex items-center focus-visible:text-base-900 dark:focus-visible:text-base-100 justify-center max-sm:hidden focus-visible:bg-base-900 rounded-lg h-9 px-3 outline-none transition text-base-400 hover:text-base-100 text-sm"
						href="/"
						>About
					</a>
				</li> -->
				<span class="max-sm:hidden bg-base-300 dark:bg-base-800 w-px h-6" />
				<li>
					<a
						class="inline-flex items-center focus-visible:text-base-900 dark:focus-visible:text-base-100 justify-center dark:focus-visible:bg-base-900 focus-visible:bg-base-200/50 rounded-lg h-9 px-3 outline-none transition text-base-500 dark:text-base-400 dark:hover:text-base-100 hover:text-base-900 text-sm"
						href="/login"
						>Log in
					</a>
				</li>
				<li>
					<a
						class="inline-flex group items-center h-9 px-3 transition-all text-base-50 justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-base-50 dark:ring-offset-base-950 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
						href="/signup"
					>
						Sign up
					</a>
				</li>
			</ul>
		</nav>
	</div>
</header>
