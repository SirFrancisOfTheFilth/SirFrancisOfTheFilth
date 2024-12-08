//Checks if furniture is allowed on the current map
FotF_IsFurnitureAllowed = function() {
	var session = root.getCurrentSession();
	
	if (session !== null) {
		if (session.getCurrentMapInfo().custom.furniture) {
			return true;
		}
	}
	return false;
};

//Checks if specified item is in convoy
FotF_IsItemInStock = function (id, isWeapon) {
	
	var i;
	var arr = StockItemControl.getStockItemArray();
	
	for (i = 0; i < arr.length; i++) {
		var item = arr[i];
		if (item.getId() === id && item.isWeapon() === isWeapon) {
			return true;
		}
	}
	
	return false;
};

//Checks if a specific tile is on a specific position
FotF_IsTileOnPos = function(isOrnament, isRuntime, id, xSrc, ySrc, xDest, yDest) {
	
	var session = root.getCurrentSession();
	var handle = session.getMapChipGraphicsHandle(xDest, yDest, isOrnament);
	var tRuntime = handle.getHandleType();
	var tID = handle.getId();
	var tSrcX = handle.getSrcX();
	var tSrcY = handle.getSrcY();
	if (tRuntime === isRuntime && tID === id && tSrcX === xSrc && tSrcY === ySrc) {
		return true;
	}
	
	return false;
};

//Checks if the convoy contains at least one item of specified type
var FotF_IsItemTypeInStock = function(weaponTypeIndex, weaponTypeId) {
	
	var i;
	var arr = StockItemControl.getStockItemArray();
	var wType = root.getBaseData().getWeaponTypeList(weaponTypeIndex).getDataFromId(weaponTypeId);
	
	for (i = 0; i < arr.length; i++) {
		var item = arr[i];
		
		if (item.getWeaponType() === wType) {
			return true;
		}
	}

	return false;	
};

//Checks if unit has moveable tiles adjacent to it
//If null is specified for unit, it assumes the active event unit
FotF_IsMoveableTileAdjacentToUnit = function(unit) {
	
	var i;
	
	if (unit === null) {
		unit = root.getCurrentSession().getActiveEventUnit();
	}
	
	if (unit === null) {
		return false;
	}
	
	var unitX = unit.getMapX();
	var unitY = unit.getMapY();

	for (i = 0; i < 4; i++) {
		var x = unitX + XPoint[i];
		var y = unitY + YPoint[i];
		var terrain = PosChecker.getTerrainFromPos(x, y);
		if (typeof terrain !== 'undefined' && terrain !== null) {
			if (terrain.custom.moveable) {
				return true;
			}
		}
	}

	return false;
};

//Checks if object on position is moveable
FotF_IsPosMoveableObject = function(x, y) {

	var terrain = PosChecker.getTerrainFromPos(x, y);

	if (typeof terrain !== 'undefined' && terrain !== null) {
		if (terrain.custom.moveable) {
			return true;
		}
	}

	return false;
};

//Checks if object on position is moveable
//Position is defined through variable values
FotF_IsVarPosMoveableObject = function(xVarId, yVarId, xVarTable, yVarTable) {

	var xIndex = root.getMetaSession().getVariableTable(xVarTable).getVariableIndexFromId(xVarId);
	var yIndex = root.getMetaSession().getVariableTable(yVarTable).getVariableIndexFromId(yVarId);
	var x = root.getMetaSession().getVariableTable(xVarTable).getVariable(xIndex);
	var y = root.getMetaSession().getVariableTable(yVarTable).getVariable(yIndex);

	var terrain = PosChecker.getTerrainFromPos(x, y);

	if (typeof terrain !== 'undefined' && terrain !== null) {
		if (terrain.custom.moveable) {
			return true;
		}
	}

	return false;
};

//Sends item associated with moveable tile to convoy
var FotF_GrantMoveableItemFromVarPos = function(xVarId, yVarId, xVarTable, yVarTable) {
	var generator = root.getEventGenerator();
	var xIndex = root.getMetaSession().getVariableTable(xVarTable).getVariableIndexFromId(xVarId);
	var yIndex = root.getMetaSession().getVariableTable(yVarTable).getVariableIndexFromId(yVarId);
	var x = root.getMetaSession().getVariableTable(xVarTable).getVariable(xIndex);
	var y = root.getMetaSession().getVariableTable(yVarTable).getVariable(yIndex);
	var terrain = PosChecker.getTerrainFromPos(x, y);
	
	if (typeof terrain !== 'undefined' && terrain !== null) {
		if (typeof terrain.custom.moveable === 'number') {
			var item = root.getBaseData().getItemList().getDataFromId(terrain.custom.moveable);
			generator.stockItemChange(item, IncreaseType.INCREASE, true);
			generator.execute();
		}
	}	
};

//Checks if terrain surrounding unit with ornament and without ornament
//If they're the same, it means no ornament, ergo free space
var FotF_IsFreeSpaceAdjacentToUnit = function(unit) {
	
	var i;
	
	if (unit === null) {
		unit = root.getCurrentSession().getActiveEventUnit();
	}
	
	if (unit === null) {
		return false;
	}
	
	var unitX = unit.getMapX();
	var unitY = unit.getMapY();

	for (i = 0; i < 4; i++) {
		var x = unitX + XPoint[i];
		var y = unitY + YPoint[i];
		var terrain = PosChecker.getTerrainFromPos(x, y);
		var terrain2 = PosChecker.getTerrainFromPosEx(x, y);
		
		if (terrain === null) {
			continue;
		}
		
		//So this one is weird. When changing a mapchip to "None", it
		//will actually be an empty chip with the name "Plain".
		//So, yeah. Check for that too I guess...
		if (terrain === terrain2 || terrain.getName() === 'Plain') {
			return true;
		}
	}

	return false;
};


