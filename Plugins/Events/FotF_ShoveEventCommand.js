/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                        Easily push or pull units!
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This custom event command is intended to simplify and enhance unit shoving.
It requires you to set some parameters in the event command itself, but is
otherwise plug-and-play.

_____________________________________________________________________________
						    What can this do?
_____________________________________________________________________________

The event command is capable of moving any unit currently on the map any
distance in any of the 4 main directions and even damage them dynamically.

_____________________________________________________________________________
						  Seting the parameters
_____________________________________________________________________________

To use this event, create an Execute Script event command and set it to
"Call Event Command", then write "FotF_ShoveEvent" in the event name dialog.

There are several required parameters, that have to be set like this:

{
    targetId: 65540,    //ID of the shove target. Notice that with unit group ID correction this would be the enemy with ID 5 (65535 + 5 = 65540).
	attackerId: 2,      //ID of the attacker, also follows ID correction rules, so this here is player ID 2. Can be omitted by specifying null.
	xSrc: 15,           //Start x coordinate
	ySrc: 3,            //Start y coordinate
	xDest: 15,          //Target x coordinate
	yDest: 6,           //Target y coordinate
	isPull: false,      //true to pull target towards start coordinates, false to push it away from them.
	distance: 2,        //Distance to push/pull (pull is one more to support attacker running up to target)
	damage: 10          //Damage to be dealt. Can be 0 (or negative for healing).
}

_____________________________________________________________________________
					Getting variables into the parameters
_____________________________________________________________________________

Yes that's possible, but I was lazy, so you have to do some light scripting,
or better yet, use MarkyJoe's Variable Finder plugin (very useful!).

Scripting way (Complicated):

var table = root.getMetaSession().getVariableTable(index)       //index is the variable tab - 1. So tab 4 is index 3.
var varIndex = table.getVariableIndexFromId(id)                 //id is, well, the ID of the variable.
var value = table.getVariable(varIndex);                        //value is the variable value you want.

Use the values like so:

{
    targetId: value1,
	attackerId: value2,
	xSrc: value3,
	ySrc: value4,
	xDest: value5,
	yDest: value6,
	isPull: false,
	distance: value7,
	damage: value8
}

With Variable Finder (Easier):

Just use VariableFinder.getVariableValue("Variable Name") for the values
you want to get with variables.

{
	targetId: VariableFinder.getVariableValue("Skill Target"),
	attackerId: VariableFinder.getVariableValue("Attacker"),
	xSrc: VariableFinder.getVariableValue("Math Variable 2"),
	ySrc: VariableFinder.getVariableValue("Math Variable 3"),
	xDest: VariableFinder.getVariableValue("Math Variable 4"),
	yDest: VariableFinder.getVariableValue("Math Variable 5"),
	isPull: false,
	distance: VariableFinder.getVariableValue("Math Variable 6"),
	damage: VariableFinder.getVariableValue("Math Variable 7")
}
_____________________________________________________________________________
						Direction Calculation
_____________________________________________________________________________

The shove direction is calculated for you based on the source coordinates
(xSrc/ySrc) and the destination coordinates (xDest/yDest). Imagine drawing an
arrow from source to destination. Now correct the arrows direction to fit the
closest cardinal direction. That's the direction you're gonna get.
The pull direction is reversed of course.
_____________________________________________________________________________
					     Damage Calculation
_____________________________________________________________________________

Damage is done in one go, but calculated in 3 stages:

    1. Initial damage as specified in the parameters
    2. If collision with unpassable terrain or other units occurs, damage
       is multiplied by shove distance
    3. Target's defense is subtracted

Healing is also multiplied on collision, but not affected by defense.
If damage is 0, no damage/healing effect will play.
_____________________________________________________________________________
							  EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2025/06/22
Released

--------------------------------------------------------------------------*/

(function () {
    var FotF_AppendShoveEvent = ScriptExecuteEventCommand._configureOriginalEventCommand;
    ScriptExecuteEventCommand._configureOriginalEventCommand = function (groupArray) {
        FotF_AppendShoveEvent.call(this, groupArray);
        groupArray.appendObject(FotF_ShoveEventCommand);
    };
})();

