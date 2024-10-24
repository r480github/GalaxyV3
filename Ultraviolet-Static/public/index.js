function opencloak() {
	var win = window.open()   
	var url = "index.html" 
	var iframe = win.document.createElement('iframe')
	iframe.style.width = "100%";
	iframe.style.height = "100%";
	iframe.src = url;
	win.document.body.style.margin = "0"; 
	win.document.body.style.padding = "0"; 
	win.document.body.appendChild(iframe);

 }
 
 var cursor = {
	delay: 8,
	_x: 0,
	_y: 0,
	endX: (window.innerWidth / 2),
	endY: (window.innerHeight / 2),
	cursorVisible: true,
	cursorEnlarged: false,
	$dot: document.querySelector('.cursor-dot'),
	$outline: document.querySelector('.cursor-dot-outline'),
	
	init: function() {
		 // Set up element sizes
		 this.dotSize = this.$dot.offsetWidth;
		 this.outlineSize = this.$outline.offsetWidth;
		 
		 this.setupEventListeners();
		 this.animateDotOutline();
	},
	
//     updateCursor: function(e) {
//         var self = this;
		 
//         console.log(e)
		 
//         // Show the cursor
//         self.cursorVisible = true;
//         self.toggleCursorVisibility();

//         // Position the dot
//         self.endX = e.pageX;
//         self.endY = e.pageY;
//         self.$dot.style.top = self.endY + 'px';
//         self.$dot.style.left = self.endX + 'px';
//     },
	
	setupEventListeners: function() {
		 var self = this;
		 
		 // Anchor hovering
		 document.querySelectorAll('a').forEach(function(el) {
			  el.addEventListener('mouseover', function() {
					self.cursorEnlarged = true;
					self.toggleCursorSize();
			  });
			  el.addEventListener('mouseout', function() {
					self.cursorEnlarged = false;
					self.toggleCursorSize();
			  });
		 });
		 
		 // Click events
		 document.addEventListener('mousedown', function() {
			  self.cursorEnlarged = true;
			  self.toggleCursorSize();
		 });
		 document.addEventListener('mouseup', function() {
			  self.cursorEnlarged = false;
			  self.toggleCursorSize();
		 });
 
 
		 document.addEventListener('mousemove', function(e) {
			  // Show the cursor
			  self.cursorVisible = true;
			  self.toggleCursorVisibility();

			  // Position the dot
			  self.endX = e.pageX;
			  self.endY = e.pageY;
			  self.$dot.style.top = self.endY + 'px';
			  self.$dot.style.left = self.endX + 'px';
		 });
		 
		 // Hide/show cursor
		 document.addEventListener('mouseenter', function(e) {
			  self.cursorVisible = true;
			  self.toggleCursorVisibility();
			  self.$dot.style.opacity = 1;
			  self.$outline.style.opacity = 1;
		 });
		 
		 document.addEventListener('mouseleave', function(e) {
			  self.cursorVisible = true;
			  self.toggleCursorVisibility();
			  self.$dot.style.opacity = 0;
			  self.$outline.style.opacity = 0;
		 });
	},
	
	animateDotOutline: function() {
		 var self = this;
		 
		 self._x += (self.endX - self._x) / self.delay;
		 self._y += (self.endY - self._y) / self.delay;
		 self.$outline.style.top = self._y + 'px';
		 self.$outline.style.left = self._x + 'px';
		 
		 requestAnimationFrame(this.animateDotOutline.bind(self));
	},
	
	toggleCursorSize: function() {
		 var self = this;
		 
		 if (self.cursorEnlarged) {
			  self.$dot.style.transform = 'translate(-50%, -50%) scale(0.75)';
			  self.$outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
		 } else {
			  self.$dot.style.transform = 'translate(-50%, -50%) scale(1)';
			  self.$outline.style.transform = 'translate(-50%, -50%) scale(1)';
		 }
	},
	
	toggleCursorVisibility: function() {
		 var self = this;
		 
		 if (self.cursorVisible) {
			  self.$dot.style.opacity = 1;
			  self.$outline.style.opacity = 1;
		 } else {
			  self.$dot.style.opacity = 0;
			  self.$outline.style.opacity = 0;
		 }
	}
}

cursor.init();
"use strict";
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("uv-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("uv-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("uv-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("uv-error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("uv-error-code");
const connection = new BareMux.BareMuxConnection("/baremux/worker.js")

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	try {
		await registerSW();
	} catch (err) {
		error.textContent = "Failed to register service worker.";
		errorCode.textContent = err.toString();
		throw err;
	}

	const url = search(address.value, searchEngine.value);

	let frame = document.getElementById("uv-frame");
	frame.style.display = "block";
	let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
	if (await connection.getTransport() !== "/epoxy/index.mjs") {
		await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
	}
	frame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
});
