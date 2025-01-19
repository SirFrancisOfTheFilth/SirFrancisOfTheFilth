/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            Prevent units from attacking if their weapon
            has a custom parameter and they moved beforehand
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Just as the title says, units won't be able to attack with a weapon with
custom parameter "beforeMov" if they moved before attacking.

This can be used to enforce high damage, high range weapons to limit movement
without limiting the unit's movement altogether.

AI with such weapons will attack only before moving (if possible) and you
can use the already existing enemy canto plugin to make them use leftover
movement.

_____________________________________________________________________________
								EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2025/01/19
Released

--------------------------------------------------------------------------*/

(function () {
    //Disallow weapon if player unit moved prior and weapon has custom param "beforeMov"
    var FotF_DisableBeforeMoveWeaponPlayer = WeaponSelectMenu._isWeaponAllowed;
    WeaponSelectMenu._isWeaponAllowed = function (unit, item) {
        if (item.custom.beforeMov) {
            var move = unit.getMostResentMov();
            if (move > 0) {
                return false;
            }
        }
        return FotF_DisableBeforeMoveWeaponPlayer.call(this, unit, item);
    };

    //Limits attacks AI can make to ones where it doesn't move beforehand
    //if it's weapon has custom param "beforeMov", works with Enemy Canto
    var FotF_DisableBeforeMoveWeaponAI = BaseCombinationCollector._createCostArrayInternal;
    BaseCombinationCollector._createCostArrayInternal = function (misc) {
        if (misc.item !== null && misc.item.custom.beforeMov) {
            var x, y, posUnit;
            var posIndex = misc.posIndex;
            var movePoint = misc.movePoint;

            if (movePoint === AIValue.MAX_MOVE) {
                return;
            }

            x = CurrentMap.getX(posIndex);
            y = CurrentMap.getY(posIndex);

            var startRange = item.getStartRange();
            var endRange = item.getEndRange();
            if (movePoint === 0) {
                var x = CurrentMap.getX(misc.posIndex);
                var y = CurrentMap.getY(misc.posIndex);
                if (misc.isForce) {
                    this._createAndPushCost(misc);
                } else {
                    // There is a possibility that the player exists at the position (the player is processed to be passable).
                    // So check if the unit who is not myself exists.
                    posUnit = PosChecker.getUnitFromPos(x, y);
                    if (posUnit === null || posUnit === misc.unit) {
                        // Create the cost because it can move to this position.
                        // The cost includes a target position to move and necessary steps to move.
                        this._createAndPushCost(misc);
                    } else {
                        this._createAndPushCostUnused(misc);
                    }
                }
            }
        } else {
            FotF_DisableBeforeMoveWeaponAI.call(this, misc);
        }
    };
})();
