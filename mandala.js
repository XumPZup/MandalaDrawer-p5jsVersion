var menu = document.getElementById('menu');
var objList = document.getElementById('objects');

var simmetryLines = document.getElementById('simmetryLines');
var setReflectionAxis = document.getElementById('reflection');
//buttons
var selector = document.getElementById('choice');
var btnAddShape = document.getElementById('add');
btnAddShape.addEventListener('click', addShape);
var btnCopy = document.getElementById('copy');
btnCopy.addEventListener('click', copy);
var btnDelete = document.getElementById('delete');
btnDelete.addEventListener('click', deleteObject);
var upArrow = document.getElementById('arrowUp');
upArrow.addEventListener('click', moveObject);
var downArrow = document.getElementById('arrowDown');
downArrow.addEventListener('click', moveObject);

var bkgColorPicker = document.getElementById('bkgColor');
bkgColorPicker.addEventListener('change', changeBkgColor);

var mainColorPicker = document.getElementById('mainColor');
mainColorPicker.addEventListener('change', changeMainColor);

var simmetriesN = document.getElementById('simmetries');

var bkg = [255,255,255];
var mainColor = [0,0,0];
var objects = []
var selectedObject;


function addShape(){
	on = document.getElementsByClassName('on');
	if(on.length){
		on[0].setAttribute('class', 'off');
	}
	p = document.createElement('p');
	p.setAttribute('class', 'on')
	p.setAttribute('id', objects.length);
	
	if(selector.value == '1'){
		objects.push(new partial());
		p.innerHTML = 'Partial; ID=' + objects.length;
	}
	else if(selector.value == '2'){
		objects.push(new RegularPolygon());
		p.innerHTML = 'Regular Polygon; ID=' + objects.length;
	}
	// - In Test - //
	else if(selector.value == '3'){
		objects.push(new TestClass());
		p.innerHTML = 'Test class; ID=' + objects.length;
	} //
	selectedObject = objects.length-1;
	objList.appendChild(p);
	objects[selectedObject].putInputs();
	p.addEventListener('click', selectFromList);
}


function selectFromList(){
	if(selectedObject >= 0){
		on = document.getElementsByClassName('on');
		on[0].setAttribute('class', 'off');
	}
	this.setAttribute('class', 'on');
	selectedObject = this.getAttribute('id');
	objects[selectedObject].putInputs();
}


function copy(){
	if(selectedObject >= 0){
		// Copy of the instance
		objects.push(Object.assign( Object.create( Object.getPrototypeOf(objects[selectedObject])), objects[selectedObject]));
		on = document.getElementsByClassName('on');
		p = document.createElement('p');
		p.setAttribute('id', objects.length-1);
		p.innerHTML = on[0].innerHTML.split(';')[0] + '; ID=' + objects.length;
		on[0].setAttribute('class', 'off');
		p.setAttribute('class', 'on')
		selectedObject = objects.length-1;
		objList.appendChild(p);
		objects[selectedObject].putInputs();
		p.addEventListener('click', selectFromList);
	}
}


function deleteObject(){
	if(selectedObject >= 0){
		on = document.getElementsByClassName('on');
		on[0].remove();
		objects.splice(selectedObject, 1);
		// Change idx
		for(var i = parseInt(selectedObject)+1; i <= objects.length; i++){
			p = document.getElementById(i);
			p.setAttribute('id', i-1);
			p.innerHTML = p.innerHTML.split(';')[0] + '; ID=' + i;
		}
		selectedObject = -1;
	}
}


