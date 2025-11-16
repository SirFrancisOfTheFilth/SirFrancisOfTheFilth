/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                   Increase your units' stat caps with items
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

With this plugin you can create items that increases a unit's stat caps
beyond their class cap and even the global cap when used. The item does not
increase the stat itself, only the cap for that specific unit.

To get the item info to show the item's effects, my Info Window Overhaul
plugin is required.

_____________________________________________________________________________
						         Setup
_____________________________________________________________________________

Create a custom item with the keyword "Modify Stat Cap" (can be changed in
this file's settings) and give it the following custom parameter(s):

    {
        modifyStatCap: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		limitStatCap: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

The first one, modifyStatCap consists of 11 numbers that represent the 11
unit stats (MHP, STR, MAG, SKI, SPD, LUK, DEF, MDF, MOV, WLV, BLD in this
exact order). Setting any of them to a number other than 0 will make the
item increase (or decrease) the corresponding stat cap(s) by that number.

The second one, limitStatCap is optional and can be used to limit how far
the item can raise the stat. As before, each 0 represents one unit stat.
This is an upwards limit only, there is no downwards limit (except 0).

_____________________________________________________________________________
                                Example
_____________________________________________________________________________

You want to create a steroid  item that increases a unit's STR stat cap by 5.
The unit has no class limit, but the global limit is 60. You also want the
maximum STR cap increase from this item to be 70 (or +10, so 2 uses). As a
drawback for using the item, the unit's BLD cap should decrease by 1. The
item would have the custom parameters

    {
        modifyStatCap: [0, 5, 0, 0, 0, 0, 0, 0, 0, 0, -1],
		limitStatCap: [0, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

The first two uses of the item would raise the STR cap to 65 and 70
respectively and decrease the BLD cap by 1 and 2. All further use of the
item would only decrease the build cap, just like steroids should.

_____________________________________________________________________________
            How does it interact with permanent/temporary buffs?
_____________________________________________________________________________

It pretty much mimics the default behavior, where temporary buffs are present
when a unit has reached the stat cap, but aren't factored into calculations.

If a unit that has 60 innate STR on a 60 STR stat cap has a +10 STR buff
from a state, the buff essentially has no effect. Increasing the limit to 65
will make it so half the buff's STR is immediately available to the unit, who
is now at 65 STR total (60 innate and 5 from the buff).

However, if the unit levels up or otherwise gains permanent STR, this
permanent stat increase will take precedence over the temporary one. So if we
continue our example and the unit levels up, gaining +1 STR, the total of 65
will not change, but once the state wears off, 61 STR will be left, because
the permanent +1 to STR is factored in with priority.

_____________________________________________________________________________
						    Compatibility
_____________________________________________________________________________

No functions were overwritten :)

To get a detailed info window for this custom item, please also download and
configure my Info Window Overhaul.

_____________________________________________________________________________
								 EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2025/11/16
Released

--------------------------------------------------------------------------*/

/*-------------------------------------------------------------
                           SETTINGS
-------------------------------------------------------------*/

var FotF_StatCapItemSettings = {
    keyword: 'Modify Stat Cap', //Custom keyword
    itemInfo: 'Stat Cap' //Text for info window
};

/*-------------------------------------------------------------
                             CODE
-------------------------------------------------------------*/

//Global object to make it accessible from anywhere
var FotF_StatCapArray = null;

(function () {
    var FotF_SetupStatCapArray = ScriptCall_Setup;
    ScriptCall_Setup = function () {
        FotF_SetupStatCapArray.call(this);

        FotF_StatCapArray = [];
    };

    FotF_LoadSwitchArray = LoadSaveScreen._executeLoad;
    LoadSaveScreen._executeLoad = function () {
        FotF_LoadSwitchArray.call(this);

        var extData = root.getExternalData();
        var manager = root.getLoadSaveManager();
        var saveIndex = extData.getActiveSaveFileIndex();
        var saveFileInfo = manager.getSaveFileInfo(saveIndex);
        var saveObject = saveFileInfo.custom;

        if (typeof saveObject.statCapArray !== 'undefined' && saveObject.statCapArray !== null) {
            FotF_StatCapArray = saveObject.statCapArray;
        }
    };

    var FotF_SaveStatCapChanges = LoadSaveScreen._getCustomObject;
    LoadSaveScreen._getCustomObject = function () {
        var obj = FotF_SaveStatCapChanges.call(this);

        obj.statCapArray = FotF_StatCapArray;

        return this._screenParam.customObject;
    };

    var FotF_CheckStatCap = BaseUnitParameter.getMaxValue;
    BaseUnitParameter.getMaxValue = function (unit) {
        var value = FotF_CheckStatCap.call(this, unit);
        var bonus = FotF_StatCapControl.getStatCapBonus(unit, this.getParameterType());

        if (bonus === null) {
            return value;
        }

        return bonus;
    };

    var FotF_PushStatCapItemSelection = ItemPackageControl.getCustomItemSelectionObject;
    ItemPackageControl.getCustomItemSelectionObject = function (item, keyword) {
        var result = FotF_PushStatCapItemSelection.call(this, item, keyword);
        if (keyword === FotF_StatCapItemSettings.keyword) {
            return StatCapItemSelection;
        }
        return result;
    };

    var FotF_PushStatCapItemUse = ItemPackageControl.getCustomItemUseObject;
    ItemPackageControl.getCustomItemUseObject = function (item, keyword) {
        var result = FotF_PushStatCapItemUse.call(this, item, keyword);
        if (keyword === FotF_StatCapItemSettings.keyword) {
            return StatCapItemUse;
        }
        return result;
    };

    var FotF_PushStatCapItemPotency = ItemPackageControl.getCustomItemPotencyObject;
    ItemPackageControl.getCustomItemPotencyObject = function (item, keyword) {
        var result = FotF_PushStatCapItemPotency.call(this, item, keyword);
        if (keyword === FotF_StatCapItemSettings.keyword) {
            return StatCapItemPotency;
        }
        return result;
    };

    var FotF_PushStatCapItemInfo = ItemPackageControl.getCustomItemInfoObject;
    ItemPackageControl.getCustomItemInfoObject = function (item, keyword) {
        var result = FotF_PushStatCapItemInfo.call(this, item, keyword);
        if (keyword === FotF_StatCapItemSettings.keyword) {
            return StatCapItemInfo;
        }
        return result;
    };

    var FotF_PushStatCapItemAvailability = ItemPackageControl.getCustomItemAvailabilityObject;
    ItemPackageControl.getCustomItemAvailabilityObject = function (item, keyword) {
        var result = FotF_PushStatCapItemAvailability.call(this, item, keyword);
        if (keyword === FotF_StatCapItemSettings.keyword) {
            return StatCapItemAvailability;
        }
        return result;
    };

    var FotF_PushStatCapItemAI = ItemPackageControl.getCustomItemAIObject;
    ItemPackageControl.getCustomItemAIObject = function (item, keyword) {
        var result = FotF_PushStatCapItemAI.call(this, item, keyword);
        if (keyword === FotF_StatCapItemSettings.keyword) {
            return StatCapItemAI;
        }
        return result;
    };
})();

var StatCapItemSelection = defineObject(BaseItemSelection, {});

var StatCapItemUse = defineObject(BaseItemUse, {
    _itemUseParent: null,
    _parameterChangeWindow: null,

    enterMainUseCycle: function (itemUseParent) {
        var itemTargetInfo = itemUseParent.getItemTargetInfo();

        this._itemUseParent = itemUseParent;

        if (itemUseParent.isItemSkipMode()) {
            this.mainAction();
            return EnterResult.NOTENTER;
        }

        return EnterResult.OK;
    },

    moveMainUseCycle: function () {
        this.mainAction();
        return MoveResult.END;
    },

    drawMainUseCycle: function () {},

    mainAction: function () {
        var itemTargetInfo = this._itemUseParent.getItemTargetInfo();
        var unit = itemTargetInfo.targetUnit;
        var item = itemTargetInfo.item;
        var arr = FotF_StatCapControl.getValidBonusArray(unit, item);

        if (arr !== null) {
            FotF_StatCapControl.pushEntry(unit, arr);
        }
    },

    getItemAnimePos: function (itemUseParent, animeData) {
        return this.getUnitBasePos(itemUseParent, animeData);
    }
});

var StatCapItemPotency = defineObject(BaseItemPotency, {});

var StatCapItemInfo = defineObject(BaseItemInfo, {
    drawItemInfoCycle: function (x, y) {
        if (typeof FotF_CusparaRenderer === 'object') {
            FotF_StatCapRenderer.drawStatCaps(x, y, this._item);
        }
    },

    getInfoPartsCount: function () {
        if (typeof FotF_CusparaRenderer === 'object') {
            return FotF_StatCapRenderer.getModifyCount(this._item);
        }
    }
});

var StatCapItemAvailability = defineObject(BaseItemAvailability, {
    isItemAllowed: function (unit, targetUnit, item) {
        return FotF_StatCapControl.isItemAllowed(targetUnit, item);
    }
});

var StatCapItemAI = defineObject(BaseItemAI, {});

var FotF_StatCapControl = {
    getCompleteUnitList: function () {
        var list = StructureBuilder.buildDataList();

        var pL = PlayerList.getMainList()._arr;
        var eL = EnemyList.getMainList()._arr;
        var aL = AllyList.getMainList()._arr;

        pL.concat(eL, aL);
        list.setDataArray(pL);

        return list;
    },

    getUnitFromId: function (id) {
        var unit = null;
        var session = root.getCurrentSession();

        if (session === null) {
            return unit;
        }

        if (id < 0x10000) {
            unit = session.getPlayerList().getDataFromId(id);
        } else if ((id >= 0x10000 && id < 0x30000) || (id >= 0x50000 && id < 0x60000)) {
            unit = session.getEnemyList().getDataFromId(id);
        } else if (id >= 0x30000 && id < 0x50000) {
            unit = session.getAllyList().getDataFromId(id);
        } else if (id >= 0x60000 && id < 0x80000) {
            unit = session.getGuestList().getDataFromId(id);
        }

        return unit;
    },

    createEntry: function (unit, arr) {
        var obj = {
            unitId: unit.getId(),
            stats: arr
        };

        return obj;
    },

    getEntry: function (unit) {
        var unitIndex = this.getEntryIndex(unit);
        if (unitIndex > -1) {
            var entry = FotF_StatCapArray[unitIndex];
            return entry;
        }

        return null;
    },

    getEntryIndex: function (unit) {
        var i;
        for (i = 0; i < FotF_StatCapArray.length; i++) {
            var entry = FotF_StatCapArray[i];
            if (entry.unitId === unit.getId()) {
                return i;
            }
        }

        return -1;
    },

    getStatCapBonus: function (unit, index) {
        var entry = this.getEntry(unit);

        if (entry === null) {
            return null;
        }

        var stat = entry.stats[index];
        if (typeof stat === 'number' && stat !== 0) {
            return stat;
        }

        return null;
    },

    pushEntry: function (unit, arr) {
        var i;
        var entryIndex = this.getEntryIndex(unit);
        var oldEntry = FotF_StatCapArray[entryIndex];

        if (entryIndex < 0) {
            var newEntry = this.createEntry(unit, arr);
            FotF_StatCapArray.push(newEntry);
        } else {
            for (i = 0; i < oldEntry.length; i++) {
                var mod = arr[i];
                var newValue = oldEntry.stats[i] + mod;
                oldEntry.stats.splice(i, 1, newValue);
            }
        }

        return true;
    },

    getStatArrayFromItem: function (item) {
        var custom = item.custom.modifyStatCap;

        if (custom) {
            return custom;
        }

        return null;
    },

    getItemCap: function (item, index) {
        var entry = this.getStatArrayFromItem(item);
        var cap = item.custom.limitStatCap;

        if (entry === null || typeof cap === 'undefined') {
            return Infinity;
        }

        if (cap[index] === 0 || cap[index] === null) {
            return Infinity;
        }

        return cap[index];
    },

    getValidBonusArray: function (unit, item) {
        var i;
        var obj = [];
        var arr = this.getStatArrayFromItem(item);

        if (arr === null) {
            return null;
        }

        for (i = 0; i < arr.length; i++) {
            var stat = arr[i];
            var cap = this.getItemCap(item, i);
            var max = ParamGroup.getMaxValue(unit, i);

            if (stat === null || stat === 0) {
                obj.push(max);
                continue;
            }

            var combined = stat + max;

            if (combined > cap) {
                combined = cap;
            }

            obj.push(combined);
        }

        return obj;
    },

    isItemAllowed: function (targetUnit, item) {
        var i, value, max, newMax;
        var count = ParamGroup.getParameterCount();
        var entry = FotF_StatCapControl.getValidBonusArray(targetUnit, item);
        var result = false;

        if (this._isItemAlwaysAllowed(targetUnit, item)) {
            return true;
        }

        for (i = 0; i < count; i++) {
            var value = entry[i];
            if (value === 0) {
                continue;
            }

            max = ParamGroup.getMaxValue(targetUnit, i);
            newMax = this.getItemCap(item, i);
            if (newMax <= max) {
                continue;
            }

            result = true;
            break;
        }

        return result;
    },

    _isItemAlwaysAllowed: function (targetUnit, item) {
        return item.getExp() > 0;
    }
};

var FotF_StatCapRenderer = {
    drawStatCaps: function (x, y, item) {
        var i;
        var cfg = FotF_CusparaRenderSettings;
        var renderer = FotF_CusparaRenderer;
        var arr = this.getModifyArray(item);

        x += renderer.drawText(x, y, FotF_StatCapItemSettings.itemInfo);
        x += cfg.itemStatSpacingX;
        var savedX = x;

        for (i = 0; i < arr.length; i++) {
            x = savedX;

            var index = arr[i][0];
            var bonus = arr[i][1];
            var cap = arr[i][2];
            var stat = ParamGroup.getParameterName(index);
            var sign = bonus >= 0 ? '+' : '-';

            if (bonus < 0) {
                bonus *= -1;
            }

            x += renderer.drawText(x, y, stat);
            x += renderer.drawSign(x, y, sign);
            x += renderer.drawNumber(x, y, bonus, null, null);

            if (cap < Infinity) {
                x += renderer.drawSign(x, y, '(Max');
                x += renderer.drawNumber(x, y, cap, null, null);
                x += renderer.drawSign(x, y, ')');
            }

            y += cfg.lineSpacingY;
        }
    },

    getModifyArray: function (item) {
        var i;
        var arr = FotF_StatCapControl.getStatArrayFromItem(item);
        var result = [];

        for (i = 0; i < arr.length; i++) {
            if (arr[i] !== 0) {
                var cap = FotF_StatCapControl.getItemCap(item, i);
                result.push([i, arr[i], cap]);
            }
        }

        return result;
    },

    getModifyCount: function (item) {
        return this.getModifyArray(item).length;
    }
};
