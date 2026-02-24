<script lang="ts">
	import type { RangeMap } from '$lib/ui/query';
	import Query from '$lib/ui/Query.svelte';

	type User = {
		price: number;
		watt: number;
		weight: number;
		efficiency: number;
		shipping_cost: number;
	};

	// Dataset with 20 items to test pagination and filtering depth
	let users = new Map<number, User>([
		[1, { price: 25, watt: 80, weight: 450, efficiency: 0.85, shipping_cost: 5.99 }],
		[2, { price: 30, watt: 60, weight: 320, efficiency: 0.78, shipping_cost: 0.0 }],
		[3, { price: 40, watt: 95, weight: 600, efficiency: 0.92, shipping_cost: 12.5 }],
		[4, { price: 15, watt: 40, weight: 150, efficiency: 0.65, shipping_cost: 4.5 }],
		[5, { price: 120, watt: 150, weight: 1200, efficiency: 0.98, shipping_cost: 25.0 }],
		[6, { price: 55, watt: 75, weight: 500, efficiency: 0.88, shipping_cost: 0.0 }],
		[7, { price: 200, watt: 300, weight: 2500, efficiency: 0.95, shipping_cost: 45.0 }],
		[8, { price: 12, watt: 10, weight: 50, efficiency: 0.4, shipping_cost: 2.99 }],
		[9, { price: 85, watt: 110, weight: 800, efficiency: 0.82, shipping_cost: 15.0 }],
		[10, { price: 300, watt: 450, weight: 3500, efficiency: 0.99, shipping_cost: 55.0 }],
		[11, { price: 22, watt: 45, weight: 210, efficiency: 0.72, shipping_cost: 0.0 }],
		[12, { price: 65, watt: 130, weight: 950, efficiency: 0.89, shipping_cost: 8.5 }],
		[13, { price: 18, watt: 25, weight: 110, efficiency: 0.55, shipping_cost: 3.0 }],
		[14, { price: 95, watt: 200, weight: 1800, efficiency: 0.91, shipping_cost: 19.99 }],
		[15, { price: 48, watt: 85, weight: 550, efficiency: 0.84, shipping_cost: 0.0 }],
		[16, { price: 150, watt: 250, weight: 2100, efficiency: 0.94, shipping_cost: 30.0 }],
		[17, { price: 35, watt: 70, weight: 400, efficiency: 0.8, shipping_cost: 6.5 }],
		[18, { price: 275, watt: 400, weight: 3200, efficiency: 0.97, shipping_cost: 50.0 }],
		[19, { price: 10, watt: 5, weight: 40, efficiency: 0.3, shipping_cost: 1.5 }],
		[20, { price: 75, watt: 160, weight: 1400, efficiency: 0.87, shipping_cost: 10.0 }],
		[21, { price: 42, watt: 88, weight: 580, efficiency: 0.83, shipping_cost: 7.2 }],
		[22, { price: 110, watt: 140, weight: 1100, efficiency: 0.96, shipping_cost: 0.0 }],
		[23, { price: 14, watt: 30, weight: 130, efficiency: 0.6, shipping_cost: 4.0 }],
		[24, { price: 320, watt: 480, weight: 4200, efficiency: 0.99, shipping_cost: 65.0 }],
		[25, { price: 58, watt: 90, weight: 620, efficiency: 0.86, shipping_cost: 0.0 }],
		[26, { price: 135, watt: 210, weight: 1900, efficiency: 0.93, shipping_cost: 22.0 }],
		[27, { price: 28, watt: 55, weight: 300, efficiency: 0.75, shipping_cost: 5.5 }],
		[28, { price: 88, watt: 175, weight: 1600, efficiency: 0.9, shipping_cost: 14.0 }],
		[29, { price: 45, watt: 92, weight: 570, efficiency: 0.81, shipping_cost: 0.0 }],
		[30, { price: 190, watt: 280, weight: 2400, efficiency: 0.95, shipping_cost: 38.0 }],
		[31, { price: 11, watt: 12, weight: 60, efficiency: 0.35, shipping_cost: 2.5 }],
		[32, { price: 62, watt: 115, weight: 900, efficiency: 0.88, shipping_cost: 9.0 }],
		[33, { price: 21, watt: 42, weight: 190, efficiency: 0.68, shipping_cost: 0.0 }],
		[34, { price: 165, watt: 260, weight: 2200, efficiency: 0.94, shipping_cost: 32.5 }],
		[35, { price: 38, watt: 78, weight: 480, efficiency: 0.82, shipping_cost: 6.0 }],
		[36, { price: 240, watt: 380, weight: 3000, efficiency: 0.98, shipping_cost: 48.0 }],
		[37, { price: 16, watt: 35, weight: 140, efficiency: 0.62, shipping_cost: 4.25 }],
		[38, { price: 92, watt: 190, weight: 1750, efficiency: 0.91, shipping_cost: 0.0 }],
		[39, { price: 52, watt: 82, weight: 520, efficiency: 0.84, shipping_cost: 8.0 }],
		[40, { price: 115, watt: 155, weight: 1250, efficiency: 0.97, shipping_cost: 26.5 }],
		[41, { price: 19, watt: 28, weight: 120, efficiency: 0.58, shipping_cost: 3.5 }],
		[42, { price: 290, watt: 460, weight: 4000, efficiency: 0.99, shipping_cost: 60.0 }],
		[43, { price: 47, watt: 94, weight: 590, efficiency: 0.85, shipping_cost: 0.0 }],
		[44, { price: 145, watt: 230, weight: 2050, efficiency: 0.94, shipping_cost: 28.0 }],
		[45, { price: 26, watt: 50, weight: 280, efficiency: 0.74, shipping_cost: 5.0 }],
		[46, { price: 82, watt: 165, weight: 1550, efficiency: 0.89, shipping_cost: 13.5 }],
		[47, { price: 34, watt: 68, weight: 390, efficiency: 0.79, shipping_cost: 0.0 }],
		[48, { price: 175, watt: 290, weight: 2600, efficiency: 0.96, shipping_cost: 40.0 }],
		[49, { price: 13, watt: 15, weight: 70, efficiency: 0.45, shipping_cost: 2.75 }],
		[50, { price: 68, watt: 125, weight: 980, efficiency: 0.87, shipping_cost: 9.5 }]
	]);

	let filtered = new Map<number, User>();

	let names = {
		price: 'Price ($)',
		watt: 'Wattage (W)',
		weight: 'Weight (g)',
		efficiency: 'Efficiency (0-1)',
		shipping_cost: 'Shipping Fee ($)'
	};

	let ranges: RangeMap<User> = {
		price: [0, 500],
		watt: [0, 500],
		weight: [0, 5000],
		efficiency: [0, 1],
		shipping_cost: [0, 100]
	};

	let sort_by: keyof User = 'price';
</script>

<Query data={users} bind:output={filtered} {names} {ranges} {sort_by} entry_count={4}>
	<div style="margin-bottom: 1rem; border-bottom: 2px solid #eee;">
		<h3>Showing {filtered.size} of {users.size} Items</h3>
	</div>

	<div class="results-grid">
		{#each filtered as [id, item]}
			<div class="card">
				<div class="id-badge">ID: {id}</div>
				<p><strong>Price:</strong> ${item.price} | <strong>Power:</strong> {item.watt}W</p>
				<p>
					<strong>Weight:</strong>
					{item.weight}g | <strong>Eff:</strong>
					{(item.efficiency * 100).toFixed(0)}%
				</p>
				<p>
					<small>Shipping: {item.shipping_cost === 0 ? 'FREE' : '$' + item.shipping_cost}</small>
				</p>
			</div>
		{/each}
	</div>
</Query>

<style>
	.results-grid {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.card {
		padding: 1rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		background-color: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}
	.id-badge {
		font-weight: bold;
		color: #666;
		font-size: 0.8rem;
		margin-bottom: 4px;
	}
	p {
		margin: 4px 0;
	}
</style>
