<script>
	import { Chrome, Github } from 'lucide-svelte'
	import { cubicOut } from 'svelte/easing'
	import { fly } from 'svelte/transition'
</script>

<main class="h-screen flex items-center justify-center w-full p-6">
	<form
		in:fly={{ y: 300, duration: 200, easing: cubicOut }}
		class="w-full border rounded-3xl border-zinc-900 p-6 grid gap-6 sm:w-96"
	>
		<h1 class="text-center font-semibold text-xl">Sign in</h1>
		<input
			class="hover:ring-primary-600 ring-1 ring-transparent duration-200 focus-within:ring-primary-600 border-0 transition h-10 outline-none placeholder:text-zinc-500 text-sm rounded-lg bg-zinc-900 px-4"
			type="text"
			placeholder="Email address"
		/>
		<!-- <input
			class="hover:ring-primary-600 ring-1 ring-transparent duration-200 focus-within:ring-primary-600 border-0 transition h-10 outline-none placeholder:text-zinc-500 text-sm rounded-lg bg-zinc-900 px-4"
			type="password"
			placeholder="Password"
		/> -->
		<button
			class="inline-flex w-full group items-center h-10 py-2 px-4 transition-all text-primary-50 justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-zinc-950 bg-primary-600 hover:bg-primary-700"
		>
			Sign in with email
		</button>
		<div class="flex items-center justify-center text-sm gap-3">
			<span class="bg-zinc-800 h-px w-full" />
			<span class="text-zinc-400">or</span>
			<span class="bg-zinc-800 h-px w-full" />
		</div>
		<div class="flex flex-col gap-3">
			<button
				class="inline-flex w-full group items-center h-10 py-2 px-4 transition-all text-primary-50 justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-zinc-800 ring-offset-zinc-950 hover:bg-zinc-800"
			>
				<Chrome size={20} class="mr-2 w-4 h-4" />
				Continue with Google
			</button>
			<button
				class="inline-flex w-full group items-center h-10 py-2 px-4 transition-all text-primary-50 justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-zinc-800 ring-offset-zinc-950 hover:bg-zinc-800"
			>
				<Github size={20} class="mr-2 w-4 h-4" />
				Continue with GitHub
			</button>
		</div>
		<div class="w-full flex justify-center items-center text-sm gap-2">
			Don't have an account?
			<button
				class="inline-flex group items-center transition justify-center text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 ring-offset-zinc-950 rounded px-1 disabled:opacity-50 disabled:pointer-events-none"
			>
				<span
					class="border-b border-opacity-0 border-primary-600 group-hover:border-opacity-100 transition text-primary-500 group-hover:text-primary-600"
				>
					Sign up
				</span>
			</button>
		</div>
	</form>
</main>
