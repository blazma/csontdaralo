var layerMenu = document.getElementById("layer_menu");
var layerGame = document.getElementById("layer_game");
var layerGameMenu = document.getElementById("layer_game_menu")
var layerResults = document.getElementById("layer_results");
var layerHelp = document.getElementById("layer_help");
var layerGameBodypart = document.getElementById("layer_game_bodypart");
var layerMain = document.getElementById("layer_main");
var canvas = document.getElementById("canvas");
var parentRight = document.getElementById("parentRight");

layerGame.style.display = "none";
layerResults.style.display = "none";
layerHelp.style.display = "none";
layerGameBodypart.style.display = "none";
layerMenu.style.display = "block";

var mainMenuElements = [
	["btn_start", onStartClick, "Start"],
	["btn_results", onResultsClick, "Eredmények"],
	["btn_help", onHelpClick, "Segítség"]
];

function createMainMenu(){
	for (var i=0; i<mainMenuElements.length; ++i){
		var btn = document.createElement("button");
		btn.id = mainMenuElements[i][0];
		btn.onclick = mainMenuElements[i][1];
		btn.innerHTML = mainMenuElements[i][2];
		btn.className += "fancybtn";
		layerMenu.appendChild(btn);
		layerMenu.appendChild(document.createElement("br"));
	}
}
createMainMenu();

function deleteTable() {
	var table = document.getElementById("table");
	table.parentNode.removeChild(table);
}

//timer	
var sec = 0;
var min = 0;
var	hour = 0;
function timer() {
	var s = "0";
	sec++;
	if (sec==60){
		min++;
		sec = 0;
		if (min==60) {
			hour++;
			min = 0;
		}
	}
	if (sec < 10) {
		sec = "0" + sec;
	}
	if (min < 9) {
		document.getElementById("time").innerHTML = "0" + hour+":0"+min+":"+sec;
	} else {
		document.getElementById("time").innerHTML = "0" + hour + ":" + min + ":" + sec;
	}
}

function ptTimer() {
	if (points!=0) {
		points--;
	}
	document.getElementById("points").innerHTML = "Pontszám: "+points;
}

function reset_timer() {
	sec = 0;
	min = 0;
	hour = 0;
	points = 0;
	document.getElementById("time").innerHTML = "00:00:00";
	document.getElementById("points").innerHTML = "0";
}

function disable_btn(){
	var Btns = document.getElementsByTagName("button");
	for (var i = 0; i < Btns.length; i++) {
		Btns[i].disabled = "true";
	}
}

function enable_btn(){
	var Btns = document.getElementsByTagName("button");
	for (var i = 0; i < Btns.length; i++) {
		Btns[i].disabled = "";
	}
}

function dragOver(ev){
	ev.preventDefault();
    ev = ev || window.event;
	var pos = findPos(canvas);
    var x = ev.pageX - pos.x;
    var y = ev.pageY - pos.y;
    var c = canvas.getContext('2d');
    var p = c.getImageData(x, y, 1, 1).data; 
   	color = [p[0], p[1], p[2]];
   	console.log(p[0]+", "+p[1]+", "+p[2]);
}

var bodypart;
var bones;

function drop(ev, bodypartElements, bonesmatrix){
	bodypartElements = bodypart;
	bonesmatrix = bones;
	if (lives != 0) {
		ev.preventDefault();
		var index = bodypartElements[1].indexOf(ev.dataTransfer.getData("text"));
		console.log(index);
		//console.log(bodypartElements[1]);
		var colorcode = bonesmatrix[index];
		console.log(colorcode);
		if (!equals(color,[0, 0, 0]) && !equals(color,[198,198,198]) && !equals(color,[20, 18, 14])) {
			if ((equals(color,colorcode))) {
				for (var i=0; i<buttonTags.length; ++i){
					if (buttonTags[i].innerHTML == (bodypartElements[1])[index]) {
						buttonTags[i].className = "btn_bone_rplc";
						buttonTags[i].disabled = "true";
						buttonTags[i].innerHTML = "";
						buttonTags[i].draggable = "";
						
						// CSONTOK
						var context = canvas.getContext("2d");
						var image = new Image();
						image.src= "images/"+(bodypartElements[2])+index+".png";
						image.onload = function(){	
							context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height)
						};
						// CSONTOK_VÉGE

						points += 200;
						document.getElementById("points").innerHTML = "Pontszám: "+points;

						bonesleft--;
						check();

						break;
					}
				}
			} else {
				lives--;
				refreshLives();
			}					
		}
	}
}

