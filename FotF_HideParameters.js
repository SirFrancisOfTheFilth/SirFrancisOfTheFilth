/*-------------------------------------------------------------------------------------------------------------------------------------------------------------
This plugin lets you hide unit parameters per unit/class/faction by passing a custom parameter.
Just replace the name of FotF_ParamName1/2 in line 54 to the name of the parameter you want to hide
and give your unit/class the custom parameter "hideParameter:x", where x is the index number
of your parameter:

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

To customize this plugin, paste or replace these statements starting from line 71 and 98(or add your own):

if (ParamGroup.getParameterName(index) === FotF_ParamName1 && this._unit.getUnitType() !== UnitType.PLAYER) {			//hides the parameter in FotF_ParamName1 for all factions but players
            return false;
        }

if (ParamGroup.getParameterName(index) === FotF_ParamName1 && this._unit.getUnitType() === UnitType.PLAYER) {			//hides the parameter in FotF_ParamName1 only for players
            return false;
        }

if (ParamGroup.getParameterName(index) === FotF_ParamName2 && this._unit.custom.hideParameter === index) {				//hides the parameter in FotF_ParamName2 for all units with custom parameter
            return false;
        }

if (ParamGroup.getParameterName(index) === FotF_ParamName2 && this._unit.getClass().custom.hideParameter === index) {	//hides the parameter in FotF_ParamName2 for all classes with custom parameter
            return false;
        }


Update history
02/10/2023 Created


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

(function () {
	
	var FotF_ParamName1 = 'Wlv'
	var FotF_ParamName2 = 'Bld'
	UnitStatusScrollbar._unit = null;
    // this lets other functions in UnitStatusScrollbar see the current unit object
    var alias2 = UnitStatusScrollbar._createStatusEntry;
    UnitStatusScrollbar._createStatusEntry = function (unit, index, weapon) {
        this._unit = unit;

        return alias2.call(this, unit, index, weapon);
    }

	 // hide parameter in unit status scrollbar
    var alias3 = UnitStatusScrollbar._isParameterDisplayable
    UnitStatusScrollbar._isParameterDisplayable = function (index) {
        if (ParamGroup.getParameterName(index) === FotF_ParamName2 && this._unit.getUnitType() !== UnitType.PLAYER) {
            return false;
        }
		
		if (ParamGroup.getParameterName(index) === FotF_ParamName2 && this._unit.custom.hideParameter === index) {
            return false;
        }
		
		if (ParamGroup.getParameterName(index) === FotF_ParamName2 && this._unit.getClass().custom.hideParameter === index) {
            return false;
        }
		
        return alias3.call(this, index);
    }
	
	StatusScrollbar._unit = null;
    // this lets other functions in StatusScrollbar see the current unit object
    var alias4 = StatusScrollbar._createStatusEntry;
    StatusScrollbar._createStatusEntry = function (unit, index, weapon) {
        this._unit = unit;

        return alias4.call(this, unit, index, weapon);
    }
	
	//hide parameters in status scrollbar
	var alias5 = StatusScrollbar._isParameterDisplayable
    StatusScrollbar._isParameterDisplayable = function (index) {
        if (ParamGroup.getParameterName(index) === FotF_ParamName1 || ParamGroup.getParameterName(index) === FotF_ParamName2 && this._unit.getUnitType() !== UnitType.PLAYER) {
            return false;
        }
		
		if (ParamGroup.getParameterName(index) === FotF_ParamName1 || ParamGroup.getParameterName(index) === FotF_ParamName2 && this._unit.custom.hideParameter === index) {
            return false;
        }
		
		if (ParamGroup.getParameterName(index) === FotF_ParamName1 || ParamGroup.getParameterName(index) === FotF_ParamName2 && this._unit.getClass().custom.hideParameter === index) {
            return false;
        }
		
        return alias5.call(this, index);
    }
})();