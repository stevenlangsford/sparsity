/*global $, document, console, alert */
var currentrule; 
var rules25 = shuffle([
//makerule(petalval,ringval,colval,petaltest,ringtest,coltest)
//petal 25%
new makerule(3,900,900,lessthan,lessthan,lessthan),
new makerule(4,900,900,greaterthan,lessthan,lessthan),
//ring 25%
new makerule(900,10,900,lessthan,lessthan,lessthan),
new makerule(900,15,900,lessthan,greaterthan,lessthan),
//col 25%
new makerule(900,900,Math.round(255/2),lessthan,lessthan,lessthan),
new makerule(900,900,Math.round((3*255)/4),lessthan,lessthan,greaterthan)
])

var rules50 = shuffle([
//makerule(petalval,ringval,colval,petaltest,ringtest,coltest)
//petal 50%
new makerule(4,900,900,lessthan,lessthan,lessthan),
new makerule(3,900,900,greaterthan,lessthan,lessthan),
//ring 50%
new makerule(900,15,900,lessthan,lessthan,lessthan),
new makerule(900,10,900,lessthan,greaterthan,lessthan),
//col 50%
new makerule(900,900,Math.round((3*255)/4),lessthan,lessthan,lessthan),
new makerule(900,900,Math.round(255/2),lessthan,lessthan,greaterthan)
])

var rules75 = shuffle([
//makerule(petalval,ringval,colval,petaltest,ringtest,coltest)
//petal 75%
new makerule(5,900,900,lessthan,lessthan,lessthan),
new makerule(2,900,900,greaterthan,lessthan,lessthan),
//ring 75%
new makerule(900,20,900,lessthan,lessthan,lessthan),
new makerule(900,5,900,lessthan,greaterthan,lessthan),
//col 75%
new makerule(900,900,255,lessthan,lessthan,lessthan),
new makerule(900,900,Math.round(255/4),lessthan,lessthan,greaterthan)
])


//params:
var expversionnumber=2;

var populationsize = 1000;
var canvaswidth=50;
var canvasheight=50;
var flowermax = 15;
var samplerows = 100;
var samplecols = 7;


//trial info
var whichtrial = 0;
var sparsitylevel=shuffle([25,50,75]);
var petallevels=[2,3,4,5];
var ringlevels = [5,10,15,20];
var collevels = [Math.round(255/4),Math.round(255/2),Math.round((3*255)/4),255];
var sizeparam = 10;

var requestcounter = 0;
var maxrequests = 10;
var stimcol = shuffle(["blue","red","green"]);
var subjectID = Math.round(Math.random() * 1000000);
var demographicinfo = "";
var percentrich=sparsitylevel[0]; //used only for display, in instructions and by request buttons
setRule();
var richgroup=[];//display groups, ie hypothesised, not true groups
var poorgroup=[];//display group
var hmtotal = 0;
var hmrich=0;
var knownids=[];
var richids=[];
var poorids=[];
var startasrich;
var correctcount=0;
function setstart(){//might want to change this to randomize start side for 50%... now it's always all-rich.
    if(percentrich>=50)startasrich=true;
    else startasrich=false;
} 
setstart();
function initgroups(){
    var allstim = [];

    for(var i=0;i<petallevels.length;i++){
	for(var j=0;j<ringlevels.length;j++){
	    for(var k=0;k<collevels.length;k++){
		//makeflower(x, y, petallevel, ringlevel, collevel, sizeparam){
		thisflower=new makeflower(canvaswidth/2,canvasheight/2,petallevels[i],ringlevels[j],collevels[k],sizeparam);
//		if(hmtotal%2==0)richgroup.push(thisflower);
//		else poorgroup.push(thisflower);
		allstim.push(thisflower);
		hmtotal++;
		if(currentrule.passes(thisflower)){
		    hmrich++; 
		    richids.push(thisflower.idno);
		}
		else poorids.push(thisflower.idno);
	    }//collevels
	}//ringlevels
    }//petallevels
    allstim=shuffle(allstim);
    for(var i=0;i<allstim.length;i++){
	if(i%2==0)richgroup.push(allstim[i]);
	else poorgroup.push(allstim[i]);
    }
}//initgroups

var posleft = Math.random()>.5;
// var drawposrow = 0;
// var drawposcol = 0;
// var drawnegrow = 0;
// var drawnegcol = 0;

var sample=getSample();
var poscounter = 0;
var negcounter = 0;

function setRule(){
      switch(percentrich){
    case 25: currentrule=rules25[whichtrial];
	break;
    case 50: currentrule=rules50[whichtrial];
	break;
    case 75: currentrule=rules75[whichtrial];
	break;
    }
}


//DATA STORE:
var requests = []; // code 1 for rich, 0 for poor
var switches = [];
var allactions = [];//Key: P=request rich, N=request poor, p=swap from rich side to poor side, n=swap from poor side to rich side, S submit.
//var examplesseen = []; //plankton flower objects
//var testitems = []; //plankton flower objects
//var testans = [];//1 for rich, 0 for poor
//var testresponses=[]; //1 for rich, 0 for poor

function cleardata(){
    requests.length=0; //is this really the javascript way of clearing an array?
    switches.length=0;
    allactions.length=0;
    //examplesseen.length=0;
//    testitems.length=0;
 //   testans.length=0;
  //  testresponses.length=0;;
}

function savetrial(){
    timelogged = new Date().getTime();
    function arrtostring(arr){
	console.log(arr);//diag
	var arrstring="";
	for(var i=0;i<arr.length;i++){
	    arrstring+=arr[i];
	    if(i<arr.length-1)arrstring+=",";
	}
	return arrstring;
    }
    // all of the data from this trial will go into this object
  var exp_data = {};
    exp_data.expversion=expversionnumber;
    exp_data.subjectID=subjectID;
    exp_data.demographics=demographicinfo.toLowerCase();
    exp_data.timelogged=timelogged;
    exp_data.trialnumber=whichtrial;
    exp_data.ruleused=currentrule.asString;
    exp_data.posleft=posleft;
    exp_data.sparsitylevel=sparsitylevel[0];
    exp_data.requests=arrtostring(requests);
    exp_data.causedswitch=arrtostring(switches);
    exp_data.actions=arrtostring(allactions);
    exp_data.correct=correctcount;
    exp_data.posgroup=arrtostring(richgroup);
    exp_data.neggroup=arrtostring(poorgroup);
    // save trial data
    saveData(exp_data);
    console.log(exp_data);//diag
cleardata();//after saving, ready for next trial if there is one.
}

