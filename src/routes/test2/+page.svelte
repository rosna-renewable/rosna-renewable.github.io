<script>
	import { SvelteURLSearchParams } from 'svelte/reactivity';

	const params = new URLSearchParams('message=hello');

	let key = $state('key');
	let value = $state('value');
	params.append('test', 'hello');
</script>

<input bind:value={key} />
<input bind:value />

<p>?{params.toString()}</p>

{#each params as [key, value]}
	<p>{key}: {value}</p>
{/each}
