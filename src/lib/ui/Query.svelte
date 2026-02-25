<script lang="ts" generics="T">
	import { type NameMap, type RangeMap } from '$lib/ui/query';
	import Modal from '$lib/ui/Modal.svelte';
	import RangeInput from '$lib/ui/RangeInput.svelte';
	import { onMount, type Snippet } from 'svelte';
	import { goto } from '$app/navigation';

	type Props = {
		data: Map<number, T>;
		output: Map<number, T>;
		names: NameMap<T>;
		ranges: RangeMap<T>;
		sort_by: keyof T;
		sort_ascending: boolean;
		entry_count: number;
		children?: Snippet;
	};

	let {
		data,
		output = $bindable(),
		names,
		ranges,
		sort_by,
		sort_ascending,
		entry_count,
		children
	}: Props = $props();

	let show = $state(false);
	let has_selected = $state(false);
	let selected_key = $state<keyof T | null>(null);

	// svelte-ignore state_referenced_locally
	const keys = Object.keys(ranges ?? {}) as (keyof T)[];
	let params: URLSearchParams = new URLSearchParams();

	// svelte-ignore state_referenced_locally
	let sort_key = $state(sort_by);
	// svelte-ignore state_referenced_locally
	let sort_asc = $state(sort_ascending);
	let page = $state(0);

	let filter_enable = $state(
		Object.fromEntries(
			// svelte-ignore state_referenced_locally
			keys.map((k) => [k, false])
		) as Record<keyof T, boolean>
	);

	// svelte-ignore state_referenced_locally
	let filter_range = $state(structuredClone(ranges));
	const sorted_result = $derived.by(() => {
		const active = keys
			.filter((k) => filter_enable[k])
			.map((k) => ({ key: k, min: filter_range[k][0], max: filter_range[k][1] }));

		const filtered: [number, T][] = [];

		for (const [id, entry] of data) {
			let keep = true;

			for (const f of active) {
				const val = entry[f.key] as number;
				if (val < f.min || val > f.max) {
					keep = false;
					break;
				}
			}

			if (keep) filtered.push([id, entry]);
		}

		const dir = sort_asc ? 1 : -1;

		return filtered.sort(([, a], [, b]) => {
			const va = a[sort_key];
			const vb = b[sort_key];

			if (va === vb) return 0;
			return va > vb ? dir : -dir;
		});
	});

	const total_pages = $derived(Math.ceil(sorted_result.length / entry_count) || 1);

	const page_buttons = $derived.by(() => {
		const tp = total_pages;
		const current = page + 1;

		if (tp <= 10) {
			return Array.from({ length: tp }, (_, i) => i + 1);
		}

		// We want: First 2, Last 2, and Current Center (+/- 1)
		const pages = new Set<number>();
		pages.add(1);
		pages.add(2);
		pages.add(tp - 1);
		pages.add(tp);

		// Add current block safely inside bounds
		if (current > 1) pages.add(current - 1);
		pages.add(current);
		if (current < tp) pages.add(current + 1);

		const sorted = Array.from(pages).sort((a, b) => a - b);
		const result: (number | string)[] = [];

		// Insert '...' where there are gaps
		for (let i = 0; i < sorted.length; i++) {
			if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
				result.push('...');
			}
			result.push(sorted[i]);
		}

		return result;
	});

	$effect(() => {
		const max_page_index = total_pages - 1;

		if (page > max_page_index) {
			page = max_page_index;
		}

		const start = page * entry_count;
		const end = start + entry_count;
		output = new Map(sorted_result.slice(start, end));
	});

	let last_filter_str = '';
	let mounted = false;
	let pop_state = false;

	function read_params(update_filter_str: boolean = false) {
		const page_param = params.get('page');
		page = Math.max(0, page_param ? parseInt(page_param) || 0 : page);

		const sort_asc_param = params.get('sort_asc');
		sort_asc = sort_asc_param ? sort_asc_param === '1' : sort_ascending;

		const sort_key_param = (params.get('sort_key') ?? '') as keyof T;
		sort_key = keys.includes(sort_key_param) ? sort_key_param : sort_by;

		const filters = params.get('filters');

		for (const key of keys) {
			filter_enable[key] = false;
		}

		const detected_keys: string[] = [];

		if (filters) {
			for (const part of filters.split('.')) {
				const [key, range] = part.split('~');
				if (!key || !range) continue;

				const typed = key as keyof T;
				if (!keys.includes(typed)) continue;
				detected_keys.push(key);

				let [min, max] = range.split('-').map(Number);
				const [min_limit, max_limit] = ranges[typed];

				min = Math.max(min_limit, min);
				max = Math.min(max_limit, max);

				filter_enable[typed] = true;
				filter_range[typed] = [min, max];
			}
		}

		if (update_filter_str) last_filter_str = keys.filter((k) => filter_enable[k]).join(' ');
	}

	$effect(() => {
		const active_keys = keys.filter((k) => filter_enable[k]);
		const asc = sort_asc;
		const key = sort_key;
		const num = page;
		const range = filter_range;

		if (mounted) {
			if (pop_state) {
				pop_state = false;
				return;
			}

			const active_filters = active_keys.map((k) => {
				const [min, max] = range[k];
				return `${String(k)}~${min}-${max}`;
			});

			const asc_updated = params.get('sort_asc') !== (asc ? '1' : '0');
			const key_updated = params.get('sort_key') !== String(key);
			const num_updated = params.get('page') !== String(num);

			params.set('sort_asc', asc ? '1' : '0');
			params.set('sort_key', String(key));
			params.set('page', String(num));

			if (active_filters.length === 0) {
				params.delete('filters');
			} else {
				params.set('filters', active_filters.join('.'));
			}

			const active_filter_str = active_keys.join(' ');
			const url = `${location.pathname}?${params}`;

			if (url !== `${location.pathname}${location.search}`) {
				goto(url, {
					replaceState:
						active_filter_str === last_filter_str && !(asc_updated || key_updated || num_updated),
					keepFocus: true,
					noScroll: true
				});

				last_filter_str = active_filter_str;
			}
		}
	});

	onMount(() => {
		params = new URLSearchParams(location.search);
		read_params();
		mounted = true;
	});