function greaterthan(a,b){
return a>b;
}
function lessthan(a,b){
return a<b;
}
function makerule(petalval,ringval,colval,petaltest,ringtest,coltest){
this.petalval=petalval;
this.ringval=ringval;
this.colval=colval;
this.passes=function(aflower){
return petaltest(aflower.petals,petalval) && 
ringtest(aflower.ring,ringval) && 
coltest(aflower.collevel,colval);
}
var infostring=""+petalval+":"+ringval+":"+colval;
if(petaltest(1,2))infostring+=":<:";
else infostring+=":>:";
if(ringtest(1,2))infostring+="<:";
else infostring+=">:";
if(coltest(1,2))infostring+="<";
else infostring+=">";
this.asString=infostring;
}

var floweridcounter = 0; //UGH YUK
function makeflower(x, y, petallevel, ringlevel, collevel, sizeparam){
    this.idno=floweridcounter;
    floweridcounter++;
this.x=x;
this.y=y;
this.petals=petallevel;
this.ring=ringlevel;
this.collevel = collevel;
    if(stimcol[whichtrial]=="red") this.colstring="#"+collevel.toString(16)+"0000";
    if(stimcol[whichtrial]=="green")this.colstring="#00"+collevel.toString(16)+"00";
    if(stimcol[whichtrial]=="blue")this.colstring="#0000"+collevel.toString(16);
this.size = sizeparam;
    this.toString=function(){return petallevel+":"+ringlevel+":"+collevel+":"+sizeparam;}
}

function drawflower(aflower, acanvas){
var ctx=acanvas.getContext("2d");
ctx.clearRect(0,0,canvaswidth,canvasheight);
ctx.lineWidth=5;
    if(knownids.indexOf(aflower.idno)>-1){
	if(currentrule.passes(aflower)){ctx.fillStyle="#ff0000";}
	else {ctx.fillStyle="#0000ff";}
	ctx.globalAlpha=.3;
	ctx.fillRect(0,0,canvaswidth,canvasheight);
	ctx.globalAlpha=1;
    }

ctx.fillStyle=aflower.colstring;
ctx.strokeStyle=aflower.colstring;

ctx.beginPath();
ctx.arc(aflower.x,aflower.y,aflower.ring,0,2*Math.PI)
ctx.stroke();

switch(aflower.petals){
case 2:
ctx.moveTo(aflower.x,aflower.y);
ctx.lineTo(aflower.x,aflower.y-aflower.size*2);
ctx.moveTo(aflower.x,aflower.y);
ctx.lineTo(aflower.x,aflower.y+aflower.size*2);
break;
case 3:
ctx.moveTo(aflower.x,aflower.y);
ctx.lineTo(aflower.x,aflower.y-aflower.size*2);
ctx.moveTo(aflower.x,aflower.y);
ctx.lineTo(aflower.x-aflower.size*2,aflower.y+aflower.size);
ctx.moveTo(aflower.x,aflower.y);
ctx.lineTo(aflower.x+aflower.size*2,aflower.y+aflower.size);
break;
case 4:
ctx.moveTo(aflower.x,aflower.y-aflower.size*2);
ctx.lineTo(aflower.x,aflower.y+aflower.size*2);
ctx.moveTo(aflower.x-aflower.size*2,aflower.y);
ctx.lineTo(aflower.x+aflower.size*2,aflower.y);
break;
case 5:
var r = aflower.size*2;
var slice = 2*Math.PI/5;
var theta = [0,slice,2*slice,3*slice,4*slice];
ctx.moveTo(aflower.x,aflower.y);
ctx.lineTo(aflower.x+r*Math.cos(theta[0]),aflower.y+r*Math.sin(theta[0]));
ctx.moveTo(aflower.x,aflower.y);
ctx.lineTo(aflower.x+r*Math.cos(theta[1]),aflower.y+r*Math.sin(theta[1]));
ctx.moveTo(aflower.x,aflower.y);
ctx.lineTo(aflower.x+r*Math.cos(theta[2]),aflower.y+r*Math.sin(theta[2]));
ctx.moveTo(aflower.x,aflower.y);
ctx.lineTo(aflower.x+r*Math.cos(theta[3]),aflower.y+r*Math.sin(theta[3]));
ctx.moveTo(aflower.x,aflower.y);
ctx.lineTo(aflower.x+r*Math.cos(theta[4]),aflower.y+r*Math.sin(theta[4]));
break;
}
ctx.stroke();

}//end drawflower

function runif(a, b){
return a+Math.random()*(b-a);
};

function rndcol(min, max, whichcol){//vary one colour at a time, 'which' from ["red","green","blue"].
var defaultcol = "00";
var colstring = "";
var acolour = Math.floor(runif(parseInt(min,16),parseInt(max,16))).toString(16);
if(whichcol=="red")colstring="#"+acolour+defaultcol+defaultcol;
if(whichcol=="green")colstring="#"+defaultcol+acolour+defaultcol;
if(whichcol=="blue")colstring="#"+defaultcol+defaultcol+acolour;
return colstring;
};


function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

//drawing functions

function sampletable(trows, tcols, type){
var t = "<table style=\"border:1px solid black\">";
for(var i=0;i<trows;i++){
t+="<tr>";
for(var j=0;j<tcols;j++){
t+="<td>";
t+="<canvas id=\""+type+i+"_"+j+"\"width=\""+canvaswidth+"\", height=\""+canvasheight+"\"></canvas>";
t+="</td>";
}
t+="</tr>";
}
t+="</table>";
    return t;
}

function getSample(){
    var population = [];
    //makeflower(x, y, petallevel, ringlevel, collevel, sizeparam){
    for(var i=0;i<populationsize;i++)population.push(new makeflower(canvaswidth/2,canvasheight/2,shuffle(petallevels)[0],shuffle(ringlevels)[0],shuffle(collevels)[0],sizeparam));
    
    var near = [];
    var far = [];
    var nearindex=0;
    var farindex=0;
    for(var i=0;i<populationsize;i++){
	if(currentrule.passes(population[i]))near.push(population[i])
	else far.push(population[i])
    }
    if(near.length<2||far.length<2)getSample();//?
    var retsample = {
	'pos':shuffle(near),
	'neg':shuffle(far)
    };
    
    return retsample;
}


function nextExample(type){
var retval;
if(poscounter>=sample.pos.length||negcounter>=sample.neg.length){
sample=getSample();
poscounter=0;
negcounter=0;
}
if(type=="pos"){retval=sample.pos[poscounter]; poscounter++;}
else {retval=sample.neg[negcounter]; negcounter++;}

return retval;
}

var richgroup=[];
var poorgroup=[];
var hmtotal = 0;
var hmrich=0;
var currentrule;//=rules75[0];

