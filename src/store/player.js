import { writable, readable, derived, get } from 'svelte/store';
import { takeItemFromMonster } from './monsters';
import { rarityTolerance } from './app';

import { biggest, smallest } from '../lib/utilities';

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
	alerts,
	// derived
	expLevel,
	maxHealth,
	hunger,
	maxAttacks,
	attackPoints,
	defense,
	dodge,
	carryCapacity,
	carryAmount,
	totalFoodCapacity,
	goldCarryCapacity,
	foodCarryCapacity,
	// actions
	movePlayer,
	loseHealth,
	changeLevel,
	gainExperience,
	addPlayerAlert,
	clearPlayerAlerts,
	pickUpItems,
	pickUpItem,
	storeItem,
	armItem,
	removeItem,
	pullItem,
	dropItem,
	resetMoves,
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
const health = writable(20);	// MaxHealth minus damage taken
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
const alerts =	writable([]); //['+5 Food', '+20 Gold',

const expLevel = derived(experience, $experience => Math.floor((-1+Math.sqrt(1+8*$experience/50))/2)+1);
const maxHealth = derived([strength, tenacity, expLevel], ([$strength, $tenacity, $expLevel]) => ($strength+$tenacity)*($expLevel+1));
const hunger = derived([maxHealth, health], ([$maxH, $h]) => $maxH -$h)
const attackPoints = derived([strength, intel, body, expLevel], ([$strength, $intel, $body, $expLevel]) => Math.round(
	($strength + $intel)
	* ( ( $body.filter(i=>i.type==='weapon')[0].attack + 10 ) / 10 )
	* ( ( $expLevel + 1 ) / 4)));
const defense = derived([body, tenacity, strength], ([$body, $t, $s]) => ($t + $s + $body.reduce((sum,i)=> {return sum+ i.defense},0)) / 100);
const dodge = derived([speed, intel], ([$speed, $intel]) => $speed*$intel)
const maxMoves = derived([speed, tenacity], ([$speed, $tenacity]) => Math.ceil(($speed + $tenacity*2)/4));
const maxAttacks = derived([speed, body, maxMoves], ([$speed, $body, $maxMoves]) => smallest(Math.ceil(($speed + $body.filter(i=>i.type==='weapon')[0].speed)/5), $maxMoves));
const carryCapacity = derived(strength, ($strength) => 10 + $strength*2);
const carryAmount = derived(bag, $bag => {			
	// loop through bag items
	const bagItems = $bag.reduce((sum, item)=> {
		if (item.type === 'food')
			return sum + Math.ceil(item.amount/32); // 32 food takes 1 spot
		else if (item.type === 'gold')
			return sum + Math.ceil(item.amount/100); // 100 gold takes 1 spot
		else return sum + item.size; // other bag items take up 1 spot/size
	}, 0);
	return bagItems;
});
const totalFoodCapacity = derived([maxHealth, health, carryCapacity, carryAmount], ([$maxH, $h, $capacity, $amount]) => ($maxH - $h) + ($capacity - $amount*10)); // belly + bag capacity
const goldCarryCapacity = derived([carryCapacity, carryAmount], ([$capacity, $amount]) => $capacity - $amount*50);
const foodCarryCapacity = derived([carryCapacity, carryAmount], ([$capacity, $amount]) => $capacity - $amount*10); // bag food capacity

function movePlayer(target) {
	locale.set(target)
	movesRemain.set(get(movesRemain) - 1)
}

function resetMoves() {
	movesRemain.set(get(maxMoves));
	attacksRemain.set(get(maxAttacks));
}

function changeLevel(toLevel) {
	level.set(toLevel);
	movesRemain.set(get(maxMoves)+2);
}

function gainExperience(exp) {
	experience.set(get(experience) + exp);
}

function loseHealth(damage) {
  health.set(get(health) - damage);
}

function playerFlashOver() {
	const newAlerts = [...get(alerts)] 
	newAlerts.pop()
	flash.set(newAlerts.length === 0 ? false : true);
	alerts.set(newAlerts);
}

function addPlayerAlert(alert) {
	const newAlerts = [alert, ...get(alerts)] 
	alerts.set(newAlerts);
	flash.set(true);
}

function pickUpItem(item, id) {
	// Take item from monster
	takeItemFromMonster(item, id)
  // And put in player's hand
	hand.set([item]);
}

function storeItem(index) {
	const currentItem = get(hand)[index];
	let newBag = [];
	if (currentItem.type === 'food' || currentItem.type === 'gold') {
		//console.log("adding "+currentItem.type+" to bag")
		newBag = get(bag).map(item => item.type === currentItem.type
			? Object.assign({}, item, { amount: Math.round((item.amount + currentItem.amount)*10)/10 })
			: item
		);
	}
	else {
		newBag = get(bag).map(item => item);
		newBag.push(currentItem);
	}
	let newHand = get(hand).map(item => item);
	newHand.splice(index, 1);
	bag.set(newBag);
	hand.set(newHand);
}

