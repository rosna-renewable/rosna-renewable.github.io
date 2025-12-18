<script lang="ts">
	import type { Solar } from '$lib/supabase/client';

	let { data }: { data: Solar[] } = $props();

	let sort_field: keyof Solar = $state('price');
	let sort_dir: number = $state(1);

	let sorted_data: Solar[] = $derived(
		data.slice().sort((a, b) => sort_dir * (Number(a[sort_field]) - Number(b[sort_field])))
	);

	function toHex32(id: number) {
		return '0x' + (id >>> 0).toString(16).padStart(8, '0');
	}
</script>

<table>
	<thead>
		<tr>
			{#each Object.keys(sorted_data[0]) as key}
				<th
					onclick={() => {
						sort_field = key as keyof Solar;
						sort_dir *= -1;
					}}
				>
					{key}
				</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each sorted_data as row}
			<tr>
				{#each Object.keys(row) as key}
					<td>
						{key === 'id'
							? toHex32(row[key as keyof Solar] as number)
							: (row[key as keyof Solar] ?? '-')}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		border-collapse: collapse;
		width: 100%;
		font-family: sans-serif;
		margin-top: 1rem;
	}

	th,
	td {
		border: 1px solid #ccc;
		padding: 0.5rem 1rem;
		text-align: left;
	}

	th {
		background-color: #f0f0f0;
		cursor: pointer;
		user-select: none;
		position: relative;
	}

	th:hover {
		background-color: #e0e0e0;
	}

	th.arrow {
		margin-left: 0.25rem;
		font-size: 0.75rem;
	}

	tr:nth-child(even) {
		background-color: #fafafa;
	}

	tr:hover {
		background-color: #f5f5ff;
	}
</style>
