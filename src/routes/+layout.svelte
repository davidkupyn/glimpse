<script>
	import '../app.postcss'
	import Header from '../lib/components/header.svelte'
</script>

<svelte:head>
	<title>Glimpse</title>
	<link rel="icon" href="https://fav.farm/%F0%9F%94%AE" />
</svelte:head>

<Header />
<slot />
