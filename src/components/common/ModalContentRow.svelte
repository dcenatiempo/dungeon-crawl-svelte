<script>
	import { get } from 'svelte/store';
	import { townEvery } from '../../store/constants';
	import {
		level as playerLevel,
		pickUpItem,
		storeItem,
		removeItem,
		pullItem,
		dropItem,
		armItem,
		hunger,
		bag,
		body,
		carryCapacity,
		carryAmount,
		goldCarryCapacity
	} from '../../store/player';
	import { market, buy, sell } from '../../store/market';
	import { getName, getPlayerPrice, getMarketPrice } from '../../lib/helpers';
	import { smallest } from '../../lib/utilities';

	export let index;
	export let item;
	export let box;
	export let isMarket;

	function sellItem(e) {
		let level = get(playerLevel);
		debugger
		let marketId = level/townEvery;
		let id = e.target.id
		let gold = getPlayerPrice(item);
		let goldCapacity = get(goldCarryCapacity);
		let amount = Math.round(smallest(gold, goldCapacity) * 100)/100;
		
		pickUpItem({ type: 'gold', amount }, null);
		storeItem(0);
		
		if (box === 'body')
			removeItem(id);
		else if (box === 'bag')
			pullItem(id, 1);
		
		dropItem(0);
		buy(marketId, gold, item);
	}

	function buyItem(e) {
		let level = get(playerLevel);
		let marketId = level/townEvery;
		let goods = get(market)[marketId];
		let id = e.target.id;
		let gold = getMarketPrice(item);
		pullItem(0, gold);
		dropItem(0);
		if (id == 0)
			pickUpItem({ type: 'food', amount: 1}, null);
		else pickUpItem(item, null)
		storeItem(0);
		sell(marketId, gold, id)
	}
	function armItemInner(e) {
		let id = e.target.id;
		let foodInHand = get(bag)[id].amount;
		pullItem(id, ( e.target.innerHTML === 'Eat' ? smallest(get(hunger), foodInHand): 1));
		armItem(0);
	}
	function storeItemInner (e) {
		let id = e.target.id
		removeItem(id)
		storeItem(0)
	}
	function dropItemInner(e) { // rucksack and body???
		let id = e.target.id;
		box === 'body' ? removeItem(id) : pullItem(id, 1); // else box === 'bag'
		dropItem(0);
	}
		

	let shouldDisplay = false;
	$: if(item) {
		if (isMarket && box === 'market') {
			if (getMarketPrice(item) >= get(bag)[0].amount)
				shouldDisplay = false
			else
				shouldDisplay = !(item.type === 'food' && item.amount <= 0);
		}
		else if ( (item.type === 'gold' || item.type === 'food') && item.amount <= 0 )
			shouldDisplay = false
		else if (item.type === 'weapon' && item.name === 'fist')
			shouldDisplay = false
		else if ( (item.type === 'gold' || item.type === 'rock') && isMarket )
			shouldDisplay = false
		else if (item.type === 'ring' || item.name === 'wedding band')
			shouldDisplay = false
		else shouldDisplay = true;
	}

</script>
		
<div class="modal-row">
	<div class="box">{item.type}</div>
	<div class="box">{getName(item)}</div>
	<div class="box center">
		{item.type ==='gold' ? Math.ceil(item.amount/100) : (item.type === 'food' ? Math.ceil(item.amount/20) : item.size || '') }
	</div>

	{#if isMarket && item}
		{#if box !== 'market'}
			{#if !shouldDisplay}
				<div class="box" />
			{:else}
				<div class="box">{getPlayerPrice(item)}</div>
			{/if}
		{:else}
			<div class="box">${getMarketPrice(item)}</div>
		{/if}
	{:else}
		{#if !shouldDisplay}
				<div class="box" />
		{:else if box === 'bag'}
			{#if item.type === 'gold' || item.type === 'rock'}
				<div class="box" />
			{:else if (item.type === 'food' && item.amount >=0 ) || item.type !== 'food'}
				{#if  $body.find( i => i.type == item.type) !== undefined && $body.find( i => i.type == item.type).name !== 'fist'}
					<div class="box" />
				{:else}
					<button class='box center' id={index} on:click={armItemInner}>
						{item.type === 'food' ? 'Eat': 'Eqp'}
					</button>
				{/if}
			{/if}
		{:else if box === 'body'}
			{#if ($carryCapacity - $carryAmount) >= item.size}
				<button class="box" id={index} on:click={storeItemInner}>Bag</button>
			{:else}
				<div class="box" />
			{/if}
		{/if}
	{/if}
	
	{#if isMarket}
		{#if box === 'market'}
			{#if getMarketPrice(item) <= $bag[0].amount}
					<button class="box" id={index} on:click={buyItem}>Buy</button>
			{:else} 
					<div class="box" />
		  {/if}
		{:else}
			{#if !shouldDisplay}
				<div class="box" />
			{:else}
				<button class="box" id={index} on:click={sellItem}>Sell</button>
			{/if}
		{/if}
	{:else}
		{#if !shouldDisplay}
			<div class="box" />
		{:else}
			<button class="box" id={index} on:click={dropItemInner}>x</button>
		{/if}
	{/if}
</div>

<style type="text/scss">
	.modal-row {
		display: grid;
		grid-template-columns: auto auto 35px 35px 35px;
	
		.box {
			background-color: #444;
			color: #fff;
			padding: 5px;
			font-size: 100%;
		}	

		.center {
			text-align: center
		}
	}
	</style>