function moveObject(){
	if(this.getAttribute('id') == 'arrowUp' && selectedObject > 0){
		other = parseInt(selectedObject) - 1; 
	}else if(this.getAttribute('id') == 'arrowDown' && selectedObject < objects.length-1){
		other = parseInt(selectedObject) + 1;
	}
	if(other >= 0){
		// Make a coy of the instances to swap
		selectedCopy = Object.assign( Object.create( Object.getPrototypeOf(objects[selectedObject])), objects[selectedObject]);
		otherCopy = Object.assign( Object.create( Object.getPrototypeOf(objects[other])), objects[other]);
		// Swap instaces in objects list
		objects[selectedObject] = otherCopy;
		objects[other] = selectedCopy;
		otherHtml = document.getElementById(other);
		otherText = otherHtml.innerHTML.split(';')[0];
		selectedHtml = document.getElementById(selectedObject)
		selectedText = selectedHtml.innerHTML.split(';')[0];
		otherHtml.innerHTML = selectedText + '; ID=' + (other+1);
		selectedHtml.innerHTML = otherText + '; ID=' + (parseInt(selectedObject)+1);
		otherHtml.click();
	}
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
	bkg = hexToRgb(this.value);
}


function changeMainColor(){
	mainColor = hexToRgb(this.value);
}



function displaySimmetryLines(n){
	translate(width/2, height/2);
	stroke(mainColor);
	strokeWeight(1);
	for(var i = 0; i < n; i++){
		line(0,0,350*(2**0.5), 350*(2**0.5));
		rotate(360/n);
	}
}