function gameplay(bodypartElements, bonesmatrix) {
	//update: B) működik o shiet boi
	refreshLives();
	var dropzone = document.getElementById("canvas");
	createTable(bodypartElements);
	createBodypart(bodypartElements);						
	bodypart = bodypartElements;
	bones = bonesmatrix;
	layerGameBodypart.style.display = "block";

	dropzone.addEventListener("dragover", dragOver, false);
	dropzone.addEventListener("drop", drop, false);

	if (eog) {
		mytime = setInterval(timer, 1000);
		pointstimer = setInterval(ptTimer, 250);
		eog = false;
	}
}

var lives = 3;
var eog = true; //end of game
var mytime = 0;
var pointstimer = 0;
var bonesleft = -1;
var buttonTags = layerGameBodypart.getElementsByTagName("button");
var points = 0;
var bodypartString = "Bodypart";

var handbones = [				// 
	"Felső ujjperc csontok", 	// (255, 255, 255)
	"Középső ujjperc csontok",	// (254, 255, 255)	
	"Alsó ujjperc csontok",		// (255, 254, 255)
	"Kézközépcsontok",			// (255, 255, 254)
	"Horgascsont",				// (254, 254, 255)
	"Borsócsont",				// (254, 255, 254)
	"Háromszögletű csont",		// (255, 254, 254)
	"Kistrapézcsont",			// (254, 254, 254)
	"Trapézcsont",				// (253, 255, 255)
	"Sajkacsont",				// (255, 253, 255)
	"Fejescsont",				// (255, 255, 253)
	"Holdas-z csont",			// (253, 253, 255)
	"Singcsont",				// (253, 255, 253)
	"Orsócsont"					// (255, 253, 253)
];

var handbones_matrix = [
	[255, 255, 255],
	[254, 255, 255],
	[255, 254, 255],
	[255, 255, 254],
	[254, 254, 255],
	[254, 255, 254],
	[255, 254, 254],
	[254, 254, 254],
	[253, 255, 255],
	[255, 253, 255],
	[255, 255, 253],
	[253, 253, 255],
	[253, 255, 253],
	[255, 253, 253]
];

var skullbones = [
	"Falcsont",			//255 255 255
	"Homlokcsont", 		//255 255 254
	"Nyakszirtcsont",	//253 255 255
	"Halántékcsont",	//255 253 255
	"Orrcsont",			//255 254 255
	"Járomcsont",		//255 255 253
	"Felső állcsont",	//254 255 255
	"Állkapocscsont",	//254 255 254
	"Könnycsont",		//254 254 255
	"Ékcsont",			//254 254 254
	"Fogak"				//255 254 254
];

var skullbones_matrix = [
	[255, 255, 255],
	[255, 255, 254],
	[253, 255, 255],
	[255, 253, 255],
	[255, 254, 255],
	[255, 255, 253],
	[254, 255, 255],
	[254, 255, 254],
	[254, 254, 255],
	[254, 254, 254],
	[255, 254, 254]
];

var footbones = [
	"Sarokcsont",
	"Ugrócsont",
	"Sajkacsont",
	"Belső ékcsont",
	"Középső ékcsont",
	"Külső ékcsont",
	"Köbcsont",
	"Lábközépcsontok",
	"Felső ujjperccsontok",
	"Középső ujjperccsontok",
	"Alsó ujjperccsontok"
];

var footbones_matrix = [
	[255, 255, 255],
	[254, 255, 255],
	[255, 254, 255],
	[255, 255, 254],
	[253, 255, 255],
	[255, 253, 255],
	[255, 255, 253],
	[252, 255, 255],
	[251, 255, 255],
	[255, 255, 252],
	[255, 252, 255]
];

//ELEMENTEK ELNEVEZÉSE
/*var ELEMENTS = [
	csontok, //0, shuffle-özve lesz
	csontok.concat(), //1, az indexeket ebből keresem vissza
	"testrész", // 2 source-hoz egyéni png-khez kell
	"csont gombja",//3 gomb indexei
	"testrészbase.png",//4 createbodypartnál kell a base-hez
	"Testrész"//5 eredménytáblába kerülő string
]*/
var handElements = [
	handbones, //0, shuffle-özött verzió
	handbones.concat(), //1, amiből visszakeresem az indexeket
	"hand", //2, a sourcehoz kell (egyéni png-k)
	"handbone", //3, gomb indexeihez kell
	"handbase.png", //4, createBodypartnál kell a base-hez
	"Kéz" //5, eredménynél ezt írja ki
];

var skullElements = [
	skullbones, //0, shuffle-özött verzió
	skullbones.concat(), //1, amiből visszakeresem az indexeket
	"skull", //2, a sourcehoz kell (egyéni png-k)
	"skullbone", //3, gomb indexeihez kell
	"skullbase.png", //4, createBodypartnál kell a base-hez
	"Koponya" //5, eredménynél ezt írja ki
];

