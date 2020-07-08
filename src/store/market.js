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
	const newMarket = JSON.parse(JSON.stringify(get(market)));
	newMarket.push(createMarket(level)[0]);
	market.set(newMarket);
}

function buy(marketId, gold, item) {
	debugger
	const newMarket = JSON.parse(JSON.stringify(get(market)));
	if (item.type === 'food')
	  newMarket[marketId].bag[0].amount += 1;
	else newMarket[marketId].bag.push(item);
		newMarket[marketId].gold -= gold;

	market.set(newMarket);
}

function sell(marketId, gold, id) {
	const newMarket = JSON.parse(JSON.stringify(get(market)));
	debugger
	if (id == 0)
		newMarket[marketId].bag[0].amount -= 1;
	else newMarket[marketId].bag.splice(id, 1);
		newMarket[marketId].gold += gold;
	
	market.set(newMarket);
}
