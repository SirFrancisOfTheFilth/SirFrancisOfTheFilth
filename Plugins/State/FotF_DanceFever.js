/*--------------------------------------------------------------------------
This plugin makes units dance when inflicted with a state with the custom
parameter "danceFever:true".

Usage instructions:

Create a state and give it the custom parameters "danceFever:true" and 
"danceSpeed:x", where x is a number. The lower the number the higher the
dance speed. (60 is one move per second at 60 fps, 30 is 2 moves/s, etc.)
	
	It should look like this:
	
	{danceFever:true, danceSpeed:20}
	
Now all units afflicted by this state will randomly spin in all directions.
  
If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @francisofthefilth
  
Original Plugin Author:
Francis of the Filth
  
2024/03/08 Released

2024/03/16
	Fixed a crash if states were added to units during real battle.
  
--------------------------------------------------------------------------*/

var FotF_DancerArray = null;
var FotF_PauseArray = null;
var FotF_SpeedArray = null;

(function () {
	var delayCounter = null;
	FotF_DancerArray = [];
	FotF_PauseArray = [];
	FotF_SpeedArray = [];
	
	FotF_PrepareDance = MapLayer.prepareMapLayer;
	MapLayer.prepareMapLayer = function () {
	
		var baseData = root.getBaseData();
		var stateListFull = baseData.getStateList();
		
		for (var i = 0; i < stateListFull.getCount(); i++) {
			var state = stateListFull.getData(i);
			if (state.custom.danceFever) {
				//root.log(state.getName());
				
				if (typeof state.custom.danceSpeed === 'number') {
					var danceSpeed = state.custom.danceSpeed
				} else {
					var danceSpeed = 20
				}
				//root.log(danceSpeed);
				FotF_SpeedArray.push([state, danceSpeed]);
			}
		}
		FotF_PrepareDance.call(this);
	};
	
	var FotF_DanceControl = MapLayer.moveMapLayer;
	MapLayer.moveMapLayer = function () {
		
		var i, j, k;
		var session = root.getCurrentSession();
		var playerList = PlayerList.getAliveList();
		var enemyList = EnemyList.getAliveList();
		var allyList = AllyList.getAliveList();

		for (i = 0; i < FotF_SpeedArray.length; i++) {
			if (FotF_SpeedArray[i][1] > 0) {
				FotF_SpeedArray[i].splice(1, 1, FotF_SpeedArray[i][1] - 1)
			} else {
				FotF_SpeedArray[i].splice(1, 1, FotF_SpeedArray[i][0].custom.danceSpeed)
			}
		}
	
		for (j = 0; j < playerList.getCount(); j++) {
			var unit = playerList.getData(j);
			var stateList = unit.getTurnStateList();
			
			for (i = 0; i < stateList.getCount(); i++) {
				var preState = stateList.getData(i);
				var state = preState.getState();
				var speed = state.custom.danceSpeed;
				
				if (state.custom.danceFever && FotF_PauseArray.indexOf(unit) < 0) {
					for (k = 0; k < FotF_SpeedArray.length; k++) {
						var stateCheck = FotF_SpeedArray[k][0];
						var speedCheck = FotF_SpeedArray[k][1];
						if (stateCheck === state && speedCheck === 0) {
							var danceMove = Math.floor(Math.random() * 5);
							unit.setDirection(danceMove);
							
							if (FotF_DancerArray.indexOf(unit) < 0) {
								FotF_DancerArray.push(unit);
							}
						}
					}
				}
			}
		}
		
		for (j = 0; j < enemyList.getCount(); j++) {
			var unit = enemyList.getData(j);
			var stateList = unit.getTurnStateList();
			
			for (i = 0; i < stateList.getCount(); i++) {
				var preState = stateList.getData(i);
				var state = preState.getState();
				var speed = state.custom.danceSpeed;
				
				if (state.custom.danceFever && FotF_PauseArray.indexOf(unit) < 0) {
					for (k = 0; k < FotF_SpeedArray.length; k++) {
						var stateCheck = FotF_SpeedArray[k][0];
						var speedCheck = FotF_SpeedArray[k][1];
						if (stateCheck === state && speedCheck === 0) {
							var danceMove = Math.floor(Math.random() * 5);
							unit.setDirection(danceMove);
							
							if (FotF_DancerArray.indexOf(unit) < 0) {
								FotF_DancerArray.push(unit);
							}
						}
					}
				}
			}
		}
		
		for (j = 0; j < allyList.getCount(); j++) {
			var unit = allyList.getData(j);
			var stateList = unit.getTurnStateList();
			
			for (i = 0; i < stateList.getCount(); i++) {
				var preState = stateList.getData(i);
				var state = preState.getState();
				var speed = state.custom.danceSpeed;
				
				if (state.custom.danceFever && FotF_PauseArray.indexOf(unit) < 0) {
					for (k = 0; k < FotF_SpeedArray.length; k++) {
						var stateCheck = FotF_SpeedArray[k][0];
						var speedCheck = FotF_SpeedArray[k][1];
						if (stateCheck === state && speedCheck === 0) {
							var danceMove = Math.floor(Math.random() * 5);
							unit.setDirection(danceMove);
							
							if (FotF_DancerArray.indexOf(unit) < 0) {
								FotF_DancerArray.push(unit);
							}
						}
					}
				}
			}
		}
		
		FotF_DanceControl.call(this);
	};

	FotF_CureDanceFever = StateControl.arrangeState;
	StateControl.arrangeState = function(unit, state, increaseType) {
		
		var turnState = FotF_CureDanceFever.call(this, unit, state, increaseType);
		
		if (state !== null) {
			//var turnState = state.getState();
			
			if ((state.custom.danceFever && increaseType === IncreaseType.DECREASE) || increaseType === IncreaseType.ALLRELEASE) {
				unit.setDirection(DirectionType.NULL);
				FotF_DancerArray.splice(FotF_DancerArray.indexOf(unit), 1);
			}
		}
		
		return turnState;
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