import { writable, readable, derived } from 'svelte/store';

export {
	type,
	name,
	level,
	locale,
	strength,
	speed,
	tenacity,
	intel,
	experience,
	movesRemain,
	attacksRemain,
	health,
	body,
	bag,
	hand,
	flash,
	alert,
	// derived
	expLevel,
	maxHealth,
}

const type = readable('player');
const name = writable('Devin');
const level =	writable(0); // current dungeon level location 0=town
const locale = writable([2, 8]); // row/column coordinates
const strength = writable(5); // Attack, Health
const speed = writable(5); // MaxMoves, Dodge, MaxAttacks
const tenacity = writable(5);	// Health, MaxMoves
const intel = writable(5); // Dodge, Attack
const experience = writable(0);	// used to calculate player level
const movesRemain = writable(2); // MaxMoves minus moves already taken
const attacksRemain = writable(2); // MaxAttacks minus attacks already taken
const health = writable(0);	// MaxHealth minus damage taken
const body = writable([			
	{
		type: 'ring',
		name:	'wedding band',
		speed: 0,
		strength: 0,
		intel: 0,
		tenacity: 0,
		defense: 0,
		sort:	6
	},
		//weaponList[0]
	{
		type:			'weapon',
		name:			'fist',
		size:			0,
		attack:		0,
		defense:		0,
		rarity:		1,
		speed:		7,
		sort:			1
	}
]);
const bag = writable([
	{
		type: 'gold',
		amount: 10
	},{				// array of item objects
		type: 'food',
		amount: 5
	},{					
		type: 'rock',
		size: 5
	}]);
	const hand = writable([]); // temp storing place when moving items
	const flash =	writable(false); // flashes true if being attacked - for animation
	const alert =	writable([]); //['+5 Food', '+20 Gold',

	const expLevel = derived(experience, $experience => Math.floor((-1+Math.sqrt(1+8*$experience/50))/2)+1);
	const maxHealth = derived([strength, tenacity, expLevel], ([$strength, $tenacity, $expLevel]) => ($strength+$tenacity)*($expLevel+1));