<script>
import { get } from 'svelte/store';
import { locale, player } from '../store/player';
import { monsters, isAnyMonster, isAliveMonster, isDeadMonster } from '../store/monsters';
import { tileSize, toolTip, mouseX, mouseY, toolTipObject } from '../store/app';
import { world } from '../store/world';
import { townEvery } from '../store/constants';
import { market } from '../store/market';

export let cell;
export let isPlayer;
export let mID;
export let level;
export let inBounds;

$: tile = inBounds
	? $world[level][cell[0]][cell[1]]
	: null;

$: classes = !tile
	? ""
	: tile.type +
			" vis-" + tile.vis +
			(tile.fog >= 1 ? " fog" : 
				( !isPlayer ? "" : " player" ) +
				( mID === false ? "" :
					( isAliveMonster(cell, $monsters[level]) !== false ?
						( $monsters[level][mID].flash ? " monster damaged": " monster" ) :
						( isDeadMonster(cell, $monsters[level]) === false ? "" : " dead" )
					)
				)
			);

let styles = `height: ${$tileSize}px;	width: ${$tileSize}px`;
$: id = `${cell[0]},${cell[1]}`

function toggleToolTip(x, y, obj) {
	toolTip.set(!get(toolTip))
	mouseX.set(x)
	mouseY.set(y)
	toolTipObject.set(obj);
}

function inspectorClick (e) {
		const target = e.target.id.split(",")
		const tile = get(world)[level][target[0]][target[1]];
		// console.log(target)
		// console.log(tile.type)
		const currentMonsters = get(monsters)[level];
		if (isPlayer) {
			toggleToolTip(e.clientX, e.clientY, get(player));
		}
		else if (isAliveMonster(target, currentMonsters) !== false) {
			debugger
			let monster = currentMonsters[isAliveMonster(target, currentMonsters)]
			toggleToolTip(e.clientX, e.clientY, monster);
		}
		else if (isDeadMonster(target, currentMonsters) !== false) {
			let corpse = currentMonsters[isDeadMonster(target, currentMonsters)]
			toggleToolTip(e.clientX, e.clientY, corpse);
		}
		else if (tile.type === 'gate') {
			toggleToolTip(e.clientX, e.clientY, tile);
		}
		else if (tile.type === 'market' ) {
			let currentMarket = get(market)[level/townEvery]
			toggleToolTip(e.clientX, e.clientY, currentMarket)
		}
	}

</script>
{#if inBounds} 
	<div 
		key={id}
		id={id}
		on:mouseover={inspectorClick}
		on:mouseleave={inspectorClick}
		class={classes}
		style={styles}
		>
		<!-- {tile.type === 'gate' ? tile.toLevel+1 : null}
			{ (isPlayer(cell, locale) !== false) ? <Alert char={this.props.player}/> : null } -->
	</div>
{:else}
  <div
		id={id}
		class="void"
		style={styles}
	/>
{/if}

<style type="text/scss">
.dungeon-title {
	color: lightgray;
	text-align: center;
	margin: 10px 0;
}
.row {
	display: flex;
	flex-flow: row nowrap;
	justify-content: center;
}
.cell {
	height: 50px;
	width: 50px;
	margin: 2px;
}
.temp-stats {
	justify-content: space-around;
}
.void {
	@extend .cell;
	background: #262626;
}
.floor {
	@extend .cell;
	background: green;
	border: solid;
	border-width: .5px;
	border-color: forestgreen;
}
.wall {
	@extend .cell;
	background: #888;
}
.market {
	@extend .cell;
	background: orange;
}
.gate {
	@extend .cell;
	background: purple;
}
.fog {
	filter: brightness(50%);
}
.dead {
	background: olive;
}
.monster {
	background: brown;
	border-color: brown;
}
.player {
	background: blue;
	border-color: blue;
}
.damaged {
	border: solid;
	border-color: white;
}
.vis-false {
	background: #262626;
	border: none;
	filter: none;
	box-shadow: none;
}
</style>