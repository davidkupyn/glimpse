<script>
	import '../app.postcss'
	import Header from '../lib/components/header.svelte'
	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'

	export let data

	$: ({ supabase, session } = data)

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})

		return () => subscription.unsubscribe()
	})
</script>

<svelte:head>
	<title>Glimpse</title>
	<link rel="icon" href="https://fav.farm/%F0%9F%94%AE" />
</svelte:head>

<Header />
<slot />