var FotF_ShoveEventCommand = defineObject(BaseEventCommand, {
    _unit: null,
    _attacker: null,
    _xSrc: null,
    _ySrc: null,
    _xDest: null,
    _yDest: null,
    _damage: null,
    _distance: null,
    _isPull: null,
    _x2: null,
    _y2: null,
    _dynamicEvent: null,

    enterEventCommandCycle: function () {
        return this.completeEventCommandMemberData();
    },

    completeEventCommandMemberData: function () {
        var args = root.getEventCommandObject().getEventCommandArgument();
        this._unit = this.getUnitFromId(args.targetId);
        this._attacker = this.getUnitFromId(args.attackerId);
        this._xSrc = args.xSrc;
        this._ySrc = args.ySrc;
        this._xDest = args.xDest;
        this._yDest = args.yDest;
        this._damage = args.damage;
        this._distance = args.distance;
        this._isPull = args.isPull;
        this._dynamicEvent = createObject(DynamicEvent);

        if (this.checkMapInfo() && this.checkArgs()) {
            return this.shoveUnit(this._unit, this._xSrc, this._ySrc, this._xDest, this._yDest, this._damage, this._distance, this._isPull);
        }

        return EnterResult.NOTENTER;
    },

    moveEventCommandCycle: function () {
        var result = this._dynamicEvent.moveDynamicEvent();
        return result;
    },

    checkMapInfo: function () {
        var session = root.getCurrentSession();

        if (session !== null) {
            var mapInfo = session.getCurrentMapInfo();
            if (mapInfo !== null) {
                return true;
            }
        }

        return false;
    },

    checkArgs: function () {
        return this._unit !== null && this.checkCoordinates() && typeof this._distance === 'number' && typeof this._isPull === 'boolean';
    },

    checkCoordinates: function () {
        var mapInfo = root.getCurrentSession().getCurrentMapInfo();

        if (typeof this._xSrc !== 'number' || this._xSrc < 0 || this._xSrc >= mapInfo.getMapWidth()) {
            return false;
        } else if (typeof this._ySrc !== 'number' || this._ySrc < 0 || this._ySrc >= mapInfo.getMapHeight()) {
            return false;
        } else if (typeof this._xDest !== 'number' || this._xDest < 0 || this._xDest >= mapInfo.getMapWidth()) {
            return false;
        } else if (typeof this._yDest !== 'number' || this._yDest < 0 || this._yDest >= mapInfo.getMapHeight()) {
            return false;
        }

        return true;
    },

    checkDisplace: function (unit, attacker, x, y, direction, isPull) {
        var mapInfo = root.getCurrentSession().getCurrentMapInfo();

        var newX = x + XPoint[direction];
        var newY = y + YPoint[direction];
        var checkUnit = PosChecker.getUnitFromPos(newX, newY);

        if (newX < 0 || newX >= mapInfo.getMapWidth()) {
            return false;
        } else if (newY < 0 || newY >= mapInfo.getMapHeight()) {
            return false;
        } else if (PosChecker.getMovePointFromUnit(newX, newY, unit) === 0) {
            return false;
        } else if (checkUnit !== null) {
            if (isPull && checkUnit === attacker) {
                return true;
            }
            return false;
        }

        return true;
    },

    getUnitFromId: function (id) {
        var unit = null;

        if (typeof id !== 'number') {
            return unit;
        }

        if (id < 0x10000) {
            unit = root.getCurrentSession().getPlayerList().getDataFromId(id);
        } else if ((id >= 0x10000 && id < 0x30000) || (id >= 0x50000 && id < 0x60000)) {
            unit = root.getCurrentSession().getEnemyList().getDataFromId(id);
        } else if (id >= 0x30000 && id < 0x50000) {
            unit = root.getCurrentSession().getAllyList().getDataFromId(id);
        } else if (id >= 0x60000 && id < 0x80000) {
            unit = root.getCurrentSession().getGuestList().getDataFromId(id);
        }

        return unit;
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
    },

    shoveUnit: function (target, srcX, srcY, destX, destY, damage, distance, isPull) {
        var i;
        var generator = this._dynamicEvent.acquireEventGenerator();
        var direction = DirectionType.NULL;

        if (target !== null) {
            var dx = srcX - destX;
            var dy = srcY - destY;
            var isHorz = Math.abs(dx) > Math.abs(dy) ? true : false;

            if (isHorz && dx > 0) {
                direction = DirectionType.LEFT;
            } else if (isHorz && dx < 0) {
                direction = DirectionType.RIGHT;
            } else if (!isHorz && dy > 0) {
                direction = DirectionType.TOP;
            } else if (!isHorz && dy < 0) {
                direction = DirectionType.BOTTOM;
            }
        }

        //If pulling, reverse direction and pull target beyond attacker
        if (isPull) {
            direction = this.reverseDirection(direction);
            distance += 1;
        }

        if (direction !== DirectionType.NULL) {
            for (i = 0; i < distance; i++) {
                if (this.checkDisplace(target, this._attacker, destX, destY, direction, isPull)) {
                    generator.unitSlide(target, direction, 3, SlideType.START, false);
                } else {
                    damage += damage;
                }
            }
        }

        if (damage > 0) {
            var anime = root.queryAnime('easydamage');
            generator.damageHit(target, anime, damage, DamageType.PHYSICS, this._attacker, false);
        } else if (damage < 0) {
            var anime = queryAnime('easyrecovery');
            generator.hpRecovery(target, anime, damage, RecoveryType.SPECIFY, false);
        }

        generator.unitSlide(target, 0, 0, SlideType.UPDATEEND, false);

        return this._dynamicEvent.executeDynamicEvent();
    },

    getEventCommandName: function () {
        return 'FotF_ShoveEvent';
    }
});
