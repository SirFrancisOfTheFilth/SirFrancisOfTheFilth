/*--------------------------------------------------------------------------
This plugin makes units dance when inflicted with a state with the custom
parameter "danceFever:true".

Usage instructions:

Create a state and give it the custom parameter "danceFever:true".
	
	It should look like this:
	
	{danceFever:true}
	
Now all units afflicted by this state will randomly spin in all directions.

The dance speed can be changed by adjusting FotF_DanceSpeed in line 31.
  
If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @francisofthefilth
  
Original Plugin Author:
Francis of the Filth
  
2024/01/07 Released
  
--------------------------------------------------------------------------*/

var FotF_DancerArray = null;
var FotF_PauseArray = null;

(function () {
	var FotF_DanceSpeed = 20;			//Change this value to adjust dance speed. Minimum 0. Lower values --> faster dancing
	var delayCounter = null;
	FotF_DancerArray = [];
	FotF_PauseArray = [];
	
	var FotF_DanceControl = MapLayer.moveMapLayer;
	MapLayer.moveMapLayer = function () {
		
		var i, j;
		var session = root.getCurrentSession();
		var playerList = PlayerList.getAliveList();
		var enemyList = EnemyList.getAliveList();
		var allyList = AllyList.getAliveList();
		
		if (typeof FotF_DanceSpeed !== 'number' || FotF_DanceSpeed < 0) {
			FotF_DanceSpeed = 0
		}
		
		if (delayCounter === null) {
			delayCounter = 0;
		} else if (delayCounter === FotF_DanceSpeed) {
			delayCounter = 0;
		} else {
			delayCounter++
		}
			
		if (delayCounter === FotF_DanceSpeed) {
			for (j = 0; j < playerList.getCount(); j++) {
				var unit = playerList.getData(j);
				var stateList = unit.getTurnStateList();
				
				for (i = 0; i < stateList.getCount(); i++) {
					var state = stateList.getData(i).getState();
					
					if (state.custom.danceFever && FotF_PauseArray.indexOf(unit) < 0) {
						var danceMove = Math.floor(Math.random() * 5);
						unit.setDirection(danceMove);
						
						if (FotF_DancerArray.indexOf(unit) < 0) {
							FotF_DancerArray.push(unit);
						}
					}
				}
			}
			
			for (j = 0; j < enemyList.getCount(); j++) {
				var unit = enemyList.getData(j);
				var stateList = unit.getTurnStateList();
				
				for (i = 0; i < stateList.getCount(); i++) {
					var state = stateList.getData(i).getState();
					
					if (state.custom.danceFever && FotF_PauseArray.indexOf(unit) < 0) {
						var danceMove = Math.floor(Math.random() * 5);
						unit.setDirection(danceMove);
						
						if (FotF_DancerArray.indexOf(unit) < 0) {
							FotF_DancerArray.push(unit);
						}
					}
				}
			}
			
			for (j = 0; j < allyList.getCount(); j++) {
				var unit = allyList.getData(j);
				var stateList = unit.getTurnStateList();
				
				for (i = 0; i < stateList.getCount(); i++) {
					var state = stateList.getData(i).getState();
					
					if (state.custom.danceFever && FotF_PauseArray.indexOf(unit) < 0) {
						var danceMove = Math.floor(Math.random() * 5);
						unit.setDirection(danceMove);
						
						if (FotF_DancerArray.indexOf(unit) < 0) {
							FotF_DancerArray.push(unit);
						}
					}
				}
			}
		}
		
		FotF_DanceControl.call(this);
	};

	FotF_CureDanceFever = StateControl.arrangeState;
	StateControl.arrangeState = function(unit, state, increaseType) {
		
		if (state !== null) {
			//var turnState = state.getState();
			
			if ((state.custom.danceFever && increaseType === IncreaseType.DECREASE) || increaseType === IncreaseType.ALLRELEASE) {
				unit.setDirection(DirectionType.NULL);
				FotF_DancerArray.splice(FotF_DancerArray.indexOf(unit), 1);
			}
		}
		
		FotF_CureDanceFever.call(this, unit, state, increaseType);
	};
	
	FotF_PauseDance = SimulateMove.startMove;
	SimulateMove.startMove = function(unit, moveCource) {
		
		var i;
		var stateList = unit.getTurnStateList();
				
		for (i = 0; i < stateList.getCount(); i++) {
			var state = stateList.getData(i).getState();
			
			if (state.custom.danceFever && FotF_PauseArray.indexOf(unit) < 0) {
				FotF_PauseArray.push(unit);
				unit.setDirection(DirectionType.NULL);
			}
		}
		
		FotF_PauseDance.call(this, unit, moveCource);
	};
	
	FotF_ResumeDance = SimulateMove._endMove;
	SimulateMove._endMove = function(unit) {
		
		if (FotF_PauseArray.indexOf(unit) > -1) {
			FotF_PauseArray.splice(FotF_PauseArray.indexOf(unit), 1);
		}
		
		FotF_ResumeDance.call(this, unit);
	};
	
})();