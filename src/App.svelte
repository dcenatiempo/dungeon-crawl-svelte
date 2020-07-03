<script>
	import { onMount } from 'svelte';
	import { dimensions, tileSize, grid } from './store/app.js';
	import Header from './components/Header.svelte';
	import World from './components/World.svelte';

	$: console.log($tileSize)
	$: console.log($grid)
</script>

<main>
	<Header />
	<World />
	<h1>Hello {$dimensions.w}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>