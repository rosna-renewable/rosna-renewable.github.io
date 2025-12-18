<script lang="ts">
	import Header from './Header.svelte';
	import './layout.css';

	let { children } = $props();
</script>

<div class="app">
	<Header />

	<main>
		{@render children()}
	</main>

	<footer></footer>
</div>

<!-- <style> -->
<!-- 	.app { -->
<!-- 		display: flex; -->
<!-- 		flex-direction: column; -->
<!-- 		min-height: 100vh; -->
<!-- 	} -->
<!---->
<!-- 	main { -->
<!-- 		flex: 1; -->
<!-- 		display: flex; -->
<!-- 		flex-direction: column; -->
<!-- 		width: 100%; -->
<!-- 		margin: 0 auto; -->
<!-- 		box-sizing: border-box; -->
<!-- 	} -->
<!---->
<!-- 	footer { -->
<!-- 		display: flex; -->
<!-- 		flex-direction: column; -->
<!-- 		justify-content: center; -->
<!-- 		align-items: center; -->
<!-- 		padding: 12px; -->
<!-- 	} -->
<!-- </style> -->
