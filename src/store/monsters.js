import { writable, readable, derived, get } from 'svelte/store';
import { monsterList } from './constants';
import { world } from './world';
import { getRand, add } from '../lib/utilities';
import { level, locale, loseHealth as playerLoseHealth, clearPlayerAlerts } from './player';
import { rarityTolerance } from './app';
import { randomGold, getArmor, getWeapon, getMaxMoves, getMaxHealth, getMaxAttacks, isPlayer, battle } from '../lib/helpers';

const townEvery = 5;

export {
	monsters,
	//actions
	populateLevel,
	monsterLoseHealth,
	takeItemFromMonster,
	monsterFlashOver,
	// helpers
	isAnyMonster,
	isAliveMonster,
	isDeadMonster,
	monsterTurn,
}

function createMonster(monster, coords) {
	let tempMonster = Object.assign({}, monster,
		{ 	alert:			[],//['-23 Health', 'Dodge!'],
			flash:			false,		// flashes true if being attacked - for animation
			locale:			coords,		// monsters location on map
			gold:				randomGold(monster.gold),	// Gold carrying on person
		 	armor:			getArmor(monster.tools),	// Array of armor objects on person
		 	weapon:			getWeapon(monster.tools),	// Weapon on person
		 	movesRemain:	getMaxMoves(monster),		// MaxMoves minus moves already taken
		 	health:			getMaxHealth(monster),		// MaxHealth minus damage taken
		})
	tempMonster = Object.assign({}, tempMonster, {attacksRemain: getMaxAttacks(tempMonster)})
	return tempMonster//{attacksRemain: getMaxAttacks(monster),		// MaxAttacks minus attacks already taken}
}

const monsters = writable([[
	createMonster(monsterList[0][getRand(0,monsterList[0].length-1)], [8,8])]]);

function populateLevel(toLevel) {
	let newMonsters = JSON.parse(JSON.stringify(get(monsters)));
	let monsterLevelList = [];
	let currentWorld = get(world)[toLevel];
	let remainder = toLevel%townEvery;
	let rarity;
	for (let r=1; r<currentWorld.length-2; r++) {
		for (let c=1; c<currentWorld.length-2; c++) {
			if (currentWorld[r][c].type === 'gate' && remainder == (townEvery - 1) && currentWorld[r][c].toLevel === toLevel+1) {
				monsterLevelList.push(createMonster(monsterList[3][getRand(0,monsterList[3].length-1)], [r,c]));
			}
			if (currentWorld[r][c].type === 'floor') {
				if (getRand(0,50) === 0) { // 1 monster every 50 squares
					if (remainder === 0) rarity = 0;
					else {
						let percent = getRand(0,100);
						if (remainder === 1) {
							if (percent <= 90) rarity = 0;
							else rarity = 1;
						}
						if (remainder === 2) {
							if (percent <= 50) rarity = 0;
							else if (percent <= 90) rarity = 1;
							else rarity = 2;
						}
						if (remainder === 3) {
							if (percent <= 30) rarity = 0;
							else if (percent <= 60) rarity = 1;
							else rarity = 2;
						}
						if (remainder === 4) {
							if (percent <= 50) rarity = 0;
							else if (percent <= 30) rarity = 1;
							else rarity = 2;
						}			
					}

					monsterLevelList.push(createMonster(monsterList[rarity][getRand(0,monsterList[rarity].length-1)], [r,c]));
				}
				
			}
		}
	}
	newMonsters.push(monsterLevelList);
	monsters.set(newMonsters);
}

function moveMonster(id, target) {
	let newMonsters = JSON.parse(JSON.stringify(get(monsters)));
	newMonsters[get(level)][id].locale = target;
	newMonsters[get(level)][id].movesRemain -= 1;
	monsters.set(newMonsters);
}

function monsterLoseHealth(id, damage) {
	let newMonsters = JSON.parse(JSON.stringify(get(monsters)));
	newMonsters[get(level)][id].health -= damage;
	newMonsters[get(level)][id].flash = true;
	monsters.set(newMonsters);
}

