<script lang="ts">
	import type { Solar } from '$lib/supabase/client';
	import { entries } from '$lib/supabase/data';

	let { data }: { data: Solar[] } = $props();

	let sort_dir = $state(1);
	let sort_entry = $state(1);

	let sorted_data: Solar[] = $derived(
		data.slice().sort((a, b) => {
			const a_val = entries[sort_entry].get(a);
			const b_val = entries[sort_entry].get(b);

			if (typeof a_val === 'number' && typeof b_val === 'number') {
				return sort_dir * (a_val - b_val);
			} else {
				return sort_dir * String(a_val).localeCompare(String(b_val));
			}
		})
	);
</script>

<div class="table-wrapper">
	<table>
		<thead>
			<tr>
				{#each entries as entry, i}
					<th
						onclick={() => {
							if (sort_entry === i) {
								sort_dir *= -1;
							} else {
								sort_entry = i;
								sort_dir = 1;
							}
						}}
					>
						{entry.label}
						{#if sort_entry === i}
							<span class="arrow">{sort_dir === 1 ? '▲' : '▼'}</span>
						{/if}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each sorted_data as row}
				<tr>
					{#each entries as entry}
						<td>{entry.get(row)}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style lang="scss">
	@use 'sass:color';

	$table-bg: #f0f0f0;
	$border-color: #ccc;
	$table-hover: #f5f5ff;

	.table-wrapper {
		padding: 0;
		margin: 0;

		table {
			border-collapse: collapse;
			table-layout: fixed; /* evenly distribute columns */

			th,
			td {
				border: 1px solid $border-color;
				padding: 0.5rem 1rem;
				text-align: left;
				overflow: hidden;

				max-width: 6rem;
				white-space: normal; /* previously was nowrap */
				word-wrap: break-word; /* wrap long words */
				overflow: visible; /* remove ellipsis hiding */
			}

			th {
				background-color: $table-bg;
				cursor: pointer;
				user-select: none;

				&:hover {
					background-color: color.adjust($table-bg, $lightness: 10%);
				}

				.arrow {
					margin-left: 0.25rem;
					font-size: 0.75rem;
				}
			}

			tr:nth-child(even) {
				background-color: #fafafa;
			}

			tr:hover {
				background-color: $table-hover;
			}
		}
	}
</style>
