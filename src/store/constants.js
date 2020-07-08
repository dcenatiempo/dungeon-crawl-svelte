export {
	monsterList,
	weaponList,
	materialList,
	gearList,
	shadowList,
	townEvery
}
const townEvery = 2;

const monsterList = [
	//group '0' common
	[{
		type:			'elk',
		strength:	3,
		speed:		5,
		tenacity:	1,
		intel:		1,
		gold:			0,
		tools:		false,
		food:			50,		
	},{
		type:			'rat',
		strength:	1,
		speed:		5,
		tenacity:	1,
		intel:		1,
		gold:			0,
		tools:		false,
		food:			10,		
	}, {
		type:			'spider',
		strength:	1,
		speed:		2,
		tenacity:	1,
		intel:		1,
		gold:			0,
		tools:		false,
		food:			5
	},	{
		type:			'zombie',
		strength:	2,
		speed:		1,
		tenacity:	4,
		intel:		0,
		gold:			1,
		tools:		true,
		food:			0
	},	{
		type:			'bandit',
		strength:	2,
		speed:		2,
		tenacity:	1,
		intel:		5,
		gold:			10,
		tools:		true,
		food:			0
	}, {
		type:			'wolf',
		strength:	2,
		speed:		4,
		tenacity:	3,
		intel:		4,
		gold:			0,
		tools:		false,
		food:			20
	}, {
		type:			'goblin',
		strength:	3,
		speed:		3,
		tenacity:	1,
		intel:		2,
		gold:			3,
		tools:		true,
		food:			0
	}],
	// group '1' main stays
	[{ 
		type:			'orc',
		strength:	4,
		speed:		3,
		tenacity:	3,
		intel:		2,
		gold:			3,
		tools:		true,
		food:			0
	},	{
		type:			'troll',
		strength:	5,
		speed:		1,
		tenacity:	5,
		intel:		3,
		gold:			5,
		tools:		true,
		food:			0
	},	{
		type:			'ogre',
		strength:	6,
		speed:		2,
		tenacity:	4,
		intel:		2,
		gold:			6,
		tools:		true,
		food:			0
	},{
		type:			'bear',
		strength:	6,
		speed:		4,
		tenacity:	3,
		intel:		3,
		gold:			0,
		tools:		false,
		food:			100
	}],
	// group '2' rare
	[{
		type:			'werewolf',
		strength:	4,
		speed:		4,
		tenacity:	7,
		intel:		3,
		gold:			0,
		tools:		false,
		food:			0
	},	{
		type:			'griffin',
		strength:	5,
		speed:		4,
		tenacity:	2,
		intel:		5,
		gold:			20,
		tools:		false,
		food:			10
	},	{
		type:			'minotaur',
		strength:	5,
		speed:		3,
		tenacity:	5,
		intel:		5,
		gold:			0,
		tools:		true,
		food:			10
	}, {
		type:			'dark knight',
		strength:	4,
		speed:		3,
		tenacity:	4,
		intel:		7,
		gold:			10,
		tools:		true,
		food:			0
	}],
	// group '3' bosses
	[{
		type:			'cyclopse',
		strength:	8,
		speed:		2,
		tenacity:	7,
		intel:		3,
		gold:			50,
		tools:		true,
		food:			0
	},	{
		type:			'barlog',
		strength:	9,
		speed:		2,
		tenacity:	3,
		intel:		5,
		gold:			100,
		tools:		true,
		food:			0
	},	{
		type:			'dragon',
		strength:	10,
		speed:		5,
		tenacity:	10,
		intel:		10,
		gold:			200,
		tools:		false,
		food:			0
	}]
];

