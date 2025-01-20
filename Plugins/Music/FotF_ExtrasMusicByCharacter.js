/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		Make every character have their own theme in the extras screen!
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

With this you can set a custom track to play for every character in the
extras screen. Simply go into Story Settings > Characters > Custom Parameters
and give everyone you'd like the parameter extraMusicHandle.

The value for the parameter is an array containing if it's runtime or
original music and the music's ID. You write it out like this:

    {
    extraMusicHandle: [isRuntime, ID]
    }

isRuntime is true for RTP music and false for original music.
ID is the ID of the track.

_____________________________________________________________________________
							 NICE TO KNOW
_____________________________________________________________________________

If you switch to a character that doesn't have the parameter set, the music
will return to the default extras music. Canceling the screen do the same.
Music continues unless a new track is played.
_____________________________________________________________________________
							    EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth

  
Original Plugin Author:
Francis of the Filth
  
2025/01/20
Released

--------------------------------------------------------------------------*/

/////////////////////////////////////////////////////////////////////////////
/////								CODE								/////
/////////////////////////////////////////////////////////////////////////////

CharacterScreen._isMusicPlay = null;

CharacterScreen._setPageData = function () {
    unit = this._scrollbar.getObject();
    cuspara = unit.custom.extraMusicHandle;

    if (typeof cuspara !== 'undefined') {
        var handle = root.createResourceHandle(cuspara[0], cuspara[1], 0, 0, 0);
        if (!handle.isEqualHandle(root.getMediaManager().getActiveMusicHandle())) {
            MediaControl.musicPlay(handle);
            this._isMusicPlay = true;
        }
    } else {
        if (this._isMusicPlay) {
            MediaControl.musicStop(MusicStopType.BACK);
            this._isMusicPlay = false;
        } else {
            var handle = this.getScreenMusicHandle();
            if (!handle.isEqualHandle(root.getMediaManager().getActiveMusicHandle())) {
                MediaControl.musicPlay(handle);
            }
        }
    }

    this._storyDataChanger.setPageData(this._messagePager.getPagerWidth(), 120);
};

CharacterScreen._moveMain = function () {
    var index;

    this._storyDataChanger.movePage();

    if (InputControl.isCancelAction()) {
        if (this._isMusicPlay) {
            MediaControl.musicStop(MusicStopType.BACK);
        }
        MouseControl.changeCursorFromScrollbar(this._scrollbar, this._scrollbar.getIndex());
        this._playCancelSound();
        this.changeCycleMode(DictionaryMode.TOP);
    } else if (this._storyDataChanger.checkPage()) {
        this._changeNewPage(false);
    } else {
        index = this._dataChanger.checkDataIndex(this._scrollbar, null);
        if (index !== -1) {
            this._scrollbar.setIndex(index);
            this._changeNewPage(true);
        }
    }

    return MoveResult.CONTINUE;
};
