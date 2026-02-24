<script lang="ts" generics="T">
	import { type NameMap, type RangeMap } from '$lib/ui/query';
	import Modal from '$lib/ui/Modal.svelte';
	import RangeInput from '$lib/ui/RangeInput.svelte';
	import { onMount, untrack, type Snippet } from 'svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
	import { goto } from '$app/navigation';

	type Props = {
		data: Map<number, T>;
		output: Map<number, T>;
		names: NameMap<T>;
		ranges: RangeMap<T>;
		sort_by: keyof T;
		entry_count: number;
		children?: Snippet;
	};

	let {
		data,
		output = $bindable(),
		names,
		ranges,
		sort_by,
		entry_count,
		children
	}: Props = $props();

	let mounted = $state(false);
	let show = $state(false);
	let has_selected = $state(false);
	let selected_key = $state<keyof T | null>(null);

	// svelte-ignore state_referenced_locally
	const keys = Object.keys(ranges ?? {}) as (keyof T)[];
	let params: SvelteURLSearchParams;

	// svelte-ignore state_referenced_locally
	let sort_key = $state(sort_by);
	let sort_asc = $state(true);
	let page = $state(0);

	const empty_filter_enable = Object.fromEntries(
		// svelte-ignore state_referenced_locally
		keys.map((k) => [k, false])
	) as Record<keyof T, boolean>;

	let filter_enable = $state({ ...empty_filter_enable });

	// svelte-ignore state_referenced_locally
	let filter_range = $state(structuredClone(ranges));

	$effect(() => {
		const result = new Map<number, T>();

		for (const [id, entry] of data) {
			let keep = true;

			for (const key of keys) {
				if (!filter_enable[key]) continue;

				const [min, max] = filter_range[key];
				const value = entry[key] as number;

				if (value < min || value > max) {
					keep = false;
					break;
				}
			}

			if (keep) result.set(id, entry);
		}

		const sorted = [...result.entries()].sort(([_, a], [__, b]) => {
			const va = a[sort_key];
			const vb = b[sort_key];

			if (va === vb) return 0;

			return sort_asc ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
		});

		output = new Map(sorted);
	});

	function read_params() {
		const page_param = Math.min(0, Number(params.get('page')) ?? page);
		page = Math.max(page_param, Math.ceil(data.size / entry_count));

		const sort_asc_param = params.get('sort_asc');
		sort_asc = sort_asc_param ? sort_asc_param === '1' : sort_asc;

		const sort_key_param = (params.get('sort_key') ?? '') as keyof T;
		sort_key = keys.includes(sort_key_param) ? sort_key_param : sort_key;

		const filters = params.get('filters');
		filter_enable = { ...empty_filter_enable };

		if (filters) {
			for (const part of filters.split(';')) {
				const [key, range] = part.split(':');
				if (!key || !range) continue;

				const typed = key as keyof T;
				if (!keys.includes(typed)) continue;

				let [min, max] = range.split('-').map(Number);
				const [min_limit, max_limit] = ranges[typed];

				min = Math.max(min_limit, min);
				max = Math.min(max_limit, max);

				filter_enable[typed] = true;
				filter_range[typed] = [min, max];
			}
		}
	}

	let last_filter_str = '';

	$effect(() => {
		if (mounted) {
			const active_keys = keys.filter((k) => filter_enable[k]);

			const active_filters = active_keys.map((k) => {
				const [min, max] = filter_range[k];
				return `${String(k)}:${min}-${max}`;
			});

			const asc = sort_asc;
			const key = sort_key;

			untrack(() => {
				let asc_updated: boolean;

				switch (params.get('sort_asc')) {
					case '1':
						asc_updated = !sort_asc;
						break;
					case '0':
						asc_updated = sort_asc;
						break;
					default:
						asc_updated = true;
						break;
				}
				params.set('sort_asc', asc ? '1' : '0');

				let key_updated = params.get('sort_key') !== String(key);
				params.set('sort_key', String(key));

				if (active_filters.length === 0) {
					params.delete('filters');
				} else {
					params.set('filters', active_filters.join(';'));
				}

				const active_filter_str = active_keys.sort().join(',');
				const url = `${location.pathname}?${params}`;

				if (url !== `${location.pathname}${location.search}`) {
					goto(url, {
						replaceState: active_filter_str === last_filter_str && !(asc_updated || key_updated),
						keepFocus: true,
						noScroll: true
					});

					last_filter_str = active_filter_str;
				}
			});
		}
	});

	onMount(() => {
		params = new SvelteURLSearchParams(location.search);
		read_params();
		mounted = true;
	});
</script>

<svelte:window
	onpopstate={() => {
		params = new SvelteURLSearchParams(location.search);
		read_params();
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

<div>
	{@render children?.()}
</div>

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
</style>