function armItem(i) {
	const currentItem = get(hand)[i];
	let newHand = get(hand).map(item => item);
	newHand.splice(i, 1);
	if (currentItem.type === 'food') {
		health.set(get(health) + currentItem.amount);
		hand.set(newHand);
		return;
	}

	let newBody = get(body).map(item => item);
	let index = newBody.findIndex(i=> i.type === currentItem.type)

	newBody.splice(index, (index+1 === 0 ? 0 : 1), currentItem);
	newBody.sort((a, b) => a.sort-b.sort)

	body.set(newBody);
	hand.set(newHand);
	movesRemain.set(get(movesRemain) - 1);		
}

function removeItem(i) {
	const currentItem = get(body)[i];
	let newHand = get(hand).map(item => item);
	newHand.push(currentItem);
	const newBody = get(body).map(item => item);
	if (currentItem.type === 'weapon')
		newBody.splice(i, 1, weaponList[0]);
	else
		newBody.splice(i, 1);
	
	body.set(newBody);
	hand.set(newHand);
}

function pullItem(i, amount) {
	const handItem = { ...get(bag)[i] };
	if (handItem.hasOwnProperty('amount')) {
			handItem.amount = amount;
	}
	let newHand = get(hand).map(item => item);
	newHand.push(handItem);

	let newBag;
	if (handItem.type === 'food' || handItem.type === 'gold')
		// if food/gold reduce amount of item
		newBag = get(bag).map(item => item.type === handItem.type ? { ...item, amount: item.amount - amount } : item );
	else {
		// else remove item
		newBag = get(bag).map(item => item)
		newBag.splice(i, 1);
	}
	bag.set(newBag);
	hand.set(newHand);
}

function dropItem(i) {
	let newHand = get(hand).map(item => item);
	newHand.splice(i, 1);
	hand.set(newHand);
}

function pickUpItems (target, currentMonsters) {
	const monsters = currentMonsters;
	//console.log("pick up items at "+target);
	// find all monsters on square
	const monstIDs = [];
	monsters.forEach((m,i)=>{
		if ( m.locale[0] == target[0] && m.locale[1] == target[1] )
			monstIDs.push(i)
	});
	// pick up items (food, gold, weapons, gear)
	monstIDs.forEach(id=> {
		let food = monsters[id].food;
		let gold = monsters[id].gold;
		let weapon = monsters[id].weapon;
		let armor = monsters[id].armor;
		// auto pick up food
		if (food > 0) {
			let hunger = maxHealth-health;
			let doggyBag = foodCarryCapacity;
			let foodInHand = smallest(food, (hunger+doggyBag));
			addPlayerAlert(('+'+foodInHand+' food'));
			if (hunger > 0) {	// eat what food you can
				//console.log("eating "+smallest(foodInHand, hunger)+" food")
				pickUpItem({type: 'food', amount: smallest(foodInHand, hunger)}, id)
				armItem(0);
				foodInHand -= smallest(foodInHand, hunger)
			}
			if ( foodInHand > 0 ) {	// put what you can in bag
				//console.log("storing "+foodInHand+" food in bag")
				pickUpItem({type: 'food', amount: foodInHand}, id);
				storeItem(0);
			}
		}
		// auto pick up gold
		if (gold > 0) {
			let purse = goldCarryCapacity
			let goldInHand = smallest (gold, purse)
			if (goldInHand > 0) {
				//console.log("picking up "+goldInHand+" gold");
				addPlayerAlert(`+${goldInHand} gold`);
				pickUpItem({type: 'gold', amount: goldInHand}, id);
				storeItem(0);
			}
		}
		// auto pick up weapon
		if (weapon.rarity >= get(rarityTolerance) && weapon.name != 'fist') {
			if (player.body.filter(i=>i.type==='weapon')[0].name === 'fist'  ) {
				//console.log("pick up and arm "+ weapon.name);
				addPlayerAlert('+ new weapon')
				pickUpItem(weapon, id);
				armItem(0);
			}
			else if ( (carryCapacity - carryAmount) >= weapon.size ) {
				//console.log("pick up and store "+ weapon.name);
				addPlayerAlert('+ new weapon')
				pickUpItem(weapon, id);
				storeItem(0);
			}
		}
		// auto pick up armor
		if (armor.rarity >= get(rarityTolerance)) {
			if ( get(body).find( i => i.type == [armor.type] ) === undefined) {
				//console.log("pick up and arm "+ armor.material);
				addPlayerAlert(`+ new ${armor.material} armor`);
				pickUpItem(armor, id);
				armItem(0);
			}
			else if ( (carryCapacity - carryAmount) >= armor.size) {
				//console.log("pick up and store "+ armor.material+" "+armor.name);
				addPlayerAlert(`+ new ${armor.material} armor`);
				pickUpItem(armor, id);
				storeItem(0);
			}
		}
		
	})
}

var timerVar;
function clearPlayerAlerts () {
	clearTimeout( timerVar );
	timerVar = setInterval( () => { 
		playerFlashOver();
		get(alerts).length === 0 ? clearTimeout(timerVar) : null ;
		}, biggest( (900-(get(alerts).length*100)), 200 ) );
}