//Creates an array with information of all furniture tiles on the map
var FotF_CreateFurnitureArray = function() {
	
	var session = root.getCurrentSession();
	var arr = [];
	
	if (session === null) {
		return arr;
	}
	
	var i, j;
	var mapInfo = session.getCurrentMapInfo();
	var width = mapInfo.getMapWidth();
	var height = mapInfo.getMapHeight();
	
	arr.push(mapInfo.getId());
	
	for (i = 0; i < width; i++) {
		for (j = 0; j < height; j++) {
			var terrain = PosChecker.getTerrainFromPos(i, j);
			
			if (typeof terrain.custom.moveable === 'number') {
				var handle = session.getMapChipGraphicsHandle(i, j, true);
				arr.push([i, j, handle]);
			}
		}
	}
	return arr;
};

var FotF_FurnitureArray = null;

(function() {
	
	//Create empty furniture array on startup
	//This is to ensure everything works out
	//if the game isn't started using a save file
	FotF_SetupFurnitureArray = ScriptCall_Setup;
	ScriptCall_Setup = function() {
		FotF_SetupFurnitureArray.call(this);
		
		FotF_FurnitureArray = [];
	};
	
	//Load Furniture Array from save file
	FotF_LoadFurnitureArray = LoadSaveScreen._executeLoad;
	LoadSaveScreen._executeLoad = function () {
		FotF_LoadFurnitureArray.call(this);
		
		var i;
		var extData = root.getExternalData();
		var manager = root.getLoadSaveManager();
		var saveIndex = extData.getActiveSaveFileIndex();
		var saveFileInfo = manager.getSaveFileInfo(saveIndex);
		var saveObject = saveFileInfo.custom;
		var mapList = root.getBaseData().getMapList();
		
		if (typeof saveObject.furnitureArray !== 'undefined' && saveObject.furnitureArray !== null) {
			FotF_FurnitureArray = saveObject.furnitureArray;
		}
	};
	
	//Place furniture before map begins
	var FotF_ArrangeFurniture = CurrentMap.prepareMap;
	CurrentMap.prepareMap = function() {
		
		FotF_ArrangeFurniture.call(this);
		
		var i, j;
		var mapInfo = root.getCurrentSession().getCurrentMapInfo();
		
		if (mapInfo !== null) {
			if (mapInfo.custom.furniture) {
				var mapID = mapInfo.getId();
				var arr = FotF_FurnitureArray;
				
				for (i = 0; i < arr.length; i++) {
					if (arr[i][0] === mapID) {
						var generator = root.getEventGenerator();
						for (j = 1; j < arr[i].length; j++) {						//j = 1 to skip the mapID at index 0
							var x = arr[i][j][0];
							var y = arr[i][j][1];
							var handle = arr[i][j][2];
							generator.mapChipChange(x, y, true, handle);
						}
						generator.execute();
					}
				}
			}
		}
	};
	
	//Save furniture information of current map into the array upon exiting map
	FotF_WriteFurnitureToArray = MapEndFlowEntry.enterFlowEntry;
	MapEndFlowEntry.enterFlowEntry = function(battleResultScene) {
		
		var i;
		var isNewEntry = true;
		var mapInfo = root.getCurrentSession().getCurrentMapInfo();
		var arr = FotF_FurnitureArray;
		var saveArr = FotF_CreateFurnitureArray();
		
		if (mapInfo !== null) {
			var mapID = mapInfo.getId();
			if (mapInfo.custom.furniture) {
				
				for (i = 0; i < arr.length; i++) {
					if (arr[i][0] === mapID) {
						arr.splice(i, 1);
						arr.unshift(saveArr);
						isNewEntry = false;
						break;
					}
				}
				
				if (isNewEntry === true) {
					arr.unshift(saveArr);
				}
			}
		}
		return FotF_WriteFurnitureToArray.call(this, battleResultScene);
	};
	
	//Save Furniture Array to save file
	var FotF_SaveFurnitureArray = LoadSaveScreen._getCustomObject;
	LoadSaveScreen._getCustomObject = function() {
			
		var obj = FotF_SaveFurnitureArray.call(this);
		
		var i;
		var isNewEntry = true;
		var mapInfo = root.getCurrentSession().getCurrentMapInfo();
		var arr = FotF_FurnitureArray;
		var saveArr = FotF_CreateFurnitureArray();
		
		if (mapInfo !== null) {
			var mapID = mapInfo.getId();
			if (mapInfo.custom.furniture) {
				
				for (i = 0; i < arr.length; i++) {
					if (arr[i][0] === mapID) {
						arr.splice(i, 1);
						arr.unshift(saveArr);
						isNewEntry = false;
						break;
					}
				}
				
				if (isNewEntry === true) {
					arr.unshift(saveArr);
				}
			}
		}
		
		obj.furnitureArray = arr;
		
		return this._screenParam.customObject;
	};
	
})();