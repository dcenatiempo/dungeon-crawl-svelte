<script>
  import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { toolTip, dimensions, tileSize, grid, displayMarket, displayGear } from './store/app.js';
	import { world, currentWorld, updateVisibility, addNewLevel } from './store/world.js';
	import { monsters, populateLevel, monsterLoseHealth, isAliveMonster, isDeadMonster, monsterTurn } from './store/monsters.js';
	import { level, locale, movePlayer, changeLevel, gainExperience, clearPlayerAlerts, pickUpItems, movesRemain, attacksRemain, resetMoves, useAttack } from './store/player.js';
	import { populateMarket } from './store/market.js';
	import { townEvery } from './store/constants';
	
	import Header from './components/Header.svelte';
	import World from './components/World.svelte';
	import Bag from './components/Bag.svelte';
	import Gear from './components/Gear.svelte';
	import Market from './components/Market.svelte';
	import Inspector from './components/Inspector.svelte';
	
	import { getExpFromMonst, battle } from './lib/helpers';
	import { sleep } from './lib/utilities';

	let displaySetByMarket = false;

	function movePlayerAction(target) {
		movePlayer(target);
		updateVisibility(target);
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeypress)
		movesRemain.subscribe(val => {
			if (val <= 0) {
				//this.props.resetPlayerMoves();
				// check to see if any monsters on non-foggy squares
				let countMonst = 0;
				const currentWorld = $world[$level];
				const currentMonsters = $monsters[$level];
				currentMonsters.reduce((mList, m, i) => {
					if ( currentWorld[m.locale[0]][m.locale[1]].fog === 0 && m.health > 0) {
						countMonst++
						mList.push(i)
						return mList
					}
					else return mList
				},[]).forEach((mi,i) => sleep((i+1)*200).then(() => { monsterTurn(mi); }) );
				
				sleep(200+(countMonst)*200).then(() => { resetMoves(); });
			
			}
		})
	});

	function handleKeypress(e) {
		function getCoords(fromLevel, toLevel){
				let newWorld = $world[toLevel];
				let coords;
				for (let r=1; r<newWorld.length-1; r++) {
					for (let c=1; c<newWorld[1].length-1; c++) {
						if (newWorld[r][c].type === 'gate') {
							//console.log("found a gate!!! at "+r+","+c)
							if (newWorld[r][c].toLevel === fromLevel){
								coords = [r,c];
								// reset c and r to exit loop
								c = newWorld[1].length;
								r = newWorld.length;
								//console.log("placing player at gate at "+coords[0]+" "+coords[1])
				}}}}
				//console.log("Level: "+toLevel+ " coords: "+coords)
				return ( coords )
			}
		
		//console.log("keypress: "+e.keyCode);
		let currCell = $locale;					// players current coordinates
		let currentMonsters = $monsters[$level]; // current dungeon monsters list
		let currentWorld = $world[$level];
		let tarCell;
		let kp = e.keyCode || e.which;
		let dir; // [row direction, col direction]
		//console.log(kp)
		switch (kp) {
			case 55:	// 7
				dir = [-1,-1]; break;
			case 38:	// up arrow
			case 56: // 8
				dir = [-1, 0]; break;
			case 57:	// 9
				dir = [-1, 1]; break;
			case 37: // left arrow
			case 52:	// 4
				dir = [0, -1]; break;
			case 39:	// right arrow
			case 54:	// 6
				dir = [0, 1]; break;
			case 49:	// 1
				dir = [1, -1]; break;
			case 40:	// down arrow
			case 50:	// 2
				dir = [1, 0]; break;
			case 51:	// 3
				dir = [1, 1]; break;
			// REST/SKIP MOVE
			case 32: // space
			case 82: // R
			case 53: // 5
				dir = [0,0]; break;
			default:
				dir = undefined;
		}
		if (!dir) return;

		// targetCell is potential future location of player 
		tarCell = [(currCell[0]+dir[0]),(currCell[1]+dir[1])];
		// does player have any moves left???
		if ($movesRemain === 0 ) {
			//console.log("no more moves");
			return;
		}
		// if targetCell is a wall...

		if (currentWorld[currCell[0]][currCell[1]].type === 'market') {
			if (currentWorld[tarCell[0]][tarCell[1]].type !== 'market')
				displayMarket.set(false);
			if (displaySetByMarket)
			  displayGear.set(false);
		}
			
		if (currentWorld[tarCell[0]][tarCell[1]].type === 'wall') {
			;//console.log("you can't walk through walls!");
		}
		// if targetCell is a gate...
		else if (currentWorld[tarCell[0]][tarCell[1]].type === 'gate') {
			let fromLevel = $level;
			let toLevel = currentWorld[tarCell[0]][tarCell[1]].toLevel;
			movePlayerAction(tarCell);				// move player onto gate
			changeLevel(toLevel);				// change players level/location
			if (toLevel >= $world.length) {	// if this level does not exist then...
				//console.log("creating level "+toLevel)		//
				addNewLevel(toLevel); // create new level
				populateLevel(toLevel); // populate new level with monsters
				(toLevel%townEvery === 0 ? populateMarket(toLevel) : null )
			}
			movePlayerAction(getCoords(fromLevel, toLevel));	
		}
		// if targetCell is a market...
		else if (currentWorld[tarCell[0]][tarCell[1]].type === 'market') {
			console.log("lets barter!");
			movePlayerAction(tarCell);
			if (!$displayMarket) {
				displayMarket.set(true);
			}
			if (!$displayGear) {
				displaySetByMarket = true;
				displayGear.set(true);
			} else {
				displaySetByMarket = false;
			}
		}
		// if targetCell is a monster...
		else if (isAliveMonster(tarCell, currentMonsters) !== false ) {
			let m = isAliveMonster(tarCell, currentMonsters);
			// check to see if player has any attacks left
			if ($attacksRemain >= 1 ) {
				useAttack();
				//console.log("Attack "+currentMonsters[m].type+"!");
				let damage = battle(m, false);
				monsterLoseHealth(m, damage);
				currentMonsters = $monsters[$level];
				const monsterKilled = isAliveMonster(tarCell, currentMonsters) === false;
				if (monsterKilled) {
					//console.log("earn experience "+getExpFromMonst(currentMonsters[m]))
					//this.props.addPlayerAlert(("+"+getExpFromMonst(currentMonsters[m])+" experience"))
					gainExperience(getExpFromMonst(currentMonsters[m]))
				}
				/// timed erase of alerts
				clearPlayerAlerts();
			}
			else movePlayerAction(currCell);//no more attacks: 'move' player to square already on
		}
		else if (isDeadMonster(tarCell, currentMonsters) !== false ) {
			//console.log("pick up items");
			pickUpItems(tarCell, currentMonsters);
			movePlayerAction(tarCell);
			/// timed erase of alerts
			clearPlayerAlerts();
		}
		// if targetCell is open ground...
		else if (currentWorld[tarCell[0]][tarCell[1]].type === 'floor') {
			movePlayerAction(tarCell);
		}
	}
