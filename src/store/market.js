import { writable, readable, derived, get } from 'svelte/store';
import { monsterList, townEvery } from './constants';
import { level } from './player';
import { world } from './world';
import { getRand } from '../lib/utilities';
import { createMarket, randomGold, getArmor, getWeapon, getMaxMoves, getMaxHealth, getMaxAttacks } from '../lib/helpers';

export {
	market,
	// actions
	populateMarket,
	buy,
	sell,
}

const market = writable(createMarket(0));

function populateMarket(level) {
	const newMarket = JSON.parse(JSON.stringify($market));
	newMarket.push(createMarket(level)[0]);
	market.set(newMarket);
}

function buy({ level, gold, item }) {
	const newMarket = JSON.parse(JSON.stringify($market));
	if (item.type === 'food')
	  newMarket[level].bag[0].amount += 1;
	else newMarket[level].bag.push(item);
		newMarket[level].gold -= gold;

	market.set(newMarket);
}

function sell({ level, gold, item}) {
	const newMarket = JSON.parse(JSON.stringify($market));
	if (id == 0)
		newMarket[level].bag[0].amount -= 1;
	else newMarket[level].bag.splice(id, 1);
		newMarket[level].gold += gold;
	
	market.set(newMarket);
}
