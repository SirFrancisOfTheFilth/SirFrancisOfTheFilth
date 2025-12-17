/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
         Give players the option to let the game select their units
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This plug-and-play plugin adds a config option, that when activated, auto-
matically selects the next unit once the currently active unit ends their
action. It also allows for unit cycling with A/S (left/right pad) when a
unit is already selected.
_____________________________________________________________________________
						    Compatibility
_____________________________________________________________________________

Overwritten functions:

    - PlayerTurn._changeEventMode
    - PlayerTurn._moveAutoEventCheck
_____________________________________________________________________________
							  EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2025/12/17
Released

--------------------------------------------------------------------------*/

var FotF_AutoUnitSelectSettings = {
    configName: 'Auto Unit Selection',
    configDescription: 'Auto select the next unit',
    optionNames: ['On', 'Off']
};

(function () {
    PlayerTurn._changeEventMode = function () {
        var result;

        result = this._eventChecker.enterEventChecker(root.getCurrentSession().getAutoEventList(), EventType.AUTO);
        if (result === EnterResult.NOTENTER) {
            this._doEventEndAction();
            var newUnit = this.getNextUnit(true).unit;
            var newIndex = this.getNextUnit(true).index;

            if (newUnit !== null && newUnit.getUnitType() === UnitType.PLAYER && !newUnit.isWait() && FotF_AutoUnitSelectControl.isConfig()) {
                this._targetUnit = newUnit;
                this._mapEdit._activeIndex = newIndex;
                this._mapEdit._setUnit(newUnit);
                this._mapEdit._setFocus(newUnit);
                this._mapSequenceArea.openSequence(this);
                this.changeCycleMode(PlayerTurnMode.AREA);
            } else {
                this.changeCycleMode(PlayerTurnMode.MAP);
            }
        } else {
            this.changeCycleMode(PlayerTurnMode.AUTOEVENTCHECK);
        }
    };

    PlayerTurn._moveAutoEventCheck = function () {
        root.log('start');
        if (this._eventChecker.moveEventChecker() !== MoveResult.CONTINUE) {
            this._doEventEndAction();
            MapLayer.getMarkingPanel().updateMarkingPanel();
            if (FotF_AutoUnitSelectControl.isConfig()) {
                this.autoSelectNextUnit();
            }
        }
        root.log('end');

        return MoveResult.CONTINUE;
    };

    var FotF_AllowMapAreaUnitChange = MapSequenceArea._moveArea;
    MapSequenceArea._moveArea = function () {
        var result = FotF_AllowMapAreaUnitChange.call(this);
        var playerTurn = this._parentTurnObject;
        var isChange = false;

        //Only allow unit cycling if no other action is taken
        if (result === MapSequenceAreaResult.NONE) {
            if (InputControl.isLeftPadAction()) {
                var newUnit = playerTurn.getNextUnit(false).unit;
                var newIndex = playerTurn.getNextUnit(false).index;
                isChange = true;
            } else if (InputControl.isRightPadAction()) {
                var newUnit = playerTurn.getNextUnit(true).unit;
                var newIndex = playerTurn.getNextUnit(true).index;
                isChange = true;
            }

            if (isChange) {
                this._playMapUnitSelectSound();
                this._targetUnit = newUnit;
                playerTurn._targetUnit = newUnit;
                playerTurn._mapEdit._activeIndex = newIndex;
                playerTurn._mapEdit._setUnit(newUnit);
                playerTurn._mapEdit._setFocus(newUnit);
            }
        }

        return result;
    };

    var FotF_AppendAutoUnitSelectConfig = ConfigWindow._configureConfigItem;
    ConfigWindow._configureConfigItem = function (groupArray) {
        FotF_AppendAutoUnitSelectConfig.call(this, groupArray);
        groupArray.appendObject(ConfigItem.UnitAutoSelect);
    };
})();

var FotF_AutoUnitSelectControl = {
    isConfig: function () {
        if (ConfigItem.UnitAutoSelect.getFlagValue() === 0) {
            return true;
        }

        return false;
    }
};

PlayerTurn.autoSelectNextUnit = function () {
    var newUnit = this.getNextUnit(true).unit;
    var newIndex = this.getNextUnit(true).index;
    if (newUnit !== null && newUnit.getUnitType() === UnitType.PLAYER && !newUnit.isWait()) {
        this._targetUnit = newUnit;
        this._mapEdit._activeIndex = newIndex;
        this._mapEdit._setUnit(newUnit);
        this._mapEdit._setFocus(newUnit);
        this._mapSequenceArea.openSequence(this);
        this.changeCycleMode(PlayerTurnMode.AREA);
    } else {
        this.changeCycleMode(PlayerTurnMode.MAP);
    }
};

PlayerTurn.getNextUnit = function (isNext) {
    var unit;
    var list = PlayerList.getSortieList();
    var count = list.getCount();
    var index = this._mapEdit._activeIndex;

    for (i = 0; i < count; i++) {
        if (isNext) {
            index++;
        } else {
            index--;
        }

        if (index >= count) {
            index = 0;
        } else if (index < 0) {
            index = count - 1;
        }

        unit = list.getData(index);
        if (unit === null || unit.isWait()) {
            continue;
        }

        return {
            unit: unit,
            index: index
        };
    }

    return {
        unit: unit,
        index: this._mapEdit._activeIndex
    };
};

ConfigItem.UnitAutoSelect = defineObject(BaseConfigtItem, {
    selectFlag: function (index) {
        var env = root.getExternalData().env;
        env.unitAutoSelect = index;
    },

    getFlagValue: function () {
        var env = root.getExternalData().env;
        return env.unitAutoSelect;
    },

    getFlagCount: function () {
        return 2;
    },

    getConfigItemTitle: function () {
        return FotF_AutoUnitSelectSettings.configName;
    },

    getConfigItemDescription: function () {
        return FotF_AutoUnitSelectSettings.configDescription;
    },

    getObjectArray: function () {
        var cfg = FotF_AutoUnitSelectSettings;
        return cfg.optionNames;
    }
});
