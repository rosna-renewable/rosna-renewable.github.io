<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<div class="app">
	<main>
		<div class="bg">
			<enhanced:img src="$lib/assets/bg.jpg?blur=7&brightness=0.8" alt="" />
		</div>

		<div class="content">
			<div class="logo-div">
				<a href="/" aria-label="Home">
					<enhanced:img src="$lib/assets/life.png?saturation=1.5" class="logo" alt="Logo" />
				</a>
			</div>

			{@render children()}
		</div>
	</main>

	<footer></footer>
</div>

<style>
	html,
	body {
		margin: 0;
		height: 100%;
	}

	.bg {
		position: fixed;
		inset: 0;
		z-index: -1;
		overflow: hidden;
	}

	.bg :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.content {
		position: relative;
		z-index: 1;
	}

	.logo-div {
		display: flex;
		justify-content: center; /* horizontal center */
		align-items: flex-start; /* top alignment */
		padding-top: 1vh; /* responsive space from top */
	}

	.logo {
		width: clamp(100px, 50vw, 200px); /* responsive width */
		height: auto;
		cursor: pointer; /* indicates clickable */
	}
</style>
