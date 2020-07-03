import { writable, readable, derived } from 'svelte/store';
import { level, locale } from './player';
import { grid } from '../store/app';
import { townEvery } from '../store/constants';
import { createTownLevel } from '../lib/helpers';
import { add } from '../lib/utilities';

export {
	world,
	currentWorld,
	virtualWorld
}

const world = writable([createTownLevel()]);
const currentWorld = derived([world, level], ([$world, $level]) => $world[$level]);
const virtualWorld = derived([locale, grid, level, currentWorld], ([$center, $grid, $level, $currentWorld]) => {
		let height = $grid.height;
		let width = $grid.width;
		console.log($currentWorld)
		//console.log(height+","+width)
		let start = [Math.round($center[0]-(height)/2)+1, Math.round($center[1]-(width)/2)]; // top left corner
		if ($level%townEvery === 0) {
			start[0] = -2;
			start[1] = Math.round($currentWorld[0].length/2 - width/2)
		}
		if (height < 11)
			start[0] -= 2
		let end = add (start, [height, width]);

		let virtualWorld = [];
		let i;
		for (let r = start[0], i=0; r < end[0]; r++) {
			virtualWorld.push([])
			for (let c = start[1]; c < end[1]; c++) {
				virtualWorld[i].push([r,c])
			}
			i++
		}
		return virtualWorld;
});