</script>

<svelte:window
	onpopstate={() => {
		params = new URLSearchParams(location.search);
		read_params(true);
		pop_state = true;
	}}
/>;

<button class="filter-button" onclick={() => (show = true)}> Filters </button>
<Modal bind:show>
	{#if !has_selected}
		<hr />

		<div class="entry-list">
			{#each keys as key}
				{#if !filter_enable[key]}
					<span>
						<button
							onclick={() => {
								filter_enable[key] = true;
								selected_key = key;
								has_selected = true;
							}}
						>
							{names[key]}
						</button>
					</span>
				{/if}
			{/each}
		</div>

		<hr />

		<button onclick={() => (show = false)}>Close</button>
	{:else}
		{#if selected_key !== null}
			<div class="active-filter">
				<label>
					{names[selected_key]}

					<RangeInput
						min={ranges[selected_key][0]}
						max={ranges[selected_key][1]}
						bind:from={filter_range[selected_key][0]}
						bind:to={filter_range[selected_key][1]}
					/>
				</label>
			</div>
		{/if}

		<button
			onclick={() => {
				show = false;
				has_selected = false;
				selected_key = null;
			}}
		>
			Done
		</button>
	{/if}
</Modal>

<div class="chips">
	{#each keys as key}
		{#if filter_enable[key]}
			<span class="chip">
				<button
					class="chip-label"
					onclick={() => {
						selected_key = key;
						has_selected = true;
						show = true;
					}}
				>
					{names[key]}
				</button>

				<button
					class="chip-close"
					onclick={() => {
						filter_enable[key] = false;

						if (selected_key === key) {
							has_selected = false;
							selected_key = null;
						}
					}}
				>
					×
				</button>
			</span>
		{/if}
	{/each}
</div>

<div class="sort-bar">
	<label>
		Sort By:
		<select bind:value={sort_key}>
			{#each keys as key}
				<option value={key}>
					{names[key]}
				</option>
			{/each}
		</select>
	</label>

	<button onclick={() => (sort_asc = !sort_asc)} class="sort-direction">
		{sort_asc ? '▲' : '▼'}
	</button>
</div>

<div>
	{@render children?.()}
</div>

<div class="pagination">
	<button class="nav-btn" disabled={page === 0} onclick={() => (page = Math.max(0, page - 1))}>
		&laquo; Prev
	</button>

	{#each page_buttons as btn}
		{#if btn === '...'}
			<span class="dots">...</span>
		{:else}
			<button
				class="page-btn"
				class:active={page === (btn as number) - 1}
				onclick={() => (page = (btn as number) - 1)}
			>
				{btn}
			</button>
		{/if}
	{/each}

	<button
		class="nav-btn"
		disabled={page === total_pages - 1}
		onclick={() => (page = Math.min(total_pages - 1, page + 1))}
	>
		Next &raquo;
	</button>
</div>

<style lang="scss">
	.sort-bar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;

		select {
			padding: 0.3rem;
			border-radius: 6px;
			border: 1px solid #ccc;
		}

		.sort-direction {
			padding: 0.3rem 0.6rem;
			cursor: pointer;
			border-radius: 6px;
			border: 1px solid #ccc;
			background: #f0f0f0;

			&:hover {
				background: #e0e0e0;
			}
		}
	}

	.entry-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;

		button {
			padding: 0.25rem 0.5rem;
			border-radius: 8px;
			border: 1px solid #ccc;
			background: #f0f0f0;
			cursor: pointer;

			&:hover {
				background: #e0e0e0;
			}
		}
	}

	.active-filter {
		margin: 0.5rem 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;

		.chip {
			display: flex;
			align-items: center;
			background: #e0e0e0;
			border-radius: 16px;
			padding: 0.1rem 0.25rem;
			gap: 0.25rem;

			.chip-label {
				background: transparent;
				border: none;
				cursor: pointer;
				padding: 0.25rem 0.5rem;
				border-radius: 16px;

				&:hover {
					background: #d0d0d0;
				}
			}

			.chip-close {
				background: transparent;
				border: none;
				cursor: pointer;
				font-weight: bold;

				&:hover {
					color: red;
				}
			}
		}
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		margin: 2rem 0;
		flex-wrap: wrap;

		button {
			padding: 0.4rem 0.8rem;
			border-radius: 6px;
			border: 1px solid #ccc;
			background: #fff;
			cursor: pointer;
			font-weight: 500;
			transition: all 0.2s;

			&:hover:not(:disabled) {
				background: #e0e0e0;
			}

			&:disabled {
				opacity: 0.4;
				cursor: not-allowed;
			}
		}

		.page-btn {
			min-width: 2.5rem;

			&.active {
				background: #333;
				color: #fff;
				border-color: #333;
			}
		}

		.dots {
			padding: 0 0.2rem;
			color: #888;
			font-weight: bold;
		}
	}
</style>
