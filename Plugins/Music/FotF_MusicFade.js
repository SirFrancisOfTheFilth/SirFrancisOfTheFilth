/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			Add a fade-in effect when music is played or changes!
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This plugin makes music fade in when it starts playing or the track is
changed, as well as making it fade out when the track ends or changes.
This is made possible by the new addition of the functions

    getActiveMusicTime

            and

    getActiveMusicDuration

to SRPG Studio's API. Using this function, this plugin will monitor the active
track's playback time and increase it's volume over a set period of time until
it reaches the volume set in the game's config dialogue, or 0 if fading out.

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
					Can I change the music with events?
_____________________________________________________________________________

Yes, but not the conventional way. Normally you'd play the new track using
"Play Music" or change the map music with "Change Map Info". I combined these
two features into an executable function that will queue the selected track
and begin the fade-out. To use it, set up an "Execute Script" event command
set to "Execute Code" and paste the following in the prompt box:

    var arr = [1,1,1,1,1,1,1]
    FotF_MusicFadeControl.initiateFadeOut(fadeTime, isRuntime, id, arr);

arr is an array containing the map music overwrite info. 1 means overwrite,
while 0 means don't overwrite. The order is player turn, enemy turn, ally
turn, player battle, enemy battle, ally battle, battle setup.

Now replace fadeTime with the number of ticks the fade out should take,
isRuntime with true for RTP music and false for original music and id with
the ID of the track.
_____________________________________________________________________________
							 NICE TO KNOW
_____________________________________________________________________________

When you tab out and don't have the option to play sounds in backgroud
enabled, the plugin will adjust the volume abruptly when you tab in.
This is to prevent the music volume from getting stuck at lower levels if you
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

2025/05/10
Added fade out with requested API function getAciveMusicDuration

--------------------------------------------------------------------------*/

/////////////////////////////////////////////////////////////////////////////
/////							SETTINGS								/////
/////////////////////////////////////////////////////////////////////////////

var FotF_MusicFadeSettings = {
    fadeInDurationMap: 180, //Duration of fade-in in game ticks on the map (60 ticks = 1s)
    fadeOutDurationMap: 180, //Duration of fade-out in game ticks on the map (60 ticks = 1s)
    fadeInDurationBase: 180, //Duration of fade-in in game ticks in the base (60 ticks = 1s)
    fadeOutDurationBase: 180, //Duration of fade-out in game ticks in the base (60 ticks = 1s)
    fadeInDurationBattle: 120, //Duration of fade-in in game ticks in battle (60 ticks = 1s)
    fadeOutDurationBattle: 120, //Duration of fade-out in game ticks in battle (60 ticks = 1s)
    switchId: 42 //ID of global switch to toggle fading on/off
};

/////////////////////////////////////////////////////////////////////////////
/////								CODE								/////
/////////////////////////////////////////////////////////////////////////////

var FotF_MusicQueue = {
    handle: null,
    time: null,
    maxTime: null,
    overwriteArray: null
};

//Controls the music fading on a per-tick basis by monitoring the current playback time
//in comparison to the selected fade time for the current scene
var FotF_FadeMusic = function (sceneType) {
    var ctrl = FotF_MusicFadeControl;
    var fadeTimes = ctrl.getFadeDuration(sceneType);
    var currentTime = MediaControl.getCurrentMusicTime();
    var tickTime = ctrl.getTickTime(currentTime);
    var maxTime = root.getMediaManager().getActiveMusicDuration();
    var maxTicks = ctrl.getTickTime(maxTime);
    var tickDiff = maxTicks - tickTime;
    var defaultVolume = ctrl.getDefaultVolume();

    if (tickTime < fadeTimes[0]) {
        var newVolume = ctrl.getFadeVolume(defaultVolume, tickTime, fadeTimes[0]);
        root.getMediaManager().setMusicVolume(newVolume);
    } else if (tickDiff < fadeTimes[1]) {
        var newVolume = ctrl.getFadeVolume(defaultVolume, tickDiff, fadeTimes[1]);
        root.getMediaManager().setMusicVolume(newVolume);
    } else {
        var defaultVolume = 100 - 25 * root.getMetaSession().getDefaultEnvironmentValue(0);
        var checkVolume = root.getMediaManager().getMusicVolume();
        if (checkVolume !== defaultVolume) {
            root.getMediaManager().setMusicVolume(defaultVolume);
        }
    }

    if (FotF_MusicQueue.handle !== null) {
        if (FotF_MusicQueue.time > 0) {
            var newVolume = ctrl.getFadeVolume(defaultVolume, FotF_MusicQueue.time, FotF_MusicQueue.maxTime);
            root.getMediaManager().setMusicVolume(newVolume);
            FotF_MusicQueue.time--;
        } else {
            ctrl.overwriteMapMusic(FotF_MusicQueue.handle, FotF_MusicQueue.overwriteArray);
            root.getMediaManager().setMusicVolume(0);
            MediaControl.musicPlayNew(FotF_MusicQueue.handle);
            root.getMediaManager().setMusicVolume(0); //Yes setting it to 0 two times actually makes the transition smoother
            FotF_MusicQueue.handle = null;
            FotF_MusicQueue.time = null;
            FotF_MusicQueue.maxTime = null;
            FotF_MusicQueue.overwriteArray = null;
        }
    }
};