</script>

<main>
	<Header />
	<World />
	{#if $displayGear}
		<sidebar transition:fade="{{ duration: 80 }}" class="left-sidebar-grid" id="l-sidebar">
			<Bag />
			<Gear />
		</sidebar>
	{/if}
	{#if $displayMarket}
		<sidebar transition:fade="{{ duration: 80 }}" class="right-sidebar-grid" id="r-sidebar">
			<Market />
		</sidebar>
	{/if}
	<h1 class="dungeon-title footer-grid">
		{$level%townEvery === 0 ? "Town": "Dungeon" } Level {$level+1}
	</h1>
	{#if $toolTip}
		<Inspector />
	{/if}
</main>

<style type="text/scss">
	$header-height: 50px;

	.left-sidebar-grid {
		z-index: 10;
		position: fixed;
		top: $header-height;
		bottom: 0;
		left: 0;
		opacity: .85;
	}
	.right-sidebar-grid {
		z-index: 10;
		position: fixed;
		top: $header-height;
		bottom: 0;
		right: 0;
		opacity: .85;
	}

	.dungeon-title {
		color: lightgray;
		text-align: center;
		margin: 10px 0;
	}
	.footer-grid {
		grid-column: 2 / 3;
		grid-row: 2 / 3;
		z-index: 20;
		pointer-events: none;
	}
</style>