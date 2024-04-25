/*--------------------------------------------------------------------------
This plugin makes units inflicted with a custom state drunk.

With each step (tile moved) they have a chance of one of two things happening:

	- They sway, randomizing the direction they walk in for this step
	- They trip and fall, ending their turn
	
Simulation canceling (pressing cancel to revoke the move you just made) is disabled
for units afflicted by a drunk state to avoid exploiting probabilities.

To use this, create a custom state with following parameter(s):

	{
	booze: {
		Str:20,							//Required, determines how strong the overall effects are
		swayMod:1.75,					//Optional, modifies (multiplicative) how often swaying occurs
		tripMod:0.5,					//Optional, modifies (multiplicative) how often tripping occurs
		sound:[false, 0]				//Optional, plays the sound with this ID if unit trips (false for original sounds, true for RTP)
	}
	}
	
If you want units to have an innate resistance to alcohol (maybe they're used to it),
give them the custom parameter "boozeRes:x" with x being a number that is deduced
from the probability of swaying or tripping.

The probability of swaying/tripping is determined by following formulas:

	Sway Chance: (boozeStr - boozeRes - Skill - Luck) * swayMod
	Trip Chance: (boozeStr - boozeRes - Skill - Luck) * tripMod

I recommend using a relatively low trip modifier if you don't want units to
trip all the time, but ultimately you have to experiment a bit with the values.

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @francisofthefilth

Original Plugin Author:
Francis of the Filth

2024/04/25 Released
 
--------------------------------------------------------------------------*/
var FotF_BoozeConstants = {
	IsCancelBlock: false,					//Used to block canceling of movement simulation
	IsTrip: false,							//Used to block unit commands if unit trips
	drunkard: null,							//Cache for unit in question
	SoundHandle: null						//Used to save the sound of the state, DO NOT CHANGE
};

