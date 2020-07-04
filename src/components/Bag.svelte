<script>
	import { get } from 'svelte/store';
	import ModalContentRow from './common/ModalContentRow.svelte';
	import ModalLabelRow from './common/ModalLabelRow.svelte';

	import { displayMarket } from '../store/app';
	import { bag, carryAmount, carryCapacity } from '../store/player';

</script>

<div class="modal-box">
	<h3>Rucksack {$carryAmount}/{$carryCapacity}</h3>
	<ModalLabelRow
		box='bag'
		isMarket={$displayMarket}
	/>
	{#each $bag as thing, i}
		<ModalContentRow 
			index={i}
			item={thing}
			box='bag'
			isMarket={$displayMarket}
		/>
	{/each}
</div>

<style>
	.modal-box {
		background: rgba(255,255,255,.5)
	}
</style>