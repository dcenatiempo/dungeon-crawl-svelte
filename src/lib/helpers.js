import { get } from 'svelte/store';

import { getRand, smallest, biggest, sleep } from './utilities';
import { weaponList, materialList, gearList } from '../store/constants';
import { currentWorld } from '../store/world';
import { monsters, monsterFlashOver } from '../store/monsters';
import { bag, intel } from '../store/player';

import {
	level,
	attackPoints as playerAttackPoints,
	defense as playerDefense,
	dodge as playerDodge,
	addPlayerAlert,
} from '../store/player';

export {
	getName,
	getExpLevel,
	getAttackPoints,
	getDefense,
	getDodge,
	getCarryAmount,
	getMarketPrice,
	getPlayerPrice,
	getPrice,
	getMaxMoves,
	getMaxAttacks,
	getMaxHealth,
	getExpFromMonst,
	randomGold,
	isPlayer,
	isInBounds,
	getArmor,
	getWeapon,
	createDungeonLevel,
	createTownLevel,
	createMarket,
	battle,
}

function getName(item) {
	if (item.type === 'weapon' || item.type ==='ring') // weapon
		return item.name;
	else if(item.type === 'gold')
		return "$"+item.amount;
	else if(item.type === 'food')
		return item.amount + " oz meat"
	else if (!item.hasOwnProperty('name')) // gold/food/rock
		return item.type
	else // armor
		return item.material + " " + item.name;
}

// returns char level
function getExpLevel (char) {
	if (typeof store === 'undefined') {
			return 1;
	}
	return level+1;
}
// returns attack points of character
function getAttackPoints(monster) {
	return Math.round(
		(monster.strength + monster.intel)
		* ( ( monster.weapon.attack + 10 ) / 10 )
		* ( ( getExpLevel(monster) + 1 ) / 4));
}
function getDefense(monster) {
		return (monster.tenacity + monster.strength + monster.weapon.defense + monster.armor.defense) / 100;
}
function getDodge(monster) {
	// speed, intel //TODO: account for ring of agility
	return monster.speed * monster.intel;
}

function getCarryAmount(char) {					
	const bagItems = char.bag.reduce((sum, item)=> {	// loop through bag items
		if (item.type === 'food')
			return sum + Math.ceil(item.amount/32);			// 32 food takes 1 spot
		else if (item.type === 'gold')
			return sum + Math.ceil(item.amount/100);			// 100 gold takes 1 spot
		else return sum + item.size;}, 0);			// other bag items take up 1 spot/size
	return bagItems;
}

function getMarketPrice (item) { return getPrice(item, 1.25); }
function getPlayerPrice (item) { return getPrice(item, .75); }
function getPrice (item, dif) {
	let price;
	let rarity;
	if (item.type === 'food') {
		let pFood = get(bag).filter( thing => thing.type === 'food' )[0].amount
		let mFood = item.amount
		rarity = biggest(1, (8 - Math.round( (pFood + mFood) / 25 ) ) )
		price = rarity/10;
		return Math.round(price*dif*10)/10;
	}
	else {
		price = item.rarity*20;
		price = price*dif
		if (dif>0)
			price = Math.round(price * ( 1 - (get(intel)-1)*.05 ));
		return Math.round(price*10)/10;
	}
}

// given monster returns max moves
function getMaxMoves(monster) {
	// speed, tenacity
	return Math.round((monster.speed + monster.tenacity*2)/4);
}

// given monster returns max moves
function getMaxAttacks(monster) {
	return smallest(Math.ceil((monster.speed + monster.weapon.speed)/5),getMaxMoves(monster));
}

// given monster returns max health
function getMaxHealth( char ) {
	//TODO: strength, tenacity, level
	return (char.strength+char.tenacity)*(getExpLevel(char)+1)+(char.hasOwnProperty('type') ? 0 : 30);
}

// given monster, returns that monsters experience points
function getExpFromMonst(monster){
	return Math.round((monster.strength + monster.tenacity + monster.speed + monster.intel)*(getExpLevel(monster)+1)/3);
}

