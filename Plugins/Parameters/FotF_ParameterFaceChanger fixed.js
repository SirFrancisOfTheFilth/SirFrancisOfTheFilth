/*-------------------------------------------------------------------------------------------------------------------------------------------------------------
With this plugin you can change the face graphic of units of all factions in the map unit window, unit menu and real battle depending on
the value of one of their unit parameters. The face graphic used in the message command is not affected.
To do this, you have to set the custom parameter "faceChanger" in the unit's custom parameters as follows:

{faceChanger:[Param,[x1,x2,x3,...],[y1,y2,y3,...][v1,v2,...]]}

Param is the index of the Parameter you want to use:

MHP:0
STR:1
MAG:2
SKI:3
SPD:4
LUK:5
DEF:6
MDF:7
MOV:8
WLV:9
BLD:10

x1,x2,x3,... and y1,y2,y3,... are the X- and Y-Coordinates in the face graphic sheet of the unit you want to assign. Be aware that they start
not at index 1, but index 0. A normal 6x4 face graphic sheet would then translate to this [X/Y]:

[0/0] [1/0] [2/0] [3/0] [4/0] [5/0]
[0/1] [1/1] [2/1] [3/1] [4/1] [5/1]
[0/2] [1/2] [2/2] [3/2] [4/2] [5/2]
[0/3] [1/3] [2/3] [3/3] [4/3] [5/3]

The length of the X- and Y-Arrays can be chosen freely (how many x1,x2,x3,... and y1,y2,y3,... you want to use), but they should both be the same length/amount.

The last array [v1,v2,...] is optional and describes the limits between which the respective face graphic is displayed for that unit. It's length
has to be exactly one less than the X-/Y-Arrays. So if your X-/Y-Arrays have a length of 6 (which equals x6/y6 or 6 facial expressions), the
limits array should have a length of 5. If you do not specify this array, it will default to [20,40,60,80,100], so you have to use 6 facial expressions,
which are displayed at unit parameter values of 0-19, 20-39, 40-59, 60-79, 80-99 and 100+.

Examples:

#1: {faceChanger:[2,[0,2,1,1,2,5],[3,0,0,1,1,1]]}

Example #1 uses the unit's MAG stat to change the expression in 6 stages with the default limits of 0-19, 20-39, 40-59, 60-79, 80-99 and 100+.
So at 0-19 MAG, the expression will be [0/3], which is the leftmost expression in the bottommost row. It will then change to [2/0] starting at
20 MAG to 39 MAG, [1/0] at 40-59 MAG, [1/1] at 60-79 MAG, [2/1] at 80-99 MAG and [5/1] at or above 100 MAG.


#2: {faceChanger:[10,[0,1,2,5],[3,0,1,1],[1,2,5]]}

In this example, BLD is used as the unit parameter. This time there will only be 4 expressions used:
0 BLD: [0/3]
1 BLD: [1/0]
2-4 BLD: [2/1]
5 or more BLD: [5/1]


Update history
10/10/2023 Fixed overflow error if limits array length was changed
09/10/2023 Created


Supported versions
SRPG Studio Version: 1.286


Terms and Conditions
The use of SRPG Studio is limited to games that use SRPG Studio.
You can use it for both commercial and non-commercial purposes. You can use it for any purpose.
You can modify the game. Please modify the game as much as you like.
No credits OK.
Redistribution and reproduction OK.
Please comply with the SRPG Studio Terms of Use.
-------------------------------------------------------------------------------------------------------------------------------------------------------------*/




	
///-----------------------------------------///
///				Variables					///
///-----------------------------------------///

	var destWidthUM = 96;				//width of the picture that should be drawn in the top part of the unit menu (default is 96px)
	var destHeightUM = 96;				//height of the picture that should be drawn in the top part of the unit menu (default is 96px)
	var destWidthMUW = 96;				//width of the picture that should be drawn in the map unit window (default is 96px)
	var destHeightMUW = 96;				//height of the picture that should be drawn in the map unit window (default is 96px)
	var srcWidthFotF = 96;				//width of the source picture (default is 96px)
	var srcHeightFotF = 96;				//height of the source picture (default is 96px)
	var UMfaceOffsetX = 0;				//x-Offset of the unit menu face picture
	var UMfaceOffsetY = 0;				//y-Offset of the unit menu face picture
	var MUWfaceOffsetX = 0;				//x-Offset of the map unit window face picture
	var MUWfaceOffsetY = 0;				//y-Offset of the map unit window face picture
	limitsFotF = [];