var FotF_MusicFadeControl = {
    getDefaultVolume: function () {
        return 100 - 25 * root.getMetaSession().getDefaultEnvironmentValue(0);
    },

    getFadeVolume: function (defaultVolume, tickTime, fadeTime) {
        var volume = Math.round(defaultVolume * (tickTime / fadeTime));

        if (typeof volume === 'number' && volume <= 100 && volume >= 0) {
            return volume;
        }

        return this.getDefaultVolume();
    },

    getTickTime: function (currentTime) {
        var time = Math.floor((currentTime / 1000) * 60);

        if (typeof time === 'number' && time >= 0) {
            return time;
        }

        return 0;
    },

    getFadeDuration: function (sceneType) {
        var cfg = FotF_MusicFadeSettings;
        if (sceneType === SceneType.FREE) {
            return [cfg.fadeInDurationMap, cfg.fadeOutDurationMap];
        } else if (sceneType === SceneType.REST) {
            return [cfg.fadeInDurationBase, cfg.fadeOutDurationBase];
        } else if (sceneType === SceneType.BATTLESETUP) {
            return [cfg.fadeInDurationBattle, cfg.fadeOutDurationBattle];
        }

        return 0;
    },

    isFadeEnabled: function () {
        var switchTable = root.getMetaSession().getGlobalSwitchTable();
        var switchIndex = switchTable.getSwitchIndexFromId(FotF_MusicFadeSettings.switchId);
        return switchTable.isSwitchOn(switchIndex);
    },

    initiateFadeOut: function (fadeTime, isRuntime, musicId, overwriteArray) {
        var handle = root.createResourceHandle(isRuntime, musicId, 0, 0, 0);
        FotF_MusicQueue.handle = handle;
        FotF_MusicQueue.time = fadeTime;
        FotF_MusicQueue.maxTime = fadeTime;
        FotF_MusicQueue.overwriteArray = overwriteArray;
    },

    overwriteMapMusic: function (handle, arr) {
        var mapInfo = root.getCurrentSession().getCurrentMapInfo();

        if (arr[0] == true) {
            mapInfo.setPlayerTurnMusicHandle(handle);
        } else if (arr[1] == true) {
            mapInfo.setEnemyTurnMusicHandle(handle);
        } else if (arr[2] == true) {
            mapInfo.setAllyTurnMusicHandle(handle);
        } else if (arr[3] == true) {
            mapInfo.setPlayerBattleMusicHandle(handle);
        } else if (arr[4] == true) {
            mapInfo.setEnemyBattleMusicHandle(handle);
        } else if (arr[5] == true) {
            mapInfo.setAllyBattleMusicHandle(handle);
        } else if (arr[6] == true) {
            mapInfo.setBattleSetupMusicHandle(handle);
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
        var ctrl = FotF_MusicFadeControl;
        var isFade = ctrl.isFadeEnabled();
        if (isFade) {
            FotF_FadeMusic(SceneType.FREE);
        }

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
        var ctrl = FotF_MusicFadeControl;
        var isFade = ctrl.isFadeEnabled();
        if (isFade) {
            FotF_FadeMusic(SceneType.REST);
        }
        return FotF_MoveRestMusicFade.call(this);
    };

    //Set initial battle music volume to 0 if it's changed from map music
    var FotF_PrepareBattleMusicFade = BattleMusicControl.playBattleMusic;
    BattleMusicControl.playBattleMusic = function (battleTable, isForce) {
        if (FotF_MusicFadeControl.isFadeEnabled()) {
            var handleActive;
            var data = this._getBattleMusicData(battleTable);
            var handle = data.handle;
            var isMusicPlay = false;
            var cfg = FotF_MusicFadeSettings;

            if (handle.isNullHandle()) {
                isMusicPlay = false;
            } else {
                handleActive = root.getMediaManager().getActiveMusicHandle();
                if (handle.isEqualHandle(handleActive)) {
                    // Don't play background music because the background music which was about to be played has already been played.
                    isMusicPlay = false;
                } else {
                    if (data.isNew) {
                        FotF_MusicFadeControl.initiateFadeOut(cfg.fadeOutDurationBattle, data.handle.getHandleType(), data.handle.getResourceId(), [0, 0, 0, 0, 0, 0, 0]);
                        root.getMediaManager().setMusicVolume(0);
                        this._restorePreviousMusicTime(handle);
                        this._arrangeMapMusic(handle);
                    } else if (isForce) {
                        FotF_MusicFadeControl.initiateFadeOut(cfg.fadeOutDurationBattle, data.handle.getHandleType(), data.handle.getResourceId(), [0, 0, 0, 0, 0, 0, 0]);
                        root.getMediaManager().setMusicVolume(0);
                        this._restorePreviousMusicTime(handle);
                        isMusicPlay = true;
                    }
                }
            }

            return isMusicPlay;
        }

        return FotF_PrepareBattleMusicFade.call(this, battleTable, isForce);
    };

    //Adjust battle music volume according to play time
    var FotF_MoveBattleMusicFade = RealBattle.moveBattleCycle;
    RealBattle.moveBattleCycle = function () {
        var ctrl = FotF_MusicFadeControl;
        var isFade = ctrl.isFadeEnabled();
        if (isFade) {
            FotF_FadeMusic(SceneType.BATTLESETUP);
        }
        return FotF_MoveBattleMusicFade.call(this);
    };
})();
