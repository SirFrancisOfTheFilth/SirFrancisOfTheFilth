/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                Easily apply an offset to battle motions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

With this plugin you can give a battle motion the custom parameter

    {
        motionOffset: {
            x: 0,
            y: 0
        }
    }

where you replace the 0s with the offset coordinates you want to apply to
the motion. Be sure to apply it to the motions's custom parameter, not the
custom parameters of the animations the motion consists of.

While y offsets are easy (+ is down, - is up), x offsets are always from the
perspective of the right battler. So if you want the battler to stand further
towards the opponent, you need to set a negative x offset, while positive
offsets increase the spacing.

Offsets only apply to units that approach during the battle.
_____________________________________________________________________________
						        EXAMPLE
_____________________________________________________________________________

Let's say you have an armored knight, who moves far slower than other classes
and you don't want the walk animation to take so long. You could position the
armor knight closer to the opponent by setting an x offset of -100:

    {
        motionOffset: {
            x: -100,
            y: 0
        }
    }


Another example could be a flying unit that starts higher up than others.
For this you simply set a negative y offset:

    {
        motionOffset: {
            x: 0,
            y: -60
        }
    }

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

(function () {
    var alias1 = AnimeMotion.setMotionParam;
    AnimeMotion.setMotionParam = function (motionParam) {
        var dx = 0;
        var dy = 0;
        var custom = motionParam.animeData.custom;

        if (motionParam.isOffsetAllowed && typeof custom === 'object' && custom !== null) {
            var cuspara = custom.motionOffset;
            if (typeof cuspara === 'object') {
                dx = cuspara.x;
                dy = cuspara.y;
            }

            if (!motionParam.isRight) {
                dx *= -1;
            }

            this.setSpriteOffset(dx, dy);
        }

        alias1.call(this, motionParam);
    };

    var alias2 = BaseBattler.setupRealBattler;
    BaseBattler.setupRealBattler = function (motionParam, isSrc, realBattle) {
        alias2.call(this, motionParam, isSrc, realBattle);

        motionParam.isOffsetAllowed = FotF_MotionOffsetControl.isOffsetAllowed(isSrc, realBattle);
        this._motion.setMotionParam(motionParam);
    };

    var FotF_AddSourceToMotionParam = StructureBuilder.buildMotionParam;
    StructureBuilder.buildMotionParam = function () {
        var motionParam = FotF_AddSourceToMotionParam.call(this);
        motionParam.isOffsetAllowed = false;

        return motionParam;
    };
})();

var FotF_MotionOffsetControl = {
    isOffsetAllowed: function (isSrc, realBattle) {
        var i;
        var battler = realBattle._battlerLeft;

        if ((isSrc && !battler._isSrc) || (!isSrc && battler._isSrc)) {
            battler = realBattle._battlerRight;
        }

        var motion = battler._motion;

        if (typeof motion !== 'undefined' && motion !== null) {
            var animeData = motion.getAnimeData();
            var count = animeData.getMotionCount();
            for (i = 0; i < count; i++) {
                var id = animeData.getMotionIdFromIndex(i);
                var type = animeData.getMotionCategoryType(id);

                if (type === MotionCategoryType.APPROACH) {
                    return true;
                }
            }
        }

        return false;
    }
};
