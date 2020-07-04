<script>
	import { get } from 'svelte/store';
	import ModalContentRow from './common/ModalContentRow.svelte';
	import ModalLabelRow from './common/ModalLabelRow.svelte';

	import { displayMarket } from '../store/app';
	import { body } from '../store/player';

</script>

<div class="modal-box">
	<h3>Armed Gear</h3>
	<ModalLabelRow
		box='body'
		isMarket={$displayMarket}
	/>
	{#each $body as thing, i}
		<ModalContentRow 
			index={i}
			item={thing}
			box='body'
			isMarket={$displayMarket}
		/>
	{/each}
</div>

<style>
	.modal-box {
		background: rgba(255,255,255,.5)
	}
</style>