// given monster's prototype gold, returns random gold+/-gold
function randomGold (gold) {
	let sign = 1;
	if (getRand(1,2) === 2)
		sign = -1;
	return Math.round(gold+(sign*gold / getRand(1,10)));
}

// given location target (row,col) returns true if player is on that location, false if not
function isPlayer(target, playerlocale){
	if (target[0] == playerlocale[0] && target[1] == playerlocale[1])
		return true
	else return false
}
// given location target (row,col) returns true if cell is within map bounds false if not
function isInBounds (target, currentWorld) {
	const rows = currentWorld.length;
	const cols = currentWorld[0].length;
	if (target[0] >= 0 && target[1] >= 0 && target[0] < rows && target[1] < cols)
		return true
	else return false
}

function getArmor(tools, level = 0) {
	if (!tools) { // non tool carrying monster
		return { name: 'no armor', defense: 0};
	}
	else {
		let mNum = getRand(0,smallest(6, Math.floor(level/1.5))) //limits material available based on player level
		//console.log(mNum)
		let materials = materialList.filter( item => item.rarity <= mNum );
		//console.log(material)
		mNum = getRand(0,materials.length-1)
		let mtrl = (materials.filter( (item, index) => index === mNum))[0]
		//console.log(material.material)
		
		let aNum = getRand(0, gearList.length-2);//get index of head, torso, arms or feet (exclude rings)
      //console.log(aNum)
		let bodyParts = gearList.filter( (part, index) => index === aNum )[0];//get array or head, torso, arms or feet
		let bP
		//console.log(bodyPart)
		if (mtrl.material === 'leather') { // if material is leather, get most common gear
			bP = bodyParts[0]
		}
		else {
			aNum = getRand(3, smallest(10,level)); //limits piece available based on player level
			//console.log(aNum);
			bP = (aNum === 10 ? bodyParts[2]: bodyParts[1])
		}
    	return (Object.assign({}, mtrl, bP, {rarity: mtrl.rarity + bP.rarity, defense: mtrl.defense + bP.defense}))
  }
}
function getWeapon(tools, levelProp = 0) {
	let level = levelProp;
	if (typeof store === 'object' && level === 0) //getting weapon for monster, else getting weapon for market
		level= Slevel;
	let num = getRand(1,smallest(10, 1+Math.round(level/1.5))); //limits weapons available based on player level
	if (!tools) {  // non tool carrying monster
		return weaponList[0]
	}
	else {
		let tempArray = weaponList.filter( item => item.rarity <= num );
		let num2 = getRand(0,tempArray.length-1)
		return (tempArray.filter( (item, index) => index === num2)[0])
	}
}

function createTownLevel (level) {
	let rows = 11;
	let cols = 11;
	let newLevel = [];
	
	for (let r=0; r<rows; r++) {
		newLevel.push( [ ] );
		for(let c=0; c<cols; c++) {
			if ( (r === 0 || r === rows-1) || ( c === 0 || c === cols-1 )) {
				newLevel[r].push( {type: 'wall', vis: true, fog: 0 })
			}
			else newLevel[r].push( {type: 'floor', vis: true, fog: 0} )
		}
	}
	// create market
	newLevel[2][2].type = 'market';
	// create gete to next level
	newLevel[8][2].type = 'gate';
	newLevel[8][2].toLevel = level+1;
	// create gate to previous level
	if (level>1) {
		newLevel[2][8].type = 'gate';
		newLevel[2][8].toLevel = level-1;
	}
	return newLevel;
}

