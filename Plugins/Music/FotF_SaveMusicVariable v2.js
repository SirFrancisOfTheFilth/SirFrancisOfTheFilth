/*--------------------------------------------------------------------------
This plugin adds functions to save the currently playing player turn music into
a variable and play it at a later time.

How to use:

To save music to a variable, use the function

SaveMusicVariable(index, ID)					//index = tab in the variable table (starts with 0!)	ID = ID of the variable within the specified tab

in an Execute Event > Execute Code event command.

To change the map music according to a variable, use

LoadMusicVariable((index, ID, isRuntime)			//index and ID are the same as in SaveMusicVariable	isRuntime is true for RTP music and false for original music

or

LoadMusicVariableNoPlay((index, ID, isRuntime)			//This function doesn't play the music right away, only changes it


Original Plugin Author:
Francis of the Filth
  
Plugin History:
2023/12/03 Released
  
--------------------------------------------------------------------------*/
var SaveMusicVariable = function(index, ID) {
	
	var mapInfoHandle = root.getCurrentSession().getCurrentMapInfo();
	var musicID = mapInfoHandle.getPlayerTurnMusicHandle().getResourceID();
	root.log('musicID: ' + musicID);
	var table = root.getMetaSession().getVariableTable(index);
	var variableIndex = table.getVariableIndexfromID(ID);
	root.log('variableIndex: ' + variableIndex);
	var variableValue = table.getVariable(variableIndex);
	root.log('variableValue before: ' + variableValue);
	
	table.setVariable(variableIndex, musicID);
	var variableValue = table.getVariable(variableIndex);
	root.log('variableValue after: ' + variableValue);

};

var LoadMusicVariable = function(index, ID, isRuntime) {

	var table = root.getMetaSession().getVariableTable(index);
	var variableIndex = table.getVariableIndexfromID(ID);
	var variableValue = table.getVariable(variableIndex);
	var mapInfoHandle = root.getCurrentSession().getCurrentMapInfo();

	var list, count, mediaIndex, mediaData, mediaId;
	
	list = root.getBaseData().getMediaResourceList(MediaType.MUSIC, isRuntime);
	mediaData = list.getData(variableValue);
	mediaId = mediaData.getId();
		
	var musicHandle = root.createResourceHandle(isRuntime, mediaId, 0, 0, 0);
	
	root.log('variableValue used: ' + variableValue);
	mapInfoHandle.setPlayerTurnMusicHandle(musicHandle);
	mapInfoHandle.setEnemyTurnMusicHandle(musicHandle);
	mapInfoHandle.setAllyTurnMusicHandle(musicHandle);
	mapInfoHandle.setPlayerBattleMusicHandle(musicHandle);
	mapInfoHandle.setEnemyBattleMusicHandle(musicHandle);
	mapInfoHandle.setAllyBattleMusicHandle(musicHandle);
	mapInfoHandle.setBattleSetupMusicHandle(musicHandle);
	MediaControl.resetMusicList();
	MediaControl.musicPlayNew(musicHandle);

};

var LoadMusicVariableNoPlay = function(index, ID, isRuntime) {

	var table = root.getMetaSession().getVariableTable(index);
	var variableIndex = table.getVariableIndexfromID(ID);
	var variableValue = table.getVariable(variableIndex);
	var mapInfoHandle = root.getCurrentSession().getCurrentMapInfo();

	var list, count, mediaIndex, mediaData, mediaId;
	
	list = root.getBaseData().getMediaResourceList(MediaType.MUSIC, isRuntime);
	mediaData = list.getData(variableValue);
	mediaId = mediaData.getId();
		
	var musicHandle = root.createResourceHandle(isRuntime, mediaId, 0, 0, 0);
	
	root.log('variableValue used: ' + variableValue);
	mapInfoHandle.setPlayerTurnMusicHandle(musicHandle);
	mapInfoHandle.setEnemyTurnMusicHandle(musicHandle);
	mapInfoHandle.setAllyTurnMusicHandle(musicHandle);
	mapInfoHandle.setPlayerBattleMusicHandle(musicHandle);
	mapInfoHandle.setEnemyBattleMusicHandle(musicHandle);
	mapInfoHandle.setAllyBattleMusicHandle(musicHandle);
	mapInfoHandle.setBattleSetupMusicHandle(musicHandle);

};
