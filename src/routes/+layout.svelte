<script>
	import '../app.postcss'
	import Header from '../lib/components/header.svelte'
	import Footer from '$lib/components/footer.svelte'
</script>

<svelte:head>
	<title>Glimpse</title>
	<link rel="icon" href="https://fav.farm/%F0%9F%94%AE" />
</svelte:head>
<!-- <div class="flex flex-col min-h-screen">
	<Header />
	<main class="flex-grow">
		<slot />
	</main>
	<Footer />
</div> -->

<Header />
<slot />