function swapout(cellcount,origin){
    if(origin=="pos"){
	allactions.push("p");
	if(cellcount>=richgroup.length)return;
	var temp = richgroup[cellcount];
	poorgroup.push(temp);
	richgroup.splice(cellcount,1);
    }
    if(origin=="neg"){
	allactions.push("n");
	if(cellcount>=poorgroup.length)return;
	var temp=poorgroup[cellcount];
	richgroup.push(temp);
	poorgroup.splice(cellcount,1);
    }
    redraw();
}
function redraw(){
	listtodrawntable(8,8,richgroup,"pos");
	listtodrawntable(8,8,poorgroup,"neg");
}

function listtodrawntable(rows,cols,planktonlist,targdiv){
    var tstr="<table>"
    var cellcount=0;
    for(var row=0;row<rows;row++){
	tstr+="<tr>";
	for(var col=0;col<cols;col++){
	    tstr+="<td style=\"border:1px solid black\"><canvas onclick=\"swapout("+cellcount+",'"+targdiv+"')\" width=\""+canvaswidth+"\", height=\""+canvasheight+"\" id=\""+targdiv+row+"_"+col+"\"</td>";
	    cellcount++;
	}
	tstr+="</tr>"
    }
    tstr+="</table>";
    
    var thisrow=0;
    var thiscol=0;
    function nextcell(){
	thiscol=thiscol+1;
	if(thiscol>=cols){thiscol=0;thisrow++;}
    }
    document.getElementById(targdiv).innerHTML=tstr;
    for(var i=0;i<planktonlist.length;i++){
	drawflower(planktonlist[i],document.getElementById(targdiv+thisrow+"_"+thiscol));
	nextcell();
    }//for each plankton in list
}

function seeExample(type){
    var switchflag=false;
    if(type=="pos"){
	allactions.push("P");
	requests.push(1);
	richids = shuffle(richids);
	for(var i=0;i<richids.length;i++){
	    if(knownids.indexOf(richids[i])<0){
		knownids.push(richids[i]);
		for(var j=0;j<poorgroup.length;j++){
		    if(poorgroup[j].idno==richids[i]){
			//richgroup.push(poorgroup[j]); //don't auto move stuff: closer to battleships setup.
			//poorgroup.splice(j,1);
			switches.push(1);
			switchflag=true;
		    }//if found rich-example, swap into richgroup
		}//for everything currently in poor-group
		if(switchflag==true)switches.push(0);
		break;
	    }//if richids[i] is not already in knownids
	}//for each index in richids 
    }//if pos requested
    else{
	allactions.push("N");
	requests.push(0);
	poorids=shuffle(poorids);
	for(var i=0;i<poorids.length;i++){
	    if(knownids.indexOf(poorids[i])<0){
		knownids.push(poorids[i]);
		for(var j=0;j<richgroup.length;j++){
		    if(richgroup[j].idno==poorids[i]){
			//poorgroup.push(richgroup[j]); //don't auto-move stuff, closer to battleships.
			//richgroup.splice(j,1);
			switches.push(1);
			switchflag=true;
		    }//if found poor example, swap into poor group
		}//for everything currently in rich group
		if(switchflag==false)switches.push(0);
		break;
	    }//if poorids[i] not already in knownids
	}//for each index in poorids
    }//if neg requested
    redraw();
}//end seeExample

function showtrial(){
    richgroup.length=0;
    poorgroup.length=0;
    initgroups();//assumes everything is starting in richgroup...

    richgroup=shuffle(richgroup);
    poorgroup=shuffle(poorgroup);
//    rebalance();

    var posbutton = "<button onclick=\"seeExample('pos')\"><p>Highlight a</p><p> <strong>selenoid rich</strong></p>example</button>";
    var negbutton = "<button onclick=\"seeExample('neg')\"><p>Highlight a</p> <p><strong> selenoid poor</strong></p> example</button>";
    scroll(0,0);
    var atrial="<table class=\"centered\""; //style=\"border:1px solid black\">";
    atrial+="<tr><td colspan=\"3\">";
    atrial+="<h3>"
    if(whichtrial==0)atrial+="This is a practice run";
    else atrial += "Pattern"+whichtrial;
    atrial+="</h3>";
    atrial+="Move plankton between groups by clicking on them, or request examples using the buttons below. When you're confident you have moved all the plankton to the correct group, click 'Submit answer' to continue. ";
    atrial+="</td></tr>";
    atrial+="<tr>"
    if(posleft)atrial+="<td style=\"float:left\"><h4>Selenoid rich group: "+percentrich+"% ("+64*percentrich/100/8+" full rows) </h4></td><td></td><td style=\"float:right\"><h4>Selenoid poor group: "+(100-percentrich)+"% ("+64*(100-percentrich)/100/8+" full rows)</h4></td>";
    else atrial+="<td style=\"float:left\"><h4>Selenoid poor group:"+(100-percentrich)+"% ("+64*(100-percentrich)/100/8+" full rows)</h4></td><td></td><td style=\"float:right\"><h4>Selenoid rich group:"+percentrich+"% ("+64*percentrich/100/8+" full rows)</h4></td>";
    atrial+="</tr>"
    atrial+="<tr>";
    atrial+="<td>";
    if(posleft)atrial+="<div id=\"pos\"></div>";
    else atrial+="<div id=\"neg\"></div>";
    atrial+="</td>";
    atrial+="<td>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</td>";//YUK!!!
    atrial+="<td>";
    if(posleft)atrial+="<div id=\"neg\"></div>";
    else atrial+="<div id=\"pos\"></div>";
    atrial+="</td>";
    atrial+="</tr>";
    atrial+="<tr>"
    if(posleft)atrial+="<td style=\"float:left\">"+posbutton+"</td><td></td><td style=\"float:right\">"+negbutton+"</td>";
    else atrial+="<td style=\"float:left\">"+negbutton+"</td><td></td><td style=\"float:right\">"+posbutton+"</td>";
    atrial+="</tr>"
    atrial+="<tr><td colspan=\"3\"><button id=\"submitans\" onclick=\"submit()\">Submit answer</button></td></tr>";
    atrial+="</table>";
    document.getElementById("viewdiv").innerHTML=atrial;
    redraw();
}

