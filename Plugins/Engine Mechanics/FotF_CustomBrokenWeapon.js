/*--------------------------------------------------------------------------
Quick little plugin that lets items and weapons change into any other item 
or weapon when breaking. Simply set one of two custom parameters on the item:

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
--------------------------------------------------------------------------*/

(function () {
    var FotF_ItemLostOverride = ItemControl.lostItem;
    ItemControl.lostItem = function (unit, item) {
        if (typeof item.custom.customBreakItem === 'number') {
            var newItem = root.getBaseData().getItemList().getDataFromId(item.custom.customBreakItem);
            if (unit === null) {
                StockItemControl.cutStockItem(StockItemControl.getIndexFromItem(item));
                ItemChangeControl._increaseStockItem(newItem);
            } else {
                this.deleteItem(unit, item);
                ItemChangeControl._increaseUnitItem(unit, newItem);
            }
        } else if (typeof item.custom.customBreakWeapon === 'number') {
            var newItem = root.getBaseData().getWeaponList().getDataFromId(item.custom.customBreakWeapon);
            if (unit === null) {
                StockItemControl.cutStockItem(StockItemControl.getIndexFromItem(item));
                ItemChangeControl._increaseStockItem(newItem);
            } else {
                this.deleteItem(unit, item);
                ItemChangeControl._increaseUnitItem(unit, newItem);
            }
        }

        FotF_ItemLostOverride.call(this, unit, item);
    };
})();
