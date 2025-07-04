<script lang="ts">
	import LightSwitch from '$lib/Components/LightSwitch.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
	<header class="p-4"><LightSwitch /></header>
	<main class="space-y-4 p-4">
		{@render children()}
	</main>
	<footer class="p-4">(footer)</footer>
</div>
