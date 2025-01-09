/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			Add a fade-in effect when music is played or changes!
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This quick plugin makes music fade in when it starts playing or the track
is changed. This is made possible by the new addition of the function

    getActiveMusicTime

in SRPG Studio's MediaControl wrapper. Using this function, this plugin will
monitor the active track's playback time and increase it's volume over a set
period of time until it reaches the volume set in the game's config dialogue.

_____________________________________________________________________________
					What music does this apply to?
_____________________________________________________________________________

It applies to music on the map (also easy/real battle) and in the base.

_____________________________________________________________________________
				What do I have to do to get it working?
_____________________________________________________________________________

It's (almost) plug-and-play! Create a global switch to toggle the plugin's
behavior on and off, change the switchId in this file's settings section to
the ID of your global switch and activate the global switch (preferably in
an opening event). Violà, your music now fades until you turn off the switch
again.

_____________________________________________________________________________
					I wanna change how fast it fades!
_____________________________________________________________________________

I got you! Adjust the values of the fade durations in the settings section to
your liking. The values are in game ticks, 60 ticks translate to 1 second (or
30 ticks if you're playing the game in software rendering mode).

_____________________________________________________________________________
							 NICE TO KNOW
_____________________________________________________________________________

When you tab out and don't have the option to play sounds in backgroud
enabled, the plugin will adjust the volume abruptly when you tab in.
This is to prevent the music volume getting stuck at lower levels if you
tab out during the fade.

_____________________________________________________________________________
							    EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth

  
Original Plugin Author:
Francis of the Filth
  
2025/01/10
Released

--------------------------------------------------------------------------*/

/////////////////////////////////////////////////////////////////////////////
/////							SETTINGS								/////
/////////////////////////////////////////////////////////////////////////////

var FotF_MusicFadeSettings = {
    fadeDurationMap: 180, //Duration of 1 fade in game ticks on the map (60 ticks = 1s)
    fadeDurationBase: 180, //Duration of 1 fade in game ticks in the base
    fadeDurationRealBattle: 120, //Duration of 1 fade in game ticks in real battle
    switchId: 42 //ID of global switch to toggle fading on/off
};

/////////////////////////////////////////////////////////////////////////////
/////								CODE								/////
/////////////////////////////////////////////////////////////////////////////

//Controls the music fading on a per-tick basis by monitoring the current playback time
//in comparison to the selected fade time for the current scene
var FotF_FadeMusic = function (fadeTime) {
    var switchTable = root.getMetaSession().getGlobalSwitchTable();
    var switchIndex = switchTable.getSwitchIndexFromId(FotF_MusicFadeSettings.switchId);
    var isFade = switchTable.isSwitchOn(switchIndex);
    var currentTime = MediaControl.getCurrentMusicTime();
    var tickTime = Math.floor((currentTime / 1000) * 60);
    if (isFade && tickTime < fadeTime) {
        var defaultVolume = 100 - 25 * root.getMetaSession().getDefaultEnvironmentValue(0);
        var newVolume = Math.round(defaultVolume * (tickTime / fadeTime));
        root.getMediaManager().setMusicVolume(newVolume);
    } else if (isFade && tickTime >= fadeTime) {
        var defaultVolume = 100 - 25 * root.getMetaSession().getDefaultEnvironmentValue(0);
        var newVolume = root.getMediaManager().getMusicVolume();
        if (newVolume !== defaultVolume) {
            root.getMediaManager().setMusicVolume(defaultVolume);
        }
    } else {
        var defaultVolume = 100 - 25 * root.getMetaSession().getDefaultEnvironmentValue(0);
        var newVolume = root.getMediaManager().getMusicVolume();
        if (newVolume !== defaultVolume) {
            root.getMediaManager().setMusicVolume(defaultVolume);
        }
    }
};

(function () {
    //Set initial map music volume to 0
    //Can't check for variable, because variable table isn't initialized yet
    //This "skips" the very firt frame of the music for every map - ah well...
    var FotF_PrepareMapMusicFade = MapLayer.prepareMapLayer;
    MapLayer.prepareMapLayer = function () {
        FotF_PrepareMapMusicFade.call(this);
        root.getMediaManager().setMusicVolume(0);
    };

    //Adjust map music volume according to play time
    var FotF_MoveMapMusicFade = MapLayer.moveMapLayer;
    MapLayer.moveMapLayer = function () {
        FotF_FadeMusic(FotF_MusicFadeSettings.fadeDurationMap);
        return FotF_MoveMapMusicFade.call(this);
    };

    //Set intial rest music volume to 0
    //Same as with MapLayer, the first frame is skipped
    var FotF_PrepareRestMusicFade = RestMusicFlowEntry._playSetupMusic;
    RestMusicFlowEntry._playSetupMusic = function (restScene) {
        FotF_PrepareRestMusicFade.call(this, restScene);
        var area = restScene.getRestArea();
        if (area !== null) {
            root.getMediaManager().setMusicVolume(0);
        }
    };

    //Adjust base music volume according to play time
    var FotF_MoveRestMusicFade = RestScene.moveSceneCycle;
    RestScene.moveSceneCycle = function () {
        FotF_FadeMusic(FotF_MusicFadeSettings.fadeDurationBase);
        return FotF_MoveRestMusicFade.call(this);
    };

    //Set initial battle music volume to 0 if it's changed from map music
    var FotF_PrepareBattleMusicFade = BattleMusicControl.playBattleMusic;
    BattleMusicControl.playBattleMusic = function (battleTable, isForce) {
        var data = this._getBattleMusicData(battleTable);

        if (data.isNew || isForce) {
            root.getMediaManager().setMusicVolume(0);
        }

        return FotF_PrepareBattleMusicFade.call(this, battleTable, isForce);
    };

    //Adjust battle music volume according to play time
    var FotF_MoveBattleMusicFade = RealBattle.moveBattleCycle;
    RealBattle.moveBattleCycle = function () {
        FotF_FadeMusic(FotF_MusicFadeSettings.fadeDurationRealBattle);
        return FotF_MoveBattleMusicFade.call(this);
    };
})();
