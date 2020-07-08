<script>
	import { get } from 'svelte/store';
	import ModalContentRow from './common/ModalContentRow.svelte';
	import ModalLabelRow from './common/ModalLabelRow.svelte';

	import { displayMarket } from '../store/app';
	import { market } from '../store/market';
	import { level } from '../store/player';
	import { townEvery } from '../store/constants';

	$: marketId = $level/townEvery;
</script>

<div class="modal-box">
	<h3>Market</h3>
	<ModalLabelRow
		box='market'
		isMarket={true}
	/>
	{#each $market[marketId].bag as thing, i}
		<ModalContentRow
			index={i}
			item={thing}
			box='market'
			isMarket={true}
		/>
	{/each}
</div>


<style>
	.modal-box {
		background: rgba(255,255,255,.5)
	}
</style>