var footElements = [
	footbones,
	footbones.concat(),
	"foot",
	"footbone",
	"footbase.png",
	"Lábfej"
];

var results_matrix = [["Testrész", "Idő", "Megmaradt életek", "Pontszám"]];
var color = [-1, -1, -1];

function onStartClick(ev) {
	var parentDiv = ev.target.closest("div");
	parentDiv.style.display = "none"; 
	layerGame.style.display = "block";
	layerGameMenu.style.display = "block";
}

function onResultsClick(ev) {
	var parentDiv = ev.target.closest("div");
	parentDiv.style.display = "none";
	layerGame.style.display = "block";
	layerGameMenu.style.display = "none";
	layerResults.style.display = "block";
	showResults();
}

function onHelpClick(ev) {
	var parentDiv = ev.target.closest("div");
	parentDiv.style.display = "none";
	layerGame.style.display = "block";
	layerGameMenu.style.display = "none";
	layerHelp.style.display = "block";
	showHelp();
}

function onBackClick(ev){
	var parentDiv = ev.target.closest("div");
	parentDiv.style.display = "none";

	if (parentDiv.id == "layer_game_bodypart"){
		layerGameMenu.style.display = "block";
		deleteTable();
	}
	if (parentDiv.id == "layer_game_menu") {
		layerMenu.style.display = "block";
		layerGameMenu.style.display = "none";
	}
	if (parentDiv.id == "layer_results" || parentDiv.id == "layer_help"){
		layerMenu.style.display = "block";
		layerGameMenu.style.display = "none";
	}
	reset_timer();

	var dropzone = document.getElementById("canvas");
	dropzone.removeEventListener('drag', dragOver, false);
	dropzone.removeEventListener('drop', drop, false);

}

function onBodyPartClick(ev) {
	layerGameMenu.style.display = "none";
	var currBtn = ev.target;
	lives = 3;
	reset_timer();
	switch(currBtn.id) {
		case "btn_hand":
			gameplay(handElements, handbones_matrix);
			bodypartString = "Kéz";
			break;
		case "btn_skull":
			gameplay(skullElements, skullbones_matrix);
			bodypartString = "Koponya";
			break;
		case "btn_foot":
			gameplay(footElements, footbones_matrix);
			bodypartString = "Lábfej";
			break;
	}
}

function check() {
	if (bonesleft == 0) {
		gameWon();
	}
}

function shuffle(array) { // Fisher-Yates Shuffle
	var counter = array.length;
	while(counter > 0){
		var index = Math.floor(Math.random()*counter);
		counter--;
		var temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}
	return array;
}
function createTable(bodypartElements) {
	shuffle(bodypartElements[0]);
	var parent = document.getElementById("parentLeft");
	var index = 0;
	table = document.createElement("table");
	table.id = "table";
	var rows = Math.ceil((bodypartElements[0].length)/3);
	var stop = 3+bodypartElements[0].length-(3*rows);

	for(var i=0; i<rows; ++i) {
		var tr = table.insertRow();
		for (var j=0; j<3; ++j){
			if(i==rows-1 && j==stop) break;
			var td = tr.insertCell();
			var bone = document.createElement("button");
			bone.innerHTML = (bodypartElements[0])[index];
			bone.id = (bodypartElements[3])+index;
			bone.draggable = "true";
			bone.className = "btn_bone"; 
			bone.addEventListener("dragstart", function(ev){drag(ev)}, false);
			td.appendChild(bone);
			index++;
		}
	}
	parent.appendChild(table);
	bonesleft = layer_game_bodypart.getElementsByClassName("btn_bone").length;
	//console.log(bonesleft);
}

function createBodypart(bodypartElements) {
	var parent = document.getElementById("parentRight");
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);

	var image = new Image();
	image.src= "images/"+(bodypartElements[4]);
	image.onload = function() {	
		context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height)};
}

function drag(ev) {
	ev.dataTransfer.setData("text",ev.target.innerHTML);
}

var hr = document.getElementById("heart_row");
function refreshLives() {
	hr.innerHTML = "";
	for (var i=0; i<lives; ++i) {
		var heart_full = document.createElement("img");
		heart_full.src = "images/heart_full.png";
		heart_full.style.width = "40px";
		heart_full.draggable = "";
		var td = hr.insertCell();
		td.appendChild(heart_full);
	}
	for (var i=0; i<3-lives; ++i) {
		var heart_empty = document.createElement("img");
		heart_empty.src = "images/heart_empty.png";
		heart_empty.style.width = "40px";
		heart_empty.draggable = "";
		var td = hr.insertCell();
		td.appendChild(heart_empty);
	}
	if (lives == 0) {
		gameOver();
	}
}