function submit(){
    allactions.push("S");
//check the submission is even possible...
    if(richgroup.length!=64*percentrich/100){
	alert("Your answer has the wrong number of plankton in each group, so it can't possibly be correct.Please move some plankton from the overfull side to the underfull side and reconsider your answer before continuing.");
	return;
    }
    for(var i=0; i<richgroup.length;i++){
	if(knownids.indexOf(richgroup[i].idno)>=0&&richids.indexOf(richgroup[i].idno)<0){
	    alert("Your answer has some known examples in the wrong group, so it can't possibly be correct. Please move all known examples to the correct side and reconsider your answer before continuing.");
	    return;
	}
    }
    for(var i=0; i<poorgroup.length;i++){
	if(knownids.indexOf(poorgroup[i].idno)>1&&richids.indexOf(poorgroup[i].idno)>=0){
	    alert("Your answer has some known examples in the wrong group, so it can't possibly be correct. Please move all known examples to the correct side and reconsider your answer before continuing.");
	    return;
	}
    }
feedback()
}
function feedback(){
    correctcount=0;
    for(var i=0;i<richgroup.length;i++)if(richids.indexOf(richgroup[i].idno)>=0)correctcount++;
    for(var i=0;i<poorgroup.length;i++)if(richids.indexOf(poorgroup[i].idno)<0)correctcount++;
    var fdbk="<p>You got "+correctcount+" out of "+hmtotal+" in the right group.</p>"
    fdbk+=""+knownids.length+" of these were known examples, so your successful-inference score on this round is <h3>"+100*(correctcount-knownids.length)/hmtotal+"%</h3><br/><button onclick=\"tweenscreen()\">Continue!</button>";
    savetrial();
    document.getElementById("viewdiv").innerHTML=fdbk;
}

function nexttrial(){//SAVE DATA? reset everything that needs it...
whichtrial++;
if(whichtrial==3){finish(); return}
    setRule();
//drawposrow = 0;
//drawposcol = 0;
//drawnegrow = 0;
//drawnegcol = 0;
sample=getSample();
poscounter = 0;
negcounter = 0;

    hmtotal=0;
    richgroup.length=0;
    poorgroup.length=0;
    knownids.length=0;
    hmrich=0;
    richids.length=0;
    poorids.length=0;
showtrial();
}
function finish(){
    var symbols=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","j","k","m","n","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","J","K","L","M","N","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9"];
    var completioncode = "AD"+shuffle(symbols)[0]+shuffle(symbols)[0]+"9"+shuffle(symbols)[0]+shuffle(symbols)[0]+shuffle(symbols)[0];
document.getElementById("viewdiv").innerHTML="<p>You're done! Thank you for participating!</p><p>To claim this HIT please go back to Mechanical Turk and enter the completion code below.</p>Your completion code is: "+completioncode+"</p>";
}

var instructionbutton = "<button id=\"instbutton\" onclick=\"instructions()\">Continue</button>";
var instructionchapters= ["<p>This task asks you to help a fictitious company Xabanta with their selenoid collecting operations. The whole task will take about 10 minutes. That includes a short quiz about these instructions, and three runs through a classification task where your goal is to figure out how to tell the difference between two different kinds of plankton.</p>"+instructionbutton,
			   "<p>In this study, some plankton are selenoid-rich and some are selenoid-poor. Xabanta has discovered a medical use for selenoid in making artificial corneas, so it's interested in collecting selenoid-rich plankton.</p><p>Xabanta's research ship collects large amounts of plankton for you to study, and can pre-sort the sample into selenoid-rich and selenoid-poor groups. Individual plankton can take on a variety of different appearances. They vary in colour, number of petal-like arms, and body size. Previous work has shown that about "+percentrich+"% of the plankton are selenoid-rich.</p>"+instructionbutton,
			   "<p>A typical unsorted sample of plankton might look something like this.<img style=\"display:block; margin-left:auto; margin-right:auto\" src=\"js/planktonworld.png\"></p><p>Your job is to look through a <em>sorted</em> sample and work out what kinds of plankton are selenoid-rich. Each of the three runs will be with a different colour plankton, with a different selenoid pattern.</p>"+instructionbutton,
			   "<p>The main task has two parts. The first part is the research phase. You'll be able to request examples of either selenoid-rich or selenoid-poor plankton using the buttons in the centre of the screen. You can only view up to ten example plankton, so choose carefully! When you're done, click 'Go to test!' button at the lower centre of the screen to go to the second part, the test phase. You'll be shown new plankton examples and asked to label them as selenoid-rich or selenoid-poor. After you've labelled all the plankton, you'll be given a score that you can maximize by getting a high accuracy on the test phase while asking for few examples during the research phase. </p><p>You'll get three shots at the main task: the first one is a practice run, so you can try out the buttons and see what the plankton look like. The pattern of which plankton are selenoid-rich will change each time, so you'll have to figure it out again in each run, but the rest of the task is the same.</p>"+instructionbutton,
"<p><p>On the next page, you'll be asked some questions about these instructions. There are also a couple of demographics questions for our records. Then there will be a practice run and two real runs through the main task. All together, the whole process is expected to take around 10 minutes.</p>This is part of a study being run by the University of Adelaide. By clicking start, you are agreeing to take part in it. You should know that you're free to withdraw at any time (although you'll only be paid on completion), and that although data gained from this study may be published, you will not be identified and your personal details will not be divulged, nor will anything be linked to your Amazon ID.</p><br/><button onclick=\"instructionquiz()\">Start!</button><br/><p style=\"font-size:.8em\">Please direct any questions about this study to the principle investigator, Steven Langsford (steven.langsford@adelaide.edu.au). For any questions regarding the ethics of the study, please contact the convenor of the Subcommittee for Human Research in the School of Psychology at the University of Adelaide, Dr Paul Delfabbro (+61)08 8313 4936.</p>"
];

var instructioncounter=0;

