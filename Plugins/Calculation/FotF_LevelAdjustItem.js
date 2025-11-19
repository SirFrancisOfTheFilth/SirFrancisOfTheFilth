/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                  Adjust a unit's level with a custom item
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This plugin allows you to create an item that sets a unit's level to a
number you defined. The unit's stats are unaffected by this, but they will be
able to gain more stats by leveling up if you reduce their level.

The item will only be useable if it would actually do something (so level is
not already target level, over 0 and is within class/config level caps).

_____________________________________________________________________________
						         Setup
_____________________________________________________________________________

Create a custom item with the keyword "Adjust Level" (can be changed in this
file's settings) and give it the following custom parameter:

    {
        adjustLevel: x
    }

where x is the target level.

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

2025/11/18
Released

2025/11/19
Fixed error without Info Window Overhaul

--------------------------------------------------------------------------*/

/*-------------------------------------------------------------
                           SETTINGS
-------------------------------------------------------------*/

var FotF_LevelAdjustItemSettings = {
    keyword: 'Adjust Level', //Custom keyword
    itemInfo: 'Sets level to' //Text for info window
};

/*-------------------------------------------------------------
                             CODE
-------------------------------------------------------------*/

(function () {
    var FotF_PushLevelAdjustItemSelection = ItemPackageControl.getCustomItemSelectionObject;
    ItemPackageControl.getCustomItemSelectionObject = function (item, keyword) {
        var result = FotF_PushLevelAdjustItemSelection.call(this, item, keyword);
        if (keyword === FotF_LevelAdjustItemSettings.keyword) {
            return LevelAdjustItemSelection;
        }
        return result;
    };

    var FotF_PushLevelAdjustItemUse = ItemPackageControl.getCustomItemUseObject;
    ItemPackageControl.getCustomItemUseObject = function (item, keyword) {
        var result = FotF_PushLevelAdjustItemUse.call(this, item, keyword);
        if (keyword === FotF_LevelAdjustItemSettings.keyword) {
            return LevelAdjustItemUse;
        }
        return result;
    };

    var FotF_PushLevelAdjustItemPotency = ItemPackageControl.getCustomItemPotencyObject;
    ItemPackageControl.getCustomItemPotencyObject = function (item, keyword) {
        var result = FotF_PushLevelAdjustItemPotency.call(this, item, keyword);
        if (keyword === FotF_LevelAdjustItemSettings.keyword) {
            return LevelAdjustItemPotency;
        }
        return result;
    };

    var FotF_PushLevelAdjustItemInfo = ItemPackageControl.getCustomItemInfoObject;
    ItemPackageControl.getCustomItemInfoObject = function (item, keyword) {
        var result = FotF_PushLevelAdjustItemInfo.call(this, item, keyword);
        if (keyword === FotF_LevelAdjustItemSettings.keyword) {
            return LevelAdjustItemInfo;
        }
        return result;
    };

    var FotF_PushLevelAdjustItemAvailability = ItemPackageControl.getCustomItemAvailabilityObject;
    ItemPackageControl.getCustomItemAvailabilityObject = function (item, keyword) {
        var result = FotF_PushLevelAdjustItemAvailability.call(this, item, keyword);
        if (keyword === FotF_LevelAdjustItemSettings.keyword) {
            return LevelAdjustItemAvailability;
        }
        return result;
    };

    var FotF_PushLevelAdjustItemAI = ItemPackageControl.getCustomItemAIObject;
    ItemPackageControl.getCustomItemAIObject = function (item, keyword) {
        var result = FotF_PushLevelAdjustItemAI.call(this, item, keyword);
        if (keyword === FotF_LevelAdjustItemSettings.keyword) {
            return LevelAdjustItemAI;
        }
        return result;
    };
})();

var LevelAdjustItemSelection = defineObject(BaseItemSelection, {});

var LevelAdjustItemUse = defineObject(BaseItemUse, {
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
        var level = item.custom.adjustLevel;

        unit.setLv(level);
    },

    getItemAnimePos: function (itemUseParent, animeData) {
        return this.getUnitBasePos(itemUseParent, animeData);
    }
});

var LevelAdjustItemPotency = defineObject(BaseItemPotency, {});

var LevelAdjustItemInfo = defineObject(BaseItemInfo, {
    drawItemInfoCycle: function (x, y) {
        var level = this._item.custom.adjustLevel;
        if (typeof FotF_CusparaRenderer === 'object') {
            var renderer = FotF_CusparaRenderer;
            x += renderer.drawText(x, y, FotF_LevelAdjustItemSettings.itemInfo);
            x += renderer.drawNumber(x, y, level, null, null);
        }
    },

    getInfoPartsCount: function () {
        if (typeof FotF_CusparaRenderer === 'object') {
            return 1;
        }

        return 0;
    }
});

var LevelAdjustItemAvailability = defineObject(BaseItemAvailability, {
    isItemAllowed: function (unit, targetUnit, item) {
        var itemLevel = item.custom.adjustLevel;
        var unitLevel = unit.getLv();
        var unitMaxLevel = unit.getClass().getMaxLv();
        var configMaxLevel = DataConfig.getMaxLv();

        if (typeof itemLevel !== 'number' || itemLevel === unitLevel || itemLevel > configMaxLevel || (itemLevel > unitMaxLevel && unitMaxLevel !== -1) || itemLevel < 0) {
            return false;
        }

        return true;
    }
});

var LevelAdjustItemAI = defineObject(BaseItemAI, {});
