//essential global vars inherited from old stim
var canvaswidth=50;
var canvasheight=50;
var stimcol=["green","red","blue"];
var whichtrial=0;

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

//NEW STUFF, NEW STIM
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

function makeflower(x, y, petallevel, ringlevel, collevel, sizeparam){
this.x=x;
this.y=y;
this.petals=petallevel;
this.ring=ringlevel;
this.collevel = collevel;
this.colstring = "#"+"00"+collevel.toString(16)+"00";//maybe order changeable, for diff-colour trials
this.size = sizeparam;
}

function drawflower(aflower, acanvas){
var ctx=acanvas.getContext("2d");
ctx.clearRect(0,0,canvaswidth,canvasheight);
ctx.lineWidth=5;

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

//RULES
var rules25 = shuffle([
//makerule(petalval,ringval,colval,petaltest,ringtest,coltest)
//petal 25%
new makerule(3,900,900,lessthan,lessthan,lessthan),
new makerule(5,900,900,greaterthan,lessthan,lessthan),
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
new makerule(900,900,(3*255)/4,lessthan,lessthan,lessthan),
new makerule(900,900,Math.round(255/2),lessthan,lessthan,greaterthan)
])

var rules75 = shuffle([
//makerule(petalval,ringval,colval,petaltest,ringtest,coltest)
//petal 75%
new makerule(5,900,900,lessthan,lessthan,lessthan),
new makerule(2,900,900,greaterthan,lessthan,lessthan),
//ring 25%
new makerule(900,20,900,lessthan,lessthan,lessthan),
new makerule(900,5,900,lessthan,greaterthan,lessthan),
//col 25%
new makerule(900,900,255,lessthan,lessthan,lessthan),
new makerule(900,900,Math.round(255/4),lessthan,lessthan,greaterthan)
])


//TEST AREA
var petallevels=shuffle([2,3,4,5]);
var ringlevels = shuffle([5,10,15,20]);
var collevels = shuffle([Math.round(255/4),Math.round(255/2),Math.round((3*255)/4),255]);
var sizeparam = 10;

var richgroup=[];
var poorgroup=[];
var hmtotal = 0;
var hmrich=0;
var currentrule=rules75[0];

function initrichgroup(){
    for(var i=0;i<petallevels.length;i++){
	for(var j=0;j<ringlevels.length;j++){
	    for(var k=0;k<collevels.length;k++){
		//makeflower(x, y, petallevel, ringlevel, collevel, sizeparam){
		thisflower=new makeflower(canvaswidth/2,canvasheight/2,petallevels[i],ringlevels[j],collevels[k],sizeparam);
		richgroup.push(thisflower);
		hmtotal++;
		if(currentrule.passes(thisflower)){hmrich++;}
	    }
	}
    }
}



//function testflower(){return new makeflower(canvaswidth/2,canvasheight/2,shuffle(petallevels)[0],shuffle(ringlevels)[0],shuffle(collevels)[0],sizeparam);}

function swapout(cellcount,origin){
    if(origin=="pos"){
	if(cellcount>=richgroup.length)return;
	temp = richgroup[cellcount];
	poorgroup.push(temp);
	richgroup.splice(cellcount,1);
    }
    if(origin=="neg"){
	if(cellcount>=poorgroup.length)return;
	temp=poorgroup[cellcount];
	richgroup.push(temp);
	poorgroup.splice(cellcount,1);
    }
    redraw();
}

function redraw(){
listtodrawntable(8,8,richgroup,"pos");
listtodrawntable(4,4,poorgroup,"neg");
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

initrichgroup();
document.write("<div id=\"pos\"></div>");
document.write("<div id=\"neg\"></div>");
redraw();
