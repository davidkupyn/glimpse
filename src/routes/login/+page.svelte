<script lang="ts">
	import { fadeScale } from '$lib/utils/fadeScale'
	import { Chrome, Eye, EyeOff, Github } from 'lucide-svelte'
	import { scale } from 'svelte/transition'
	import { superForm } from 'sveltekit-superforms/client'
	import { onMount } from 'svelte'
	import { applyAction, enhance } from '$app/forms'
	import { pb } from '$lib/pocketbase.js'
	import { page } from '$app/stores'
	export let data

	const { form, errors } = superForm(data.form)

	const googleWord = [
		{ letter: 'G', style: 'group-hover:text-blue-600 dark:group-hover:text-blue-500' },
		{ letter: 'o', style: 'group-hover:text-red-600 dark:group-hover:text-red-500' },
		{ letter: 'o', style: 'group-hover:text-yellow-600 dark:group-hover:text-yellow-500' },
		{ letter: 'g', style: 'group-hover:text-blue-600 dark:group-hover:text-blue-500' },
		{ letter: 'l', style: 'group-hover:text-green-600 dark:group-hover:text-green-500' },
		{ letter: 'e', style: 'group-hover:text-red-600 dark:group-hover:text-red-500' }
	]

	let showPassword = false
	let passwordInput: HTMLInputElement
	let mounted = false
	onMount(() => {
		mounted = true
	})
	$: {
		if (mounted) passwordInput.type = showPassword ? 'text' : 'password'
	}

	$: redirect = $page.url.searchParams.get('redirect') || '/rooms'
</script>

<main
	class="h-[calc(100vh-6rem)] md:h-[calc(100vh-16rem)] flex items-center justify-center w-full p-6"
>
	<form
		method="POST"
		use:enhance={() => {
			return async ({ result }) => {
				pb.authStore.loadFromCookie(document.cookie)
				await applyAction(result)
			}
		}}
		in:fadeScale={{ baseScale: 0.8 }}
		class="w-full border rounded-3xl dark:border-base-900 border-base-300 p-6 grid gap-6 sm:w-96"
	>
		<h1 class="text-center font-semibold text-xl">Log in</h1>
		<fieldset class="grid gap-1">
			<input
				class="w-full hover:ring-primary-500 data-[invalid]:ring-red-500 dark:hover:ring-primary-600 ring-1 ring-transparent duration-200 focus:ring-primary-500 dark:focus:ring-primary-600 border-0 transition h-10 outline-none dark:placeholder:text-base-500 placeholder:text-base-400 text-sm rounded-lg bg-base-200 dark:bg-base-900 px-4"
				type="text"
				name="email"
				bind:value={$form.email}
				data-invalid={$errors.email}
				placeholder="Email address"
			/>
			{#if $errors.email}
				<small class="text-red-500">{$errors.email}</small>
			{/if}
		</fieldset>
		<fieldset class="grid gap-1">
			<div
				class="w-full flex items-center data-[invalid]:ring-red-500 hover:ring-primary-500 dark:hover:ring-primary-600 rounded-lg overflow-hidden ring-1 ring-transparent duration-200 focus-within:ring-primary-500 dark:focus-within:ring-primary-600 bg-base-200 dark:bg-base-900 pr-2"
				data-invalid={$errors.password}
			>
				<input
					class="focus:ring-0 border-0 transition h-10 outline-none dark:placeholder:text-base-500 placeholder:text-base-400 bg-transparent w-full text-sm pl-4 pr-0"
					bind:this={passwordInput}
					bind:value={$form.password}
					name="password"
					placeholder="Password"
				/>
				<button
					type="button"
					class="p-1 focus-visible:bg-base-300/75 focus-visible:text-base-800 dark:focus-visible:bg-base-800 dark:focus-visible:text-base-200 outline-none rounded text-base-500 dark:text-base-400 hover:text-base-800 dark:hover:text-base-100 transition"
					on:click={() => {
						showPassword = !showPassword
					}}
				>
					{#if showPassword}
						<span in:scale>
							<Eye size={20} />
						</span>
					{:else}
						<span in:scale>
							<EyeOff size={20} />
						</span>
					{/if}
				</button>
			</div>
			{#if $errors.password}
				<small class="text-red-500">{$errors.password}</small>
			{/if}
		</fieldset>
		<button
			type="submit"
			class="inline-flex w-full group items-center h-10 py-2 px-4 transition-all text-base-50 justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 ring-offset-base-50 dark:ring-offset-base-950"
		>
			Log in with email
		</button>
		<div class="flex items-center justify-center text-sm gap-3">
			<span class="bg-base-300 dark:bg-base-800 h-px w-full" />
			<span class="text-base-400">or</span>
			<span class="bg-base-300 dark:bg-base-800 h-px w-full" />
		</div>
		<div class="flex flex-col gap-3">
			<button
				class="inline-flex w-full group items-center h-10 py-2 px-4 transition-all justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-base-300 dark:border-base-800 ring-offset-base-50 dark:ring-offset-base-950 hover:bg-base-200 dark:hover:bg-base-800"
			>
				<Chrome size={20} class="mr-2 w-4 h-4" />
				Continue with
				<span class="ml-1 [&>span]:transition">
					{#each googleWord as { letter, style }}
						<span class={style}>{letter}</span>
					{/each}
				</span>
			</button>
			<button
				class="inline-flex w-full group items-center h-10 py-2 px-4 transition-all justify-center rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-base-300 dark:border-base-800 ring-offset-base-50 dark:ring-offset-base-950 hover:bg-base-200 dark:hover:bg-base-800"
			>
				<Github size={20} class="mr-2 w-4 h-4" />
				Continue with GitHub
			</button>
		</div>
		<div class="w-full flex justify-center items-center text-sm gap-1">
			Don't have an account?
			<a
				href="/signup?redirect={redirect}"
				class="inline-flex group items-center transition justify-center text-sm font-medium focus-visible:outline-none focus-visible:ring-2 ring-primary-600 focus-visible:ring-offset-2 ring-offset-base-50 dark:ring-offset-base-950 rounded px-1 disabled:opacity-50 disabled:pointer-events-none"
			>
				<span
					class="border-b border-opacity-0 border-primary-600 group-hover:border-opacity-100 transition text-primary-500 group-hover:text-primary-600"
				>
					Sign up
				</span>
			</a>
		</div>
	</form>
</main>
