<script lang="ts">
	import { onMount } from 'svelte';
	import { client, type Solar } from '$lib/supabase/client';
	import View from './View.svelte';
	import Filter from './Filter.svelte';

	let all_data: Solar[] = $state([]);
	let data: Solar[] = $state([]);
	let error: string = $state('');

	onMount(async () => {
		const { data: fetchedData, error: fetchedError } = await client.from('solar').select('*');
		if (fetchedError) {
			error = fetchedError.message;
		} else if (fetchedData) {
			all_data = fetchedData;
			data = fetchedData;
		}
	});
</script>

<div class="page">
	<h1>Solar Inventory</h1>

	{#if error}
		<p style="color:red">{error}</p>
	{:else if all_data.length === 0}
		<p>Loading...</p>
	{:else}
		<Filter data={all_data} bind:filteredData={data} />
		<View {data} />
	{/if}
</div>
