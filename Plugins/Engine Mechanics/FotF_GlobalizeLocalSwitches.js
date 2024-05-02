/*--------------------------------------------------------------------------
Ever wanted to revisit a map, but the global switches were all turned off?
This is standard SRPG Studio behaviour and makes sense for most maps, you
could just use global switches if you wanted them to persist.

But having a few global switches per revisitable map tends to add up quickly
and before you know it you have dozens of global switches for the sole purpose
of keeping track of map progress.

You could sort them well and keep track using notes, but what if I told you
there's an easier way?

This plugin lets you define which local switches will be saved upon exiting
the map or saving, so they retain their state if you revisit it.


To do this, go to the map's custom parameters and specify

globalizeSwitches:[ID1, ID2, ...]

where ID1, ID2, ... are the IDs of all the switches you want saved.


There are also functions to get/set the state of a switch outside of it's
map for using with Execute Code events:

FotF_GetGlobalizedSwitch(mapID, switchID);							//mapID: ID of the target map		switchID: ID of the target switch

FotF_SetGlobalizedSwitch(mapID, switchID, toggle);					//toggle: true to turn switch on, false to turn it off

--------------------------------------------------------------------------*/
var FotF_SwitchSaveArray = null;
var FotF_LocalSwitchArray = null;
var FotF_SavedMapIds = null;

(function() {
	
	FotF_SetupSwitchArrays = ScriptCall_Setup;
	ScriptCall_Setup = function() {
		FotF_SetupSwitchArrays.call(this);
		
		FotF_SwitchSaveArray = [];
		FotF_LocalSwitchArray = [];
		FotF_SavedMapIds = [];
	};
	
	//Load SwitchSaveArray from save file
	FotF_LoadSwitchArray = LoadSaveScreen._executeLoad;
	LoadSaveScreen._executeLoad = function () {
		FotF_LoadSwitchArray.call(this);
		
		var i;
		var extData = root.getExternalData();
		var manager = root.getLoadSaveManager();
		var saveIndex = extData.getActiveSaveFileIndex();
		var saveFileInfo = manager.getSaveFileInfo(saveIndex);
		var saveObject = saveFileInfo.custom;
		var mapList = root.getBaseData().getMapList();
		
		if (typeof saveObject.globalizedSwitches !== 'undefined' && saveObject.globalizedSwitches !== null) {
			FotF_SwitchSaveArray = saveObject.globalizedSwitches
		} else {
		}
	};
	
	//Apply saved switches in array to map switches upon entering map
	var FotF_ApplyLocalSwitches = CurrentMap.prepareMap;
	CurrentMap.prepareMap = function() {
		
		FotF_ApplyLocalSwitches.call(this);
		
		var i, j;
		var mapInfo = root.getCurrentSession().getCurrentMapInfo();
		
		if (mapInfo !== null) {
			var mapID = mapInfo.getId();
			var switchTable = mapInfo.getLocalSwitchTable();
			
			for (i = 0; i < FotF_SwitchSaveArray.length; i++) {
				if (FotF_SwitchSaveArray[i][0] === mapID) {
					var arr = FotF_SwitchSaveArray[i];
					for (j = 1; j < arr.length; j++) {						//j = 1 to skip the mapID at index 0
						switchTable.setSwitch(arr[j], true);
					}
				} else {
				}
			}
		} else {
		}
	};
	
	//Save the switches of current map into the array upon exiting map
	FotF_SaveLocalSwitches = MapEndFlowEntry.enterFlowEntry;
	MapEndFlowEntry.enterFlowEntry = function(battleResultScene) {
		
		var i;
		var isNewEntry = true;
		var mapInfo = root.getCurrentSession().getCurrentMapInfo();
		FotF_LocalSwitchArray = [];
		
		if (mapInfo !== null) {
			var mapID = mapInfo.getId();
			var table = mapInfo.getLocalSwitchTable();
			var index = FotF_SavedMapIds.indexOf(mapID);
			
			FotF_LocalSwitchArray.push(mapID);
			
			if (mapInfo.custom.globalizeSwitches) {
				var arr = mapInfo.custom.globalizeSwitches;
				for (i = 0; i < arr.length; i++) {
					var switchID = arr[i];
					if (table.isSwitchOn(switchID) === true) {
						FotF_LocalSwitchArray.push(switchID);
					}
				}
			}
			
			for (i = 0; i < FotF_SwitchSaveArray.length; i++) {
				
				if (FotF_SwitchSaveArray[i][0] === mapID) {
					FotF_SwitchSaveArray.splice(i, 1);
					FotF_SwitchSaveArray.unshift(FotF_LocalSwitchArray);
					isNewEntry = false;
					break;
				}
			}
			
			if (isNewEntry === true) {
				FotF_SwitchSaveArray.unshift(FotF_LocalSwitchArray);
			}
		}
		return FotF_SaveLocalSwitches.call(this, battleResultScene);
	};
	
	//Save SwitchSaveArray to save file
	var FotF_SaveSwitchChanges = LoadSaveScreen._getCustomObject;
	LoadSaveScreen._getCustomObject = function() {
			
		var obj = FotF_SaveSwitchChanges.call(this);
		
		var i;
		var isNewEntry = true;
		var mapInfo = root.getCurrentSession().getCurrentMapInfo();
		FotF_LocalSwitchArray = [];
		
		if (mapInfo !== null) {
			var mapID = mapInfo.getId();
			var table = mapInfo.getLocalSwitchTable();
			var index = FotF_SavedMapIds.indexOf(mapID);
			
			FotF_LocalSwitchArray.push(mapID);
			
			if (mapInfo.custom.globalizeSwitches) {
				var arr = mapInfo.custom.globalizeSwitches;
				for (i = 0; i < arr.length; i++) {
					var switchID = arr[i];
					if (table.isSwitchOn(switchID) === true) {
						FotF_LocalSwitchArray.push(switchID);
					}
				}
			}
			
			for (i = 0; i < FotF_SwitchSaveArray.length; i++) {
				
				if (FotF_SwitchSaveArray[i][0] === mapID) {
					FotF_SwitchSaveArray.splice(i, 1);
					FotF_SwitchSaveArray.unshift(FotF_LocalSwitchArray);
					isNewEntry = false;
					break;
				}
			}
			
			if (isNewEntry === true) {
				FotF_SwitchSaveArray.unshift(FotF_LocalSwitchArray);
			}
		}
		
		obj.globalizedSwitches = FotF_SwitchSaveArray;
		
		return this._screenParam.customObject;
	};
	
})();

var FotF_GetGlobalizedSwitch = function(mapID, switchID) {
		
	var i, j;
	var arr = FotF_SwitchSaveArray;
	
	for (i = 0; i < arr.length; i++) {
		if (arr[i][0] === mapID) {
			arr2 = arr[i];
			for (j = 1; j < arr2.length; j++) {
				if (arr2[j] === switchID) {
					return true;
				}
			}
			return false;
		}
	}
	return false;			
};

var FotF_SetGlobalizedSwitch = function(mapID, switchID, toggle) {
	
	var i;
	var arr = FotF_SwitchSaveArray;
	
	for (i = 0; i < arr.length; i++) {
		if (arr[i][0] === mapID) {
			arr2 = arr[i];
			if (arr2.indexOf(switchID, 1) > -1 && toggle === false) {
				arr2.splice(arr2.indexOf(switchID), 1);
				break;
			} else if (arr2.indexOf(switchID, 1) < 0 && toggle === true) {
				arr2.push(switchID);
				break;
			}
		}
	}		
};