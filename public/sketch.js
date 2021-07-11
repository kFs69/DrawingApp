let socket
let color = '#FFF'
let bgColor = '#000'
let strokeWidth = 4

function setup() {
	// Creating canvas
	const cv = createCanvas(window.innerWidth, window.innerHeight)
	cv.background(bgColor)

	// Start the socket connection
	socket = io.connect('http://localhost:3000')

	// Callback function
	socket.on('mouse', data => {
		stroke(data.color)
		strokeWeight(data.strokeWidth)
		line(data.x, data.y, data.px, data.py)
	})

	// Getting our buttons and the holder through the p5.js dom
	const color_picker = document.querySelector("#pickcolor");
	const bg_picker = document.querySelector("#bg-pickcolor");

	const stroke_width_picker = select('#stroke-width-picker')
	const stroke_btn = select('#stroke-btn')

  const clear_btn = select('#clear-btn')
	
  const save_btn = select('#save')

  color_picker.addEventListener("change", watchColorPicker, false);
  bg_picker.addEventListener("change", watchBgPicker, false);

  function watchColorPicker(event) {
    color = event.target.value;
  }

  function watchBgPicker(event) {
    bgColor = event.target.value;
    cv.background(bgColor)
  }

  clear_btn.mousePressed(() => {
    cv.background(bgColor)
  })

  save_btn.mousePressed(() => {
		saveCanvas(cv, 'myArtwork', 'png');
	})

	// Adding a mousePressed listener to the button
	stroke_btn.mousePressed(() => {
		const width = parseInt(stroke_width_picker.value())
		if (width > 0) strokeWidth = width
	})
}

function mouseDragged() {
	// Draw
	stroke(color)
	strokeWeight(strokeWidth)
	line(mouseX, mouseY, pmouseX, pmouseY)

	// Send the mouse coordinates
	sendmouse(mouseX, mouseY, pmouseX, pmouseY)
}

// Sending data to the socket
function sendmouse(x, y, pX, pY) {
	const data = {
		x: x,
		y: y,
		px: pX,
		py: pY,
		color,
    bgColor,
		strokeWidth: strokeWidth,
	}

	socket.emit('mouse', data)
}