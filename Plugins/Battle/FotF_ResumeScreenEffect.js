/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Continue screen effects in real battle after their animation has ended
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In real battle, screen effects only last as long as the animations that
introduced them do. This plugin lets you prolong the effect until you dispell
it or the battle ends.
_____________________________________________________________________________
						        HOW TO USE
_____________________________________________________________________________

To save a screen effect, select the animation that introduces it into the
battle and on any frame after the effect is produced (preferrably the last
frame of that animation), set the custom parameter

{
    saveScreenEffect: true
}

This will save the state of the screen effect on that frame (so if it has a
fade effect that is not fully resolved yet, the saved screen effect will
retain that state).

To remove the screen effect again, set

{
    saveScreenEffect: false
}

on any frame of any animation that comes after the effect was saved (can be
the same animation where it was saved).

Only one effect can be saved at any time and there is no fade out effect.
A fade out can be achieved by clearing the effect and instantly setting the
same effect normally, then letting it fade out normally. The saved effect is
automatically cleared when the battle ends.

_____________________________________________________________________________
						    COMPATIBILITY
_____________________________________________________________________________

No functions were overwritten :)

_____________________________________________________________________________
							  EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
namae_kakkokari

Rewritten by:
Francis of the Filth

2026/01/02
Released

--------------------------------------------------------------------------*/

RealBattle._savedScreenEffect = null;

(function () {
    var FotF_DrawContinuousScreenEffect = UIBattleLayout._drawColor;
    UIBattleLayout._drawColor = function (rangeType) {
        var i, effect, motion;
        var effectArray = this._realBattle.getEffectArray();
        var count = effectArray.length;

        for (i = 0; i < count; i++) {
            effect = effectArray[i];
            motion = effect.getAnimeMotion();

            if (motion !== null) {
                var motionId = motion.getMotionId();
                var frameIndex = motion.getFrameIndex();
                var custom = motion.getAnimeData().getFrameCustom(motionId, frameIndex);

                if (typeof custom === 'object' && typeof custom.saveScreenEffect === 'boolean') {
                    if (custom.saveScreenEffect === true) {
                        this._realBattle._savedScreenEffect = {
                            color: motion.getScreenColor(),
                            alpha: motion.getScreenAlpha(),
                            rangeType: motion.getScreenEffectRangeType(),
                            animeId: motion.getAnimeData().getId() //This is to prevent "stacking" of the effect
                        };
                    } else if (custom.saveScreenEffect === false) {
                        this._realBattle._savedScreenEffect = null;
                    }
                }
            }
        }

        FotF_DrawContinuousScreenEffect.call(this, rangeType);

        if (this._realBattle._savedScreenEffect !== null) {
            var color = this._realBattle._savedScreenEffect.color;
            var alpha = this._realBattle._savedScreenEffect.alpha;
            var rangeType2 = this._realBattle._savedScreenEffect.rangeType;
            var animeId = this._realBattle._savedScreenEffect.animeId;

            if (rangeType2 === rangeType && !this.isMotionActive(animeId)) {
                root.getGraphicsManager().fillRange(0, 0, root.getGameAreaWidth(), root.getGameAreaHeight(), color, alpha);
            }
        }
    };
})();

UIBattleLayout.isMotionActive = function (motionId) {
    var i;
    var effectArray = this._realBattle.getEffectArray();

    for (i = 0; i < effectArray.length; i++) {
        var effect = effectArray[i];
        var motion = effect.getAnimeMotion();

        if (motion !== null) {
            var refId = motion.getAnimeData().getId();
            if (refId === motionId) {
                return true;
            }
        }
    }

    return false;
};