(function () {

	var FotF_GetCourceBuilderUnit = CourceBuilder._createCource;
	CourceBuilder._createCource = function (unit, goalIndex, simulator, indexArrayDisabled, moveMaxCount, type) {
		FotF_BoozeConstants.drunkard = unit;
		return FotF_GetCourceBuilderUnit.call(this, unit, goalIndex, simulator, indexArrayDisabled, moveMaxCount, type);
	};
	
	var FotF_InterruptMovement = CourceBuilder._reverseCource;
	CourceBuilder._reverseCource = function(moveCource) {
		FotF_InterruptMovement.call(this, moveCource);
		root.log('grabbed cource' + moveCource);

		var unit = FotF_BoozeConstants.drunkard;
		FotF_BoozeConstants.IsCancelBlock = false;
		
		var i, j;
		var count = 0;
		var unit = FotF_BoozeConstants.drunkard;
		var stateList = unit.getTurnStateList();
		var tripTreshold = 0;
		var swayTreshold = 0;
		var mapInfo = root.getCurrentSession().getCurrentMapInfo();
		var newCource = []
			
		for (i = 0; i < stateList.getCount(); i++) {
			var preState = stateList.getData(i);
			var state = preState.getState();
			if (state.custom.booze.Str) {
				var boozeStr = state.custom.booze.Str;
				var tripMod = state.custom.booze.tripMod;
				var swayMod = state.custom.booze.swayMod;
				var sound = state.custom.booze.sound;
			}
			var boozeRes = unit.custom.boozeRes;
			var anime = state.getEasyAnime();
			
			if (typeof boozeStr === 'number') {
				FotF_BoozeConstants.IsCancelBlock = true;
			
				if (typeof boozeRes !== 'number') {
					boozeRes = 0
				}
				if (typeof tripMod !== 'number') {
					tripMod = 1
				}
				if (typeof swayMod !== 'number') {
					swayMod = 1
				}
				
				if (typeof sound === 'object' && typeof sound[0] === 'boolean' && typeof sound[1] === 'number') {
					FotF_BoozeConstants.SoundHandle = root.createResourceHandle(sound[0], sound[1], 0, 0, 0);
					root.log('sound handle created');
				} else {
					FotF_BoozeConstants.SoundHandle = null;
					root.log('no sound handle created');
				}
				
				tripTreshold += ((boozeStr - boozeRes - RealBonus.getSki(unit) - RealBonus.getLuk(unit)) * tripMod)
				swayTreshold += ((boozeStr - boozeRes - RealBonus.getSki(unit) - RealBonus.getLuk(unit)) * swayMod)
				
				if (tripTreshold <= 0) {
					tripTreshold = 0
				}
					
				if (swayTreshold <= 0) {
					swayTreshold = 0
				}
				
				var isSway, isTrip;
				var mapWidth = CurrentMap.getWidth();
				var mapHeight = CurrentMap.getHeight();
				var simulator = root.getCurrentSession().createMapSimulator();
				simulator.startSimulation(unit, RealBonus.getMov(unit));
				var indexArray = simulator.getSimulationIndexArray();
				root.writeTestFile(indexArray.toString());
				var currentX = unit.getMapX();
				var currentY = unit.getMapY();
				savedCoords = []
				savedCoords.push(currentX);
				savedCoords.push(currentY);
				root.log('startX: ' + currentX);
				root.log('startY: ' + currentY);
				var currentIndex = CurrentMap.getIndex(currentX, currentY);
				
				for (j = 0; j < moveCource.length; j++) {
					
					var tripValue = Math.floor(Math.random() * 101);
					var swayValue = Math.floor(Math.random() * 101);
					
					root.log('currentX before: ' + currentX);
					root.log('currentY before: ' + currentY);
					
					if (j > 0) {
						currentX += XPoint[newCource[j-1]];
						currentY += YPoint[newCource[j-1]];
					}
					root.log('currentX after: ' + currentX);
					root.log('currentY after: ' + currentY);
					
					
					root.log('tripTreshold: ' + tripTreshold);
					if (tripTreshold > tripValue) {
						isTrip = true
						root.log('tripped');
					} else {
						isTrip = false
						root.log('no trip');
					}
					
					if (isTrip === true && indexArray.indexOf(currentIndex) > -1 && (PosChecker.getUnitFromPos(currentX, currentY) === null || PosChecker.getUnitFromPos(currentX, currentY) === unit)) {
						FotF_BoozeConstants.IsTrip = true;
						unit.setWait(true);
						root.log(unit.getName() + ' fucking tripped and fell. Idiot.');
						//moveCource = newCource;
						//break;
					} else if (isTrip === true) {
						root.log('tripping not allowed, recalculating');
						var isSway, isTrip;
						currentX = savedCoords[0];
						currentY = savedCoords[1];
						newCource.splice(0, newCource.length);
						j = - 1;
						continue;
					}
						
					if (swayTreshold > swayValue) {
						isSway = true
						root.log('swayed');
					} else {
						isSway = false
						root.log('no sway');
					}
					
					var sim0 = CurrentMap.getIndex(currentX - 1, currentY);
					var sim1 = CurrentMap.getIndex(currentX, currentY - 1);
					var sim2 = CurrentMap.getIndex(currentX + 1, currentY);
					var sim3 = CurrentMap.getIndex(currentX, currentY + 1);
					root.log('sim0: ' + sim0);
					root.log('sim1: ' + sim1);
					root.log('sim2: ' + sim2);
					root.log('sim3: ' + sim3);
					var direction = 99;
					validDir = []
					
					if (j < (moveCource.length - 1) && isTrip !== true) {
						root.log('////////////////////// CASE 1 ///////////////////////');
						
						if (indexArray.indexOf(sim0)> -1) {
							validDir.push(0)
						}
						if (indexArray.indexOf(sim1) > -1) {
							validDir.push(1)
						}
						if (indexArray.indexOf(sim2) > -1) {
							validDir.push(2)
						}
						if (indexArray.indexOf(sim3) > -1) {
							validDir.push(3)
						}
						root.log('valid directions: ' + validDir);
							
						if (isSway === true && validDir.length > 0) {
							direction = validDir[Math.floor(Math.random() * validDir.length)];
							root.log('applied normal sway');
						} else if (isSway !== true && validDir.indexOf(moveCource[j]) > -1) {
							direction = moveCource[j]
							root.log('applied no sway');
						} else {
							direction = 99
							root.log('applied no direction');
						}
						
					} else if (j === (moveCource.length - 1) || isTrip === true) {
						root.log('////////////////////// CASE 2 ///////////////////////');
						
						if (indexArray.indexOf(sim0) > -1 && PosChecker.getUnitFromPos(currentX - 1, currentY) === null) {
							validDir.push(0)
						}
						if (indexArray.indexOf(sim1) > -1 && PosChecker.getUnitFromPos(currentX , currentY - 1) === null) {
							validDir.push(1)
						}
						if (indexArray.indexOf(sim2) > -1 && PosChecker.getUnitFromPos(currentX + 1, currentY) === null) {
							validDir.push(2)
						}
						if (indexArray.indexOf(sim3) > -1 && PosChecker.getUnitFromPos(currentX , currentY + 1) === null) {
							validDir.push(3)
						}
						root.log('valid directions: ' + validDir);
						
						if (isSway === true && validDir.length > 0) {
							direction = validDir[Math.floor(Math.random() * validDir.length)];
							root.log('applied normal sway');
						} else if (isSway !== true && validDir.indexOf(moveCource[j]) > -1) {
							direction = moveCource[j]
							root.log('applied no sway');
						} else {
							direction = 99
							root.log('applied no direction');																					//Push direction 99 if isTrip === true and check for it in cource adjustment
						}
						if (direction !== 99 && isTrip === true) {
							direction = null;
						}
					} else {
						root.log('////////////////////// CASE 3 ///////////////////////');
						direction = 99
						root.log('applied no direction');
					}
						
					if (direction === 99) {
						root.log('no possible last move, recalculating');
						var isSway, isTrip;
						currentX = savedCoords[0];
						currentY = savedCoords[1];
						newCource.splice(0, newCource.length);
						j = - 1;
						continue;
					} else if (typeof direction === 'number' && direction < 4) {
						root.log('pushed direction ' + direction + ' into newCource');
						newCource.push(direction);
						root.log(newCource);
					} else {
						root.log('end of cource reached, exiting loop');
						break;
					}
				}

				root.log('old Cource: ' + moveCource);
				var oldCource = moveCource;
				for (j = 0; j < oldCource.length; j++) {
					if (j < newCource.length) {
						root.log('replaced direction ' + moveCource[j] + ' with ' + newCource[j] + ' at index ' + j);
						moveCource.splice(j, 1, newCource[j]);
					} else {
						moveCource.splice(j, (moveCource.length - j));
						root.log('shortened moveCource at index ' + j);
						break;
					}
				}

				root.log('new Cource: ' + moveCource);
				break;
			}
		}
		root.log('final moveCource: ' + moveCource);
	};
	
	MapSequenceCommand._moveCommand = function() {
		var result;
		
		if (FotF_BoozeConstants.IsTrip === true) {
			root.log('result: ' + result);
			root.log('ended turn for ' + this._targetUnit.getName());
			result = this._doLastAction();
			this._straightFlow.enterStraightFlow();
			this.changeCycleMode(MapSequenceCommandMode.FLOW);
			this._targetUnit.setDirection(DirectionType.NULL);
			
			if (FotF_BoozeConstants.SoundHandle !== null) {
				handle = FotF_BoozeConstants.SoundHandle;
				MediaControl.soundPlay(handle);
				root.log('played trip sound');
			}
			
			FotF_BoozeConstants.IsTrip = false;
			return MapSequenceCommandResult.COMPLETE;
			
		} else if (this._unitCommandManager.moveListCommandManager() !== MoveResult.CONTINUE) {
			result = this._doLastAction();
				
			if (result === 0) {
				root.log('result: ' + result);
				this._straightFlow.enterStraightFlow();
				this.changeCycleMode(MapSequenceCommandMode.FLOW);
			}
			else if (result === 1) {
				root.log('result: ' + result);
				return MapSequenceCommandResult.COMPLETE;
			}
			else if (result === 2) {
				root.log('result: ' + result);
				root.log('cancelBlock is ' + FotF_BoozeConstants.IsCancelBlock);
				if (FotF_BoozeConstants.IsCancelBlock !== true) {
					this._targetUnit.setMostResentMov(0);
					return MapSequenceCommandResult.CANCEL;
				}
			}/* else {
				root.log('result: ' + result);
				//this._targetUnit.setWait(false);
				root.log('case 3');
				return MapSequenceCommandResult.CANCEL;
			}*/
		}
		
		return MapSequenceCommandResult.NONE;
	};

	MapSequenceCommand._doLastAction = function() {
		var i;
		var unit = null;
		var list = PlayerList.getSortieList();
		var count = list.getCount();
		
		// Check it because the unit may not exist by executing a command.
		for (i = 0; i < count; i++) {
			if (this._targetUnit === list.getData(i)) {
				unit = this._targetUnit;
				break;
			}
		}
		
		// Check if the unit doesn't die and still exists.
		if (unit !== null) {
			if (this._unitCommandManager.getExitCommand() !== null) {
				if (!this._unitCommandManager.isRepeatMovable()) {
					// If move again is not allowed, don't move again.
					this._targetUnit.setMostResentMov(ParamBonus.getMov(this._targetUnit));
				}
				
				// Set the wait state because the unit did some action.
				this._parentTurnObject.recordPlayerAction(true);
				return 0;
			}
			else {
				// Get the position and cursor back because the unit didn't act.
				if (FotF_BoozeConstants.IsCancelBlock !== true) {
					this._parentTurnObject.setPosValue(unit);
				}
			}
			
			// Face forward.
			unit.setDirection(DirectionType.NULL);
		}
		else {
			this._parentTurnObject.recordPlayerAction(true);
			return 1;
		}
		FotF_BoozeConstants.IsCancelBlock = false;
		return 2;
	};
	
	var FotF_ModifySelectSound = MapSequenceArea._playMapUnitSelectSound;
	MapSequenceArea._playMapUnitSelectSound = function() {
		
		if (FotF_BoozeConstants.IsTrip === true && FotF_BoozeConstants.SoundHandle !== null) {
			handle = FotF_BoozeConstants.SoundHandle;
			MediaControl.soundPlay(handle);
			root.log('played trip sound');
		} else {
			FotF_ModifySelectSound.call(this);
			root.log('played select sound');
		}
	};
	
	var FotF_ModifyCancelSound = BaseListCommandManager._playCommandCancelSound;
	BaseListCommandManager._playCommandCancelSound = function() {
		
		var unit = BaseListCommandManager.getListCommandUnit();
		
		if (FotF_BoozeConstants.IsCancelBlock === true/* && unit.isWait() !== true*/) {
			MediaControl.soundDirect('operationblock');
			root.log('played block sound');
		} else {
			FotF_ModifyCancelSound.call(this);
			root.log('played cancel sound');
		}
	};

})();