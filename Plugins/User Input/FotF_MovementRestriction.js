/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          Restrict unit movement and create "invisible walls"
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This plugin combines two features:

    -   A custom parameter to limit a unit's movement to specific patterns
        (Like for example chess piece movements)

    -   Modifying the behavior of "Passable Directions" of terrain, so it
        works both ways. This means you can create "invisible walls" between
        the faces of any 2 tiles.

_____________________________________________________________________________
						         Setup
_____________________________________________________________________________

To set up individual movement patterns for units, give them the custom
parameter

    restrictMovement: [[x, y], [x, y], ...]

The inner arrays are coordinates relative to the unit's own position, so
[0, -1] means 1 tile up, [-1, 2] means 1 tile to the left and 2 tiles down,
basically a move the knight in chess could make (jumping).

So to get the movement pattern of a chess knight, this would be the cuspara:

    restrictMovement: [[1, -2], [2, -1], [2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2]]

Actual jumping is not possible, unless the unit can traverse any terrain, so
walls will still block this movement and units will still walk around walls
to reach the location, if possible. The movement stat is not ignored, so a
unit will not be able to jump over walls that have a far away opening.


To introduce "invisible walls" to terrain, simply go to the terrain tab of
the database and disable the desired directions in the "Passable Directions"
box (the box with 4 blue arrows pointing outward). Make sure to enable
"enableTwoWayRestriction" in this file's settings.

The directions are inverted, so if you disable the top and right arrows, the
lower and left face of the tile will not be passable from that tile or the
ones adjacent to it. Units will try to move around these walls, but never
through them. Blocking all 4 directions will result in an unpassable tile.
_____________________________________________________________________________
                              Compatibility
_____________________________________________________________________________

No functions were overwritten :)

Compatible with FotF_CustomRangePanels (get the newest version)
_____________________________________________________________________________
								 Epilogue
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2026/01/25
Released

--------------------------------------------------------------------------*/

/*-------------------------------------------------------------
                           SETTINGS
-------------------------------------------------------------*/

var FotF_MovementRestrictionSettings = {
    enableTwoWayRestriction: true //true to make unpassable directions work from both sides, false for default behavior.
};

/*-------------------------------------------------------------
                            CODE
-------------------------------------------------------------*/

//This was removed from the script. Why?
//The function to get it still returns these values.
var FotF_PassableDirectionFlag = {
    LEFT: 0x01,
    TOP: 0x02,
    RIGHT: 0x04,
    BOTTOM: 0x08
};

(function () {
    var FotF_RestrictMovement = MapSequenceArea._isPlaceSelectable;
    MapSequenceArea._isPlaceSelectable = function () {
        var result = FotF_RestrictMovement.call(this);
        var x = this._mapCursor.getX();
        var y = this._mapCursor.getY();
        var unit = this._targetUnit;

        if (!FotF_MovementRestrictionControl.isPosAllowed(x, y, unit)) {
            return false;
        }

        return result;
    };

    var FotF_RestrictPanels = UnitRangePanel._setLight;
    UnitRangePanel._setLight = function (isWeapon) {
        FotF_RestrictPanels.call(this, isWeapon);
        this._mapChipLight.setIndexArray(this._getRestrictedIndexArray(this._unit, false));
        if (isWeapon) {
            this._mapChipLightWeapon.setIndexArray(this._getRestrictedIndexArray(this._unit, true));
        } else {
            this._mapChipLightWeapon.endLight();
        }
    };

    if (FotF_MovementRestrictionSettings.enableTwoWayRestriction) {
        var FotF_RestrictDirection = CourceBuilder._getSideIndex;
        CourceBuilder._getSideIndex = function (x, y, movePoint, simulator) {
            var i, x2, y2, index, newPoint;
            var sideIndex = FotF_RestrictDirection.call(this, x, y, movePoint, simulator);
            var reverseSideIndex = FotF_MovementRestrictionControl.reverseDirection(sideIndex);
            var session = root.getCurrentSession();
            var flags = [FotF_PassableDirectionFlag.LEFT, FotF_PassableDirectionFlag.TOP, FotF_PassableDirectionFlag.RIGHT, FotF_PassableDirectionFlag.BOTTOM];

            x2 = x + XPoint[sideIndex];
            y2 = y + YPoint[sideIndex];

            var oldFlagL = flags[reverseSideIndex] & session.getPassableDirectionFlag(x, y, false);
            var oldFlagU = flags[reverseSideIndex] & session.getPassableDirectionFlag(x, y, true);
            var newFlagL = flags[sideIndex] & session.getPassableDirectionFlag(x2, y2, false);
            var newFlagU = flags[sideIndex] & session.getPassableDirectionFlag(x2, y2, true);

            if (!oldFlagL || !oldFlagU || !newFlagL || !newFlagU) {
                sideIndex = -1;
                oldIndex = CurrentMap.getIndex(x, y);
                movePoint = simulator.getSimulationMovePoint(oldIndex);
                for (i = 0; i < DirectionType.COUNT; i++) {
                    var reverseDirection = FotF_MovementRestrictionControl.reverseDirection(i);
                    x2 = x + XPoint[i];
                    y2 = y + YPoint[i];

                    index = CurrentMap.getIndex(x2, y2);
                    if (index === -1) {
                        continue;
                    }

                    var oldFlagL = flags[reverseDirection] & session.getPassableDirectionFlag(x, y, false);
                    var oldFlagU = flags[reverseDirection] & session.getPassableDirectionFlag(x, y, true);
                    var newFlagL = flags[i] & session.getPassableDirectionFlag(x2, y2, false);
                    var newFlagU = flags[i] & session.getPassableDirectionFlag(x2, y2, true);

                    if (!oldFlagL || !oldFlagU || !newFlagL || !newFlagU) {
                        newPoint = Infinity;
                    } else {
                        newPoint = simulator.getSimulationMovePoint(index);
                    }

                    // If newPoint is lower than the current movePoint,
                    // check the new position.
                    if (newPoint < movePoint) {
                        // Check if the specified index position is marked.
                        if (!simulator.isSimulationMark(index)) {
                            // Update movePoint to search the lower move point.
                            movePoint = newPoint;
                            sideIndex = i;
                        }
                    }
                }
            }

            return sideIndex;
        };
    }
})();