function instructions(){
    document.getElementById("viewdiv").innerHTML=instructionchapters[instructioncounter];
    instructioncounter++;
// document.getElementById("viewdiv").innerHTML= "<p>This task asks you to help a fictitious company Xabanta with their selenoid collecting operations. The whole task will take about 10 minutes. That includes a short quiz about these instructions, and three runs through a classification task where your goal is to figure out how to tell the difference between two different kinds of plankton. In this study, some plankton are selenoid-rich and some are selenoid-poor. Xabanta has discovered a medical use for selenoid in making artificial corneas, so it's interested in collecting selenoid-rich plankton.</p><p>Xabanta's research ship collects large amounts of plankton for you to study, and can pre-sort the sample into selenoid-rich and selenoid-poor groups. There are many different species of plankton. You can tell the species apart by looking at their colour, number of petal-like arms, and body size. Each species has its own unique combination of these features. The different species are equally common, so all the combinations of features are equally likely. Previous work has shown that "+percentrich+"% percent of species are selenoid rich.</p><p>An unsorted sample of plankton might look something like this.<img style=\"display:block; margin-left:auto; margin-right:auto\" src=\"js/planktonworld.png\"></p><p>Your job is to look through a <em>sorted</em> sample and work out what kinds of plankton are selenoid-rich. Each of the three runs will be with a different colour plankton, with a different selenoid pattern.</p><p>The main task has two parts. The first part is the research phase. You'll be able to request examples of either selenoid-rich or selenoid-poor plankton using the buttons in the centre of the screen. You can only view 10 examples, so choose carefully! To continue, hit the 'Go to test!' button at the lower centre of the screen to go to the second part, the test phase. You'll be shown new plankton examples and asked to label them as selenoid-rich or selenoid-poor. After you've labelled all the plankton, you'll be given a score that you can maximize by getting a high accuracy on the test phase while asking for few examples during the research phase. </p><p>You'll get three shots at the main task: the first one is a practice run, so you can try out the buttons and see what the plankton look like. The pattern of which plankton are selenoid-rich will change each time, so you'll have to figure it out again in each run, but the rest of the task is the same.</p><p>On the next page, you'll be asked some questions about these instructions. There are also a couple of demographics questions for our records. Then there will be a practice run and two real runs through the main task. All together, the whole process is expected to take around 10 minutes.</p><p>This is part of a study being run by the University of Adelaide. By clicking start, you are agreeing to take part in it. You should know that you're free to withdraw at any time (although you'll only be paid on completion), and that although data gained from this study may be published, you will not be identified and your personal details will not be divulged, nor will anything be linked to your Amazon ID.</p><br/><button onclick=\"instructionquiz()\">Start!</button><br/><p style=\"font-size:.8em\">Please direct any questions about this study to the principle investigator, Steven Langsford (steven.langsford@adelaide.edu.au). For any questions regarding the ethics of the study, please contact the convenor of the Subcommittee for Human Research in the School of Psychology at the University of Adelaide, Dr Paul Delfabbro (+61)08 8313 4936.</p>";
}

function demographics(){
document.getElementById("viewdiv").innerHTML= "<table><tr><td>Please fill out these demographic details. This is just for our records, and it is all kept separate from the study data. As long as you finish the experiment you will get paid no matter what you put here, so please be honest.<br/></td></tr>"+
"<tr><td>&nbsp</td></tr>"+
"<tr><td>"+
"Gender: <input type=\"radio\" name=\"gender\" id=\"male\" value=\"male\">&nbspMale&nbsp&nbsp"+
"<input type=\"radio\" name=\"gender\" id=\"fem\" value=\"female\">&nbspFemale&nbsp&nbsp"+
"<input type=\"radio\" name=\"gender\" id=\"other\" value=\"other\">&nbspOther"+
"</td></tr>"+
"<tr><td>"+
"Age:<input type=\"text\" id=\"age\">"+
"</td></tr>"+
"<tr><td>"+
"Native Language(s):<input type=\"text\" id=\"language\">"+
"</td></tr>"+
"<tr><td>"+
"Country you currently live in:"+countrypicker()+
"</td></tr>"+
"<tr><td>"+
"<button onclick=demographicsvalidate()>Continue</button>"+
"</td></tr>"+
"</table>";
}