const weaponList = [
	{
		type:			'weapon',
		name:			'fist',
		size:			0,
		attack:		0,
		defense:		0,
		rarity:		1,
		speed:		7,
		sort:			1
	},	{
		type:			'weapon',
		name:			'club',
		size:			2,
		attack:		2,
		defense:		2,
		rarity:		2,
		speed:		2,
		sort:			1
	},	{
		type:			'weapon',
		name:			'dagger',
		size:			1,
		attack:		3,
		defense:		1,
		rarity:		3,
		speed:		5,
		sort:			1
	},	{
		type:			'weapon',
		name:			'hatchet',
		size:			1,
		attack:		3,
		defense:		3,
		rarity:		3,
		speed:		5,
		sort:			1
	},	{
		type:			'weapon',
		name:			'mace',
		size:			5,
		attack:		5,
		defense:		1,
		rarity:		4,
		speed:		2,
		sort:			1
	},	{
		type:			'weapon',
		name:			'broad sword',
		size:			5,
		attack:		7,
		defense:		5,
		rarity:		5,
		speed:		2,
		sort:			1
	},	{
		type:			'weapon',
		name:			'battle axe',
		size:			5,
		attack:		8,
		defense:		5,
		rarity:		6,
		speed:		1,
		sort:			1
	},	{
		type:			'weapon',
		name:			'haladie knife',
		size:			4,
		attack:		5,
		defense:		5,
		rarity:		7,
		speed:		5,
		sort:			1
	},	{
		type:			'weapon',
		name:			'numchucks',
		size:			1,
		attack:		4,
		defense:		5,
		rarity:		8,
		speed:		10,
		sort:			1
	},	{
		type:			'weapon',
		name:			'katana',
		size:			4,
		attack:		7,
		defense:		4,
		rarity:		9,
		speed:		4,
		sort:			1
	},	{
		type:			'weapon',
		name:			'claymore',
		size:			5,
		attack:		10,
		defense:		5,
		rarity:		10,
		speed:		1,
		sort:			1
	}
];

const materialList = [
	{
		material: 'leather',
		defense: 1,
		rarity: 0
	},{
		material: 'brass',
		defense: 2,
		rarity: 1
	},{
		material: 'bronze',
		defense: 3,
		rarity: 2
	},{
		material: 'iron',
		defense: 4,
		rarity: 3
	},{
		material: 'steel',
		defense: 5,
		rarity: 4
	},{
		material: 'golden',
		defense: 2,
		rarity: 5
	},{
		material: 'mithril',
		defense: 6,
		rarity: 6,
	}
];

const gearList = [
	[			// head
		{				
			type: 'head',
			name: 'cap',
			defense: 1,
			size: 1,
			rarity: 1,
			sort:	2
		},{				
			type: 'head',
			name: 'helmet',
			defense: 2,
			size: 3,
			rarity: 5,
			sort:	2
		},{				
			type: 'head',
			name: 'chainmail coif',
			defense: 4,
			size: 2,
			rarity: 10,
			sort:	2
		}
	],
	[		// torso
		{
			type: 'torso',
			name: 'tunic',
			defense: 1,
			size: 1,
			rarity: 1,
			sort:	3
		},{
			type: 'torso',
			name: 'breastplate',
			defense: 5,
			size: 4,
      	speed: -1,
			rarity: 5,
			sort:	3
		},{
			type: 'torso',
			name: 'chainmail tunic',
			defense: 4,
			size: 2,
			rarity: 10,
			sort:	3
		}
	],
	[			//hands/arms
		{
			type: 'arms',
			name: 'gloves',
			defense: 1,
			size: 1,
			rarity: 1,
			sort:	4
		},{
			type: 'arms',
			name: 'gauntlet',
			defense: 5,
			size: 1,
			rarity: 5,
			sort:	4
		},{
			type: 'arms',
			name: 'spiked gauntlet',
			defense: 5,
			attack: 2,
			size: 1,
			rarity: 10,
			sort:	4
		}
	],
	[			// feet/shoes
		{
			type: 'feet',
			name: 'sandals',
			defense: 1,
			size: 1,
			speed: 2,
			rarity: 1,
			sort:	5
		},{
			type: 'feet',
			name: 'boots',
			defense: 5,
			size: 2,
			rarity: 5,
			sort:	5
		},{
			type: 'feet',
			name: "Mercury's winged sandals",
			defense: 1,
			size: 2,
			speed: 5,
			rarity: 10,
			sort:	5
		}
	],
	[		// rings of power
		{
			type: 'ring',
			name: 'invisibility', // invisible to enemies?
			strength: 0,
			speed: 0,
			tenacity: 0,
			intel: 0,
			defense: 0,
			size: 0,
			rarity: 500,
			sort:	6
		},{
			type: 'ring',
			name: 'might',
			strength: 10,
			speed: 0,
			tenacity: -5,
			intel: 0,
			defense: 0,
			size: 0,
			rarity: 500,
			sort:	6
		},{
			type: 'ring',
			name: 'protection',
			strength: 0,
			speed: 0,
			tenacity: 0,
			intel: 0,
			defense: 10,
			size: 0,
			rarity: 500,
			sort:	6
		},{
			type: 'ring',
			name: 'wisdom',
			strength: 0,
			speed: 0,
			tenacity: 0,
			intel: 10,
			defense: 0,
			size: 0,
			rarity: 500,
			sort:	6
		},{
			type: 'ring',
			name: 'swiftness',
			strength: 0,
			speed: 8,
			tenacity: 2,
			intel: 0,
			defense: 0,
			size: 0,
			rarity: 500,
			sort:	6
		},{
			type: 'ring',
			name: 'agility',
			strength: 0,
			speed: 5,
			tenacity: 0,
			intel: 5,
			defense: 0,
			size: 0,
			rarity: 500,
			sort:	6
		}
	]
];

