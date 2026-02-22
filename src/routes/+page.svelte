<script lang="ts">
	import { onMount } from 'svelte';

	let showButton = true;

	function scrollToContacts(): void {
		document.getElementById('contacts')?.scrollIntoView({
			behavior: 'smooth'
		});
	}

	onMount(() => {
		let ticking = false;

		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					showButton = window.scrollY < 100;
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<div class="categories">
	<h1 class="title">Featured Products</h1>

	<div class="cards">
		<a href="/page1" class="card">
			<span class="card-title">Solar Panels</span>
			<span class="card-desc">High efficiency energy solutions</span>
		</a>

		<div class="bottom-row">
			<a href="/page2" class="card">
				<span class="card-title">Solar Pumps</span>
				<span class="card-desc">Reliable water pumping systems</span>
			</a>

			<a href="/page3" class="card">
				<span class="card-title">SMT</span>
				<span class="card-desc">Smart monitoring technology</span>
			</a>
		</div>
	</div>

	{#if showButton}
		<div class="contact-btn-wrapper">
			<button class="contact-btn" on:click={scrollToContacts}> Contacts ▼ </button>
		</div>
	{/if}
</div>

<section id="contacts">
	<h2>Contacts</h2>
	<p>Contact information goes here.</p>
</section>

<style lang="scss">
	.categories {
		text-align: center;
		padding: 40px 20px;

		.title {
			font-size: clamp(24px, 4vw, 40px);
			font-weight: 700;
			letter-spacing: 2px;
			text-transform: uppercase;
			margin-bottom: 20px;
			background: linear-gradient(90deg, #fff, #aaa);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}

		.cards {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 30px;
			margin: 40px auto;
			max-width: 1100px;
		}

		.bottom-row {
			display: flex;
			flex-direction: column;
			gap: 30px;
			width: 100%;
			align-items: center;

			@media (min-width: 768px) {
				flex-direction: row;
				justify-content: space-around;
			}
		}

		.card {
			width: clamp(250px, 60vw, 500px);
			height: clamp(100px, 14vw, 140px);
			background: rgba(0, 0, 0, 0.5);
			backdrop-filter: blur(12px);
			color: white;
			text-decoration: none;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 6px;
			border-radius: 20px;
			box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
			transition:
				transform 0.25s ease,
				background 0.25s ease;

			&:hover {
				transform: translateY(-6px) scale(1.03);
				background: rgba(0, 0, 0, 0.75);
			}

			.card-title {
				font-size: 18px;
				font-weight: 600;
			}

			.card-desc {
				font-size: 14px;
				opacity: 0.8;
			}
		}

		.contact-btn-wrapper {
			position: fixed;
			bottom: 20px;
			left: 50%;
			transform: translateX(-50%);
			z-index: 1000;
		}

		.contact-btn {
			min-width: clamp(100px, 30vw, 180px);
			height: clamp(40px, 8vw, 55px);
			padding: 0 clamp(12px, 3vw, 24px);

			border-radius: 999px;
			border: none;

			cursor: pointer;

			background: rgba(0, 0, 0, 0.7);
			color: white;

			font-size: clamp(14px, 2vw, 18px);
			font-weight: 500;

			transition:
				transform 0.2s ease,
				background 0.2s ease;

			&:hover {
				transform: scale(1.08);
				background: rgba(0, 0, 0, 0.85);
			}
		}
	}

	#contacts {
		padding: 100px 20px;
		text-align: center;
	}
</style>
