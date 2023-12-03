/*-------------------------------------------------------------------------------------------------------------------------------------------------------------
This plugin introduces a new control character to be used in messages: \up
It displays the numerical value of one of the specified player unit's parameters.

How to use:
Use like all other control characters by including it in the message's text as \up(Index)[(ID)]

(Index) is the index of the unit parameter whose value you want to display:

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

(ID) is the unit's ID

Example:
You want the player unit with ID 3 to tell you how strong they are. The dialogue used in this case could be something like:

"Look at these muscles! I have \up1[3] Strength!"

Let's say the player unit in question has 9 STR. Then the above message would show up in game as:

"Look at these muscles! I have 9 Strength!"


Update history
21/10/2023 Created


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
(function() {

var alias1 = VariableReplacer._configureVariableObject;
VariableReplacer._configureVariableObject = function(groupArray) {
	alias1.call(this, groupArray);
	groupArray.appendObject(DataVariable.Up);
};

DataVariable.Up = defineObject(BaseDataVariable,
{
	getReplaceValue: function(text) {
		var index = this.getIndexFromKey(text);
		var id = this.getIdFromKey(text);
		
		var session = root.getCurrentScene();
		var list;
		if (session = SceneType.REST) {
			list = root.getMetaSession().getTotalPlayerList();
		} else {
			list = root.getCurrentSession().getPlayerList();
		}
		var player = list.getDataFromId(id);
		
		return player.getParamValue(index);
	},
	
	getIndexFromKey: function(text) {
		var key = /\\up(\d+)\[\d+\]/;
		var c = text.match(key);
		
		return Number(c[1]);
	},
	
	getKey: function() {
		var key = /\\up\d+\[(\d+)\]/;
		
		return key;
	}
});

})();
