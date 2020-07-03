<script>
import Cell from './Cell.svelte';
import { virtualWorld } from '../store/world';
import { isInBounds, isPlayer} from '../lib/helpers';
import { level, locale } from '../store/player';
import { isAliveMonster, isDeadMonster } from '../store/monsters';

$: console.log('lasagna', $locale)

</script>

<div class="world-grid world">
	{#each $virtualWorld as row, i}
		<div class="row">
			{#each row as cell, j}
				<Cell cell={cell} isPlayer={isPlayer(cell, $locale)}/>
			{/each}
		</div>
	{/each}
</div>

<style type="text/scss">
.world {
	background: #262626;
}
.world-grid {
	grid-column: 2;
	grid-row: 2 / 4;
	z-index: 1;
}
.row {
	display: flex;
	flex-flow: row nowrap;
	justify-content: center;
}
</style>