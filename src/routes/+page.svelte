<script lang="ts">
	import { onMount } from 'svelte';
	import { client, type Solar } from '$lib/supabase/client';
	import View from './View.svelte';

	let data: Solar[] = [];
	let error: string = '';

	onMount(async () => {
		const { data: fetchedData, error: fetchedError } = await client.from('solar').select('*');
		if (fetchedError) {
			error = fetchedError.message;
		} else if (fetchedData) {
			data = fetchedData;
		}
	});
</script>

<h1>Solar Inventory</h1>

{#if error}
	<p style="color:red">{error}</p>
{:else if data.length === 0}
	<p>Loading...</p>
{:else}
	<View {data} />
{/if}
