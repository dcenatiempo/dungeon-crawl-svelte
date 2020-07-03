export {
	getRand,
	sleep,
	add,
	smallest,
	biggest,
}

// random whole number generator, inclusive on min and max
function getRand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function add (a,b) { // add two coordinates
	return ([a[0]+b[0],a[1]+b[1]]);
}

function smallest(a,b) {
	if (a > b)
		return b;
	else return a;
}

function biggest(a,b) {
	if (a > b)
		return a;
	else return b;
}
