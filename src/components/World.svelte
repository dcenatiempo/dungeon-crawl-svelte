<script>
import Cell from './Cell.svelte';
import { world, virtualWorld } from '../store/world';
import { isInBounds, isPlayer} from '../lib/helpers';
import { level, locale } from '../store/player';
import { monsters, isAnyMonster, isAliveMonster, isDeadMonster } from '../store/monsters';

// $: console.log('lasagna', $monsters[$level][0])
// $: console.log('level', $level)

</script>

<div class="world-grid world">
	{#each $virtualWorld as row, i}
		<div class="row">
			{#each row as cell, j}
				<Cell
					cell={cell}
					isPlayer={isPlayer(cell, $locale)}
					mID={isAnyMonster(cell, $monsters[$level])}
					level={$level}
					inBounds={isInBounds(cell, $world[$level])}
				/>
			{/each}
		</div>
	{/each}
</div>

<style type="text/scss">
.world {
	background: #262626;
	height: calc(100vh - 50px)
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