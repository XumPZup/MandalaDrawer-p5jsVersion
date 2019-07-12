var menu = document.getElementById('menu');
var objList = document.getElementById('objects');


var setReflectionAxis = document.getElementById('reflection');
var selector = document.getElementById('choice');
var btnAddShape = document.getElementById('add');
btnAddShape.addEventListener('click', addShape);

var bkgColorPicker = document.getElementById('bkgColor');
bkgColorPicker.addEventListener('change', changeBkgColor);


var bkg = [0,0,0];
var objects = []
var selectedObject;


function addShape(){
	if(selector.value == '1'){
		objects.push(new partial());
		on = document.getElementsByClassName('on');
		if(on.length){
			on[0].setAttribute('class', 'off');
		}
		p = document.createElement('p');
		p.setAttribute('class', 'on')
		p.setAttribute('id', objects.length);
		p.innerHTML = 'Partial; ID=' + objects.length;
		selectedObject = objects.length-1;
		objList.appendChild(p);
		objects[selectedObject].putInputs();
		p.addEventListener('click', selectFromList);
	}
}


function selectFromList(){
	on = document.getElementsByClassName('on');
	on[0].setAttribute('class', 'off');
	this.setAttribute('class', 'on');
	selectedObject = this.getAttribute('id') - 1;
	objects[selectedObject].putInputs();
}


function hexToRgb(c){
	red = parseInt(c[1] + c[2], 16);
	green = parseInt(c[3] + c[4], 16);		
	blue = parseInt(c[5] + c[6], 16);
	return [red, green, blue];
	
}

function rgbToHex(r, g, b){
	return '#' + r.toString(16) + g.toString(16) + b.toString(16);
}

function changeBkgColor(){
	bkg=hexToRgb(this.value);
}


function partial(onChange){
	this.distance = 100;
	this.rx = 100;
	this.ry = 50;
	this.repetitions = 1;
	this.lineWidth = 1;
	// Angles
	this.rotation = 0
	this.displace = 0
	this.start = 0;
	this.stop = Math.PI/50*10;
	this.reflectionAngle = 0;
	// Checkboxes
	this.displayReflection = false;
	this.guideLines = false;
	this.fill = false;
	// Color
	this.fillColor = [100,100,100];
	this.strokeColor = [100,100,100];
	// Functions
	this.display = function(onChange){
		resetMatrix();
		// Translation (0,0) == canvas center
		translate(width/2, height/2);
		rotate(this.displace);
		//____________________________
		// Set Reflection Axis
		//____________________________
		if(setReflectionAxis.checked && onChange == selectedObject){
			stroke(0,255,0);
			line(0,0,mouseX-width/2,mouseY-height/2);
			this.reflectionAngle = atan((mouseY-height/2)/ (mouseX-width/2));
			document.getElementById('reflectionAngle').value = this.reflectionAngle;
			if(mouseIsPressed){
				setReflectionAxis.checked = false;	
			}
		}
		strokeWeight(this.lineWidth);
		for(var j = 0; j <= this.repetitions; j++){
			var rep = TWO_PI/this.repetitions*j;
			//_______________________
			// Original figure
			//_______________________
			// Translation (0,0) = Figure center
			translate(this.distance, 0);
			rotate(this.rotation);
			
			// Entire ellipse
			if(this.guideLines){
				noFill();
				stroke(150);
				ellipse(0,0,this.rx*2, this.ry*2);
				stroke(255,0,0);
					
				line(0,0,cos(this.start)*this.rx, sin(this.start)*this.ry);
				line(0,0,cos(this.stop)*this.rx, sin(this.stop)*this.ry);
			}
			if(this.fill){
				fill(this.fillColor);
			}else{
				noFill();
			}
			stroke(this.strokeColor);
			// Chosen part
			beginShape();
			for(var i = this.start; i <= this.stop; i+=PI/50){
				x = cos(i) * this.rx;
				y = sin(i) * this.ry;
				vertex(x, y);
			}
			endShape();
			// RESET
			resetMatrix();
			// Translation (0,0) == canvas center
			translate(width/2, height/2);
			rotate(this.displace+rep);
			//_______________________
			// Toggle reflection
			//_______________________
			if(this.displayReflection){
				var alpha = PI/2 - this.reflectionAngle;
				var realToReflectionDistance = (this.distance * cos(alpha)) *2;
				// line from the original center to reflection center
				//line(this.distance,0,realToReflectionDistance*cos(PI-alpha)+this.distance, realToReflectionDistance*sin(PI-alpha));
				
				// Translation (0,0) == reflection center 
				translate(realToReflectionDistance*cos(PI-alpha)+this.distance, realToReflectionDistance*sin(PI-alpha));
				// Rotation around reflection center
				rotate(2*this.reflectionAngle-this.rotation);
				
				// Chosen part
				beginShape();
				for(var i = -this.start; i >= -this.stop; i-=PI/50){
					x = cos(i) * this.rx;
					y = sin(i) * this.ry;
					vertex(x, y);
				}
				endShape();	
				// RESET
				resetMatrix();
				// Translation (0,0) = canvas center
				translate(width/2, height/2);
				rotate(this.displace+rep);
			}
		}
	}
	
	
	this.putInputs = function(){
		var subMenu = document.getElementById('subMenu');
		if(subMenu){
			subMenu.remove();
		}
		var keys = Object.keys(this);
		subMenu = document.createElement('div');
		subMenu.setAttribute('id', 'subMenu')
		for(var i = 0; i < keys.length-2; i++){
			var label = document.createElement('label');
			label.innerHTML = keys[i] + ': ';
			var input = document.createElement('input');
			if(i < 10){
				input.type = 'number';
				if(i > 4 && i < 10){
					input.setAttribute('step', String(Math.PI/50));
				}
				input.value = this[keys[i]];
			}
			else if(i > 9 && i < keys.length-4){
				input.type = 'checkbox';
				input.checked = this[keys[i]];
			}
			else{
				input.type = 'color';
				input.value = rgbToHex(this[keys[i]][0], this[keys[i]][1], this[keys[i]][2]);
			}
			input.setAttribute('id',keys[i]);
			
			subMenu.appendChild(label);
			subMenu.appendChild(input);
			subMenu.appendChild(document.createElement('br'));
			input.addEventListener('change', setChanges);
		}
		menu.appendChild(subMenu);
	}
}

//
//
//
//
function setChanges(){
	var key = this.getAttribute('id');
	if(this.type == 'number'){
		objects[selectedObject][key] = parseFloat(this.value);
	}
	else if(this.type == 'checkbox'){
		objects[selectedObject][key] = this.checked;
	}
	else if(this.type == 'color'){
		objects[selectedObject][key] = hexToRgb(this.value);
	}
}


function setup(){
	createCanvas(700,700);
}


function draw(){
	background(bkg);
	for(var i = 0; i < objects.length; i++){
		objects[i].display(i);
	}
}


