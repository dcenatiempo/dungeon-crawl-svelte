<script>
	import { alerts, flash } from '../../store/player';
	import { tileSize } from '../../store/app';
</script>

{#if $flash}
	<div class="alert flex-col"  style={`top: ${$tileSize +5}px`}>
		{#each $alerts as alert}
		 <div >{alert}</div>
		{/each}
	</div>
{/if}

<style>
	.alert {
		pointer-events: none;
		position: relative;
		left: -81px;
		width: 189px;
		text-align: center;
		color: white;
		z-index: 51;
		max-height: calc(50vh - 50px);
	}
	.flex-col {
		display: flex;
		flex-flow: column nowrap;
	}
</style>