/*--------------------------------------------------------------------------
  This plugin draws support skill ranges of units when enemy ranges are displayed
  using the cancel key (X or CTRL by default).
  
  It is plug-and-play, just drop the file in your plugin folder.
  
  If you don't like the color or opacity of the tiles, they can be adjusted
  in the settings below.
  
  If you have any questions about this plugin, feel free to reach out to me
  over the SRPG Studio University Discord server @francisofthefilth
  
  Original Plugin Author:
  Francis of the Filth
  
  2024/02/25 Released
  
--------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------
							Settings
----------------------------------------------------------------------------*/
var FotF_SupportRangeCache = null;													//No touchy!
var FotF_SupportRangeColor = 0x00FF00;												//Color of the support range tiles (Hexadecimal color code, default 0x00FF00 --> Green)
var FotF_SupportRangeAlpha = 102;													//Transparency of the support range tiles (0-255, default 102 --> 40% opacity)

(function () {
	
	FotF_SupportRangeMapLayer = MapLayer.drawUnitLayer;
	MapLayer.drawUnitLayer = function () {
		FotF_SupportRangeMapLayer.call(this);
		if (FotF_SupportRangeCache === null) {
			FotF_CreateMergeArray();
		}
	};
	
	//For re-calculating the support range cache when units move during movement simulation
	var FotF_ResetSupportRangeCache = SimulateMove._endMove;
	SimulateMove._endMove = function(unit) {
		FotF_ResetSupportRangeCache.call(this, unit);
		
		if (FotF_SupportRangeCache !== null) {
			FotF_SupportRangeCache = null;
			root.log('FotF_SupportRangeCache reset');
		}
	}
	
	//For re-calculating the support range cache when unit movement is canceled
	var FotF_ResetSupportRangeCache2 = PlayerTurn.setPosValue;
	PlayerTurn.setPosValue = function(unit) {
		FotF_ResetSupportRangeCache2.call(this, unit);
		
		if (FotF_SupportRangeCache !== null) {
			FotF_SupportRangeCache = null;
			root.log('FotF_SupportRangeCache reset');
		}
	};

	FotF_DrawSupportRange = MarkingPanel.drawMarkingPanel;
	MarkingPanel.drawMarkingPanel = function () {
		FotF_DrawSupportRange.call(this);
		
		if (!this.isMarkingEnabled()) {
			return;
		}

		if (FotF_SupportRangeCache !== null) {
			root.drawFadeLight(FotF_SupportRangeCache, FotF_SupportRangeColor, FotF_SupportRangeAlpha);
		}
	};

})();