// Each value is a relative location (row, col) from character whos vision is being calculated
// start = wall or vision obstructing object
// full = vision fully obstructed
// half = vision halfway obstructed. if two or more halves overlap, vision is fully obstructed
const shadowList = [
	{
		start: [0,1],
		full:	[[0,2],[0,3],[0,4],[0,5],[-1,4],[-1,5],[1,4],[1,5]],
		half: [[1,2],[1,3],[2,3],[2,4],[2,5],[3,5],[-1,2],[-1,3],[-2,3],[-2,4],[-2,5],[-3,5]]
	},{
		start: [1,1],
		full: [[2,2],[3,3],[4,4],[4,3],[3,4]],
		half: [[1,2],[2,1],[1,3],[3,1],[2,3],[3,2],[4,2],[2,4],[5,2],[2,5],[5,3],[3,5]]
	},{
		start: [0,2],
		full: [[0,3],[0,4],[0,5],[-1,5],[1,5]],
		half: [[1,2],[1,3],[1,4],[2,5],[-1,2],[-1,3],[-1,4],[-2,5]]
	},{
		start: [2,2],
		full: [[3,3],[4,4]],
		half: [[2,3],[3,2],[2,4],[4,2],[3,4],[4,3],[3,5],[5,3],[2,5],[5,2]]
	},{
		start: [1,2],
		full: [[1,3],[2,3],[2,4],[2,5],[3,4],[3,5]],
		half: [[1,4],[1,5],[2,2],[3,3],[4,4]]
	},{
		start: [0,3],
		full: [[0,4],[0,5]],
		half: [[1,3],[1,4],[1,5],[-1,3],[-1,4],[-1,5]]
	},{
		start: [3,3],
		full: [[4,4]],
		half: [[3,4],[3,5],[4,3],[5,3]]
	},{
		start: [2,3],
		full: [[3,4],[3,5]],
		half: [[3,3],[4,4],[2,4],[2,5]]
	},{
		start: [1,3],
		full: [[2,4],[2,5],[3,5]],
		half: [[2,3],[3,4],[1,4],[1,5]]
	},{
		start: [0,4],
		full: [[0,5]],
		half: [[1,4],[1,5],[-1,4],[-1,5]]
	},{
		start: [3,4],
		full: [[]],
		half: [[4,4],[3,5]]
	},{
		start: [2,4],
		full: [[3,5]],
		half: [[2,5],[3,4],[4,4]]
	},{
		start: [1,4],
		full: [[1,5],[2,5]],
		half: [[2,4],[3,5]]
}];