///-----------------------------------------///
///					UnitMenu				///
///-----------------------------------------///

ContentRenderer.drawUnitFace= function(x, y, unit, isReverse, alpha) {

		var xSrc, ySrc, i;
		var handle = unit.getFaceResourceHandle();
		var pic = GraphicsRenderer.getGraphics(handle, GraphicsType.FACE);
		limitsFotF = [20,40,60,80,100];
		var count = limitsFotF.length - 1 ;
		
		
		if (typeof unit.custom.faceChanger === 'object'){
			if (unit.custom.faceChanger[0] != null) {
				var changeByParam = unit.getParamValue(unit.custom.faceChanger[0]);
			}
			
			if (unit.custom.faceChanger[3] != null) {
				limitsFotF = unit.custom.faceChanger[3];
				count = limitsFotF.length - 1 ;
			}
		
			for (i = count; i >= 0; i--) {
				if (changeByParam < limitsFotF[0]) {
					xSrc = unit.custom.faceChanger[1][0];
					ySrc = unit.custom.faceChanger[2][0];
				} else if (changeByParam >= limitsFotF[i-1] && changeByParam < limitsFotF[i] && changeByParam < limitsFotF[count]) {
					xSrc = unit.custom.faceChanger[1][i];
					ySrc = unit.custom.faceChanger[2][i];
				} else if (changeByParam >= limitsFotF[count]) {
					xSrc = unit.custom.faceChanger[1][count + 1];
					ySrc = unit.custom.faceChanger[2][count + 1];
				}
			}
			
		} else {
			xSrc = handle.getSrcX();
			ySrc = handle.getSrcY();
		}
		
		xSrc *= srcWidthFotF;
		ySrc *= srcHeightFotF;
		x += UMfaceOffsetX
		y += UMfaceOffsetY
		
		if (pic === null) {
			return;
		}
		
		this._setPicInfo(pic, unit, isReverse, alpha);
		
		pic.drawStretchParts(x, y, destWidthUM, destHeightUM, xSrc, ySrc, srcWidthFotF, srcHeightFotF);
};
	
///-----------------------------------------///
///				MapUnitWindow				///
///-----------------------------------------///

MapParts.UnitInfo._drawFace= function(x, y, unit, textui) {

		var pic, xSrc, ySrc, i;
		var handle = unit.getFaceResourceHandle();
		limitsFotF = [20,40,60,80,100];
		var count = limitsFotF.length - 1 ;
		
		if (handle === null) {
			return;
		}
		
		pic = GraphicsRenderer.getGraphics(handle, GraphicsType.FACE);
		if (pic === null) {
			return;
		}
		if (typeof unit.custom.faceChanger === 'object'){
			if (unit.custom.faceChanger[0] != null) {
				var changeByParam = unit.getParamValue(unit.custom.faceChanger[0]);
			}
			
			if (unit.custom.faceChanger[3] != null) {
				limitsFotF = unit.custom.faceChanger[3];
				count = limitsFotF.length - 1 ;
			}
			for (i = count; i >= 0; i--) {
				if (changeByParam < limitsFotF[0]) {
					xSrc = unit.custom.faceChanger[1][0];
					ySrc = unit.custom.faceChanger[2][0];
				} else if (changeByParam >= limitsFotF[i-1] && changeByParam < limitsFotF[i] && changeByParam < limitsFotF[count]) {
					xSrc = unit.custom.faceChanger[1][i];
					ySrc = unit.custom.faceChanger[2][i];
				} else if (changeByParam >= limitsFotF[count]) {
					xSrc = unit.custom.faceChanger[1][count + 1];
					ySrc = unit.custom.faceChanger[2][count + 1];
				}
			}
			
		} else {
			xSrc = handle.getSrcX();
			ySrc = handle.getSrcY();
		}

		xSrc *= srcWidthFotF;
		ySrc *= srcHeightFotF;
		x += MUWfaceOffsetX
		y += MUWfaceOffsetY
		
		pic.drawStretchParts(x, y, destWidthMUW, destHeightMUW, xSrc, ySrc, srcWidthFotF, srcHeightFotF);
};
