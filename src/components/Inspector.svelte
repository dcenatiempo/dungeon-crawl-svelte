<script>
  import { get } from 'svelte/store';
	import { monsters, isAliveMonster, isDeadMonster } from '../store/monsters';
	import { player, level } from '../store/player';
	import { toolTip, toolTipObject, mouseX, mouseY } from '../store/app';
	import { getName, getMarketPrice } from '../lib/helpers';

	import Stats from './common/Stats.svelte'
	
	let item = {};
	let top;
	let left;

	toolTip.subscribe(val => {
		$: item = get(toolTipObject);
		$: top = (parseInt(get(mouseY))-0)+"px";
		$: left = (parseInt(get(mouseX))-50)+"px";
	})
	
</script>

	{#if !item.hasOwnProperty('type')}
		<div
			class="modal-box"
			style={`top: ${top}; left: ${left} `}>
			<div class="market-inspect-modal-row">
				<div class="label">Item</div>
				<div class="label center">Qty</div>
				<div class="label center">Price</div>
			</div>
			{#each item.bag as thing, i}
				<div class="market-inspect-modal-row">
					<div class="box">{getName(thing)}</div>
					<div class="box center">{thing.hasOwnProperty('amount') ? thing.amount : '1'}</div>
					<div class="box center">{thing.type ==='gold' ? null : "$"+getMarketPrice(thing) }</div>
				</div>
			{/each}
	</div>
	{:else if item.type === 'gate'}
		<div
			class="modal-box test"
			style={`top: ${top}; left: ${left} `}>
			<h3>{item.type}</h3>
			<div>To level {item.toLevel+1}</div>	
		</div>
	{:else if item.type === 'player'}
		<div
			class="modal-box test"
			style={`top: ${top}; left: ${left} `}>
			<Stats char={$player}/>
		</div>
	{:else if isAliveMonster(item.locale, $monsters[$level]) !== false}
		<div
			class="modal-box test"
			style={`top: ${top}; left: ${left} `}>
			<Stats char={item}/>
		</div>
	{:else if isDeadMonster(item.locale, $monsters[$level]) !== false}
		<div
			class="modal-box test"
			style={`top: ${top}; left: ${left} `}>
			<h3>Dead {item.type}</h3>
				{#if item.food > 0}<div>Food: {item.food}</div>{/if}
				{#if item.gold > 0}<div>Gold: {item.gold}</div>{/if}
				{#if item.armor.name==='no armor'}<div>Armor: {item.armor.material} {item.armor.name}</div>{/if}
				{#if item.weapon.name === 'fist'}<div>Weapon: {item.weapon.name}</div>{/if}
		</div>
	{/if}

<style>
	.modal-box {
		background: rgba(255,255,255,.6);
		position: fixed;
		z-index: 50;
		pointer-events: none;
	}
</style>