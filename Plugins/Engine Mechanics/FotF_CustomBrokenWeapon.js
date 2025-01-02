/*--------------------------------------------------------------------------
(Apparently not so) Quick little plugin that lets items and weapons change
into any other item or weapon when breaking. Simply set one of two custom
parameters on the item:

    customBreakItem: x                  <--- transforms into an item
    customBreakWeapon: x                <--- transforms into a weapon

x is the database ID of the item/weapon you want your item/weapon to transform
into. Standard break behavior is not affected, so it will still yield a broken
item (in addition to the new one) if that's not disabled.
_____________________________________________________________________________
If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth
  
2024/12/18
Released

2024/12/28
Fixed a crash without error when using the script's wrapper functions to
manage items. Uses the generator now instead. Bonus: Item get popup is
possible now.
--------------------------------------------------------------------------*/

var FotF_CustomBreakWeaponSettings = {
    isPopUpSkip: false //set to true to skip the "Item Get" popup if an item breaks and you get a new item
};

(function () {
    var FotF_LostItemOverride = ItemControl.lostItem;
    ItemControl.lostItem = function (unit, item) {
        FotF_LostItemOverride.call(this, unit, item);
        var generator = root.getEventGenerator();
        if (unit.getUnitType() === UnitType.PLAYER) {
            var isSkip = FotF_CustomBreakWeaponSettings.isPopUpSkip;
        } else {
            var isSkip = true;
        }
        if (typeof item.custom.customBreakItem === 'number') {
            var newItem = root.getBaseData().getItemList().getDataFromId(item.custom.customBreakItem);
            newItem.setLimit(newItem.getLimitMax());
            if (unit === null) {
                generator.stockItemChange(newItem, IncreaseType.INCREASE, isSkip);
            } else {
                generator.unitItemChange(unit, newItem, IncreaseType.INCREASE, isSkip);
            }
        } else if (typeof item.custom.customBreakWeapon === 'number') {
            var newItem = root.getBaseData().getWeaponList().getDataFromId(item.custom.customBreakWeapon);
            newItem.setLimit(newItem.getLimitMax());
            if (unit === null) {
                generator.stockItemChange(newItem, IncreaseType.INCREASE, isSkip);
            } else {
                generator.unitItemChange(unit, newItem, IncreaseType.INCREASE, isSkip);
                ItemControl.setEquippedWeapon(unit, newItem);
            }
        }
        generator.execute();
    };

    var FotF_OverrideDurabilityChangeEventCommand = DurabilityChangeEventCommand.mainEventCommand;
    DurabilityChangeEventCommand.mainEventCommand = function () {
        if (this._targetItem === null) {
            return;
        }
        FotF_OverrideDurabilityChangeEventCommand.call(this);
    };

    DurabilityChangeEventCommand._setDurability = function () {
        var limit = this._targetItem.getLimit();
        var limitMax = this._targetItem.getLimitMax();

        if (limit <= WeaponLimitValue.BROKEN) {
            limit = 0;
        }

        if (this._increaseType === IncreaseType.INCREASE) {
            limit += this._durability;
        } else if (this._increaseType === IncreaseType.DECREASE) {
            limit -= this._durability;
        } else {
            limit = this._durability;
        }

        if (limit >= limitMax) {
            this._targetItem.setLimit(limitMax);
        } else if (limit <= 0) {
            // Delete because the durability is less than 0.
            this._lostItem();
            this._targetItem = null;
        } else {
            this._targetItem.setLimit(limit);
        }
    };
})();
