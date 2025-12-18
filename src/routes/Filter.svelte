<script lang="ts">
	import Modal from './ui/Modal.svelte';
	import Range from './ui/Range.svelte';
	import { type Solar } from '$lib/supabase/client';
	import { entries } from '$lib/supabase/data';

	let { data, filteredData = $bindable() }: { data: Solar[]; filteredData: Solar[] } = $props();
	let show = $state(false);
	let has_selected = $state(false);
	let index = $state(0);
	let free_entries = $state(entries);

	type Filter = { from: number; to: number; enable: boolean } | { str: string; enable: boolean };
	let filters: Filter[] = $state(
		entries.map(() => ({
			from: 0,
			to: 0,
			enable: false
		}))
	);

	$effect(() => {
		const result: Solar[] = [];

		for (const item of data) {
			let keep = true;

			for (let i = 0; i < filters.length; i++) {
				const filter = filters[i];
				if (!filter.enable) continue;

				const entry = entries[i];

				if ('from' in filter && 'to' in filter) {
					const value = entry.get(item) as number;

					// Fail fast if filter is impossible for this entry
					if (value < filter.from || value > filter.to) {
						keep = false;
						break;
					}
				} else if ('str' in filter) {
					const value = (entry.get(item) as string)?.toLowerCase() || '';
					const search = filter.str.toLowerCase();

					// Fail fast if string filter does not match
					if (search && !value.includes(search)) {
						keep = false;
						break;
					}
				}
			}

			if (keep) result.push(item);
		}

		filteredData = result;
	});
</script>

<!-- Button to open modal -->
<button class="filter-button" onclick={() => (show = true)}> Filters </button>

<!-- Modal using snippet for content -->
<Modal bind:show>
	{#if !has_selected}
		<hr />
		<div class="entry-list">
			{#each free_entries as entry, i}
				{#if !filters[i].enable}
					<span>
						<button
							onclick={() => {
								index = i;
								has_selected = true;
								filters[i].enable = true;
								if ('max' in entries[index] && (!('from' in filters[i]) || filters[i].from === 0)) {
									filters[i] = {
										from: 0,
										to: entries[index].max ?? 0,
										enable: filters[i].enable
									};
								} else if (!('str' in filters[i])) {
									filters[i] = {
										str: '',
										enable: filters[i].enable
									};
								}
							}}
						>
							{entry.label}
						</button>
					</span>
				{/if}
			{/each}
		</div>
		<hr />
		<button
			onclick={() => {
				show = false;
			}}
		>
			Close
		</button>
	{:else}
		{#if 'max' in entries[index]}
			<Range
				bind:from={(filters[index] as { from: number }).from}
				bind:to={(filters[index] as { to: number }).to}
				min={0}
				max={entries[index].max}
			/>
		{:else}
			<input
				type="text"
				placeholder="Enter text"
				bind:value={(filters[index] as { str: string }).str}
			/>
		{/if}

		<button
			onclick={() => {
				show = false;
				has_selected = false;
			}}
		>
			Done
		</button>
	{/if}
</Modal>

<!-- Active filter chips -->
<div class="chips">
	{#each filters as filter, i}
		{#if filter.enable}
			<span class="chip">
				<!-- Clicking the chip opens the editor -->
				<button
					class="chip-label"
					onclick={() => {
						index = i;
						has_selected = true;
						show = true;
					}}
				>
					{entries[i].label}
				</button>

				<!-- Clicking × removes the filter -->
				<button
					class="chip-close"
					onclick={() => {
						has_selected = false;

						if ('from' in filter) {
							filters[i] = { from: 0, to: 0, enable: false };
						} else {
							filters[i] = { str: '', enable: false };
						}
					}}
				>
					×
				</button>
			</span>
		{/if}
	{/each}
</div>

<style lang="scss">
	$filter-bg: #f0f0f0;
	$filter-hover-bg: #e0e0e0;
	$filter-border: #ccc;
	$filter-radius: 8px;
	$filter-gap: 0.5rem;
	$filter-padding: 0.25rem 0.5rem;
	$filter-font-size: 0.9rem;

	.entry-list {
		display: flex;
		flex-wrap: wrap;
		gap: $filter-gap;
		margin: 0;
		padding: 0;

		span {
			display: inline-block;

			button {
				padding: $filter-padding;
				border-radius: $filter-radius;
				border: 1px solid $filter-border;
				background: $filter-bg;
				cursor: pointer;
				font-size: $filter-font-size;
				transition: background 0.2s;

				&:hover {
					background: $filter-hover-bg;
				}

				&:focus {
					outline: 2px solid darken($filter-bg, 20%);
					outline-offset: 2px;
				}
			}
		}
	}

	$chip-bg: #e0e0e0;
	$chip-hover-bg: #d0d0d0;
	$chip-label-bg: #f7f7f7;
	$chip-border: #ccc;
	$chip-radius: 16px;
	$chip-gap: 0.5rem;
	$chip-padding: 0.25rem 0.5rem;
	$chip-font-size: 0.9rem;

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: $chip-gap;

		.chip {
			display: flex;
			align-items: center;
			background: $chip-bg;
			border-radius: $chip-radius;
			padding: 0.1rem 0.25rem;
			gap: 0.25rem;

			.chip-label {
				background: transparent;
				border: none;
				cursor: pointer;
				padding: $chip-padding;
				border-radius: $chip-radius;
				font-size: $chip-font-size;
				transition: background 0.2s;

				&:hover {
					background: $chip-hover-bg;
				}
			}

			.chip-close {
				background: transparent;
				border: none;
				cursor: pointer;
				font-weight: bold;
				font-size: $chip-font-size;
				line-height: 1;
				padding: 0 0.25rem;
				transition: color 0.2s;

				&:hover {
					color: red;
				}
			}
		}
	}
</style>