UnitRangePanel._getRestrictedIndexArray = function (unit, isWeapon) {
    var arr = this._simulator.getSimulationIndexArray();

    if (unit !== null && typeof FotF_MovementRestrictionControl === 'object' && FotF_MovementRestrictionControl.verifyCuspara(unit)) {
        var i;

        for (i = 0; i < arr.length; i++) {
            var x = CurrentMap.getX(arr[i]);
            var y = CurrentMap.getY(arr[i]);
            if (!FotF_MovementRestrictionControl.isPosAllowed(x, y, unit)) {
                arr.splice(i, 1);
                i--;
            }
        }

        if (isWeapon) {
            var weapon = ItemControl.getEquippedWeapon(unit);
            var arr2 = FotF_MovementRestrictionControl.getOutlineArray(arr, weapon.getStartRange(), weapon.getEndRange());
            return arr2;
        }

        return arr;
    }

    if (isWeapon) {
        return this._simulator.getSimulationWeaponIndexArray();
    }

    return this._simulator.getSimulationIndexArray();
};

var FotF_MovementRestrictionControl = {
    verifyCuspara: function (unit) {
        return typeof unit.custom.restrictMovement === 'object' && typeof unit.custom.restrictMovement.length === 'number';
    },

    getRestrictionArray: function (unit) {
        if (!this.verifyCuspara(unit)) {
            return [];
        }

        return unit.custom.restrictMovement;
    },

    isPosAllowed: function (x, y, unit) {
        var i;
        var arr = this.getRestrictionArray(unit);
        var unitX = unit.getMapX();
        var unitY = unit.getMapY();

        //Empty array means no restriction cuspara
        if (arr.length === 0) {
            return true;
        }

        for (i = 0; i < arr.length; i++) {
            if ((unitX + arr[i][0] === x && unitY + arr[i][1] === y) || (x === unitX && y === unitY)) {
                return true;
            }
        }

        return false;
    },

    getOutlineArray: function (arr, startRange, endRange) {
        var i, j;
        var arr2 = [];

        for (i = 0; i < arr.length; i++) {
            var x = CurrentMap.getX(arr[i]);
            var y = CurrentMap.getY(arr[i]);
            var tempArr = IndexArray.getBestIndexArray(x, y, startRange, endRange);

            for (j = 0; j < tempArr.length; j++) {
                if (arr2.indexOf(tempArr[j]) < 0 && arr.indexOf(tempArr[j]) < 0) {
                    arr2.push(tempArr[j]);
                }
            }
        }

        return arr2;
    },

    getRestrictionIndexArray: function (unit) {
        var i;
        var resArr = this.getRestrictionArray(unit);
        var arr = this.getMapRangeArray();

        for (i = 0; i < resArr.length; i++) {
            var index = arr.indexOf(resArr[i]);
            if (index > -1) {
                arr.splice(index, 1);
            }
        }

        return arr;
    },

    getMapRangeArray: function () {
        var i;
        var arr = [];

        for (i = 0; i < CurrentMap.getSize(); i++) {
            arr.push(i);
        }

        return arr;
    },

    reverseDirection: function (direction) {
        if (direction === DirectionType.LEFT) {
            direction = DirectionType.RIGHT;
        } else if (direction === DirectionType.RIGHT) {
            direction = DirectionType.LEFT;
        } else if (direction === DirectionType.BOTTOM) {
            direction = DirectionType.TOP;
        } else if (direction === DirectionType.TOP) {
            direction = DirectionType.BOTTOM;
        }

        return direction;
    }
};