function createDungeonLevel (toLevel) {
	let rows = 50;
	let cols = 50;
	let newLevel = [];
	let minRoomSize = 4;
	let maxRoomSize = 15;
	let maxRooms = 20;
	let numRooms = 0;
	let exits = 0;
	function placeExit(y, x) {
		newLevel[y > rows-2 ? rows-2 : y][x > cols-2 ? cols-2 : x].type = 'gate';
		newLevel[y > rows-2 ? rows-2 : y][x > cols-2 ? cols-2 : x].toLevel = (exits === 0 ? toLevel-1 : toLevel+1) ;
		exits++;
		//console.log("exit placed at "+y+","+x)
	}
	// create bank canvas (all walls)
	for (let r=0; r<rows; r++) {
		newLevel.push( [ ] );
		for(let c=0; c<cols; c++) {
			newLevel[r].push( {type: 'wall', vis: false, fog: 1 })
		}
	}
	// carve out rooms and hallways
	for (let r=0; r<rows; r++) {
		for(let c=0; c<cols; c++) {
			if ( (r > 0 && r < rows-1) && ( c > 0 && c < cols-1 )) {
				// create 1st room at (1,1) all other rooms random
				if (getRand(0,(rows*cols/maxRooms)) === 0 || (r===1 && c===1)) {
					let height = getRand(minRoomSize, maxRoomSize);
					let width = getRand(minRoomSize, maxRoomSize);
					for (let y=0; y<height; y++ ) {
						for (let x=0; x<width; x++) {
							if (getRand(0,10))
								if (newLevel[r+y > rows-2 ? rows-2 : r+y][c+x > cols-2 ? cols-2 : c+x].type !== 'gate'){
									newLevel[r+y > rows-2 ? rows-2 : r+y][c+x > cols-2 ? cols-2 : c+x].type = 'floor';
										if (getRand(0,600) === 0 && exits < 2)
											placeExit(r+y, c+x);
								}
					}}
					numRooms++;
					// create hallway to nearest room
					if (numRooms > 0) {
						let targetX = 1;
						let targetY = 1;
						// build tunnel from topleft corner of room to target coordinates
						for (let y=r; y>=1; y--) {
							//start diggin up, while checking left
							if (newLevel[y][c].type !== 'gate')
								newLevel[y][c].type = 'floor';
							for (let x=c; x>=1; x--) {
								if (newLevel[y][x-1].type === 'floor') {
									targetX = x-1;
									targetY = y;
									x=1;
									y=1;
						}}}
						// when find room to left, carve hallway to right
						for (let x=targetX; x<=c; x++) {
							if (newLevel[targetY][x].type !== 'gate')
								newLevel[targetY][x].type = 'floor'
						}
	}}}}}
	// ensure all exits were placed
	if( exits < 2 ){
		for (let r=rows-1; r>1; r-=10) {
			for(let c=cols-1; c>1; c-=10) {
				if ( exits>=2 ) break;
				if (newLevel[r][c].type === 'floor')
					placeExit(r,c);
			}
		}
	}
	return newLevel;
}

// returns array of 1 gold object, 1 food object, 0-12 gear objects
function createMarket (level) {
	let market = [];
	level += 3;
	market.push( { gold: randomGold( 50*( level ) ), bag: [] } );
	market[0].bag.push( { type: 'food', amount: randomGold( 10*( level ) ) } );
	for (let i=0; i<( 1 + randomGold(3) ); i++) {
		let weapon = getWeapon(true, level );
		weapon.name === 'fist' ? null : market[0].bag.push( weapon );
	}
	for (let i=0; i<( 1 + randomGold(3) ); i++) {
		let armor = getArmor(true, level )
		market[0].bag.push( armor );
	}
	return market
}

// returns damage from battle with monster[i].
// attacker is boolean that answers "is the monster the attacker?"
function battle(i, attacker) {
	const monster = get(monsters)[get(level)][i];
	let attackPoints = attacker
		? getAttackPoints(monster)
		: get(playerAttackPoints);

	let defense = !attacker
		? getDefense(monster)
		: get(playerDefense);

	let dodge = !attacker
		? getDodge(monster)
		: get(playerDodge);

	let damage = Math.round(attackPoints * (1 - defense));

	console.log(attackPoints+ " attack -"+defense+"% defense = "+damage+" damage")

	//If defender dodges attacke, no damage is done
	if ( getRand(0,100) <= dodge) {
		 damage = 0;
		//console.log("attack was dodged!")
	}
	attacker
	  ? addPlayerAlert(!damage ? "Dodge!" : `-${damage} health`)
		: addPlayerAlert(!damage ? "Missed!" : `+${damage} attack!`);
		
	sleep(300).then(() => monsterFlashOver(i));

	return damage;
}
