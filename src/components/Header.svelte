<script>
import { get } from 'svelte/store';

import { expLevel, experience, health, maxHealth, movesRemain, attacksRemain, bag } from '../store/player'
import { rarityTolerance, displayGear } from '../store/app';

function toggleGear() {
	displayGear.set(!get(displayGear));
}
	
function toggleMarket () {
	displayMarket.set(!get(displayMarket));
}

function changeRarity (e) {
	rarityTolerance.set(e.target.value);
}
</script>

<div class="header1-grid header flex-row">
	<button on:click={toggleGear}>Gear</button>
	<div>
		Rarity Tolerance<input
			class="slider"
			type="range"
			defaultValue={rarityTolerance}
			min={1}
			max={10}
			step={1}
			on:change={changeRarity} />
	</div>
	<div class="flex-col">
		<div>Level: {$expLevel}</div>
		<div>Exp: {$experience}/100</div>
	</div>
	<div class="flex-col">
		<div>Health: {$health}/{$maxHealth}</div>
		<div>Gold: {$bag[0].amount}</div>
	</div>
	<div class="flex-col">
		<div>Moves Remain: {$movesRemain}</div>
		<div>Attacks Remain: {$attacksRemain}</div>
	</div>
</div>

<style type="text/scss">
$thumb-height: 20px;
$thumb-width: 20px;
$slider-width: 20%;
$slider-height: 5px;
$header-height: 50px;

.header {
	background: black;
	color: lightgray;
	width: 100%;
	height: $header-height;
	justify-content: space-around;
	padding: 5px;
}
.header1-grid {
	grid-column: 1 / 4;
	grid-row: 1;
}
input[type=range].slider {
	-webkit-appearance: none;
	width: 100%;
	margin-top: 10px;
	padding-right: 10px;
}
input[type=range].slider:focus {
	outline: none;
}

input[type=range].slider::-webkit-slider-runnable-track {
	width: $slider-width;
	height: $slider-height;
	cursor: pointer;
	background: white;
	border-radius: 100%;
	border: none;
}
input[type=range].slider::-webkit-slider-thumb {
	border: 2px solid white;
	height: $thumb-height;
	width: $thumb-width;
	border-radius: 4px;
	background: yellow;
	cursor: pointer;
	-webkit-appearance: none;
	margin-top: -$thumb-height/2;
}
input[type=range].slider:focus::-webkit-slider-runnable-track {
	background: red;
}
input[type=range].slider::-moz-range-track {
	width: $slider-width;
	height: $slider-height;
	cursor: pointer;
	background: #ebeced;
	border-radius: 0px;
	border: none;
}
input[type=range].slider::-moz-range-thumb {
	border: 2px solid white;
	height: $thumb-height;
	width: $thumb-width;
	border-radius: 4px;
	background: #585859;
	cursor: pointer;
}
input[type=range].slider::-ms-track {
	width: $slider-width;
	height: $slider-height;
	cursor: pointer;
	background: transparent;
	border-color: transparent;
	color: transparent;
}
input[type=range].slider::-ms-fill-lower {
	background: white;
	border: none;
	border-radius: 0px;
}
input[type=range].slider::-ms-fill-upper {
	background: white;
	border: none;
	border-radius: 0px;
}
input[type=range].slider::-ms-thumb {
	border: 2px solid white;
	width: $thumb-width;
	border-radius: 4px;
	background: yellow;
	cursor: pointer;
	height: $thumb-height;
}
input[type=range].slider:focus::-ms-fill-lower {
	background: red;
}
input[type=range].slider:focus::-ms-fill-upper {
	background: red;
}

</style>