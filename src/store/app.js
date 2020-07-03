import { writable, readable, derived } from 'svelte/store';

export {
	dimensions,
	tileSize,
	grid,
	// settings
	rarityTolerance,
	playerBuilt,
	gameOver,
	toolTip,
	mouseX,
	mouseY,
	toolTipObject,
	displayMarket,
	displayGear,
}

// Set up global resize listener so set browser window dimensions - { h, w }
const dimensions = readable({ h: 0, w: 0 }, set => {
	function resizeFinished(){
		getWindowSize()
	}

	function getWindowSize () {
		let vpWidth = window.innerWidth;
		let vpHeight = window.innerHeight;
		let h = Math.floor( vpHeight );
		let w = Math.floor( vpWidth );

		set({ h, w });
	}

	let timout;

	window.onresize = function() {
		clearTimeout( timout );
		timout = setTimeout( resizeFinished, 20 );
	};

	getWindowSize();
});

const tileSize = writable(25);

const grid = derived([dimensions, tileSize], ([$dimensions, $tileSize]) => {
	return getGridSize($dimensions, $tileSize, false, false);
})

function getGridSize(window, cellSize, lsidebar, rsidebar) {
	let headerH = 50;		// header height in pixels
	let footerH = 0;		// footer height in pixels
	let lsb = lsidebar ? .3 : 0 ;	// sidebar width in %
	let rsb = rsidebar ? .3 : 0 ;	// sidebar width in %
	let cellMargin = 2;	// margin between tiles
	let tileSize = cellSize+ 2 *cellMargin; // add margin to tilesize
	let rows = Math.round( ( window.h - headerH - footerH - 2*tileSize ) / tileSize );
	let cols = Math.round( ( window.w*(1-lsb-rsb) - 2*tileSize ) / tileSize );	
	return { height: rows, width: cols };
}

const rarityTolerance = writable(0); // weapons/armor below this rarity will be ignored
const playerBuilt = writable(true); // becomes true after initial setup
const gameOver = writable(false);
const toolTip = writable(false);
const mouseX = writable(0);
const mouseY = writable(0);
const toolTipObject = writable({});
const displayMarket = writable(false);
const displayGear = writable(false);