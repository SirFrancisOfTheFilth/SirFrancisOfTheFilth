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