function countrypicker(){
return "<select data-placeholder=\"Choose a Country...\" id=\"countrypicker\">"+
"  <option value=\"\"></option> "+
"  <option value=\"United States\">United States</option> "+
"  <option value=\"United Kingdom\">United Kingdom</option> "+
"  <option value=\"Afghanistan\">Afghanistan</option> "+
"  <option value=\"Albania\">Albania</option> "+
"  <option value=\"Algeria\">Algeria</option> "+
"  <option value=\"American Samoa\">American Samoa</option> "+
"  <option value=\"Andorra\">Andorra</option> "+
"  <option value=\"Angola\">Angola</option> "+
"  <option value=\"Anguilla\">Anguilla</option> "+
"  <option value=\"Antarctica\">Antarctica</option> "+
"  <option value=\"Antigua and Barbuda\">Antigua and Barbuda</option> "+
"  <option value=\"Argentina\">Argentina</option> "+
"  <option value=\"Armenia\">Armenia</option> "+
"  <option value=\"Aruba\">Aruba</option> "+
"  <option value=\"Australia\">Australia</option> "+
"  <option value=\"Austria\">Austria</option> "+
"  <option value=\"Azerbaijan\">Azerbaijan</option> "+
"  <option value=\"Bahamas\">Bahamas</option> "+
"  <option value=\"Bahrain\">Bahrain</option> "+
"  <option value=\"Bangladesh\">Bangladesh</option> "+
"  <option value=\"Barbados\">Barbados</option> "+
"  <option value=\"Belarus\">Belarus</option> "+
"  <option value=\"Belgium\">Belgium</option> "+
"  <option value=\"Belize\">Belize</option> "+
"  <option value=\"Benin\">Benin</option> "+
"  <option value=\"Bermuda\">Bermuda</option> "+
"  <option value=\"Bhutan\">Bhutan</option> "+
"  <option value=\"Bolivia\">Bolivia</option> "+
"  <option value=\"Bosnia and Herzegovina\">Bosnia and Herzegovina</option> "+
"  <option value=\"Botswana\">Botswana</option> "+
"  <option value=\"Bouvet Island\">Bouvet Island</option> "+
"  <option value=\"Brazil\">Brazil</option> "+
"  <option value=\"British Indian Ocean Territory\">British Indian Ocean Territory</option> "+
"  <option value=\"Brunei Darussalam\">Brunei Darussalam</option> "+
"  <option value=\"Bulgaria\">Bulgaria</option> "+
"  <option value=\"Burkina Faso\">Burkina Faso</option> "+
"  <option value=\"Burundi\">Burundi</option> "+
"  <option value=\"Cambodia\">Cambodia</option> "+
"  <option value=\"Cameroon\">Cameroon</option> "+
"  <option value=\"Canada\">Canada</option> "+
"  <option value=\"Cape Verde\">Cape Verde</option> "+
"  <option value=\"Cayman Islands\">Cayman Islands</option> "+
"  <option value=\"Central African Republic\">Central African Republic</option> "+
"  <option value=\"Chad\">Chad</option> "+
"  <option value=\"Chile\">Chile</option> "+
"  <option value=\"China\">China</option> "+
"  <option value=\"Christmas Island\">Christmas Island</option> "+
"  <option value=\"Cocos (Keeling) Islands\">Cocos (Keeling) Islands</option> "+
"  <option value=\"Colombia\">Colombia</option> "+
"  <option value=\"Comoros\">Comoros</option> "+
"  <option value=\"Congo\">Congo</option> "+
"  <option value=\"Congo The Democratic Republic of The\">Congo, The Democratic Republic of The</option> "+
"  <option value=\"Cook Islands\">Cook Islands</option> "+
"  <option value=\"Costa Rica\">Costa Rica</option> "+
"  <option value=\"Cote D'ivoire\">Cote D'ivoire</option> "+
"  <option value=\"Croatia\">Croatia</option> "+
"  <option value=\"Cuba\">Cuba</option> "+
"  <option value=\"Cyprus\">Cyprus</option> "+
"  <option value=\"Czech Republic\">Czech Republic</option> "+
"  <option value=\"Denmark\">Denmark</option> "+
"  <option value=\"Djibouti\">Djibouti</option> "+
"  <option value=\"Dominica\">Dominica</option> "+
"  <option value=\"Dominican Republic\">Dominican Republic</option> "+
"  <option value=\"Ecuador\">Ecuador</option> "+
"  <option value=\"Egypt\">Egypt</option> "+
"  <option value=\"El Salvador\">El Salvador</option> "+
"  <option value=\"Equatorial Guinea\">Equatorial Guinea</option> "+
"  <option value=\"Eritrea\">Eritrea</option> "+
"  <option value=\"Estonia\">Estonia</option> "+
"  <option value=\"Ethiopia\">Ethiopia</option> "+
"  <option value=\"Falkland Islands (Malvinas)\">Falkland Islands (Malvinas)</option> "+
"  <option value=\"Faroe Islands\">Faroe Islands</option> "+
"  <option value=\"Fiji\">Fiji</option> "+
"  <option value=\"Finland\">Finland</option> "+
"  <option value=\"France\">France</option> "+
"  <option value=\"French Guiana\">French Guiana</option> "+
"  <option value=\"French Polynesia\">French Polynesia</option> "+
"  <option value=\"French Southern Territories\">French Southern Territories</option> "+
"  <option value=\"Gabon\">Gabon</option> "+
"  <option value=\"Gambia\">Gambia</option> "+
"  <option value=\"Georgia\">Georgia</option> "+
"  <option value=\"Germany\">Germany</option> "+
"  <option value=\"Ghana\">Ghana</option> "+
"  <option value=\"Gibraltar\">Gibraltar</option> "+
"  <option value=\"Greece\">Greece</option> "+
"  <option value=\"Greenland\">Greenland</option> "+
"  <option value=\"Grenada\">Grenada</option> "+
"  <option value=\"Guadeloupe\">Guadeloupe</option> "+
"  <option value=\"Guam\">Guam</option> "+
"  <option value=\"Guatemala\">Guatemala</option> "+
"  <option value=\"Guinea\">Guinea</option> "+
"  <option value=\"Guinea-bissau\">Guinea-bissau</option> "+
"  <option value=\"Guyana\">Guyana</option> "+
"  <option value=\"Haiti\">Haiti</option> "+
"  <option value=\"Heard Island and Mcdonald Islands\">Heard Island and Mcdonald Islands</option> "+
"  <option value=\"Holy See (Vatican City State)\">Holy See (Vatican City State)</option> "+
"  <option value=\"Honduras\">Honduras</option> "+
"  <option value=\"Hong Kong\">Hong Kong</option> "+
"  <option value=\"Hungary\">Hungary</option> "+
"  <option value=\"Iceland\">Iceland</option> "+
"  <option value=\"India\">India</option> "+
"  <option value=\"Indonesia\">Indonesia</option> "+
"  <option value=\"Iran Islamic Republic of\">Iran, Islamic Republic of</option> "+
"  <option value=\"Iraq\">Iraq</option> "+
"  <option value=\"Ireland\">Ireland</option> "+
"  <option value=\"Israel\">Israel</option> "+
"  <option value=\"Italy\">Italy</option> "+
"  <option value=\"Jamaica\">Jamaica</option> "+
"  <option value=\"Japan\">Japan</option> "+
"  <option value=\"Jordan\">Jordan</option> "+
"  <option value=\"Kazakhstan\">Kazakhstan</option> "+
"  <option value=\"Kenya\">Kenya</option> "+
"  <option value=\"Kiribati\">Kiribati</option> "+
"  <option value=\"Korea Democratic People's Republic of\">Korea, Democratic People's Republic of</option> "+
"  <option value=\"Korea Republic of\">Korea, Republic of</option> "+
"  <option value=\"Kuwait\">Kuwait</option> "+
"  <option value=\"Kyrgyzstan\">Kyrgyzstan</option> "+
"  <option value=\"Lao People's Democratic Republic\">Lao People's Democratic Republic</option> "+
"  <option value=\"Latvia\">Latvia</option> "+
"  <option value=\"Lebanon\">Lebanon</option> "+
"  <option value=\"Lesotho\">Lesotho</option> "+
"  <option value=\"Liberia\">Liberia</option> "+
"  <option value=\"Libyan Arab Jamahiriya\">Libyan Arab Jamahiriya</option> "+
"  <option value=\"Liechtenstein\">Liechtenstein</option> "+
"  <option value=\"Lithuania\">Lithuania</option> "+
"  <option value=\"Luxembourg\">Luxembourg</option> "+
"  <option value=\"Macao\">Macao</option> "+
"  <option value=\"Macedonia The Former Yugoslav Republic of\">Macedonia, The Former Yugoslav Republic of</option> "+
"  <option value=\"Madagascar\">Madagascar</option> "+
"  <option value=\"Malawi\">Malawi</option> "+
"  <option value=\"Malaysia\">Malaysia</option> "+
"  <option value=\"Maldives\">Maldives</option> "+
"  <option value=\"Mali\">Mali</option> "+
"  <option value=\"Malta\">Malta</option> "+
"  <option value=\"Marshall Islands\">Marshall Islands</option> "+
"  <option value=\"Martinique\">Martinique</option> "+
"  <option value=\"Mauritania\">Mauritania</option> "+
"  <option value=\"Mauritius\">Mauritius</option> "+
"  <option value=\"Mayotte\">Mayotte</option> "+
"  <option value=\"Mexico\">Mexico</option> "+
"  <option value=\"Micronesia Federated States of\">Micronesia, Federated States of</option> "+
"  <option value=\"Moldova Republic of\">Moldova, Republic of</option> "+
"  <option value=\"Monaco\">Monaco</option> "+
"  <option value=\"Mongolia\">Mongolia</option> "+
"  <option value=\"Montenegro\">Montenegro</option>"+
"  <option value=\"Montserrat\">Montserrat</option> "+
"  <option value=\"Morocco\">Morocco</option> "+
"  <option value=\"Mozambique\">Mozambique</option> "+
"  <option value=\"Myanmar\">Myanmar</option> "+
"  <option value=\"Namibia\">Namibia</option> "+
"  <option value=\"Nauru\">Nauru</option> "+
"  <option value=\"Nepal\">Nepal</option> "+
"  <option value=\"Netherlands\">Netherlands</option> "+
"  <option value=\"Netherlands Antilles\">Netherlands Antilles</option> "+
"  <option value=\"New Caledonia\">New Caledonia</option> "+
"  <option value=\"New Zealand\">New Zealand</option> "+
"  <option value=\"Nicaragua\">Nicaragua</option> "+
"  <option value=\"Niger\">Niger</option> "+
"  <option value=\"Nigeria\">Nigeria</option> "+
"  <option value=\"Niue\">Niue</option> "+
"  <option value=\"Norfolk Island\">Norfolk Island</option> "+
"  <option value=\"Northern Mariana Islands\">Northern Mariana Islands</option> "+
"  <option value=\"Norway\">Norway</option> "+
"  <option value=\"Oman\">Oman</option> "+
"  <option value=\"Pakistan\">Pakistan</option> "+
"  <option value=\"Palau\">Palau</option> "+
"  <option value=\"Palestinian Territory Occupied\">Palestinian Territory, Occupied</option> "+
"  <option value=\"Panama\">Panama</option> "+
"  <option value=\"Papua New Guinea\">Papua New Guinea</option> "+
"  <option value=\"Paraguay\">Paraguay</option> "+
"  <option value=\"Peru\">Peru</option> "+
"  <option value=\"Philippines\">Philippines</option> "+
"  <option value=\"Pitcairn\">Pitcairn</option> "+
"  <option value=\"Poland\">Poland</option> "+
"  <option value=\"Portugal\">Portugal</option> "+
"  <option value=\"Puerto Rico\">Puerto Rico</option> "+
"  <option value=\"Qatar\">Qatar</option> "+
"  <option value=\"Reunion\">Reunion</option> "+
"  <option value=\"Romania\">Romania</option> "+
"  <option value=\"Russian Federation\">Russian Federation</option> "+
"  <option value=\"Rwanda\">Rwanda</option> "+
"  <option value=\"Saint Helena\">Saint Helena</option> "+
"  <option value=\"Saint Kitts and Nevis\">Saint Kitts and Nevis</option> "+
"  <option value=\"Saint Lucia\">Saint Lucia</option> "+
"  <option value=\"Saint Pierre and Miquelon\">Saint Pierre and Miquelon</option> "+
"  <option value=\"Saint Vincent and The Grenadines\">Saint Vincent and The Grenadines</option> "+
"  <option value=\"Samoa\">Samoa</option> "+
"  <option value=\"San Marino\">San Marino</option> "+
"  <option value=\"Sao Tome and Principe\">Sao Tome and Principe</option> "+
"  <option value=\"Saudi Arabia\">Saudi Arabia</option> "+
"  <option value=\"Senegal\">Senegal</option> "+
"  <option value=\"Serbia\">Serbia</option> "+
"  <option value=\"Seychelles\">Seychelles</option> "+
"  <option value=\"Sierra Leone\">Sierra Leone</option> "+
"  <option value=\"Singapore\">Singapore</option> "+
"  <option value=\"Slovakia\">Slovakia</option> "+
"  <option value=\"Slovenia\">Slovenia</option> "+
"  <option value=\"Solomon Islands\">Solomon Islands</option> "+
"  <option value=\"Somalia\">Somalia</option> "+
"  <option value=\"South Africa\">South Africa</option> "+
"  <option value=\"South Georgia and The South Sandwich Islands\">South Georgia and The South Sandwich Islands</option> "+
"  <option value=\"South Sudan\">South Sudan</option> "+
"  <option value=\"Spain\">Spain</option> "+
"  <option value=\"Sri Lanka\">Sri Lanka</option> "+
"  <option value=\"Sudan\">Sudan</option> "+
"  <option value=\"Suriname\">Suriname</option> "+
"  <option value=\"Svalbard and Jan Mayen\">Svalbard and Jan Mayen</option> "+
"  <option value=\"Swaziland\">Swaziland</option> "+
"  <option value=\"Sweden\">Sweden</option> "+
"  <option value=\"Switzerland\">Switzerland</option> "+
"  <option value=\"Syrian Arab Republic\">Syrian Arab Republic</option> "+
"  <option value=\"Taiwan Republic of China\">Taiwan, Republic of China</option> "+
"  <option value=\"Tajikistan\">Tajikistan</option> "+
"  <option value=\"Tanzania United Republic of\">Tanzania, United Republic of</option> "+
"  <option value=\"Thailand\">Thailand</option> "+
"  <option value=\"Timorleste\">Timor-leste</option> "+
"  <option value=\"Togo\">Togo</option> "+
"  <option value=\"Tokelau\">Tokelau</option> "+
"  <option value=\"Tonga\">Tonga</option> "+
"  <option value=\"Trinidad and Tobago\">Trinidad and Tobago</option> "+
"  <option value=\"Tunisia\">Tunisia</option> "+
"  <option value=\"Turkey\">Turkey</option> "+
"  <option value=\"Turkmenistan\">Turkmenistan</option> "+
"  <option value=\"Turks and Caicos Islands\">Turks and Caicos Islands</option> "+
"  <option value=\"Tuvalu\">Tuvalu</option> "+
"  <option value=\"Uganda\">Uganda</option> "+
"  <option value=\"Ukraine\">Ukraine</option> "+
"  <option value=\"United Arab Emirates\">United Arab Emirates</option> "+
"  <option value=\"United Kingdom\">United Kingdom</option> "+
"  <option value=\"United States\">United States</option> "+
"  <option value=\"United States Minor Outlying Islands\">United States Minor Outlying Islands</option> "+
"  <option value=\"Uruguay\">Uruguay</option> "+
"  <option value=\"Uzbekistan\">Uzbekistan</option> "+
"  <option value=\"Vanuatu\">Vanuatu</option> "+
"  <option value=\"Venezuela\">Venezuela</option> "+
"  <option value=\"Viet Nam\">Viet Nam</option> "+
"  <option value=\"Virgin Islands British\">Virgin Islands, British</option> "+
"  <option value=\"Virgin Islands U.S.\">Virgin Islands, U.S.</option> "+
"  <option value=\"Wallis and Futuna\">Wallis and Futuna</option> "+
"  <option value=\"Western Sahara\">Western Sahara</option> "+
"  <option value=\"Yemen\">Yemen</option> "+
"  <option value=\"Zambia\">Zambia</option> "+
"  <option value=\"Zimbabwe\">Zimbabwe</option>"+
	"</select>";
}

