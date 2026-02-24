<script lang="ts">
	import type { RangeMap } from '$lib/ui/query';
	import Query from '$lib/ui/Query.svelte';

	type User = {
		age: number;
		score: number;
	};

	// Example dataset
	let users = new Map<number, User>([
		[1, { age: 25, score: 80 }],
		[2, { age: 30, score: 60 }],
		[3, { age: 40, score: 95 }]
	]);

	// Filtered result
	let filtered = new Map<number, User>();

	// Display names
	let names = {
		age: 'Age',
		score: 'Score'
	};

	// Initial ranges (required for all keys)
	let ranges: RangeMap<User> = {
		age: [0, 100],
		score: [0, 100]
	};

	let sort_by: keyof User = 'age';
</script>

<hr />

<Query data={users} bind:output={filtered} {names} {ranges} {sort_by} entry_count={5} />

<hr />

<h3>Filtered Results</h3>

{#each filtered as [id, user]}
	<div>
		ID: {id} — Age: {user.age} — Score: {user.score}
	</div>
{/each}