function gameOver() {
	disable_btn();
	showPopup("Vesztettél!", layerGameBodypart, layerGameMenu);
	clearTimeout(mytime);
	clearTimeout(pointstimer);
	eog = true;
}

function gameWon() {
	disable_btn();
	showPopup("Nyertél!!!", layerGameBodypart, layerGameMenu);

	var finishTime = document.getElementById("time").innerHTML;
	results_matrix.push([bodypartString,finishTime,lives,points]);

	clearTimeout(mytime);
	clearTimeout(pointstimer);
	eog = true;
}

var tableResults = document.getElementById("table_results");
var emptyText = document.getElementById("emptytext");
function showResults() {
	if (results_matrix.length == 1) {
		tableResults.style.display = "none";
		emptyText.style.display = "block";
	} else {
		tableResults.style.display = "block";
		emptyText.style.display = "none";
		tableResults.innerHTML = "";
		for (var i=0; i<results_matrix.length; ++i) {
			var tr = document.createElement("tr");
			for (var j=0; j<results_matrix[i].length; ++j) {
				var td = document.createElement("td");
				td.innerHTML = results_matrix[i][j];
				tr.appendChild(td);
			}
			tableResults.appendChild(tr);
		}
	}
}

function showPopup(str, from, to) {
	var parentDiv = from;
	var popup = document.createElement("div");
	popup.id = "popup";

	var text = document.createElement("p");
	text.innerHTML = str;

	var backbtn = document.createElement("button");
	backbtn.innerHTML = "Vissza a menübe";
	backbtn.className += "fancybtn";
	backbtn.onclick = function(){
		lives = 3;
		to.style.display = "block";
		from.style.display = "none";
		parentDiv.removeChild(popup);
		deleteTable();
		enable_btn();
	}

	popup.appendChild(text);
	popup.appendChild(backbtn);
	parentDiv.appendChild(popup);
}

function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function equals(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length != b.length) return false;
	for (var i = 0; i < a.length; ++i) {
    	if (a[i] !== b[i]) return false;
  	}
  	return true;
}

/*
window.onresize = function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
*/

var handtablehelp = document.getElementById("handTableHelp");
var canvashelp = document.getElementById("canvasHandHelp");
var parentHandLeftHelp = document.getElementById("parentHandLeftHelp");
function showHelp(){
	var handbones = [				// SZÍNKÓD (piros):
		"Felső ujjperc csontok", 	// 255
		"Középső ujjperc csontok",	// 254	
		"Alsó ujjperc csontok",		// 253
		"Kézközépcsontok",			// 252
		"Horgascsont",				// 251
		"Borsócsont",				// 250
		"Háromszögletű csont",		// 249
		"Kistrapézcsont",			// 248
		"Trapézcsont",				// 247
		"Sajkacsont",				// 246
		"Fejescsont",				// 245
		"Holdas-z csont",			// 244
		"Singcsont",				// 243
		"Orsócsont"					// 242
	];

	var parent = document.getElementById("parentHandRightHelp");
	var context = canvashelp.getContext("2d");

	var image = new Image();
	image.src= "images/handbase.png";
	image.onload = function() {	
		context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvashelp.width, canvashelp.height)};

	canvashelp.addEventListener('mousemove', function(ev) {
	  	ev.preventDefault();
	    ev = ev || window.event;
		var pos = findPos(canvashelp);
	    var x = ev.pageX - pos.x;
	    var y = ev.pageY - pos.y;
	    var c = canvashelp.getContext('2d');
	    var p = c.getImageData(x, y, 1, 1).data; 
	   	color = [p[0], p[1], p[2]];
	   	var index = indexOfMatrix(handbones_matrix,color)
	   	if (index!=-1) {
	   		//context.clearRect(0, 0, canvas.width, canvas.height);
			var image = new Image();
			image.src= "images/handbase.png";
			image.onload = function() {	
				context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvashelp.width, canvashelp.height)};
	   		parentHandLeftHelp.innerHTML = handbones[index];
			var bone = new Image();
			bone.src= "images/hand"+index+".png";
			bone.onload = function() {	
				context.drawImage(bone, 0, 0, bone.width, bone.height, 0, 0, canvashelp.width, canvashelp.height)};
	   	}
	}, false);
}

function indexOfMatrix(matrix, item) {
    for (var i = 0; i < matrix.length; i++) {
        if (matrix[i][0] == item[0] && matrix[i][1] == item[1] && matrix[i][2] == item[2]) {
            return i;
        }
    }
    return -1;
}