function instructionquiz(){
scroll(0,0);
var plausible = [25,50,75,90];

document.getElementById("viewdiv").innerHTML="<h3>Are you ready?</h3><br/>"+
"<strong>Which type of plankton is commercially valuable to Xabanta?</strong></br>"+
"<input type=\"radio\" name=\"value\" id=\"rich\" value=\"rich\"/>&nbsp Selenoid-rich<br/>"+
"<input type=\"radio\" name=\"value\" id=\"poor\" value=\"poor\"/>&nbsp Selenoid-poor<br/>"+
"<input type=\"radio\" name=\"value\" id=\"both\" value=\"both\"/>&nbsp Both<br/>"+
"<input type=\"radio\" name=\"value\" id=\"neither\" value=\"neither\"/>&nbsp Neither<br/></p>"+
"<p><strong>How common is the selenoid-rich plankton?</strong></br>"+
"<input type=\"radio\" name=\"howsparse\" id=\"fifteenpc\" value=\"10\"/>&nbsp 15% of plankton is selenoid-rich<br/>"+
"<input type=\"radio\" name=\"howsparse\" id=\"twentyfivepc\" value=\"30\"/>&nbsp 25% of plankton is selenoid-rich<br/>"+
"<input type=\"radio\" name=\"howsparse\" id=\"fiftypc\" value=\"50\"/>&nbsp 50% of plankton is selenoid-rich<br/>"+
"<input type=\"radio\" name=\"howsparse\" id=\"seventyfivepc\" value=\"70\"/>&nbsp 75% of plankton is selenoid-rich<br/>"+
"<input type=\"radio\" name=\"howsparse\" id=\"ninetypc\" value=\"90\"/>&nbsp 90% of plankton is selenoid-rich<br/>"+
"</p>"+
"<p><strong>What will you be asked to do in the research phase of the task?</strong></br>"+
"<input type=\"radio\" name=\"howsample\" id=\"timelimit\" value=\"time\"/>&nbsp View as many plankton examples as you can before the time runs out<br/>"+
"<input type=\"radio\" name=\"howsample\" id=\"limfifty\" value=\"fifty\"/>&nbsp Review 50 examples of each type of plankton<br/>"+
"<input type=\"radio\" name=\"howsample\" id=\"suibian\" value=\"suibian\"/>&nbsp Read descriptions of different types of plankton.<br/>"+
"<input type=\"radio\" name=\"howsample\" id=\"score\" value=\"score\"/>&nbsp View up to ten plankton examples, where you choose what type of example to view each time.<br/></p>"+
"<p><strong>What will you be asked to do in the test phase?</strong></br>"+
"<input type=\"radio\" name=\"howtest\" id=\"label\" value=\"label\"/>&nbsp Label new plankton examples as selenoid-rich or selenoid-poor.<br/>"+
"<input type=\"radio\" name=\"howtest\" id=\"pick\" value=\"pick\"/>&nbsp Pick out the selenoid-rich plankton from a field of random examples.<br/>"+
"<input type=\"radio\" name=\"howtest\" id=\"write\" value=\"write\"/>&nbsp Write a short paragraph describing what kind of plankton are selenoid-rich.<br/>"+
"<input type=\"radio\" name=\"howtest\" id=\"points\" value=\"points\"/>&nbsp The same task as in the research phase, but while being scored for accuracy.<br/></p>"+
"<p><strong>How much practice do you get?</strong></br>"+
"<input type=\"radio\" name=\"practice\" id=\"nopractice\" value=\"nopractice\"/>&nbsp No practice<br/>"+
"<input type=\"radio\" name=\"practice\" id=\"prrdiff\" value=\"prrdiff\"/>&nbsp One practice run, then two real test runs, each on different plankton with different selenoid patterns<br/>"+
"<input type=\"radio\" name=\"practice\" id=\"prrsame\" value=\"prrsame\"/>&nbsp One practice run, then two real test runs, all on the same plankton with the same selenoid pattern<br/>"+
"<input type=\"radio\" name=\"practice\" id=\"pprdiff\" value=\"pprdiff\"/>&nbsp Two practice runs, then one real test run, each on different plankton with different selenoid patterns<br/>"+
"<button onclick=\"quizvalidate()\">Begin!</button>";
}