function partial(){
	this.distance = 100;
	this.rx = 100;
	this.ry = 50;
	this.repetitions = 1;
	this.lineWidth = 1;
	// Angles
	this.rotation = 0
	this.displace = 0
	this.start = 0;
	this.stop = 50;
	this.reflectionAngle = 0;
	// Checkboxes
	this.closeSegment = false;
	this.displayReflection = false;
	this.connectReflectionToReal = false;
	this.guideLines = false;
	this.fill = false;
	// Color
	this.fillColor = mainColor;
	this.strokeColor = mainColor;
	// Functions
	this.display = function(){
		resetMatrix();
		// Translation (0,0) == canvas center
		translate(width/2, height/2);
		rotate(this.displace);
		strokeWeight(this.lineWidth);
		for(var j = 0; j <= this.repetitions; j++){
			var rep = 360/this.repetitions*j;
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
			if(this.stop - this.start < 360){
				beginShape();
				for(var i = this.stop; i > this.start; i-=4){
					x = cos(i) * this.rx;
					y = sin(i) * this.ry;
					vertex(x, y);
				}
				x = cos(this.start) * this.rx;
				y = sin(this.start) * this.ry;
				vertex(x, y);
				if(this.closeSegment && !this.connectReflectionToReal){
					endShape(CLOSE);
				}else if(!this.reflection){
					endShape();
				}
			}else{
				ellipse(0, 0, this.rx*2, this.ry*2);
			}
			//_______________________
			// Toggle reflection
			//_______________________
			if(this.displayReflection){
				var alpha = 90 - this.reflectionAngle;
				var realToReflectionDistance = (this.distance * cos(alpha)) *2;
				// angle of reflection
				aInc = (2*this.reflectionAngle-(2*this.rotation));
				// reflection center
				xInc = realToReflectionDistance*cos(180-alpha-this.rotation);
				yInc = realToReflectionDistance*sin(180-alpha-this.rotation);
				// Chosen part
				if(this.stop - this.start < 360){
					if(!this.connectReflectionToReal){
						beginShape();
					}
					// point rotation = (x*cos(U) - ysin(U); y*cos(U) + x*sin(U))
					for(var i = -this.start; i > -this.stop; i-=4){
						x = cos(i) * this.rx;
						y = sin(i) * this.ry;
						vertex(x*cos(aInc) - y*sin(aInc)+xInc, y*cos(aInc) + x*sin(aInc)+yInc);
					}
					x = cos(-this.stop) * this.rx;
					y = sin(-this.stop) * this.ry;
					vertex(x*cos(aInc) - y*sin(aInc)+xInc, y*cos(aInc) + x*sin(aInc)+yInc);
					if(this.closeSegment){
						endShape(CLOSE);
					}else{
						endShape();
					}
				}else{
					translate(xInc, yInc);
					rotate(aInc);
					ellipse(0, 0, this.rx*2, this.ry*2);
				}
			}	
			// RESET
			resetMatrix();
			// Translation (0,0) = canvas center
			translate(width/2, height/2);
			rotate(this.displace+rep);
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
function RegularPolygon(){
	this.distance = 100
	this.sideLenght = 50;
	this.sideNumber = 4;
	this.repetitions = 1;
	this.lineWidth = 1;
	// Angles
	this.rotation = 0
	this.displace = 0
	this.reflectionAngle = 0;
	// Checkboxes
	this.closeSegment = true;
	this.displayReflection = false;
	this.connectReflectionToReal = false;
	this.fill = false;
	// Color
	this.fillColor = mainColor;
	this.strokeColor = mainColor;
	// Functions
	this.display = function(){
		if(this.sideNumber <= 0){
			return;
		}
		resetMatrix();
		// Translation (0,0) == canvas center
		translate(width/2, height/2);
		rotate(this.displace);
		strokeWeight(this.lineWidth);
		for(var j = 0; j <= this.repetitions; j++){
			var rep = 360/this.repetitions*j;
			//_______________________
			// Original figure
			//_______________________
			// Translation (0,0) = Figure center
			translate(this.distance, 0);
			rotate(this.rotation);
			if(this.fill){
				fill(this.fillColor);
			}else{
				noFill();
			}
			stroke(this.strokeColor);
			beginShape();
			for(var i = 0; i < 360; i+=360/this.sideNumber){
				x = cos(i) * this.sideLenght;
				y = sin(i) * this.sideLenght;
				vertex(x, y);
			}
			if(this.closeSegment && !this.connectReflectionToReal){
				endShape(CLOSE);
			}else if(!this.reflection){
				endShape();
			}
			//_______________________
			// Toggle reflection
			//_______________________
			if(this.displayReflection){
				var alpha = 90 - this.reflectionAngle;
				var realToReflectionDistance = (this.distance * cos(alpha)) *2;
				// angle of reflection
				aInc = (2*this.reflectionAngle-(2*this.rotation));
				// reflection center
				xInc = realToReflectionDistance*cos(180-alpha-this.rotation);
				yInc = realToReflectionDistance*sin(180-alpha-this.rotation);
				if(!this.connectReflectionToReal){
					beginShape();
				}
				for(var i = -360+360/this.sideNumber; i < 360/this.sideNumber; i+=360/this.sideNumber){
					x = cos(i) * this.sideLenght;
					y = sin(i) * this.sideLenght;
					vertex(x*cos(aInc) - y*sin(aInc)+xInc, y*cos(aInc) + x*sin(aInc)+yInc);
				}
				if(this.closeSegment){
				endShape(CLOSE);
				}else{
					endShape();
				}
			}				
			// RESET
			resetMatrix();
			// Translation (0,0) = canvas center
			translate(width/2, height/2);
			rotate(this.displace+rep);	
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
			if(i < 8){
				input.type = 'number';
				input.value = this[keys[i]];
			}
			else if(i > 7 && i < keys.length-4){
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
	angleMode(DEGREES);
}


function draw(){
	background(bkg);
	if(simmetryLines.checked){
		displaySimmetryLines(simmetriesN.value);
	}
	for(var i = 0; i < objects.length; i++){
		objects[i].display();
	}
	//____________________________
	// Set Reflection Axis
	//____________________________	
	if(setReflectionAxis.checked){
		stroke(0,255,0);
		strokeWeight(1);
		line(0,0,mouseX-width/2,mouseY-height/2);
		objects[selectedObject].reflectionAngle = atan((mouseY-height/2)/ (mouseX-width/2));
		document.getElementById('reflectionAngle').value = objects[selectedObject].reflectionAngle;
		if(mouseIsPressed){
			setReflectionAxis.checked = false;	
		}
	}
}