function takeItemFromMonster(item, id) {
	if (id === null) return;

	let newMonsters = JSON.parse(JSON.stringify(get(monsters)));
	let newMonster = newMonsters[get(level)][id];
	if (item.type === 'food' || item.type === 'gold')
		newMonster[item.type] -= item.amount;
	else if (item.type === 'weapon')
		newMonster.weapon = weaponList[0];
	else
		newMonster.armor = 'no armor';
	monsters.set(newMonsters);
}

function monsterFlashOver(id) {
	let newMonsters = JSON.parse(JSON.stringify(get(monsters)));
	let newMonster = newMonsters[get(level)][id];
	newMonster.flash = false;
	monsters.set(newMonsters);
}

function isAnyMonster(target, monstersOnLevel) {
	let mIndex = false;
	if (monstersOnLevel === undefined) {
		return mIndex;
	}
	monstersOnLevel.forEach((monster, index) => {
		if (target[0] == monster.locale[0] && target[1] == monster.locale[1]) {
			mIndex = index;
		}
	});
	return mIndex;
}

function isAliveMonster(target, monstersOnLevel){
	let mIndex = false;
	if (monstersOnLevel === undefined) {
		return mIndex;

	}
	monstersOnLevel.forEach((monster, index) => {
		if (target[0] == monster.locale[0] && target[1] == monster.locale[1]) {
			if(monster.health > 0) {
				mIndex = index;
	}}});
	return mIndex;
}

function isDeadMonster(target, monstersOnLevel){ // monster is dead, but has use
	let mIndex = false;
	if (monstersOnLevel === undefined) {
		return mIndex;
	}
	monstersOnLevel.forEach((monster, index) => {
		if (target[0] == monster.locale[0] && target[1] == monster.locale[1]) {
				if (monster.health<=0 && (monster.food>0 || monster.gold>0 || (monster.weapon.name != 'fist' && monster.armor.rarity >= get(rarityTolerance)) || (monster.armor.name != 'no armor' && monster.armor.rarity >= get(rarityTolerance))))
					mIndex = index;
	}});
	return mIndex;
}

function resetMoves(id) {
	let newMonsters = JSON.parse(JSON.stringify(get(monsters)));
	const monster = newMonsters[get(level)][id]
	monster.movesRemain = getMaxMoves(monster);
	monsters.set(newMonsters);
}

// for monster index i, exaust moves, then attack
function monsterTurn(mi){
	const currentWorld = get(world)[get(level)];
	const m = get(monsters)[get(level)][mi];
	const pL = get(locale);
	let mL = m.locale;
	let moves = m.movesRemain;
	let attacks = m.attacksRemain;
	let target = [];
	function deltaL(a, b) {  return [a[0] - b[0],a[1] - b[1]]; }
	function isByPlayer(a,b) {
		if (Math.abs(deltaL(a,b)[0]) <= 1 && Math.abs(deltaL(a,b)[1]) <= 1)
			return true;
		else return false;
	}
	// max out monster moves
	//console.log(mL)
	//console.log(pL)
	//console.log(!isByPlayer(mL, pL))
	while (moves > 0 && !isByPlayer(mL, pL)) {
		// check moves
		for ( let r=-1; r<2; r++) {
			for ( let c=-1; c<2; c++) {
				if (r === 0 && c === 0)
					continue;
				target.push(deltaL( add(mL, [r,c]), pL ))
			}
		}
		target = target.sort((a,b)=> (Math.abs(a[0])+Math.abs(a[1])) - (Math.abs(b[0])+Math.abs(b[1])) )
				.slice(0,3)
				.map(item=> add(item, pL));
		// make best move
		
		for( let t=0; t<3; t++) {
			if ( (currentWorld[target[t][0]][target[t][1]].type === 'floor') && (!isAliveMonster(target[t])) && (!isPlayer(target[t], get(locale)))) {
				moveMonster(mi, target[t]);
				mL[0] = target[t][0];
				mL[1] = target[t][1];
				t=3;
			}
		}
		target=[];
		moves--;
	}
	resetMoves(mi);
	// max out monster attacks
	while (moves>0 && attacks>0 && isByPlayer(mL, pL)) {
		playerLoseHealth( battle( mi, true ) );
		// timed erase of player alerts
		clearPlayerAlerts();
		moves--;
		attacks--;
	}
}
