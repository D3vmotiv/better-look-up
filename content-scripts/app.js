function setStylingToRect(target, type, values = {}) {
	if(type) {
		const { left, top, width, height } = values;
		const scrollY = window.scrollY;

		if(left && top && width, height) {
			target.display = "flex";
			target.backgroundColor = "rgba(0,0,0,0.5)";
			target.left = `${left - 5}px`;
			target.top = `${top - 5 + scrollY}px`;
			target.width = `${width + 10}px`;
			target.height = `${height + 10}px`;
		}

	} else {
		target.display = "none";
		target.left = "0";
		target.top = "0";
		target.width = "0";
		target.height = "0";
	}
}

function focusOnElement(target) {
	const elements = document.querySelectorAll(target);
	
	const ih = window.innerHeight;
	const ch = document.documentElement.clientHeight;
	
	const iw = window.innerWidth;
	const cw = document.documentElement.clientWidth;
	
	// Used foreach not filter because its nodelist not array
	const filtered = [];
	elements.forEach((e) => {
		const rect = e.getBoundingClientRect();
		if (
			rect.top >= 0
			&& rect.left >= 0
			&& rect.bottom <= (ih || ch)
			&& rect.right <= (iw || cw)
			&& rect.width > 0
			&& filtered.length < 10
		) filtered.push(e);
	});
	delete elements;
	return filtered;
};

/**
 * Freeze website, show possibles targets 
 */
function startPause(target) {
	APP_STATE.pause = true;
	APP_STATE.catchedElements = [];

	const outlines = APP_STATE.outlines;
	const elementsToFocusOn = focusOnElement(target);

	for(let i = 0; i < elementsToFocusOn.length; i++) {

		APP_STATE.catchedElements[i] = elementsToFocusOn[i];
		APP_STATE.outlines[i].innerText = String(i + 1);

		setStylingToRect(
			outlines[i].style,
			APP_STATE.rectStylingTypes.SHOW,
			elementsToFocusOn[i].getBoundingClientRect(),
			);
	}
}

/**
 * End focuesed/freeze mode and focus on target if right key(!) clicked
 */
function endPause(key) {
	APP_STATE.pause = false;

	const userChoice = Number(key);
	if (userChoice != NaN 
			&& userChoice <= APP_STATE.catchedElements.length
			&& userChoice > 0) {
		APP_STATE.catchedElements[userChoice - 1].focus();
	}

	for(let i = 0; i < 10; i++) {
		setStylingToRect(
			APP_STATE.outlines[i].style,
			APP_STATE.rectStylingTypes.HIDDEN
			);
	}
}

// ***************************************
// THIS IS WHERE CODE START
const APP_STATE = {
	outlines: [],
	catchedElements: [],
	pause: false,
	rectStylingTypes: {
		HIDDEN: false,
		SHOW: true,	
	},
}

// This rectangles is used to highlight the possibly place to click
for(let i = 0; i < 10; i++) {
	const rect = document.createElement("div");

	setStylingToRect(
		rect.style,
		APP_STATE.rectStylingTypes.HIDDEN
		);
	rect.style.position = "absolute";
	rect.style.border = "3px solid red";
	rect.style.justifyContent = "center";
	rect.style.alignItems = "center";
	rect.style.zIndex = "99999999999";
	rect.style.fontSize = "18px";
	rect.style.fontWeight = "700";
	rect.style.color = "red";
	
	APP_STATE.outlines.push(rect);
	document.body.appendChild(rect);
}

window.addEventListener("keydown", e => {
	if(!APP_STATE.pause) {
		if (e.shiftKey && e.altKey && e.key === "B")
			startPause("button");
		else if (e.shiftKey && e.altKey && e.key === "I") 
			startPause("input");
		else if (e.shiftKey && e.altKey && e.key === "A") 
			startPause("a");
	} else {
		e.preventDefault();
		endPause(e.key);
	}
});