function quizvalidate(){
    function whichrichnessradio(){
	if(percentrich==25) return "twentyfivepc";
	if(percentrich==50) return "fiftypc";
	if(percentrich==75) return "seventyfivepc";
    }
    var valid=document.getElementById("rich").checked && document.getElementById(whichrichnessradio()).checked && document.getElementById("score").checked && document.getElementById("label").checked && document.getElementById("prrdiff").checked;
if(valid){
    demographics();

}
else {
alert("You didn't answer all the questions correctly. Please read through the instructions and take the quiz again to continue.");
instructioncounter=0;
scroll(0,0);
instructions();
}
}

function demographicsvalidate(){
    var demostring = "";
    var genderchoice=document.getElementsByName("gender");
    var genderflag = false;
    for(var i=0;i<genderchoice.length;i++){
	if(genderchoice[i].checked){
	    demostring+=genderchoice[i].value+":";
	    genderflag=true;
	}
    }
    var age = document.getElementById("age").value;
    var ageflag=age.length>0;
    demostring+=age+":";
    var languagechoice = document.getElementById("language").value;
    var langflag = languagechoice.length>0;
    demostring+=languagechoice+":";
    var country = document.getElementById("countrypicker").value;
    var countryflag = country.length>0;
    demostring+=country+":";
    if(genderflag&&langflag&&ageflag&&countryflag){
	demographicinfo=demostring;
	showtrial();
    }    
    else alert("Please fill out all the fields.");
}

function tweenscreen(){
 var tweenmessage="<p>You're done with ";
 if(whichtrial==0)tweenmessage+="the practice run!";
 if(whichtrial==1) tweenmessage+="pattern 1!";
 if(whichtrial==2){finish(); return;}
 tweenmessage+=" Click continue to go to the next run. ";
 tweenmessage+="You're still trying to tell the difference between the valuable selenoid-rich and the useless selenoid-poor plankton, but this is a different type of plankton, with different selenoid patterns.</p><button onclick=\"nexttrial()\">Continue</button>"
    document.getElementById("viewdiv").innerHTML=tweenmessage;
}

function runExp(){
//RUN ON LOAD: ie main method
document.write("<div id=\"infodiv\"></div><br/><div id=\"viewdiv\"></div>");//divs must exist before fncalls

//instructions();//actual start point

//optional instrucion-skipping cheat: 38 is up arrow
//    document.onkeypress=function(e){
//	e = e||window.event;
//	if(e.keyCode==38)showtrial();//just go to task
//    };

//diag start points:
showtrial();//just go to task
//demographics();
//tweenscreen();
}

// save experiment data with ajax //from gaebase
function saveData(args) {
    (function (d) {
        $.post('submit',  {"content": JSON.stringify(d)});
    })(args);
}