import { writable, readable, derived, get } from 'svelte/store';
import { monsterList } from './constants';
import { level } from './player';
import { getRand } from '../lib/utilities';
import { randomGold, getArmor, getWeapon, getMaxMoves, getMaxHealth, getMaxAttacks } from '../lib/helpers';

export {
	monsters,
	currentMonsters,
}

function createMonster(monster, coords) {
	let tempMonster = Object.assign({}, monster,
		{ 	alert:			[],//['-23 Health', 'Dodge!'],
			flash:			false,		// flashes true if being attacked - for animation
			local:			coords,		// monsters location on map
			gold:				randomGold(monster.gold),	// Gold carrying on person
		 	armor:			getArmor(monster.tools),	// Array of armor objects on person
		 	weapon:			getWeapon(monster.tools),	// Weapon on person
		 	movesRemain:	getMaxMoves(monster),		// MaxMoves minus moves already taken
		 	health:			getMaxHealth(monster),		// MaxHealth minus damage taken
		})
	tempMonster = Object.assign({}, tempMonster, {attacksRemain: getMaxAttacks(tempMonster)})
	return tempMonster//{attacksRemain: getMaxAttacks(monster),		// MaxAttacks minus attacks already taken}
}

const monsters = writable([
	createMonster(monsterList[0][getRand(0,monsterList[0].length-1)], [8,8])]);

const currentMonsters = derived([monsters, level], ([$monsters, $level]) => $monsters[$level]);