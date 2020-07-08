<script>
	export let char;

	import { getExpLevel, getAttackPoints, getDefense, getDodge, getMaxHealth, getMaxMoves, getMaxAttacks } from '../../lib/helpers';
</script>

<div className="modal-box">
	{#if char.type === 'player'}
		<h3>{char.name}: level {getExpLevel(char)}</h3>
	{:else}
		<h3>{char.type}: level {getExpLevel(char)}</h3>
	{/if}
	<h4>Primary Stats:</h4>
		<li>strength: {char.strength}</li>
		<li>speed: {char.speed}</li>
		<li>tenacity: {char.tenacity}</li>
		<li>intelligence: {char.intel}</li>
		{#if char.type === 'player'}
			<li>experience: {char.expLevel}</li>
		{/if}
	<h4>Secondary Stats:</h4>
		<li>health: {char.health}/{getMaxHealth(char)}</li>
		<li>attack: {getAttackPoints(char)}</li>
		<li>defense: {getDefense(char)*100}%</li>
		<li>dodge: {getDodge(char)}%</li>
		<li>moves/turn: {getMaxMoves(char)}</li>
		<li>attacks/turn: {getMaxAttacks(char)}</li>
		<!-- {#if char.type === 'player'}
			<li>carry capacity: {char.carryCapacity}</li>
		{/if} -->
</div>
	
<style>

</style>