<script lang="ts">
	import { page } from '$app/stores'
</script>

<h1 class="text-2xl mt-24 font-semibold text-center">{$page.error?.message}</h1>