FotF_CreateMergeArray = function() {
		
	var j;
	var session = root.getCurrentSession();
	var mapData = session.getCurrentMapInfo();
	var mapwidth = mapData.getMapWidth() * GraphicsFormat.MAPCHIP_WIDTH;
	var mapheight = mapData.getMapHeight() * GraphicsFormat.MAPCHIP_HEIGHT;
	var screenwidth = root.getWindowWidth();
	var screenheight = root.getWindowHeight();
	var playerList = session.getPlayerList();
	var enemyList = session.getEnemyList();
	var allyList = session.getAllyList();
	var playerCount = playerList.getCount();
	var enemyCount = enemyList.getCount();
	var allyCount = allyList.getCount();
	var graphicsManager = root.getGraphicsManager();
	
	mergeArray = []
	
	for (j = 0; j < playerCount; j++) {
		
		unit = playerList.getData(j);
		var i, skill, indexArray;
		var arr = SkillControl.getDirectSkillArray(unit, SkillType.SUPPORT, '');
		var count = arr.length;
		
		for (i = 0; i < count; i++) {
			skill = arr[i].skill;
			indexArray = null;
			
			if (skill.getRangeType() === SelectionRangeType.SELFONLY) {
				indexArray = IndexArray.getBestIndexArray(unit.getMapX(), unit.getMapY(), 0, 0);
				//Draw self range (i.e. unit's own position)
			}
			else {
				if (skill.getRangeType() === SelectionRangeType.ALL) {
					// Do not render if range is ALL (just think of the lag, also it would look horrible)
					
				} else if (skill.getRangeType() === SelectionRangeType.MULTI) {
					indexArray = IndexArray.getBestIndexArray(unit.getMapX(), unit.getMapY(), 1, skill.getRangeValue());
					//Draw flexible range
				} else {
					root.log('set indexArray to null');
					indexArray = null;
				}
			}
		}
		if (indexArray !== null && typeof indexArray === 'object') {
			root.log(unit.getName());
			root.log('pushed index array: ' + indexArray);
			mergeArray = mergeArray.concat(indexArray);
			root.log('merge array: ' + mergeArray);
			indexArray = null;
			root.log('set indexArray to null');
		}
	}
	
	for (j = 0; j < enemyCount; j++) {
		
		unit = enemyList.getData(j);
		var i, skill, indexArray;
		var arr = SkillControl.getDirectSkillArray(unit, SkillType.SUPPORT, '');
		var count = arr.length;
		
		for (i = 0; i < count; i++) {
			skill = arr[i].skill;
			indexArray = null;
			
			if (skill.getRangeType() === SelectionRangeType.SELFONLY) {
				indexArray = IndexArray.getBestIndexArray(unit.getMapX(), unit.getMapY(), 0, 0);
				//draw self range (i.e. unit's own position)
			}
			else {
				if (skill.getRangeType() === SelectionRangeType.ALL) {
					// Do not render if range is ALL (just think of the lag)
					
				} else if (skill.getRangeType() === SelectionRangeType.MULTI) {
					indexArray = IndexArray.getBestIndexArray(unit.getMapX(), unit.getMapY(), 1, skill.getRangeValue());
					// Draw specified range
				} else {
					root.log('set indexArray to null');
					indexArray = null;
				}
			}
		}
		if (indexArray !== null && typeof indexArray === 'object') {
			root.log(unit.getName());
			root.log('pushed index array: ' + indexArray);
			mergeArray = mergeArray.concat(indexArray);
			root.log('merge array: ' + mergeArray);
			indexArray = null;
			root.log('set indexArray to null');
		}
	}
	
	for (j = 0; j < allyCount; j++) {
		
		unit = allyList.getData(j);
		var i, skill, indexArray;
		var arr = SkillControl.getDirectSkillArray(unit, SkillType.SUPPORT, '');
		var count = arr.length;
		
		for (i = 0; i < count; i++) {
			skill = arr[i].skill;
			indexArray = null;
			
			if (skill.getRangeType() === SelectionRangeType.SELFONLY) {
				indexArray = IndexArray.getBestIndexArray(unit.getMapX(), unit.getMapY(), 0, 0);
				//draw self range (i.e. unit's own position)
			}
			else {
				if (skill.getRangeType() === SelectionRangeType.ALL) {
					// Do not render if range is ALL (just think of the lag)
					
				} else if (skill.getRangeType() === SelectionRangeType.MULTI) {
					indexArray = IndexArray.getBestIndexArray(unit.getMapX(), unit.getMapY(), 1, skill.getRangeValue());
					// Draw specified range
				} else {
					root.log('set indexArray to null');
					indexArray = null;
				}
			}
		}
		if (indexArray !== null && typeof indexArray === 'object') {
			root.log(unit.getName());
			root.log('pushed index array: ' + indexArray);
			mergeArray = mergeArray.concat(indexArray);
			root.log('merge array: ' + mergeArray);
			indexArray = null;
			root.log('set indexArray to null');
		}
	}
	
	//root.drawFadeLight(mergeArray, FotF_SupportRangeColor, FotF_SupportRangeAlpha);
	//graphicsManager.resetRenderCache();
	root.log('support range cache created');
	FotF_SupportRangeCache = mergeArray
	//return mergeArray;
};