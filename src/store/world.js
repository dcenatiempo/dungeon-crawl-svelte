import { writable, readable, derived, get } from 'svelte/store';
import { level, locale } from './player';
import { grid } from '../store/app';
import { townEvery, shadowList as shadowListConst} from '../store/constants';
import { createTownLevel, createDungeonLevel, isInBounds } from '../lib/helpers';
import { add } from '../lib/utilities';

export {
	world,
	currentWorld,
	virtualWorld,
	// actions
	updateVisibility,
	addNewLevel,
}

const world = writable([createTownLevel(0)]);
const currentWorld = derived([world, level], ([$world, $level]) => $world[$level] || $world[$level - 1] || []);
const virtualWorld = derived([locale, grid, level, currentWorld], ([$center, $grid, $level, $currentWorld]) => {
		let height = $grid.height;
		let width = $grid.width;
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

function updateVisibility(target) {
	if (get(level)%townEvery <= 0) return;

	let shadowSize = 5; //1-5
	let newWorld = JSON.parse(JSON.stringify(get(world)))
	let dungeon = newWorld[get(level)]
	let rows = dungeon.length;
	let cols = dungeon[0].length;
	let coords ;
	shadowListConst
	const shadowList = shadowListConst;

	// takes relative coordinates and converts to absolute coordinates then changes to visible
	function makeFog (rR, cR, q) {
		//find matching shaddows
		for ( let i=0; i<shadowList.length; i++) {
			if (shadowList[i].start[0] === rR && shadowList[i].start[1] === cR) {
				for (let j=0; j<shadowList[i].full.length; j++) {
					let rShadAbs, cShadAbs;
					if (q===1) {
						rShadAbs =  shadowList[i].full[j][0]+target[0];
						cShadAbs =  shadowList[i].full[j][1]+target[1]; }
					else if (q===2) {
						rShadAbs =  shadowList[i].full[j][1]+target[0];
						cShadAbs = -shadowList[i].full[j][0]+target[1]; }
					else if (q===3) {
						rShadAbs = -shadowList[i].full[j][0]+target[0];
						cShadAbs = -shadowList[i].full[j][1]+target[1]; }
					else if (q===4) {
						rShadAbs = -shadowList[i].full[j][1]+target[0];
						cShadAbs =  shadowList[i].full[j][0]+target[1]; }
					else if (q===5) {
						rShadAbs =  shadowList[i].full[j][1]+target[0];
						cShadAbs =  shadowList[i].full[j][0]+target[1]; }
					else if (q===6) {
						rShadAbs =  shadowList[i].full[j][0]+target[0];
						cShadAbs = -shadowList[i].full[j][1]+target[1]; }
					else if (q===7) {
						rShadAbs = -shadowList[i].full[j][1]+target[0];
						cShadAbs = -shadowList[i].full[j][0]+target[1]; }
					else if (q===8) {
						rShadAbs = -shadowList[i].full[j][0]+target[0];
						cShadAbs =  shadowList[i].full[j][1]+target[1]; }
					if (isInBounds([rShadAbs, cShadAbs], get(currentWorld))) {	
						dungeon[rShadAbs][cShadAbs].fog += 1;
						//console.log("full fog added")	
					}
				}
				for (let j=0; j<shadowList[i].half.length; j++) {
					let rShadAbs, cShadAbs;
					if (q===1) {
						rShadAbs =  shadowList[i].half[j][0]+target[0];
						cShadAbs =  shadowList[i].half[j][1]+target[1]; }
					else if (q===2) {
						rShadAbs =  shadowList[i].half[j][1]+target[0];
						cShadAbs = -shadowList[i].half[j][0]+target[1]; }
					else if (q===3) {
						rShadAbs = -shadowList[i].half[j][0]+target[0];
						cShadAbs = -shadowList[i].half[j][1]+target[1]; }
					else if (q===4) {
						rShadAbs = -shadowList[i].half[j][1]+target[0];
						cShadAbs =  shadowList[i].half[j][0]+target[1]; }
					else if (q===5) {
						rShadAbs =  shadowList[i].half[j][1]+target[0];
						cShadAbs =  shadowList[i].half[j][0]+target[1]; }
					else if (q===6) {
						rShadAbs =  shadowList[i].half[j][0]+target[0];
						cShadAbs = -shadowList[i].half[j][1]+target[1]; }
					else if (q===7) {
						rShadAbs = -shadowList[i].half[j][1]+target[0];
						cShadAbs = -shadowList[i].half[j][0]+target[1]; }
					else if (q===8) {
						rShadAbs = -shadowList[i].half[j][0]+target[0];
						cShadAbs =  shadowList[i].half[j][1]+target[1]; }
					if (isInBounds([rShadAbs, cShadAbs], get(currentWorld))) {
						dungeon[rShadAbs][cShadAbs].fog += .5;
						//console.log("half fog added")	
					}
				}
			}
		}
	}
	
	function writeToMap() {
		let rRel = coords[0];
		let cRel = coords[1]
		let rAbs = rRel+target[0];
		let cAbs = cRel+target[1];
		if (isInBounds([rAbs, cAbs], get(currentWorld))) {
			if (dungeon[rAbs][cAbs].type === 'wall') {
				// mark shadows
				if ( rRel >= 0 && rRel <= 3 && cRel >= 1 && cRel <= 4 && Math.abs(cRel) >= Math.abs(rRel)) {
					makeFog(rRel, cRel, 1);	//  r, c
				}
				else if ( rRel >= 1 && rRel <= 4 && cRel <= 0 && cRel >= -3 && Math.abs(cRel) <= Math.abs(rRel)) {
					makeFog(-cRel, rRel, 2);	//  c,-r
				}
				else if ( rRel <= 0 && rRel >= -3 && cRel <= -1 && cRel >= -4 && Math.abs(cRel) >= Math.abs(rRel)) {
					makeFog(-rRel, -cRel, 3);	// -r,-c
				}
				else if ( rRel <= -1 && rRel >= -4 && cRel >= 0 && cRel <= 3 && Math.abs(cRel) <= Math.abs(rRel)) {
					makeFog(cRel, -rRel, 4);	// -c, r
				}
				else if ( rRel >= 2 && rRel <= 4 && cRel >= 1 && cRel <= 3 && Math.abs(cRel) < Math.abs(rRel)) {
					makeFog(cRel, rRel, 5);	//  c, r
				}
				else if ( rRel >= 1 && rRel <= 3 && cRel <= -2 && cRel >= -4 && Math.abs(cRel) > Math.abs(rRel)) {
					makeFog(rRel, -cRel, 6);	//  r,-c
				}
				else if ( rRel <= 2 && rRel >= -4 && cRel <= -1 && cRel >= -3 && Math.abs(cRel) < Math.abs(rRel)) {
					makeFog(-cRel, -rRel, 7);	// -c,-r
				}
				else if ( rRel <= 1 && rRel >= -3 && cRel >= 2 && cRel <= 4 && Math.abs(cRel) > Math.abs(rRel)) {
					makeFog(-rRel, cRel, 8);	// -r, c
				}
			}
			if (dungeon[rAbs][cAbs].fog < 2) {
					dungeon[rAbs][cAbs].vis = true;
					dungeon[rAbs][cAbs].fog = 0;
			}
		}
	}
	// reset fog
	for (let i=-(shadowSize+1); i<=(shadowSize+1); i++) {
		for (let j=-(shadowSize+1); j<=(shadowSize+1);j++) {
			if (isInBounds([target[0]+i, target[1]+j], get(currentWorld))) {
				dungeon[target[0]+i][target[1]+j].fog = 1;
			}
		}
	}
			
	// loops once per shadow radius, starting with inner-most radius, ending with outer-most radius
	for (let i=1; i<=shadowSize; i++) {
		coords = [-i,-i];
		for (let j=0; j<i*2; j++){ // top side
			coords[1]++;
			if (Math.abs(coords[0]) + Math.abs(coords[1]) <= (shadowSize*2)-Math.floor(shadowSize/2))
				writeToMap();
		}
		for (let j=0; j<i*2; j++){ // right side
			coords[0]++;
			if (Math.abs(coords[0]) + Math.abs(coords[1]) <= (shadowSize*2)-Math.floor(shadowSize/2))
				writeToMap();
		}
		for (let j=0; j<i*2; j++){ // bottom side
			coords[1]--;
			if (Math.abs(coords[0]) + Math.abs(coords[1]) <= (shadowSize*2)-Math.floor(shadowSize/2))
				writeToMap();
		}
		for (let j=0; j<i*2; j++){ // left side
			coords[0]--;
			if (Math.abs(coords[0]) + Math.abs(coords[1]) <= (shadowSize*2)-Math.floor(shadowSize/2))
				writeToMap();
		}
	}
	dungeon[target[0]][target[1]].vis = true; // make players location (0,0) visible
	dungeon[target[0]][target[1]].fog = 0; // make players location (0,0) un-foggy
	
	world.set(newWorld);
}

function addNewLevel(toLevel) {
	let newWorld = JSON.parse(JSON.stringify(get(world)))
	if (get(level)%townEvery > 0)
		newWorld.push(createDungeonLevel(toLevel))
	else newWorld.push(createTownLevel(toLevel))//console.log(newWorld)
	world.set(newWorld);
}
