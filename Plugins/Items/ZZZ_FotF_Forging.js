/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   Forge properties onto weapons or items and change their name and color!
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

With the help of this plugin, you can:

    - add certain properties (damage, states, ...) onto existing weapons
    - create custom items that can be outfitted with such properties
    - remove these "crafted properties" from weapons and items
    - Add (and remove added) custom parameters (any plugin) to weapons/items
    - rename weapons/items and set a prefix, suffix and color to their names

All while being integrated into my Info Window Overhaul, so players actually
see the changes made to items in the item info window.

To experience the full UI compatibility of this plugin, please set up my
Info Window Overhaul plugin.

All changes to weapons and items will be saved in the save file.

_____________________________________________________________________________
						         Setup
_____________________________________________________________________________

I'll say it again, if you want all the UI features, get the Info Window
Overhaul, it has detailed instructions. If not, just this file will suffice.

Needs FotF_UnitWrapper as a dependency. Please also get that file.

For items you have to create a custom item with the keyword being

    "Crafted Item"

while weapons don't need any special preparation.

_____________________________________________________________________________
                              The commands
_____________________________________________________________________________

Every configuration this plugin is capable of is done via Execute Script
event commands. Make sure to check "Execute Code" and enter the correct
function name and viable parameters into the text field.

Adding/configuring properties is done via:

    FotF_CustomCraftControl.configureProperty(unitId, itemId, isWeapon, craftingType, value, isSet);

        unitId: ID of the unit that possesses the item. Can be gotten from an ID
                variable, more on that later. Note that the unit ID has to be
                corrected by a fixed value, depending on the unit group if not
                gotten from an ID variable:

                Player          + 0
                Enemy           + 65536
                Event Enemy     + 131072
                Ally            + 196608
                Event Ally      + 262144
                Reinforcement   + 327680
                Guest           + 393216
                Event Guest     + 458752
                Bookmark        + 524288

        itemId: Id of the weapon/item to be configured.

        isWeapon: true if configuring a weapon, false in the case of an item.

        craftingType: FotF_ItemCraftingType value, explained in the next section.

        value: Type specific value, often numbers or true/false.

        isSet: true to override previously crafted values, false to add to them.
               Sometimes repurposed, see next section.


Adding/configuring a custom parameter:

    FotF_CustomCraftControl.configureCuspara(unitId, itemId, isWeapon, cuspara, value, isSet);

        cuspara: Cuspara identifier as string (in ""), so for example "customBreakWeapon".

        value: Value of the cuspara object. Whatever the plugin the cuspara belongs to needs.


Changing the color of the weapon/item name:

    FotF_CustomCraftControl.configureColor(unitId, itemId, isWeapon, color);

        color: Hexadecimal color value (like 0xff0000 for pure red)


Changing the name or adding a prefix/suffix to it:

    FotF_CustomCraftControl.configureName(unitId, itemId, isWeapon, string, addMode);

        string: name/prefix/suffix you want to set (as string so in "")

        addMode: 0 to change prefix, 1 to change suffix, 2 to change name


Completely removing a crafted property:

    FotF_CustomCraftControl.removeProperty(unitId, itemId, isWeapon, craftingType);


Completely removing a crafted custom parameter:

    FotF_CustomCraftControl.removeCuspara(unitId, itemId, isWeapon, cuspara);


Removing the crafted color:

    FotF_CustomCraftControl.removeColor(unitId, itemId, isWeapon);


Removing the crafted name:

    FotF_CustomCraftControl.removeName(unitId, itemId, isWeapon, addMode);

        addMode: 0 to remove prefix, 1 to remove suffix, 2 to remove name

_____________________________________________________________________________
                        Crafting type dictionary
_____________________________________________________________________________

Type                                    Explanation                             Restrictions    Values                          isSet behavior                              Example
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
FotF_ItemCraftingType.PRICE             Item price (buy price)                                  number                          true to overwrite, false to add             100 adds to buy price
FotF_ItemCraftingType.WEIGHT            Item weight                                             number                          true to overwrite, false to add             -2 subtracts from weight
FotF_ItemCraftingType.DAMAGE            Bonus damage                                            number                          true to overwrite, false to add             10 adds damage
FotF_ItemCraftingType.DAMAGETYPE        Damage Type (default: Fixed)            item only       DamageType.FIXED                always overwrites                           DamageType.PHYSICS forces physical damage
                                                                                                DamageType.PHYSICS              
                                                                                                DamageType.MAGIC                   
FotF_ItemCraftingType.SCOPE             Selection range type                    item only       SelectionRangeType.SELFONLY     always overwrites                           SelectionRangeType.MULTI sets a specific range (default: item range)
                                                                                                SelectionRangeType.MULTI        
                                                                                                SelectionRangeType.ALL          
FotF_ItemCraftingType.MAXRANGE          Maximum range                           item only       number                          true to overwrite, false to add             2 expands item range by 2 tiles (only if scope is MULTI)
FotF_ItemCraftingType.HIT               Hit bonus                                               number                          true to overwrite, false to add             -15 subtracts from hit chance
FotF_ItemCraftingType.CRIT              Crit bonus                              weapon only     number                          true to overwrite, false to add             5 adds to crit chance
FotF_ItemCraftingType.ATTACKCOUNT       Attack count bonus                      weapon only     number                          true to overwrite, false to add             2 gives 2 extra attacks
FotF_ItemCraftingType.EXP               Exp bonus                               item only       number                          true to overwrite, false to add             20 gives more exp when using item
FotF_ItemCraftingType.SKILL             Additional skills                                       array of IDs                    true to add skills, false to delete         [3, 16] adds skills with IDs 3 and 16 to user when holding item
FotF_ItemCraftingType.STATE             Addidtional states                                      array of arrays (IDs and rates) true to add states, false to delete         [[5, 100], [67, 69]] 100% chance to inflict state with ID 5 and 69% chance to inflict state with ID 67
FotF_ItemCraftingType.GUARDSTATE        Prevented states                        item only       array of IDs                    true to add states, false to delete         [3, 16] grants holder protection from states with ID 3 and ID 16
FotF_ItemCraftingType.WEAPONOPTION      Weapon options                          weapon only     index number (0-6)              true to force weapon option on, false off   Explained below
FotF_ItemCraftingType.FILTER            Unit type filter                        item only       UnitFilterFlag.PLAYER           true to add filters, false to delete        UnitFilterFlag.ALLY makes the item able to target allies
                                                                                                UnitFilterFlag.ENEMY            
                                                                                                UnitFilterFlag.ALLY             
FotF_ItemCraftingType.RESURRECTION      Resurrection type                       item only       ResurrectionType.MIN            always overwrites                           MIN revives with 1 HP, HALF with half HP and FULL with full HP
                                                                                                ResurrectionTyoe.HALF           
                                                                                                ResurrectionType.MAX            
FotF_ItemCraftingType.SWITCH            Global switch IDs to flip               item only       array of IDs                    true to add switches, false to delete       [0, 26] flips global switches with IDs 0 and 26 (if on --> off and vice versa)
FotF_ItemCraftingType.ONEWAY            One-way (no counterattacks)             weapon only     true/false                      always overwrites                           true always prevents counterattacks, false always allows them
FotF_ItemCraftingType.REVERSE           Physical/Magical damage swap            weapon only     true/false                      always overwrites                           true changes physical weapons to magical ones and vice versa, false prevents this
FotF_ItemCraftingType.PARAMBONUS        Parameter bonus                                         array of numbers                true to overwrite, false to add             [0, -3, 12, 0, 0, 0, 0, 0, 0, 0, 4] gives -3 STR, +12 MAG and +4 BLD ==> [MHP, STR, MAG, SKI, SPD, LUK, DEF, MDF, MOV, WLV, BLD]
FotF_ItemCraftingType.GROWTHBONUS       Growth bonus                                            array of numbers                true to overwrite, false to add             same as param bonus, but affecting growths
FotF_ItemCraftingType.WLV               Weapon level bonus                      weapon only     number                          true to overwrite, false to add             -1 reduces WLV requirement by 1


Special case: Weapon Options:

The value determines the type of weapon option to configure, while isSet
is used to either enable it (true) or disable it (false).

Value           Weapon Option
-------------------------------------------
0               HP Absorption
1               Ignore Defense
2               Set HP to 1
3               Halve Attack
4               Prevent Halve Attack
5               Seal Attacks
6               Prevent Seal Attacks
_____________________________________________________________________________
                                Examples
_____________________________________________________________________________

1. You have a unit with ID 3 (enemy, so + 65536) that has an iron sword
(ID 16) in their inventory. You want to give the iron sword +10 damage
and make it inflict a Bleed state (ID 5) 70% of the time and Poison (ID 12)
30% of the time.

Adding 10 damage:

    FotF_CustomCraftControl.configureProperty(65539, 16, true, FotF_ItemCraftingType.DAMAGE, 10, false);


Adding the states:

    FotF_CustomCraftControl.configureProperty(65539, 16, true, FotF_ItemCraftingType.STATE, [[5, 70], [12, 30]], true);


Now that unit has been naughty, so you decide to revoke their enchantment
privileges and remove the 10 damage buff of their iron sword. Additionally
you debuff the sword's hit rate by 20 and remove the Poison chance.

Removing damage:

    FotF_CustomCraftControl.removeProperty(65539, 16, true, FotF_ItemCraftingType.DAMAGE);


Removing the Poison state:

    FotF_CustomCraftControl.configureProperty(65539, 16, true, FotF_ItemCraftingType.STATE, [[12, 30]], false); <-- false to remove the state entry


Debuffing the hit rate:

    FotF_CustomCraftControl.configureProperty(65539, 16, true, FotF_ItemCraftingType.HIT, -20, false);



2. Now you want another unit (player with ID 1) to craft a custom potion.
Through eventing (maybe using MarkyJoe's selector event commands), you
determine which 3 properties are to be crafted onto it: 10 healing, 5 EXP
and a buff state (ID 21, 100% chance). First of all, you create a custom
item (ID 92) with a potion icon and set the scope to 3 and filter to
players only, because that's how you want the potion to be used.

Adding 10 healing:

    FotF_CustomCraftControl.configureProperty(1, 92, false, FotF_ItemCraftingType.DAMAGE, -10, false); <--- -10 damage is 10 healing


Adding +5 EXP:

    FotF_CustomCraftControl.configureProperty(1, 92, false, FotF_ItemCraftingType.EXP, 5, false);


Adding the buff state:

    FotF_CustomCraftControl.configureProperty(1, 92, false, FotF_ItemCraftingType.STATE, [[21, 100]], true);


The potion works great, but now you want it to give 3 EXP instead when used,
as well as have it also target allies. Additionally you want to remove the
state and instead have it grant a skill (ID 4) passively.

Overwriting EXP to 3:

    FotF_CustomCraftControl.configureProperty(1, 92, false, FotF_ItemCraftingType.EXP, 3, true); <-- true to overwrite the previous value


Adding allies to filter:

    FotF_CustomCraftControl.configureProperty(1, 92, false, FotF_ItemCraftingType.FILTER, [UnitFilterFlag.ALLY], true);


Removing the state:

    FotF_CustomCraftControl.removeProperty(1, 92, false, FotF_ItemCraftingType.STATE);


Adding the skill:

    FotF_CustomCraftControl.configureProperty(1, 92, false, FotF_ItemCraftingType.SKILL, [4], true);

_____________________________________________________________________________
						    Compatibility
_____________________________________________________________________________

Overwritten functions:

    - ItemControl._isWeaponLevel
    - DurabilityChangeNoticeView.drawNoticeViewContent
    - DurabilityChangeNoticeView._setTitlePartsCount
    - ItemChangeNoticeView._setTitlePartsCount
    - ItemTitleFlowEntry.drawFlowEntry
    - SkillAutoAction._enterSteal
    - ItemRenderer.drawItemAlpha

Better not to rename the file, to prevent read order issues.
_____________________________________________________________________________
								 EPILOGUE
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

var FotF_CraftedItemSettings = {
    itemName: 'Crafted', //Name for custom crafted items
    keyword: 'Crafted Item', //Custom keyword needed for items to be able to accept crafted properties
    propertiesString: 'Forged Properties', //Title/Header for crafted proprties in the info window
    enableString: 'Enables', //If weapon option is enabled
    disableString: 'Disables', //If weapon option is disabled
    onString: 'on', //For switches if item turns them on
    offString: 'off', //For switches if item turns them off
    resurrectionTypes: ['full', 'half'] //For resurrection items. Types are full and half. Min is drawn as 1.
};

var FotF_CraftedItemStrings = {
    PRICE: 'Price',
    WEIGHT: 'Weight',
    DAMAGE: ['Damage', 'Heal'],
    DAMAGETYPE: 'Damage Type set to', //I
    SCOPE: 'Scope set to', //I
    MAXRANGE: 'Maximum range',
    HIT: 'Hit',
    CRIT: 'Crit', //W
    ATTACKCOUNT: 'Attack count', //W
    EXP: 'Usage EXP', //I
    SKILL: 'Skills',
    STATE: 'States',
    GUARDSTATE: 'Prevents states', //I
    WEAPONOPTION: [StringTable.WeaponOption_HpAbsorb, StringTable.WeaponOption_NoGuard, StringTable.WeaponOption_HpMinimum, StringTable.WeaponOption_HalveAttack, StringTable.WeaponOption_HalveAttackBreak, StringTable.WeaponOption_SealAttack, StringTable.WeaponOption_SealAttackBreak], //W
    FILTER: 'Targets', //I
    RESURRECTION: ['Resurrects target with', 'HP'], //I
    SWITCH: 'Switches',
    ONEWAY: 'no Counter', //W
    REVERSE: ['Deals', 'damage'], //W
    PARAMBONUS: 'Bonus',
    GROWTHBONUS: 'Growth Bonus',
    WLV: 'Wlv' //W
};

var FotF_CraftedItemStringArray = [
    FotF_CraftedItemStrings.PRICE,
    FotF_CraftedItemStrings.WEIGHT,
    FotF_CraftedItemStrings.DAMAGE,
    FotF_CraftedItemStrings.DAMAGETYPE, //I
    FotF_CraftedItemStrings.SCOPE, //I
    FotF_CraftedItemStrings.MAXRANGE, //I
    FotF_CraftedItemStrings.HIT,
    FotF_CraftedItemStrings.CRIT, //W
    FotF_CraftedItemStrings.ATTACKCOUNT, //W
    FotF_CraftedItemStrings.EXP, //I
    FotF_CraftedItemStrings.SKILL,
    FotF_CraftedItemStrings.STATE,
    FotF_CraftedItemStrings.GUARDSTATE, //I
    FotF_CraftedItemStrings.WEAPONOPTION, //W
    FotF_CraftedItemStrings.FILTER, //I
    FotF_CraftedItemStrings.RESURRECTION, //I
    FotF_CraftedItemStrings.SWITCH,
    FotF_CraftedItemStrings.ONEWAY, //W
    FotF_CraftedItemStrings.REVERSE, //W
    FotF_CraftedItemStrings.PARAMBONUS,
    FotF_CraftedItemStrings.GROWTHBONUS,
    FotF_CraftedItemStrings.WLV //W
];

/*-------------------------------------------------------------
                            CODE
-------------------------------------------------------------*/

var FotF_CustomItemArray = null;
var FotF_CurrentCustomItem = null;

//W = weapon only   I = item only
var FotF_ItemCraftingType = {
    PRICE: 0,
    WEIGHT: 1,
    DAMAGE: 2,
    DAMAGETYPE: 3, //I
    SCOPE: 4, //I
    MAXRANGE: 5, //I
    HIT: 6,
    CRIT: 7, //W
    ATTACKCOUNT: 8, //W
    EXP: 9, //I
    SKILL: 10,
    STATE: 11,
    GUARDSTATE: 12, //I
    WEAPONOPTION: 13, //W
    FILTER: 14, //I
    RESURRECTION: 15, //I
    SWITCH: 16,
    ONEWAY: 17, //W
    REVERSE: 18, //W
    PARAMBONUS: 19,
    GROWTHBONUS: 20,
    WLV: 21 //W
};

var FotF_StringAddMode = {
    PREFIX: 0,
    SUFFIX: 1,
    SET: 2
};

(function () {
    //Load custom object arrays from save file
    var FotF_LoadCustomCraftingArrays = LoadSaveScreen._executeLoad;
    LoadSaveScreen._executeLoad = function () {
        FotF_LoadCustomCraftingArrays.call(this);

        var extData = root.getExternalData();
        var manager = root.getLoadSaveManager();
        var saveIndex = extData.getActiveSaveFileIndex();
        var saveFileInfo = manager.getSaveFileInfo(saveIndex);
        var saveObject = saveFileInfo.custom;

        if (typeof saveObject.customItemArray !== 'undefined' && saveObject.customItemArray !== null) {
            FotF_CustomItemArray = saveObject.customItemArray;
            FotF_CustomCraftControl.initializeItemArray();
        }
    };

    //Save custom object arrays to save file
    var FotF_SaveCustomCraftingArrays = LoadSaveScreen._getCustomObject;
    LoadSaveScreen._getCustomObject = function () {
        var obj = FotF_SaveCustomCraftingArrays.call(this);
        FotF_CustomItemArray = FotF_CustomCraftControl.createItemArray();
        obj.customItemArray = FotF_CustomItemArray;

        return this._screenParam.customObject;
    };

    //Add custom item selection object
    var FotF_CustomItemPackage00 = ItemPackageControl.getCustomItemSelectionObject;
    ItemPackageControl.getCustomItemSelectionObject = function (item, keyword) {
        if (keyword === FotF_CraftedItemSettings.keyword) {
            return FotF_CraftedItemSelection;
        }

        return FotF_CustomItemPackage00.call(this, item, keyword);
    };

    //Add custom item use object
    var FotF_CustomItemPackage01 = ItemPackageControl.getCustomItemUseObject;
    ItemPackageControl.getCustomItemUseObject = function (item, keyword) {
        if (keyword === FotF_CraftedItemSettings.keyword) {
            return FotF_CraftedItemUse;
        }

        return FotF_CustomItemPackage01.call(this, item, keyword);
    };

    //Add custom item availability object
    var FotF_CustomItemPackage02 = ItemPackageControl.getCustomItemAvailabilityObject;
    ItemPackageControl.getCustomItemAvailabilityObject = function (item, keyword) {
        if (keyword === FotF_CraftedItemSettings.keyword) {
            return FotF_CraftedItemAvailability;
        }

        return FotF_CustomItemPackage02.call(this, item, keyword);
    };

    //Add custom item potency object
    var FotF_CustomItemPackage03 = ItemPackageControl.getCustomItemPotencyObject;
    ItemPackageControl.getCustomItemPotencyObject = function (item, keyword) {
        if (keyword === FotF_CraftedItemSettings.keyword) {
            return FotF_CraftedItemPotency;
        }

        return FotF_CustomItemPackage03.call(this, item, keyword);
    };

    //Add custom item info object
    var FotF_CustomItemPackage04 = ItemPackageControl.getCustomItemInfoObject;
    ItemPackageControl.getCustomItemInfoObject = function (item, keyword) {
        if (keyword === FotF_CraftedItemSettings.keyword) {
            return FotF_CraftedItemInfo;
        }

        return FotF_CustomItemPackage04.call(this, item, keyword);
    };

    //Adjust sell price of items
    var FotF_CraftAlias00 = Calculator.calculateSellPrice;
    Calculator.calculateSellPrice = function (item) {
        var gold = FotF_CraftAlias00.call(this, item);
        var bonus = 0;

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.PRICE)) {
            bonus = item.custom.craftedProperties.price;
        }

        var d;
        var limitMax = item.getLimitMax();

        if (limitMax === 0) {
            // Weapons that can be used infinitely (durability of 0) can be sold for half the purchasing cost.
            d = 1;
        } else if (limitMax === WeaponLimitValue.BROKEN) {
            // Broken weapons can only be sold for 0 gold.
            d = 0;
        } else {
            d = item.getLimit() / limitMax;
        }

        bonus = Math.floor((bonus * d) / 2);

        return gold + bonus;
    };

    //Adjust buy price of items
    var FotF_CraftAlias01 = ShopLayoutScreen.getGoldFromItem;
    ShopLayoutScreen.getGoldFromItem = function (item) {
        var gold = FotF_CraftAlias01.call(this, item);
        var bonus = 0;

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.PRICE)) {
            bonus = item.custom.craftedProperties.price;
        }
        return gold + bonus;
    };

    //Adjust item exp gain
    var FotF_CraftAlias08 = ItemExpFlowEntry._getItemExperience;
    ItemExpFlowEntry._getItemExperience = function (itemUseParent) {
        var exp = FotF_CraftAlias08.call(this, itemUseParent);
        var bonus = 0;
        var itemTargetInfo = itemUseParent.getItemTargetInfo();
        var item = itemTargetInfo.item;
        var unit = itemTargetInfo.unit;

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.EXP)) {
            bonus = item.custom.craftedProperties.exp;
        }

        var newValue = exp + bonus;

        return ExperienceCalculator.getBestExperience(unit, newValue);
    };

    //Adjust weapon damage
    var FotF_CraftAlias02 = AbilityCalculator.getPower;
    AbilityCalculator.getPower = function (unit, weapon) {
        var pow = FotF_CraftAlias02.call(this, unit, weapon);
        var bonus = 0;

        if (FotF_CustomCraftControl.verifyProperty(weapon, FotF_ItemCraftingType.DAMAGE)) {
            bonus += item.custom.craftedProperties.damage;
        }

        return pow + bonus;
    };

    //Adjust weapon weight in agility formula
    var FotF_CraftAlias03 = AbilityCalculator.getAgility;
    AbilityCalculator.getAgility = function (unit, weapon) {
        var agi = FotF_CraftAlias03.call(this, unit, weapon);
        var bonus = 0;

        if (FotF_CustomCraftControl.verifyProperty(weapon, FotF_ItemCraftingType.WEIGHT)) {
            bonus = weapon.custom.craftedProperties.weight;
        }

        return agi - bonus;
    };

    //Adjust if item can be stolen with new weight
    var FotF_CraftAlias04 = Miscellaneous.isStealTradeDisabled;
    Miscellaneous.isStealTradeDisabled = function (unit, item, value) {
        var isDisabled = FotF_CraftAlias04.call(this, unit, item, value);

        if (!isDisabled) {
            if (value & StealFlag.WEIGHT) {
                var bonus = 0;

                if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.WEIGHT)) {
                    bonus = item.custom.craftedProperties.weight;
                }

                if (ParamBonus.getStr(unit) < item.getWeight() + bonus) {
                    // If "Calculate by Weight" is enabled and if the unit pow is less than the item weight, disable.
                    return true;
                }
            }
        }

        return isDisabled;
    };

    //Adjust weapon hit rate
    var FotF_CraftAlias05 = AbilityCalculator.getHit;
    AbilityCalculator.getHit = function (unit, weapon) {
        var hit = FotF_CraftAlias05.call(this, unit, weapon);
        var bonus = 0;

        if (FotF_CustomCraftControl.verifyProperty(weapon, FotF_ItemCraftingType.HIT)) {
            bonus = weapon.custom.craftedProperties.hit;
        }

        return hit + bonus;
    };

    //Adjust weapon crit rate
    var FotF_CraftAlias06 = AbilityCalculator.getCritical;
    AbilityCalculator.getCritical = function (unit, weapon) {
        var crit = FotF_CraftAlias06.call(this, unit, weapon);
        var bonus = 0;

        if (FotF_CustomCraftControl.verifyProperty(weapon, FotF_ItemCraftingType.CRIT)) {
            bonus = weapon.custom.craftedProperties.crit;
        }

        return crit + bonus;
    };

    //Adjust weapon attack count
    var FotF_CraftAlias07 = Calculator.calculateAttackCount;
    Calculator.calculateAttackCount = function (active, passive, weapon) {
        var count = FotF_CraftAlias07.call(this, active, passive, weapon);
        var bonus = 0;

        if (FotF_CustomCraftControl.verifyProperty(weapon, FotF_ItemCraftingType.ATTACKCOUNT)) {
            bonus = weapon.custom.craftedProperties.attackCount;
        }

        return count + bonus;
    };

    //Adjust WLV requirement, unfortunately no sense in aliasing this
    ItemControl._isWeaponLevel = function (unit, item) {
        var bonus = 0;

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.WLV)) {
            bonus = item.custom.craftedProperties.wlv;
        }

        return ParamBonus.getBonusFromWeapon(unit, ParamType.WLV, item) >= item.getWeaponLevel() + bonus;
    };

    //Add crafted skills to weapons/items
    var FotF_CraftAlias09 = SkillControl._pushSkillValue;
    SkillControl._pushSkillValue = function (data, objecttype, arr, skilltype, keyword) {
        FotF_CraftAlias09.call(this, data, objecttype, arr, skilltype, keyword);

        if (objecttype === ObjectType.ITEM || objecttype === ObjectType.WEAPON) {
            var i, skill, skillEntry, isBuild;
            var list = [];

            if (FotF_CustomCraftControl.verifyProperty(data, FotF_ItemCraftingType.SKILL)) {
                list = data.custom.craftedProperties.skill;
            }

            var count = list.length;

            // Search the skill to be noticed as a type from the skill list.
            // If it's found, save the skill value at arr.
            for (i = 0; i < count; i++) {
                skill = root.getBaseData().getSkillList().getDataFromId(list[i]);
                if (skill === null) {
                    // Null may be returned if unable to find skills when loading save files.
                    continue;
                }

                isBuild = false;
                if (skilltype === -1) {
                    isBuild = true;
                } else if (skill.getSkillType() === skilltype) {
                    if (skilltype === SkillType.CUSTOM) {
                        if (skill.getCustomKeyword() === keyword) {
                            isBuild = true;
                        }
                    } else {
                        isBuild = true;
                    }
                }

                if (isBuild) {
                    skillEntry = StructureBuilder.buildMixSkillEntry();
                    skillEntry.objecttype = objecttype;
                    skillEntry.skill = skill;
                    arr.push(skillEntry);
                }
            }
        }
    };

    //Add crafted states to weapons
    var FotF_CraftAlias10 = AttackEvaluator.HitCritical._checkStateAttack;
    AttackEvaluator.HitCritical._checkStateAttack = function (virtualActive, virtualPassive, attackEntry) {
        FotF_CraftAlias10.call(this, virtualActive, virtualPassive, attackEntry);
        var i;
        var weapon = virtualActive.weapon;
        var arr = [];

        if (weapon !== null && FotF_CustomCraftControl.verifyProperty(weapon, FotF_ItemCraftingType.STATE)) {
            arr = weapon.custom.craftedProperties.state;
        }

        // Check the "State Attack" skill.
        var count = arr.length;
        for (i = 0; i < count; i++) {
            var invocation = root.createStateInvocation(arr[i][0], arr[i][1], InvocationType.ABSOLUTE);
            var state = invocation.getState();
            var rate = invocation.getInvocationValue();
            var type = invocation.getInvocationType();

            if (StateControl.isStateBlocked(virtualPassive.unitSelf, virtualActive.unitSelf, state)) {
                // Don't activate because the state is disabled.
                continue;
            }

            if (Probability.getInvocationProbability(virtualActive.unitSelf, type, rate)) {
                attackEntry.stateArrayPassive.push(state);
                virtualPassive.stateArray.push(state);
            }
        }
    };

    //Add one-way weapons
    var FotF_CraftAlias11 = AttackChecker._getCounterWeapon;
    AttackChecker._getCounterWeapon = function (unit, targetUnit) {
        var weaponPassive = FotF_CraftAlias11.call(this, unit, targetUnit);
        var weaponActive = ItemControl.getEquippedWeapon(unit);
        var isOneWayActive = null;
        var isOneWayPassive = null;

        //So there's no natural one-way weapon involved in if and one involved in else
        //meaning that adding one-way to one would disable counterattack
        if (weaponPassive !== null) {
            if (FotF_CustomCraftControl.verifyProperty(weaponActive, FotF_ItemCraftingType.ONEWAY)) {
                isOneWayActive = weaponActive.custom.craftedProperties.oneway;
            }

            if (FotF_CustomCraftControl.verifyProperty(weaponPassive, FotF_ItemCraftingType.ONEWAY)) {
                isOneWayPassive = weaponPassive.custom.craftedProperties.oneway;
            }

            //Assume passive weapon is not null (but check if it's actually there) and try to find
            //crafted one-way properties
        } else {
            weaponPassive = ItemControl.getEquippedWeapon(targetUnit);

            if (weaponPassive !== null) {
                if (weaponActive.isWeapon()) {
                    isOneWayActive = weaponActive.isOneSide();
                }

                if (weaponPassive.isWeapon()) {
                    isOneWayPassive = weaponPassive.isOneSide();
                }

                if (weaponActive.isWeapon() && FotF_CustomCraftControl.verifyProperty(weaponActive, FotF_ItemCraftingType.ONEWAY)) {
                    isOneWayActive = weaponActive.custom.craftedProperties.oneway;
                }

                if (weaponPassive.isWeapon() && FotF_CustomCraftControl.verifyProperty(weaponPassive, FotF_ItemCraftingType.ONEWAY)) {
                    isOneWayPassive = weaponPassive.custom.craftedProperties.oneway;
                }
            }
        }

        if (isOneWayActive === true || isOneWayPassive === true) {
            weaponPassive = null;
        }

        return weaponPassive;
    };

    //Add reverse weapons
    var FotF_CraftAlias12 = Miscellaneous.isPhysicsBattle;
    Miscellaneous.isPhysicsBattle = function (weapon) {
        var isPhysics = FotF_CraftAlias12.call(this, weapon);
        var weaponCategoryType = weapon.getWeaponCategoryType();

        if (FotF_CustomCraftControl.verifyProperty(weapon, FotF_ItemCraftingType.REVERSE)) {
            if (weapon.custom.craftedProperties.reverse === true) {
                if (weaponCategoryType === WeaponCategoryType.PHYSICS || weaponCategoryType === WeaponCategoryType.SHOOT) {
                    isPhysics = false;
                } else {
                    isPhysics = true;
                }
            } else if (weapon.custom.craftedProperties.reverse === false) {
                if (weaponCategoryType === WeaponCategoryType.PHYSICS || weaponCategoryType === WeaponCategoryType.SHOOT) {
                    isPhysics = true;
                } else {
                    isPhysics = false;
                }
            }
        }

        return isPhysics;
    };

    //Add param bonus to weapons
    var FotF_CraftAlias13 = BaseUnitParameter.getUnitTotalParamBonus;
    BaseUnitParameter.getUnitTotalParamBonus = function (unit, weapon) {
        d = FotF_CraftAlias13.call(this, unit, weapon);

        if (weapon !== null) {
            var bonus = 0;

            if (FotF_CustomCraftControl.verifyProperty(weapon, FotF_ItemCraftingType.PARAMBONUS)) {
                bonus = weapon.custom.craftedProperties.paramBonus[this.getParameterType()];
            }

            d += bonus;
        }

        return d;
    };

    //Add growth bonus to weapons
    var FotF_CraftAlias14 = BaseUnitParameter.getUnitTotalGrowthBonus;
    BaseUnitParameter.getUnitTotalGrowthBonus = function (unit, weapon) {
        var d = FotF_CraftAlias14.call(this, unit, weapon);

        if (weapon !== null) {
            var bonus = 0;

            if (FotF_CustomCraftControl.verifyProperty(weapon, FotF_ItemCraftingType.GROWTHBONUS)) {
                bonus = weapon.custom.craftedProperties.growthBonus[this.getParameterType()];
            }

            d += bonus;
        }

        return d;
    };

    //Add lifesteal
    var FotF_CraftAlias16 = AttackEvaluator.ActiveAction._isAbsorption;
    AttackEvaluator.ActiveAction._isAbsorption = function (virtualActive, virtualPassive, attackEntry) {
        //This is just so the function is aliased rather than overwritten
        var percent = FotF_CraftAlias16.call(this, virtualActive, virtualPassive, attackEntry);
        var weaponAbsorptionPercent = 0;
        var skillAbsorptionPercent = 0;
        var active = virtualActive.unitSelf;
        var passive = virtualPassive.unitSelf;
        var weapon = virtualActive.weapon;
        var skill = SkillControl.checkAndPushSkill(active, passive, attackEntry, true, SkillType.DAMAGEABSORPTION);

        if (skill !== null) {
            skillAbsorptionPercent = skill.getSkillValue();
        }

        weaponAbsorptionPercent = this._getWeaponAbsorptionPercent(weapon);

        if (weapon !== null) {
            var weaponOption = FotF_CustomCraftControl.verifyWeaponOption(weapon, 0);
            if (weaponOption !== null) {
                if (weaponOption === true) {
                    weaponAbsorptionPercent = 100;
                } else if (weaponOption === false) {
                    weaponAbsorptionPercent = 0;
                }
            }
        }

        return Math.max(weaponAbsorptionPercent, skillAbsorptionPercent);
    };

    //Add ignore defense
    var FotF_CraftAlias17 = DamageCalculator.isNoGuard;
    DamageCalculator.isNoGuard = function (active, passive, weapon, isCritical, trueHitValue) {
        var isNoGuard = FotF_CraftAlias17.call(this, active, passive, weapon, isCritical, trueHitValue);

        if (weapon !== null) {
            var weaponOption = FotF_CustomCraftControl.verifyWeaponOption(weapon, 1);
            if (weaponOption !== null) {
                isNoGuard = weaponOption;
            }
        }

        return isNoGuard || trueHitValue === TrueHitValue.NOGUARD;
    };

    //HP reduction AIScorer support
    var FotF_CraftAlias18 = AIScorer.Weapon._getDamage;
    AIScorer.Weapon._getDamage = function (unit, combination) {
        var damage = FotF_CraftAlias18.call(this, unit, combination);

        if (combination.item !== null) {
            var weaponOption = FotF_CustomCraftControl.verifyWeaponOption(combination.item, 2);
            if (weaponOption === true) {
                damage = combination.targetUnit.getHp() - 1;
            } else if (weaponOption === false) {
                damage = DamageCalculator.calculateDamage(unit, combination.targetUnit, combination.item, false, this._getSupportStatus(unit), this._getTargetSupportStatus(combination.targetUnit), 0);

                var roundAttackCount = Calculator.calculateRoundCount(unit, combination.targetUnit, combination.item);
                roundAttackCount *= Calculator.calculateAttackCount(unit, combination.targetUnit, combination.item);
                damage *= roundAttackCount;
            }
        }

        return damage;
    };

    //Add HP reduction
    var FotF_CraftAlias19 = DamageCalculator.isHpMinimum;
    DamageCalculator.isHpMinimum = function (active, passive, weapon, isCritical, trueHitValue) {
        var isHpMinimum = FotF_CraftAlias19.call(this, active, passive, weapon, isCritical, trueHitValue);

        if (weapon !== null) {
            var weaponOption = FotF_CustomCraftControl.verifyWeaponOption(weapon, 2);
            if (weaponOption !== null) {
                isHpMinimum = weaponOption;
            }
        }

        return isHpMinimum || trueHitValue === TrueHitValue.HPMINIMUM;
    };

    //Add halve attack
    var FotF_CraftAlias20 = DamageCalculator.isHalveAttack;
    DamageCalculator.isHalveAttack = function (active, passive, weapon, isCritical, trueHitValue) {
        var isHalve = FotF_CraftAlias20.call(this, active, passive, weapon, isCritical, trueHitValue);
        var weaponPassive = ItemControl.getEquippedWeapon(passive);

        if (weapon !== null) {
            var weaponOption = FotF_CustomCraftControl.verifyWeaponOption(weaponPassive, 3);
            if (weaponOption !== null) {
                isHalve = weaponOption;
            }
        }

        return isHalve || SkillControl.getBattleSkillFromValue(passive, active, SkillType.BATTLERESTRICTION, BattleRestrictionValue.HALVEATTACK) !== null;
    };

    //Add halve attack break
    var FotF_CraftAlias21 = DamageCalculator.isHalveAttackBreak;
    DamageCalculator.isHalveAttackBreak = function (active, passive, weapon, isCritical, trueHitValue) {
        var isHalveBreak = FotF_CraftAlias21.call(this, active, passive, weapon, isCritical, trueHitValue);

        if (weapon !== null) {
            var weaponOption = FotF_CustomCraftControl.verifyWeaponOption(weapon, 4);
            if (weaponOption !== null) {
                isHalveBreak = weaponOption;
            }
        }

        return isHalveBreak || SkillControl.getBattleSkillFromFlag(active, passive, SkillType.INVALID, InvalidFlag.HALVEATTACKBREAK) !== null;
    };

    //Add seal attacks
    var FotF_CraftAlias15 = NormalAttackOrderBuilder._isSealAttack;
    NormalAttackOrderBuilder._isSealAttack = function (virtualActive, virtualPassive) {
        var isSeal = FotF_CraftAlias15.call(this, virtualActive, virtualPassive);
        var weapon = virtualPassive.weapon;

        if (weapon !== null) {
            var weaponOption = FotF_CustomCraftControl.verifyWeaponOption(weapon, 5);
            if (weaponOption !== null) {
                isSeal = weaponOption;
            }
        }

        return isSeal || SkillControl.getBattleSkillFromValue(virtualPassive.unitSelf, virtualActive.unitSelf, SkillType.BATTLERESTRICTION, BattleRestrictionValue.SEALATTACK) !== null;
    };

    //Add seal attack break
    var FotF_CraftAlias22 = NormalAttackOrderBuilder._isSealAttackBreak;
    NormalAttackOrderBuilder._isSealAttackBreak = function (virtualActive, virtualPassive) {
        var weapon = virtualActive.weapon;
        var isSealBreak = FotF_CraftAlias22.call(this, virtualActive, virtualPassive);

        if (weapon !== null) {
            var weaponOption = FotF_CustomCraftControl.verifyWeaponOption(weapon, 6);
            if (weaponOption !== null) {
                isSealBreak = weaponOption;
            }
        }

        return isSealBreak || SkillControl.getBattleSkillFromFlag(virtualActive.unitSelf, virtualPassive.unitSelf, SkillType.INVALID, InvalidFlag.SEALATTACKBREAK) !== null;
    };

    //Add guard states to items
    var FotF_CraftAlias23 = StateControl.isStateBlocked;
    StateControl.isStateBlocked = function (unit, targetUnit, state) {
        var isBlocked = FotF_CraftAlias23.call(this, unit, targetUnit, state);

        if (isBlocked) {
            return true;
        }

        var i, count, item, stateGroup;

        if (state === null) {
            return false;
        }

        count = UnitItemControl.getPossessionItemCount(unit);
        for (i = 0; i < count; i++) {
            item = UnitItemControl.getItem(unit, i);
            if (item === null || !FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.GUARDSTATE)) {
                continue;
            }

            if (item.isWeapon()) {
                continue;
            }

            // Whether the "Guard State" of an item may be checked.
            //I left this in for the case someone wants to use it.
            if (!this._IsGuardStateCheckEnabled(unit, targetUnit, state, item)) {
                continue;
            }

            // Check the "Guard State" of the item.
            var id = state.getId();
            var arr = item.custom.craftedProperties.guardState;

            if (arr.indexOf(id) > -1) {
                return true;
            }
        }

        return false;
    };

    //Add parameter/growth bonus to items
    var FotF_CraftAlias24 = BaseUnitParameter._getItemBonus;
    BaseUnitParameter._getItemBonus = function (unit, isParameter) {
        var d = FotF_CraftAlias24.call(this, unit, isParameter);

        var i, item;
        var n = 0;
        var checkerArray = [];
        var count = UnitItemControl.getPossessionItemCount(unit);

        for (i = 0; i < count; i++) {
            item = UnitItemControl.getItem(unit, i);
            var isCheck = FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.PARAMBONUS) || FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.GROWTHBONUS);
            if (item === null || !ItemIdentityChecker.isItemReused(checkerArray, item) || !isCheck) {
                continue;
            }

            if (isParameter) {
                n = FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.PARAMBONUS) ? item.custom.craftedProperties.paramBonus[this.getParameterType()] : 0;
            } else {
                n = FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.GROWTHBONUS) ? item.custom.craftedProperties.growthBonus[this.getParameterType()] : 0;
            }

            // Correction is not added for the unit who cannot use the item.
            if (n !== 0 && ItemControl.isItemUsable(unit, item)) {
                d += n;
            }
        }

        return d;
    };

    //Add item name/color to durability change event command
    DurabilityChangeNoticeView.drawNoticeViewContent = function (x, y) {
        var textui = this.getTitleTextUI();
        var color = textui.getColor();
        var font = textui.getFont();
        var width = TextRenderer.getTextWidth(FotF_CustomCraftRenderer.getItemName(this._targetItem), font) + 30;

        ItemRenderer.drawItem(x, y, this._targetItem, FotF_CustomCraftRenderer.getItemColor(this._targetItem, color), font, false);

        x += width;
        this._drawLimit(x, y);
    };

    //Add name/item color to durability change event command
    DurabilityChangeNoticeView._setTitlePartsCount = function () {
        var font = this.getTitleTextUI().getFont();
        var textWidth = TextRenderer.getTextWidth(FotF_CustomCraftRenderer.getItemName(this._targetItem), font) + 100 + TitleRenderer.getTitlePartsWidth() * 2;

        this._titlePartsCount = Math.floor(textWidth / TitleRenderer.getTitlePartsWidth());
    };

    //Add item name/color to item change event command
    ItemChangeNoticeView._setTitlePartsCount = function () {
        var font = this.getTitleTextUI().getFont();
        var textWidth = TextRenderer.getTextWidth(FotF_CustomCraftRenderer.getItemName(this._targetItem), font) + 100 + TitleRenderer.getTitlePartsWidth() * 2;

        this._titlePartsCount = Math.floor(textWidth / TitleRenderer.getTitlePartsWidth());
    };

    //Add item name/color to item title flow entry
    ItemTitleFlowEntry.drawFlowEntry = function () {
        var x, y;
        var itemTargetInfo = this._itemUseParent.getItemTargetInfo();
        var textui = root.queryTextUI('itemuse_title');
        var color = textui.getColor();
        var font = textui.getFont();
        var pic = textui.getUIImage();
        var text = FotF_CustomCraftRenderer.getItemName(itemTargetInfo.item);
        var width = (TitleRenderer.getTitlePartsCount(text, font) + 2) * TitleRenderer.getTitlePartsWidth();

        x = LayoutControl.getUnitCenterX(itemTargetInfo.unit, width, 0);
        y = LayoutControl.getUnitBaseY(itemTargetInfo.unit, TitleRenderer.getTitlePartsHeight()) - 20;

        TextRenderer.drawTitleText(x, y, text, FotF_CustomCraftRenderer.getItemColor(itemTargetInfo.item, color), font, TextFormat.CENTER, pic);
    };

    //Add item name/color to steal action
    SkillAutoAction._enterSteal = function () {
        var generator;
        var pixelIndex = 3;
        var direction = PosChecker.getSideDirection(this._unit.getMapX(), this._unit.getMapY(), this._targetUnit.getMapX(), this._targetUnit.getMapY());
        var directionArray = [DirectionType.RIGHT, DirectionType.BOTTOM, DirectionType.LEFT, DirectionType.TOP];

        ItemControl.deleteItem(this._targetUnit, this._targetItem);
        UnitItemControl.pushItem(this._unit, this._targetItem);

        if (this._isSkipMode) {
            return EnterResult.NOTENTER;
        }

        this._dynamicEvent = createObject(DynamicEvent);
        generator = this._dynamicEvent.acquireEventGenerator();

        generator.unitSlide(this._unit, direction, pixelIndex, SlideType.START, this._isSkipMode);
        generator.soundPlay(this._getLostSoundHandle(), 1);
        generator.unitSlide(this._unit, directionArray[direction], pixelIndex, SlideType.START, this._isSkipMode);
        generator.unitSlide(this._unit, 0, 0, SlideType.END, this._isSkipMode);
        generator.messageTitle(FotF_CustomCraftRenderer.getItemName(this._targetItem) + StringTable.ItemSteal, 0, 0, true);

        this._appendExperience(generator);

        return this._dynamicEvent.executeDynamicEvent();
    };

    //Add item name/color to item renderer
    ItemRenderer.drawItemAlpha = function (x, y, item, color, font, isDrawLimit, alpha) {
        var interval = this._getItemNumberInterval();
        var iconWidth = GraphicsFormat.ICON_WIDTH + 5;
        var length = this._getTextLength();
        var handle = item.getIconResourceHandle();
        var graphicsRenderParam = StructureBuilder.buildGraphicsRenderParam();

        graphicsRenderParam.alpha = alpha;
        GraphicsRenderer.drawImageParam(x, y, handle, GraphicsType.ICON, graphicsRenderParam);

        TextRenderer.drawAlphaText(x + iconWidth, y + ContentLayout.KEYWORD_HEIGHT, FotF_CustomCraftRenderer.getItemName(item), length, FotF_CustomCraftRenderer.getItemColor(item, color), alpha, font);

        if (isDrawLimit) {
            this.drawItemLimit(x + iconWidth + interval, y, item, alpha);
        }
    };
})();

var FotF_CraftedItemSelection = defineObject(BaseObject, {
    _unit: null,
    _item: null,
    _targetUnit: null,
    _targetPos: null,
    _targetClass: null,
    _targetItem: null,
    _targetMetamorphoze: null,
    _isSelection: false,
    _posSelector: null,
    _isPosSelector: false,
    _resurrectionScreen: null,
    _resurrectUnit: null,
    _resurrectionPos: null,

    enterItemSelectionCycle: function (unit, item) {
        this._unit = unit;
        this._item = item;
        this._targetUnit = null;
        this._targetPos = createPos(this._unit.getMapX(), this._unit.getMapY());
        this._targetClass = null;
        this._targetItem = null;
        this._isSelection = false;
        this._posSelector = createObject(PosSelector);

        if (FotF_CraftedItemAvailability.isOffensiveAllowed(unit, item)) {
            this.setInitialSelection();
        }

        if (FotF_CraftedItemAvailability.isDefensiveAllowed(unit, item)) {
            this.createResurrectionScreen(this._unit, this._item);
        }

        if (this._isPosSelector || this._resurrectionScreen !== null) {
            return EnterResult.OK;
        }

        return EnterResult.NOTENTER;
    },

    moveItemSelectionCycle: function () {
        var targetUnit;

        if (this._resurrectionScreen !== null) {
            if (SceneManager.isScreenClosed(this._resurrectionScreen)) {
                targetUnit = this._resurrectionScreen.getResurrectionUnit();

                if (targetUnit === null) {
                    this._isSelection = false;
                    this._resurrectionPos = null;
                } else {
                    this._isSelection = true;
                    if (!Miscellaneous.isPrepareScene()) {
                        this._resurrectionPos = PosChecker.getNearbyPos(this._unit, targetUnit);
                    }
                }

                this._resurrectUnit = targetUnit;

                this._resurrectionScreen = null;
                this._targetPos = createPos(this._unit.getMapX(), this._unit.getMapY());
            }

            return MoveResult.CONTINUE;
        }

        if (this._isPosSelector && this._posSelector !== null) {
            var result = this._posSelector.movePosSelector();

            if (result === PosSelectorResult.SELECT) {
                if (this.isPosSelectable()) {
                    targetUnit = this._posSelector.getSelectorTarget(false);
                    if (targetUnit !== null) {
                        this._targetUnit = targetUnit;
                    }
                    this._isSelection = true;
                    this._posSelector.endPosSelector();
                    return MoveResult.END;
                }
            } else if (result === PosSelectorResult.CANCEL) {
                this._isSelection = false;
                this._posSelector.endPosSelector();
                return MoveResult.END;
            }

            return MoveResult.CONTINUE;
        }

        return MoveResult.END;
    },

    drawItemSelectionCycle: function () {
        if (this._posSelector !== null) {
            this._posSelector.drawPosSelector();
        }
    },

    setUnitSelection: function () {
        var filter = this.getUnitFilter();
        var rangeType = this.getRangeType(this._item);
        var range = this.getItemRange(this._item, rangeType);

        if (rangeType === SelectionRangeType.ALL) {
            var indexArray = this.getMapRangeArray();
        } else {
            var indexArray = IndexArray.getBestIndexArray(this._unit.getMapX(), this._unit.getMapY(), range.min, range.max);
        }

        indexArray = this._getUnitOnlyIndexArray(this._unit, indexArray);
        this._posSelector.setUnitOnly(this._unit, this._item, indexArray, PosMenuType.Item, filter);

        this.setFirstPos();
    },

    createResurrectionScreen: function (unit, item) {
        var screenParam = this._createScreenParam();

        this._resurrectionScreen = createObject(FotF_ResurrectionScreen);
        SceneManager.addScreen(this._resurrectionScreen, screenParam);
    },

    _createScreenParam: function () {
        var screenParam = ScreenBuilder.buildResurrection();

        screenParam.unit = this._unit;
        screenParam.item = this._item;

        return screenParam;
    },

    // It's called if the item is used at the specific position.
    setPosSelection: function () {
        var rangeType = this.getRangeType(this._item);
        var range = this.getItemRange(this._item, rangeType);

        if (rangeType === SelectionRangeType.ALL) {
            var indexArray = this.getMapRangeArray();
        } else {
            var indexArray = IndexArray.getBestIndexArray(this._unit.getMapX(), this._unit.getMapY(), range.min, range.max);
        }

        this._posSelector.setPosOnly(this._unit, this._item, indexArray, PosMenuType.Item);

        this.setFirstPos();
    },

    setFirstPos: function () {
        this._posSelector.setFirstPos();
    },

    isPosSelectable: function () {
        return this._posSelector.getSelectorTarget(true) !== null;
    },

    getUnitFilter: function () {
        return FilterControl.getBestFilter(this._unit.getUnitType(), this.getExtraFilter(this._item));
    },

    getExtraFilter: function (item) {
        var filter = item.getFilterFlag();

        if (typeof filter !== 'number') {
            filter = 0x00;
        }

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.FILTER)) {
            var i;
            var arr = item.custom.craftedProperties.filter;

            for (i = 0; i < arr.length; i++) {
                var bits = arr[i];
                filter += bits;
            }
        }

        return filter;
    },

    setInitialSelection: function () {
        var rangeType = this.getRangeType(this._item);

        if (rangeType === SelectionRangeType.SELFONLY) {
            this._isSelection = false;
            this._targetUnit = this._unit;
            //return EnterResult.NOTENTER;
        } else {
            // The item can be used for the unit at the default.
            this._isPosSelector = true;
            this.setUnitSelection();
        }

        return EnterResult.OK;
    },

    isSelection: function () {
        return this._isSelection;
    },

    getResultItemTargetInfo: function () {
        var itemTargetInfo = StructureBuilder.buildItemTargetInfo();

        // The caller sets the unit and the item.
        itemTargetInfo.targetUnit = this._targetUnit;
        itemTargetInfo.targetPos = this._targetPos;
        itemTargetInfo.targetClass = this._targetClass;
        itemTargetInfo.targetItem = this._targetItem;
        itemTargetInfo.targetMetamorphoze = this._targetMetamorphoze;
        itemTargetInfo.resurrectUnit = this._resurrectUnit;
        itemTargetInfo.resurrectionPos = this._resurrectionPos;

        return itemTargetInfo;
    },

    _getUnitOnlyIndexArray: function (unit, indexArray) {
        var i, index, x, y;
        var indexArrayNew = [];
        var count = indexArray.length;
        var obj = ItemPackageControl.getItemAvailabilityObject(this._item);

        if (obj === null) {
            return indexArrayNew;
        }

        for (i = 0; i < count; i++) {
            index = indexArray[i];
            x = CurrentMap.getX(index);
            y = CurrentMap.getY(index);
            if (obj.isPosEnabled(unit, this._item, x, y)) {
                indexArrayNew.push(index);
            }
        }

        return indexArrayNew;
    },

    getRangeType: function (item) {
        var type = item.getRangeType();

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.SCOPE)) {
            type = item.custom.craftedProperties.scope;
        }

        return type;
    },

    getItemRange: function (item, type) {
        var min = 1;
        var max = 1;

        if (type === SelectionRangeType.MULTI) {
            max = typeof item.getRangeValue() === 'number' ? item.getRangeValue() : 0;
            if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.MAXRANGE)) {
                max += item.custom.craftedProperties.maxRange;
            }
        } else if (type === SelectionRangeType.SELFONLY) {
            min = 0;
            max = 0;
        }

        return {
            min: min,
            max: max
        };
    },

    getMapRangeArray: function () {
        var i;
        var arr = [];

        for (i = 0; i < CurrentMap.getSize(); i++) {
            arr.push(i);
        }

        return arr;
    }
});

var FotF_CraftedItemUse = defineObject(BaseItemUse, {
    _dynamicEvent: null,

    enterMainUseCycle: function (itemUseParent) {
        var i;
        var generator;
        var itemTargetInfo = itemUseParent.getItemTargetInfo();
        var item = itemTargetInfo.item;
        var unit = itemTargetInfo.unit;
        var targetUnit = itemTargetInfo.targetUnit;
        var damage = this.getDamage(item, unit);
        var damageType = this.getDamageType(item);
        var hit = this.getHit(item);
        var stateArray = this.getStates(item);
        var rangeType = this.getRangeType(item);
        var switchArray = this.getSwitches(item);

        this._dynamicEvent = createObject(DynamicEvent);
        generator = this._dynamicEvent.acquireEventGenerator();

        if (targetUnit !== null && rangeType !== SelectionRangeType.SELFONLY) {
            generator.locationFocus(targetUnit.getMapX(), targetUnit.getMapY(), true);
        }

        if (typeof itemTargetInfo.resurrectUnit !== 'undefined' && typeof itemTargetInfo.resurrectionPos !== 'undefined') {
            this.resurrectUnit(itemTargetInfo);
        }

        if (targetUnit === null) {
            return this._dynamicEvent.executeDynamicEvent();
        }

        if (damage > 0) {
            var anime = this._getItemDamageAnime(itemTargetInfo) !== null ? this._getItemDamageAnime(itemTargetInfo) : root.queryAnime('easydamage');
            generator.damageHitEx(targetUnit, anime, damage, damageType, hit, unit, itemUseParent.isItemSkipMode());
        } else if (damage < 0) {
            var anime = this._getItemDamageAnime(itemTargetInfo) !== null ? this._getItemDamageAnime(itemTargetInfo) : root.queryAnime('easyrecovery');
            generator.hpRecovery(targetUnit, anime, damage * -1, RecoveryType.SPECIFY, itemUseParent.isItemSkipMode());
        }

        for (i = 0; i < stateArray.length; i++) {
            var invocation = stateArray[i];
            generator.unitStateAddition(targetUnit, invocation, IncreaseType.INCREASE, unit, itemUseParent.isItemSkipMode());
        }

        this.flipSwitches(switchArray);

        itemUseParent.decreaseItem();
        itemUseParent.disableItemDecrement();

        return this._dynamicEvent.executeDynamicEvent();
    },

    getDamage: function (item, unit) {
        var dmg = 0;

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.DAMAGE)) {
            dmg += item.custom.craftedProperties.damage;
        }

        damageType = DamageType.FIXED;

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.DAMAGETYPE)) {
            damageType = item.custom.craftedProperties.damageType;
        }

        if (item.isWand()) {
            if (damageType === DamageType.MAGIC) {
                dmg += ParamBonus.getMag(unit);
            }
        }

        return dmg;
    },

    getDamageType: function (item) {
        var type = DamageType.FIXED;

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.DAMAGETYPE)) {
            type = item.custom.craftedProperties.damageType;
        }

        return type;
    },

    getHit: function (item) {
        var hit = 0;

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.HIT)) {
            hit += item.custom.craftedProperties.hit;
        }

        return hit;
    },

    getStates: function (item) {
        var i;
        var arr = [];

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.STATE)) {
            var stateArr = item.custom.craftedProperties.state;
            for (i = 0; i < stateArr.length; i++) {
                var invocation = root.createStateInvocation(stateArr[i][0], stateArr[i][1], InvocationType.ABSOLUTE);
                arr.push(invocation);
            }
        }

        return arr;
    },

    getRangeType: function (item) {
        var type = item.getRangeType();

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.SCOPE)) {
            type = item.custom.craftedProperties.scope;
        }

        return type;
    },

    getSwitches: function (item) {
        var arr = [];

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.SWITCH)) {
            arr = item.custom.craftedProperties.switches;
        }

        return arr;
    },

    flipSwitches: function (arr) {
        var i;
        var table = root.getMetaSession().getGlobalSwitchTable();

        for (i = 0; i < arr.length; i++) {
            var index = table.getSwitchIndexFromId(arr[i]);
            var state = table.isSwitchOn(index);
            table.setSwitch(index, !state);
        }
    },

    resurrectUnit: function (itemTargetInfo) {
        var type = this.getResurrectionType(itemTargetInfo.item);
        var targetUnit = itemTargetInfo.resurrectUnit;
        var targetPos = itemTargetInfo.resurrectionPos;

        if (targetUnit === null || targetPos === null) {
            return;
        }

        if (Miscellaneous.isPrepareScene()) {
            type = ResurrectionType.MAX;
        } else {
            targetUnit.setMapX(targetPos.x);
            targetUnit.setMapY(targetPos.y);
            targetUnit.setSortieState(SortieType.SORTIE);
        }

        targetUnit.setAliveState(AliveType.ALIVE);
        targetUnit.setInvisible(false);
        targetUnit.setWait(false);

        // Enable to move with the enemy turn by deactivating acted.
        targetUnit.setOrderMark(OrderMarkType.FREE);

        this.changeHp(targetUnit, type);
    },

    changeHp: function (targetUnit, type) {
        var hp;
        var maxHp = ParamBonus.getMhp(targetUnit);

        if (type === ResurrectionType.MIN) {
            hp = 1;
        } else if (type === ResurrectionType.HALF) {
            hp = Math.floor(maxHp / 2);
        } else {
            hp = maxHp;
        }

        targetUnit.setHp(hp);
    },

    getResurrectionType: function (item) {
        var type = null;

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.RESURRECTION)) {
            type = item.custom.craftedProperties.resurrectionType;
        }

        return type;
    },

    moveMainUseCycle: function () {
        return this._dynamicEvent.moveDynamicEvent();
    },

    _getItemDamageAnime: function (itemTargetInfo) {
        return itemTargetInfo.item.getItemAnime();
    }
});

var FotF_CraftedItemAvailability = defineObject(BaseItemAvailability, {
    isItemAvailableCondition: function (unit, item) {
        return this.isDefensiveAllowed(unit, item) || this.isOffensiveAllowed(unit, item);
    },

    isOffensiveAllowed: function (unit, item) {
        var rangeType = this.getRangeType(item);

        if (rangeType === SelectionRangeType.SELFONLY) {
            return this._checkSelfOnly(unit, item);
        } else if (rangeType === SelectionRangeType.MULTI) {
            return this._checkMulti(unit, item);
        } else if (rangeType === SelectionRangeType.ALL) {
            return this._checkAll(unit, item);
        }
    },

    isDefensiveAllowed: function (unit, item) {
        return FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.RESURRECTION) && this.getResurrectionTargetArray(unit, item).length > 0;
    },

    getResurrectionTargetArray: function (unit, item) {
        var i, j, count, list, targetUnit;
        var filter = FilterControl.getNormalFilter(unit.getUnitType());
        var listArray = FilterControl.getDeathListArray(filter);
        var listCount = listArray.length;
        var arr = [];
        var aggregation = item.getTargetAggregation();

        for (i = 0; i < listCount; i++) {
            list = listArray[i];
            count = list.getCount();
            for (j = 0; j < count; j++) {
                targetUnit = list.getData(j);
                if (!aggregation.isCondition(targetUnit)) {
                    continue;
                }

                arr.push(targetUnit);
            }
        }

        return arr;
    },

    isPosEnabled: function (unit, item, x, y) {
        var targetUnit;

        targetUnit = PosChecker.getUnitFromPos(x, y);
        if (targetUnit !== null && targetUnit !== unit) {
            if (FilterControl.isBestUnitTypeAllowed(unit.getUnitType(), targetUnit.getUnitType(), this.getExtraFilter(item))) {
                return this._isCondition(unit, targetUnit, item) && this.isItemAllowed(unit, targetUnit, item);
            } else if (FilterControl.isBestUnitTypeAllowed(unit.getUnitType(), targetUnit.getUnitType(), this.getExtraFilter(item))) {
                return this._isCondition(unit, targetUnit, item) && this.isItemAllowed(unit, targetUnit, item);
            }
        }

        return false;
    },

    getExtraFilter: function (item) {
        var filter = item.getFilterFlag();

        if (typeof filter !== 'number') {
            filter = 0x00;
        }

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.FILTER)) {
            var i;
            var arr = item.custom.craftedProperties.filter;

            for (i = 0; i < arr.length; i++) {
                var bits = arr[i];
                filter += bits;
            }
        }

        return filter;
    },

    isItemAllowed: function (unit, targetUnit, item) {
        return true;
    },

    _checkSelfOnly: function (unit, item) {
        return this._isCondition(unit, unit, item) && this.isItemAllowed(unit, unit, item);
    },

    _checkMulti: function (unit, item) {
        var i, index, x, y;
        var range = this.getItemRange(item);
        var indexArray = IndexArray.getBestIndexArray(unit.getMapX(), unit.getMapY(), 0, range);
        var count = indexArray.length;

        for (i = 0; i < count; i++) {
            index = indexArray[i];
            x = CurrentMap.getX(index);
            y = CurrentMap.getY(index);
            if (this.isPosEnabled(unit, item, x, y)) {
                return true;
            }
        }

        return false;
    },

    _checkAll: function (unit, item) {
        var i, j, count, list, targetUnit;
        var filter = FilterControl.getBestFilter(unit.getUnitType(), this.getExtraFilter(item));
        var listArray = FilterControl.getListArray(filter);
        var listCount = listArray.length;

        for (i = 0; i < listCount; i++) {
            list = listArray[i];
            count = list.getCount();
            for (j = 0; j < count; j++) {
                targetUnit = list.getData(j);
                if (unit !== targetUnit && this._isCondition(unit, targetUnit, item) && this.isItemAllowed(unit, targetUnit, item)) {
                    return true;
                }
            }
        }

        return false;
    },

    _isCondition: function (unit, targetUnit, item) {
        return true;
    },

    getRangeType: function (item) {
        var type = item.getRangeType();

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.SCOPE)) {
            type = item.custom.craftedProperties.scope;
        }

        return type;
    },

    getItemRange: function (item) {
        var max = typeof item.getRangeValue() === 'number' ? item.getRangeValue() : 0;

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.MAXRANGE)) {
            max += item.custom.craftedProperties.maxRange;
        }

        return max;
    }
});

var FotF_CraftedItemPotency = defineObject(BaseItemPotency, {
    _value: 0,
    _value2: 0,

    setPosMenuData: function (unit, item, targetUnit) {
        this._value = Calculator.calculateDamageValue(targetUnit, this.getDamage(item, unit), this.getDamageType(item), 0);
        this._value2 = Calculator.calculateDamageHit(targetUnit, this.getHit(item));
    },

    drawPosMenuData: function (x, y, textui) {
        var text;
        var color = ColorValue.KEYWORD;
        var font = textui.getFont();

        text = root.queryCommand('power_capacity');
        TextRenderer.drawKeywordText(x, y, text, -1, color, font);
        NumberRenderer.drawNumber(x + 50, y, this._value);

        x += 75;

        text = root.queryCommand('hit_capacity');
        TextRenderer.drawKeywordText(x, y, text, -1, color, font);
        NumberRenderer.drawNumber(x + 50, y, this._value2);
    },

    getKeywordName: function () {
        return StringTable.FusionWord_Success;
    },

    getDamage: function (item, unit) {
        var dmg = 0;

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.DAMAGE)) {
            dmg += item.custom.craftedProperties.damage;
        }

        damageType = DamageType.FIXED;

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.DAMAGETYPE)) {
            damageType = item.custom.craftedProperties.damageType;
        }

        if (item.isWand()) {
            if (damageType === DamageType.MAGIC) {
                dmg += ParamBonus.getMag(unit);
            }
        }

        return dmg;
    },

    getDamageType: function (item) {
        var type = DamageType.FIXED;

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.DAMAGETYPE)) {
            type = item.custom.craftedProperties.damageType;
        }

        return type;
    },

    getHit: function (item) {
        var hit = 0;

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.HIT)) {
            hit += item.custom.craftedProperties.hit;
        }

        return hit;
    }
});

var FotF_CraftedItemInfo = defineObject(BaseItemInfo, {
    _item: null,

    setInfoItem: function (item) {
        this._item = item;
    },

    moveItemInfoCycle: function () {
        return MoveResult.CONTINUE;
    },

    drawItemInfoCycle: function (x, y) {
        var cfg = FotF_CusparaRenderSettings;
        var renderer = FotF_CusparaRenderer;
        var rangeType = this.getRangeType(this._item);
        var rangeValue = this.getItemRange(this._item, rangeType);

        renderer.drawText(x, y, this.getItemTypeName(FotF_CraftedItemSettings.itemName)); //don't add to x to not shift range drawing
        y += cfg.lineSpacingY;

        this.drawRange(x, y, rangeValue.max, rangeType);
    },

    drawRange: function (x, y, rangeValue, rangeType) {
        var cfg = FotF_CusparaRenderSettings;
        var renderer = FotF_CusparaRenderer;

        x += renderer.drawText(x, y, root.queryCommand('range_capacity'));
        x += cfg.itemStatSpacingX;

        if (rangeType === SelectionRangeType.SELFONLY) {
            x += renderer.drawText(x, y, StringTable.Range_Self);
        } else if (rangeType === SelectionRangeType.MULTI) {
            x += renderer.drawNumber(x, y, rangeValue, null, null);
        } else if (rangeType === SelectionRangeType.ALL) {
            x += renderer.drawText(x, y, StringTable.Range_All);
        }
    },

    getInfoPartsCount: function () {
        return 2;
    },

    getItemTypeName: function (name) {
        var text;

        if (this._item.isWand()) {
            text = StringTable.ItemWord_SuffixWand;
        } else {
            text = StringTable.ItemWord_SuffixItem;
        }

        return name + text;
    },

    getRangeType: function (item) {
        var type = item.getRangeType();

        if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.SCOPE)) {
            type = item.custom.craftedProperties.scope;
        }

        return type;
    },

    getItemRange: function (item, type) {
        var min = 1;
        var max = 1;

        if (type === SelectionRangeType.MULTI) {
            max = typeof item.getRangeValue() === 'number' ? item.getRangeValue() : 0;
            if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.MAXRANGE)) {
                max += item.custom.craftedProperties.maxRange;
            }
        } else if (type === SelectionRangeType.SELFONLY) {
            min = 0;
            max = 0;
        }

        return {
            min: min,
            max: max
        };
    },

    getWindowTextUI: function () {
        return ItemInfoRenderer.getTextUI();
    }
});

var FotF_CustomCraftControl = {
    createItemArray: function () {
        var i, j;
        var list = FotF_UnitWrapper.getTotalUnitList();
        var convoy = StockItemControl.getStockItemArray();

        arr = [];

        for (i = 0; i < list.getCount(); i++) {
            var unit = list.getData(i);

            if (unit === null) {
                continue;
            }

            var count = UnitItemControl.getPossessionItemCount(unit);

            for (j = 0; j < count; j++) {
                var item = UnitItemControl.getItem(unit, j);
                if (item !== null && this.verifyCuspara(item)) {
                    var saveObj = {
                        unit: unit.getId(),
                        index: j,
                        custom: item.custom.craftedProperties,
                        aesthetic: this.setItemAesthetics(item)
                    };

                    arr.push(saveObj);
                }
            }
        }

        for (i = 0; i < convoy.length; i++) {
            var item = convoy[i];
            if (item !== null && this.verifyCuspara(item)) {
                var saveObj = {
                    unit: null,
                    index: i,
                    custom: item.custom.craftedProperties,
                    aesthetic: this.setItemAesthetics(item)
                };

                arr.push(saveObj);
            }
        }

        return arr;
    },

    initializeItemArray: function () {
        var arr = FotF_CustomItemArray;

        if (typeof arr !== 'object' || typeof arr.length !== 'number') {
            return;
        }

        var i;

        for (i = 0; i < arr.length; i++) {
            var obj = arr[i];
            var index = obj.index;
            var custom = obj.custom;
            var aesthetic = obj.aesthetic;

            if (obj.unit !== null) {
                var unit = FotF_UnitWrapper.getUnitFromId(obj.unit);
                var item = UnitItemControl.getItem(unit, index);
            } else {
                var item = StockItemControl.getStockItem(index);
            }

            //var objectType = item.isWeapon() ? ObjectType.WEAPON : ObjectType.ITEM;
            item.custom.craftedProperties = custom;

            for (string in item.custom.craftedProperties) {
                //var type = FotF_CustomCraftControl.getCraftTypeFromString(string, objectType);
                var prop = item.custom.craftedProperties[string];
                if (typeof eval('item.custom.' + 'string') !== 'number') {
                    eval('item.custom.' + string + ' = prop');
                } else {
                    eval('item.custom.' + string + ' += prop');
                }
            }

            if (typeof aesthetic.color === 'number') {
                item.custom.craftedColor = aesthetic.color;
            }

            if (typeof aesthetic.prefix === 'string') {
                item.custom.craftedPrefix = aesthetic.prefix;
            }

            if (typeof aesthetic.suffix === 'string') {
                item.custom.craftedSuffix = aesthetic.suffix;
            }

            if (typeof aesthetic.name === 'string') {
                item.custom.craftedName = aesthetic.name;
            }
        }
    },

    setItemAesthetics: function (item) {
        var obj = {
            color: null,
            prefix: null,
            suffix: null,
            name: null
        };

        if (typeof item.custom.craftedColor === 'number') {
            obj.color = item.custom.craftedColor;
        }

        if (typeof item.custom.craftedPrefix === 'string') {
            obj.prefix = item.custom.craftedPrefix;
        }

        if (typeof item.custom.craftedSuffix === 'string') {
            obj.suffix = item.custom.craftedSuffix;
        }

        if (typeof item.custom.craftedName === 'string') {
            obj.name = item.custom.craftedName;
        }

        return obj;
    },

    pushNewItem: function (unitId, itemId, isWeapon, properties) {
        if (!isWeapon) {
            var item = root.getBaseData().getItemList().getDataFromId(itemId);
        } else {
            var item = root.getBaseData().getWeaponList().getDataFromId(itemId);
        }

        var unit = FotF_UnitWrapper.getUnitFromId(unitId);

        if (unit === null || item === null) {
            return;
        }

        if (typeof properties !== 'object' || properties === null) {
            properties = {
                price: 0,
                durability: 0,
                weight: 0,
                damage: 0,
                scope: SelectionRangeType.SELFONLY,
                maxRange: 0,
                exp: 0,
                skill: [],
                guardState: [],
                filter: [],
                importance: false,
                trade: true,
                paramBonus: [],
                growthBonus: []
            };
        }

        item.custom.craftedProperties = properties;

        if (UnitItemControl.pushItem(unit, item)) {
            return UnitItemControl.getIndexFromItem(unit, item);
        }

        return -1;
    },

    //possible craftingType values determined by if it's a weapon or an item
    //applicable values determined by craftingType value
    configureProperty: function (unitId, itemId, isWeapon, craftingType, value, isSet) {
        if (!isWeapon) {
            var refItem = root.getBaseData().getItemList().getDataFromId(itemId);
        } else {
            var refItem = root.getBaseData().getWeaponList().getDataFromId(itemId);
        }

        var unit = FotF_UnitWrapper.getUnitFromId(unitId);

        if (unit === null || refItem === null) {
            root.log('Error: Unit with ID ' + unitId + ' or item with ID ' + itemId + ' not found in database.');
            return;
        }

        var i;
        var isMatch = false;
        var count = UnitItemControl.getPossessionItemCount(unit);

        for (i = 0; i < count; i++) {
            item = UnitItemControl.getItem(unit, i);
            if (item.getId() === refItem.getId()) {
                isMatch = true;
                break;
            }
        }

        if (!isMatch) {
            root.log('Error: No item match found for item with ID ' + itemId + ' on unit with ID ' + unitId);
            return;
        }

        if (!isWeapon) {
            this.configurePropertyItem(item, craftingType, value, isSet);
        } else {
            this.configurePropertyWeapon(item, craftingType, value, isSet);
        }
    },

    //Works similar to configureProperty, but uses cuspara object as a string
    configureCuspara: function (unitId, itemId, isWeapon, cuspara, value, isSet) {
        if (!isWeapon) {
            var refItem = root.getBaseData().getItemList().getDataFromId(itemId);
        } else {
            var refItem = root.getBaseData().getWeaponList().getDataFromId(itemId);
        }

        var unit = FotF_UnitWrapper.getUnitFromId(unitId);

        if (unit === null || refItem === null) {
            root.log('Error: Unit with ID ' + unitId + ' or item with ID ' + itemId + ' not found in database.');
            return;
        }

        var i;
        var isMatch = false;
        var count = UnitItemControl.getPossessionItemCount(unit);

        for (i = 0; i < count; i++) {
            item = UnitItemControl.getItem(unit, i);
            if (item.getId() === refItem.getId()) {
                isMatch = true;
                break;
            }
        }

        if (!isMatch) {
            root.log('Error: No item match found for item with ID ' + itemId + ' on unit with ID ' + unitId);
            return;
        }

        var string1 = 'item.custom.' + cuspara;
        var string2 = 'item.custom.craftedProperties.' + cuspara;
        var string3 = 'item.custom.' + cuspara + ' = value';
        var string4 = 'item.custom.' + cuspara + ' += value';
        var string5 = 'item.custom.craftedProperties.' + cuspara + ' = value';
        var string6 = 'item.custom.craftedProperties.' + cuspara + ' += value';

        item.custom.craftedProperties = this.checkCuspara(item);

        if (isSet || typeof eval(string1) !== 'number') {
            eval(string3);
        } else {
            eval(string4);
        }

        if (isSet || typeof eval(string2) !== 'number') {
            eval(string5);
        } else {
            eval(string6);
        }
    },

    //Remove a crafted property
    removeProperty: function (unitId, itemId, isWeapon, craftingType) {
        if (!isWeapon) {
            var refItem = root.getBaseData().getItemList().getDataFromId(itemId);
        } else {
            var refItem = root.getBaseData().getWeaponList().getDataFromId(itemId);
        }

        var unit = FotF_UnitWrapper.getUnitFromId(unitId);

        if (unit === null || refItem === null) {
            root.log('Error: Unit with ID ' + unitId + ' or item with ID ' + itemId + ' not found in database.');
            return;
        }

        var i;
        var isMatch = false;
        var count = UnitItemControl.getPossessionItemCount(unit);

        for (i = 0; i < count; i++) {
            item = UnitItemControl.getItem(unit, i);
            if (item.getId() === refItem.getId()) {
                isMatch = true;
                break;
            }
        }

        if (!isMatch) {
            root.log('Error: No item match found for item with ID ' + itemId + ' on unit with ID ' + unitId);
            return;
        }

        if (!isWeapon) {
            this.removePropertyItem(item, craftingType, false);
        } else {
            this.removePropertyWeapon(item, craftingType, false);
        }
    },

    //Can only remove crafted cusparas permanently
    removeCuspara: function (unitId, itemId, isWeapon, cuspara) {
        if (!isWeapon) {
            var refItem = root.getBaseData().getItemList().getDataFromId(itemId);
        } else {
            var refItem = root.getBaseData().getWeaponList().getDataFromId(itemId);
        }

        var unit = FotF_UnitWrapper.getUnitFromId(unitId);

        if (unit === null || refItem === null) {
            root.log('Error: Unit with ID ' + unitId + ' or item with ID ' + itemId + ' not found in database.');
            return;
        }

        var i;
        var isMatch = false;
        var count = UnitItemControl.getPossessionItemCount(unit);

        for (i = 0; i < count; i++) {
            item = UnitItemControl.getItem(unit, i);
            if (item.getId() === refItem.getId()) {
                isMatch = true;
                break;
            }
        }

        if (!isMatch) {
            root.log('Error: No item match found for item with ID ' + itemId + ' on unit with ID ' + unitId);
            return;
        }

        this.removeItemProperty(item, true, cuspara);
    },

    //"Changes" item color by applying a custom parameter
    configureColor: function (unitId, itemId, isWeapon, color) {
        if (!isWeapon) {
            var refItem = root.getBaseData().getItemList().getDataFromId(itemId);
        } else {
            var refItem = root.getBaseData().getWeaponList().getDataFromId(itemId);
        }

        var unit = FotF_UnitWrapper.getUnitFromId(unitId);

        if (unit === null || refItem === null) {
            root.log('Error: Unit with ID ' + unitId + ' or item with ID ' + itemId + ' not found in database.');
            return;
        }

        var i;
        var isMatch = false;
        var count = UnitItemControl.getPossessionItemCount(unit);

        for (i = 0; i < count; i++) {
            item = UnitItemControl.getItem(unit, i);
            if (item.getId() === refItem.getId()) {
                isMatch = true;
                break;
            }
        }

        if (!isMatch) {
            root.log('Error: No item match found for item with ID ' + itemId + ' on unit with ID ' + unitId);
            return;
        }

        item.custom.craftedColor = color;
    },

    //Adds prefix or suffix to the name or changes it via custom parameters
    configureName: function (unitId, itemId, isWeapon, string, addMode) {
        if (!isWeapon) {
            var refItem = root.getBaseData().getItemList().getDataFromId(itemId);
        } else {
            var refItem = root.getBaseData().getWeaponList().getDataFromId(itemId);
        }

        var unit = FotF_UnitWrapper.getUnitFromId(unitId);

        if (unit === null || refItem === null) {
            root.log('Error: Unit with ID ' + unitId + ' or item with ID ' + itemId + ' not found in database.');
            return;
        }

        var i;
        var isMatch = false;
        var count = UnitItemControl.getPossessionItemCount(unit);

        for (i = 0; i < count; i++) {
            item = UnitItemControl.getItem(unit, i);
            if (item.getId() === refItem.getId()) {
                isMatch = true;
                break;
            }
        }

        if (!isMatch) {
            root.log('Error: No item match found for item with ID ' + itemId + ' on unit with ID ' + unitId);
            return;
        }

        if (addMode === FotF_StringAddMode.PREFIX) {
            item.custom.craftedPrefix = string;
        } else if (addMode === FotF_StringAddMode.SUFFIX) {
            item.custom.craftedSuffix = string;
        } else if (addMode === FotF_StringAddMode.SET) {
            item.custom.craftedName = string;
        }
    },

    //Restores original item color
    removeColor: function (unitId, itemId, isWeapon) {
        if (!isWeapon) {
            var refItem = root.getBaseData().getItemList().getDataFromId(itemId);
        } else {
            var refItem = root.getBaseData().getWeaponList().getDataFromId(itemId);
        }

        var unit = FotF_UnitWrapper.getUnitFromId(unitId);

        if (unit === null || refItem === null) {
            root.log('Error: Unit with ID ' + unitId + ' or item with ID ' + itemId + ' not found in database.');
            return;
        }

        var i;
        var isMatch = false;
        var count = UnitItemControl.getPossessionItemCount(unit);

        for (i = 0; i < count; i++) {
            item = UnitItemControl.getItem(unit, i);
            if (item.getId() === refItem.getId()) {
                isMatch = true;
                break;
            }
        }

        if (!isMatch) {
            root.log('Error: No item match found for item with ID ' + itemId + ' on unit with ID ' + unitId);
            return;
        }

        delete item.custom.craftedColor;
    },

    //Removes prefix, suffix or item rename
    removeName: function (unitId, itemId, isWeapon, addMode) {
        if (!isWeapon) {
            var refItem = root.getBaseData().getItemList().getDataFromId(itemId);
        } else {
            var refItem = root.getBaseData().getWeaponList().getDataFromId(itemId);
        }

        var unit = FotF_UnitWrapper.getUnitFromId(unitId);

        if (unit === null || refItem === null) {
            root.log('Error: Unit with ID ' + unitId + ' or item with ID ' + itemId + ' not found in database.');
            return;
        }

        var i;
        var isMatch = false;
        var count = UnitItemControl.getPossessionItemCount(unit);

        for (i = 0; i < count; i++) {
            item = UnitItemControl.getItem(unit, i);
            if (item.getId() === refItem.getId()) {
                isMatch = true;
                break;
            }
        }

        if (!isMatch) {
            root.log('Error: No item match found for item with ID ' + itemId + ' on unit with ID ' + unitId);
            return;
        }

        if (addMode === FotF_StringAddMode.PREFIX) {
            delete item.custom.craftedPrefix;
        } else if (addMode === FotF_StringAddMode.SUFFIX) {
            delete item.custom.craftedSuffix;
        } else if (addMode === FotF_StringAddMode.SET) {
            delete item.custom.craftedName;
        }
    },

    configurePropertyItem: function (item, type, value, isSet) {
        var c = this.checkCuspara(item);

        if (type === FotF_ItemCraftingType.PRICE) {
            c.price = this.adjustValue(c.price, value, isSet);
        } else if (type === FotF_ItemCraftingType.WEIGHT) {
            c.weight = this.adjustValue(c.weight, value, isSet);
        } else if (type === FotF_ItemCraftingType.DAMAGE) {
            c.damage = this.adjustValue(c.damage, value, isSet);
        } else if (type === FotF_ItemCraftingType.DAMAGETYPE) {
            c.damageType = this.adjustValue(c.damageType, value, true);
        } else if (type === FotF_ItemCraftingType.RESURRECTION) {
            c.resurrectionType = this.adjustValue(c.resurrectionType, value, true);
        } else if (type === FotF_ItemCraftingType.SCOPE) {
            c.scope = this.adjustValue(c.scope, value, true);
        } else if (type === FotF_ItemCraftingType.MAXRANGE) {
            c.maxRange = this.adjustValue(c.maxRange, value, isSet);
        } else if (type === FotF_ItemCraftingType.HIT) {
            c.hit = this.adjustValue(c.hit, value, isSet);
        } else if (type === FotF_ItemCraftingType.EXP) {
            c.exp = this.adjustValue(c.exp, value, isSet);
        } else if (type === FotF_ItemCraftingType.SKILL) {
            c.skill = this.pushValue(c.skill, value, isSet);
        } else if (type === FotF_ItemCraftingType.STATE) {
            c.state = this.pushStateInvocation(c.state, value, isSet);
        } else if (type === FotF_ItemCraftingType.GUARDSTATE) {
            c.guardState = this.pushValue(c.guardState, value, isSet);
        } else if (type === FotF_ItemCraftingType.FILTER) {
            c.filter = this.pushValue(c.filter, value, isSet);
        } else if (type === FotF_ItemCraftingType.SWITCH) {
            c.switches = this.pushValue(c.filter, value, isSet);
        } else if (type === FotF_ItemCraftingType.PARAMBONUS) {
            c.paramBonus = this.adjustParamValue(c.paramBonus, value, isSet);
        } else if (type === FotF_ItemCraftingType.GROWTHBONUS) {
            c.growthBonus = this.adjustParamValue(c.growthBonus, value, isSet);
        }
    },

    configurePropertyWeapon: function (item, type, value, isSet) {
        var c = this.checkCuspara(item);

        if (type === FotF_ItemCraftingType.PRICE) {
            c.price = this.adjustValue(c.price, value, isSet);
        } else if (type === FotF_ItemCraftingType.WEIGHT) {
            c.weight = this.adjustValue(c.weight, value, isSet);
        } else if (type === FotF_ItemCraftingType.DAMAGE) {
            c.damage = this.adjustValue(c.damage, value, isSet);
        } else if (type === FotF_ItemCraftingType.MAXRANGE) {
            c.maxRange = this.adjustValue(c.maxRange, value, isSet);
        } else if (type === FotF_ItemCraftingType.HIT) {
            c.hit = this.adjustValue(c.hit, value, isSet);
        } else if (type === FotF_ItemCraftingType.CRIT) {
            c.crit = this.adjustValue(c.crit, value, isSet);
        } else if (type === FotF_ItemCraftingType.ATTACKCOUNT) {
            c.attackCount = this.adjustValue(c.attackCount, value, isSet);
        } else if (type === FotF_ItemCraftingType.WLV) {
            c.wlv = this.adjustValue(c.wlv, value, isSet);
        } else if (type === FotF_ItemCraftingType.SKILL) {
            c.skill = this.pushValue(c.skill, value, isSet);
        } else if (type === FotF_ItemCraftingType.WEAPONOPTION) {
            c.weaponOption = this.pushWeaponOption(c.weaponOption, value, isSet);
        } else if (type === FotF_ItemCraftingType.STATE) {
            c.state = this.pushStateInvocation(c.state, value, isSet);
        } else if (type === FotF_ItemCraftingType.ONEWAY) {
            c.oneway = this.adjustValue(c.oneway, value, true);
        } else if (type === FotF_ItemCraftingType.REVERSE) {
            c.reverse = this.adjustValue(c.reverse, value, true);
        } else if (type === FotF_ItemCraftingType.PARAMBONUS) {
            c.paramBonus = this.adjustParamValue(c.paramBonus, value, isSet);
        } else if (type === FotF_ItemCraftingType.GROWTHBONUS) {
            c.growthBonus = this.adjustParamValue(c.growthBonus, value, isSet);
        }
    },

    removePropertyItem: function (item, type, isCuspara) {
        if (type === FotF_ItemCraftingType.PRICE) {
            this.removeItemProperty(item, isCuspara, 'price');
        } else if (type === FotF_ItemCraftingType.WEIGHT) {
            this.removeItemProperty(item, isCuspara, 'weight');
        } else if (type === FotF_ItemCraftingType.DAMAGE) {
            this.removeItemProperty(item, isCuspara, 'damage');
        } else if (type === FotF_ItemCraftingType.DAMAGETYPE) {
            this.removeItemProperty(item, isCuspara, 'damageType');
        } else if (type === FotF_ItemCraftingType.RESURRECTION) {
            this.removeItemProperty(item, isCuspara, 'resurrectionType');
        } else if (type === FotF_ItemCraftingType.SCOPE) {
            this.removeItemProperty(item, isCuspara, 'scope');
        } else if (type === FotF_ItemCraftingType.MAXRANGE) {
            this.removeItemProperty(item, isCuspara, 'maxRange');
        } else if (type === FotF_ItemCraftingType.HIT) {
            this.removeItemProperty(item, isCuspara, 'hit');
        } else if (type === FotF_ItemCraftingType.EXP) {
            this.removeItemProperty(item, isCuspara, 'exp');
        } else if (type === FotF_ItemCraftingType.SKILL) {
            this.removeItemProperty(item, isCuspara, 'skill');
        } else if (type === FotF_ItemCraftingType.STATE) {
            this.removeItemProperty(item, isCuspara, 'state');
        } else if (type === FotF_ItemCraftingType.GUARDSTATE) {
            this.removeItemProperty(item, isCuspara, 'guardState');
        } else if (type === FotF_ItemCraftingType.FILTER) {
            this.removeItemProperty(item, isCuspara, 'filter');
        } else if (type === FotF_ItemCraftingType.SWITCH) {
            this.removeItemProperty(item, isCuspara, 'switches');
        } else if (type === FotF_ItemCraftingType.PARAMBONUS) {
            this.removeItemProperty(item, isCuspara, 'paramBonus');
        } else if (type === FotF_ItemCraftingType.GROWTHBONUS) {
            this.removeItemProperty(item, isCuspara, 'growthBonus');
        }
    },

    removePropertyWeapon: function (item, type, isCuspara) {
        if (type === FotF_ItemCraftingType.PRICE) {
            this.removeItemProperty(item, isCuspara, 'price');
        } else if (type === FotF_ItemCraftingType.WEIGHT) {
            this.removeItemProperty(item, isCuspara, 'weight');
        } else if (type === FotF_ItemCraftingType.DAMAGE) {
            this.removeItemProperty(item, isCuspara, 'damage');
        } else if (type === FotF_ItemCraftingType.MAXRANGE) {
            this.removeItemProperty(item, isCuspara, 'maxRange');
        } else if (type === FotF_ItemCraftingType.HIT) {
            this.removeItemProperty(item, isCuspara, 'hit');
        } else if (type === FotF_ItemCraftingType.CRIT) {
            this.removeItemProperty(item, isCuspara, 'crit');
        } else if (type === FotF_ItemCraftingType.ATTACKCOUNT) {
            this.removeItemProperty(item, isCuspara, 'attackCount');
        } else if (type === FotF_ItemCraftingType.WLV) {
            this.removeItemProperty(item, isCuspara, 'wlv');
        } else if (type === FotF_ItemCraftingType.SKILL) {
            this.removeItemProperty(item, isCuspara, 'skill');
        } else if (type === FotF_ItemCraftingType.WEAPONOPTION) {
            this.removeItemProperty(item, isCuspara, 'weaponOption');
        } else if (type === FotF_ItemCraftingType.STATE) {
            this.removeItemProperty(item, isCuspara, 'state');
        } else if (type === FotF_ItemCraftingType.ONEWAY) {
            this.removeItemProperty(item, isCuspara, 'oneway');
        } else if (type === FotF_ItemCraftingType.REVERSE) {
            this.removeItemProperty(item, isCuspara, 'reverse');
        } else if (type === FotF_ItemCraftingType.PARAMBONUS) {
            this.removeItemProperty(item, isCuspara, 'paramBonus');
        } else if (type === FotF_ItemCraftingType.GROWTHBONUS) {
            this.removeItemProperty(item, isCuspara, 'growthBonus');
        }
    },

    checkCuspara: function (item) {
        if (typeof item.custom.craftedProperties !== 'object') {
            item.custom.craftedProperties = {};
        }

        return item.custom.craftedProperties;
    },

    adjustValue: function (custom, modifier, isSet) {
        if (typeof custom === 'undefined') {
            custom = 0;
        }

        if (isSet) {
            custom = modifier;
        } else {
            custom += modifier;
        }

        return custom;
    },

    //isSet is repurposed here to determine whether to add or remove from the array
    pushValue: function (custom, modifier, isSet) {
        var i;
        var arr = [];

        if (typeof custom !== 'object' || typeof custom.length !== 'number') {
            custom = [];
        }

        if (typeof modifier === 'number') {
            arr.push(modifier);
        } else if (typeof modifier === 'object' && typeof modifier.length === 'number') {
            arr = modifier;
        }

        for (i = 0; i < arr.length; i++) {
            var mod = arr[i];
            if (isSet && custom.indexOf(mod) < 0) {
                custom.push(mod);
            } else if (!isSet) {
                custom.splice(custom.indexOf(mod), 1);
            }
        }

        return custom;
    },

    //isSet is repurposed here to determine whether to add or remove from the array
    pushStateInvocation: function (custom, modifier, isSet) {
        var i, j;
        var arr = [];

        if (typeof custom !== 'object' || typeof custom.length !== 'number') {
            custom = [];
        }

        if (typeof modifier === 'number') {
            arr.push(modifier);
        } else if (typeof modifier === 'object' && typeof modifier.length === 'number') {
            arr = modifier;
        }

        for (i = 0; i < arr.length; i++) {
            var id = arr[i][0];
            var rate = arr[i][1];
            var isBuild = true;

            for (j = 0; j < custom.length; j++) {
                var refId = custom[j][0];
                if (id === refId) {
                    isBuild = false;

                    if (!isSet) {
                        custom.splice(j, 1);
                    }

                    break;
                }
            }

            if (isSet && isBuild) {
                custom.push([id, rate]);
            }
        }

        return custom;
    },

    //isSet is repurposed here to determine whether option is on/off, modifier is repurposed as index
    pushWeaponOption: function (custom, modifier, isSet) {
        if (typeof custom !== 'object' || typeof custom.length !== 'number') {
            custom = [null, null, null, null, null, null, null];
        }

        custom.splice(modifier, 1, isSet);

        return custom;
    },

    adjustParamValue: function (custom, modifier, isSet) {
        var i;

        if (typeof custom !== 'object' || typeof custom.length !== 'number') {
            custom = [];
            for (i = 0; i < ParamGroup.getParameterCount(); i++) {
                custom.push(0);
            }
        }

        for (i = 0; i < modifier.length; i++) {
            if (isSet) {
                custom.splice(i, 1, modifier[i]);
            } else {
                custom.splice(i, 1, custom[i] + modifier[i]);
            }
        }

        return custom;
    },

    removeItemProperty: function (item, isCuspara, string) {
        if (item === null || typeof item.custom.craftedProperties !== 'object') {
            return false;
        }

        if (isCuspara) {
            delete item.custom.craftedProperties[string];
            eval('delete item.custom.' + string);
        } else {
            delete item.custom.craftedProperties[string];
        }
    },

    verifyCuspara: function (item) {
        return typeof item.custom.craftedProperties === 'object';
    },

    verifyProperty: function (item, type) {
        if (item === null) {
            return false;
        }

        if (item.isWeapon()) {
            if (type === FotF_ItemCraftingType.WEAPONOPTION) {
                return this.verifyWeaponOptions(item);
            }
            return this.verifyWeapon(item, type);
        } else {
            return this.verifyItem(item, type);
        }
    },

    verifyWeaponOption: function (item, index) {
        if (item === null) {
            return false;
        }

        var c = item.custom.craftedProperties;

        if (typeof c === 'object' && typeof c.weaponOption === 'object' && typeof c.weaponOption.length === 'number') {
            if (typeof c.weaponOption[index] === 'boolean') {
                return c.weaponOption[index];
            }
        }

        return null;
    },

    verifyWeaponOptions: function (item) {
        var i;
        var c = item.custom.craftedProperties;

        if (typeof c !== 'object' || typeof c.weaponOption !== 'object' || typeof c.weaponOption.length !== 'number') {
            return false;
        }

        for (i = 0; i < c.weaponOption.length; i++) {
            if (typeof c.weaponOption[i] === 'boolean') {
                return true;
            }
        }

        return false;
    },

    verifyItem: function (item, type) {
        var c = item.custom.craftedProperties;

        if (typeof c !== 'object') {
            return false;
        }

        if (type === FotF_ItemCraftingType.PRICE) {
            return typeof c.price === 'number';
        } else if (type === FotF_ItemCraftingType.WEIGHT) {
            return typeof c.weight === 'number';
        } else if (type === FotF_ItemCraftingType.DAMAGE) {
            return typeof c.damage === 'number';
        } else if (type === FotF_ItemCraftingType.DAMAGETYPE) {
            return c.damageType === DamageType.FIXED || c.damageType === DamageType.MAGIC || c.damageType === DamageType.PHYSICS;
        } else if (type === FotF_ItemCraftingType.RESURRECTION) {
            return c.resurrectionType === ResurrectionType.HALF || c.resurrectionType === ResurrectionType.MIN || c.resurrectionType === ResurrectionType.MAX;
        } else if (type === FotF_ItemCraftingType.SCOPE) {
            return c.scope === SelectionRangeType.ALL || c.scope === SelectionRangeType.MULTI || c.scope === SelectionRangeType.SELFONLY;
        } else if (type === FotF_ItemCraftingType.MAXRANGE) {
            return typeof c.maxRange === 'number';
        } else if (type === FotF_ItemCraftingType.HIT) {
            return typeof c.hit === 'number';
        } else if (type === FotF_ItemCraftingType.EXP) {
            return typeof c.exp === 'number';
        } else if (type === FotF_ItemCraftingType.SKILL) {
            return typeof c.skill === 'object' && typeof c.skill.length === 'number';
        } else if (type === FotF_ItemCraftingType.STATE) {
            return typeof c.state === 'object' && typeof c.state.length === 'number';
        } else if (type === FotF_ItemCraftingType.GUARDSTATE) {
            return typeof c.guardState === 'object' && typeof c.guardState.length === 'number';
        } else if (type === FotF_ItemCraftingType.FILTER) {
            return typeof c.filter === 'object' && typeof c.filter.length === 'number';
        } else if (type === FotF_ItemCraftingType.SWITCH) {
            return typeof c.switches === 'object' && typeof c.switches.length === 'number';
        } else if (type === FotF_ItemCraftingType.PARAMBONUS) {
            return typeof c.paramBonus === 'object' && typeof c.paramBonus.length === 'number';
        } else if (type === FotF_ItemCraftingType.GROWTHBONUS) {
            return typeof c.growthBonus === 'object' && typeof c.growthBonus.length === 'number';
        }

        return false;
    },

    //weapon option is verified separately in verifyWeaponOption
    verifyWeapon: function (item, type) {
        var c = item.custom.craftedProperties;

        if (typeof c !== 'object') {
            return false;
        }

        if (type === FotF_ItemCraftingType.PRICE) {
            return typeof c.price === 'number';
        } else if (type === FotF_ItemCraftingType.WEIGHT) {
            return typeof c.weight === 'number';
        } else if (type === FotF_ItemCraftingType.DAMAGE) {
            return typeof c.damage === 'number';
        } else if (type === FotF_ItemCraftingType.MAXRANGE) {
            return typeof c.maxRange === 'number';
        } else if (type === FotF_ItemCraftingType.HIT) {
            return typeof c.hit === 'number';
        } else if (type === FotF_ItemCraftingType.CRIT) {
            return typeof c.crit === 'number';
        } else if (type === FotF_ItemCraftingType.ATTACKCOUNT) {
            return typeof c.attackCount === 'number';
        } else if (type === FotF_ItemCraftingType.WLV) {
            return typeof c.wlv === 'number';
        } else if (type === FotF_ItemCraftingType.SKILL) {
            return typeof c.skill === 'object' && typeof c.skill.length === 'number';
        } else if (type === FotF_ItemCraftingType.STATE) {
            return typeof c.state === 'object' && typeof c.state.length === 'number';
        } else if (type === FotF_ItemCraftingType.ONEWAY) {
            return typeof c.oneway === 'boolean';
        } else if (type === FotF_ItemCraftingType.REVERSE) {
            return typeof c.reverse === 'boolean';
        } else if (type === FotF_ItemCraftingType.PARAMBONUS) {
            return typeof c.paramBonus === 'object' && typeof c.paramBonus.length === 'number';
        } else if (type === FotF_ItemCraftingType.GROWTHBONUS) {
            return typeof c.growthBonus === 'object' && typeof c.growthBonus.length === 'number';
        }

        return false;
    },

    getCraftTypeFromString: function (string, objectType) {
        if (objectType === ObjectType.WEAPON) {
            return this.getWeaponCraftType(string);
        } else if (objectType === ObjectType.ITEM) {
            return this.getItemCraftType(string);
        }

        return null;
    },

    getWeaponCraftType: function (string) {
        if (string === 'price') {
            return FotF_ItemCraftingType.PRICE;
        } else if (string === 'weight') {
            return FotF_ItemCraftingType.WEIGHT;
        } else if (string === 'damage') {
            return FotF_ItemCraftingType.DAMAGE;
        } else if (string === 'maxRange') {
            return FotF_ItemCraftingType.MAXRANGE;
        } else if (string === 'hit') {
            return FotF_ItemCraftingType.HIT;
        } else if (string === 'crit') {
            return FotF_ItemCraftingType.CRIT;
        } else if (string === 'attackCount') {
            return FotF_ItemCraftingType.ATTACKCOUNT;
        } else if (string === 'wlv') {
            return FotF_ItemCraftingType.WLV;
        } else if (string === 'skill') {
            return FotF_ItemCraftingType.SKILL;
        } else if (string === 'weaponOption') {
            return FotF_ItemCraftingType.WEAPONOPTION;
        } else if (string === 'state') {
            return FotF_ItemCraftingType.STATE;
        } else if (string === 'oneway') {
            return FotF_ItemCraftingType.ONEWAY;
        } else if (string === 'reverse') {
            return FotF_ItemCraftingType.REVERSE;
        } else if (string === 'paramBonus') {
            return FotF_ItemCraftingType.PARAMBONUS;
        } else if (string === 'growthBonus') {
            return FotF_ItemCraftingType.GROWTHBONUS;
        }

        return null;
    },

    getItemCraftType: function (string) {
        if (string === 'price') {
            return FotF_ItemCraftingType.PRICE;
        } else if (string === 'weight') {
            return FotF_ItemCraftingType.WEIGHT;
        } else if (string === 'damage') {
            return FotF_ItemCraftingType.DAMAGE;
        } else if (string === 'damageType') {
            return FotF_ItemCraftingType.DAMAGETYPE;
        } else if (string === 'resurrectionType') {
            return FotF_ItemCraftingType.RESURRECTION;
        } else if (string === 'scope') {
            return FotF_ItemCraftingType.SCOPE;
        } else if (string === 'maxRange') {
            return FotF_ItemCraftingType.MAXRANGE;
        } else if (string === 'hit') {
            return FotF_ItemCraftingType.HIT;
        } else if (string === 'exp') {
            return FotF_ItemCraftingType.EXP;
        } else if (string === 'skill') {
            return FotF_ItemCraftingType.SKILL;
        } else if (string === 'state') {
            return FotF_ItemCraftingType.STATE;
        } else if (string === 'guardState') {
            return FotF_ItemCraftingType.GUARDSTATE;
        } else if (string === 'filter') {
            return FotF_ItemCraftingType.FILTER;
        } else if (string === 'switches') {
            return FotF_ItemCraftingType.SWITCH;
        } else if (string === 'paramBonus') {
            return FotF_ItemCraftingType.PARAMBONUS;
        } else if (string === 'growthBonus') {
            return FotF_ItemCraftingType.GROWTHBONUS;
        }

        return null;
    },

    //Index is used for types that are arrays. Specify null if you want the whole array.
    getCraftedValue: function (unitId, itemId, isWeapon, craftingType, index) {
        var value = null;

        if (!isWeapon) {
            var refItem = root.getBaseData().getItemList().getDataFromId(itemId);
        } else {
            var refItem = root.getBaseData().getWeaponList().getDataFromId(itemId);
        }

        var unit = FotF_UnitWrapper.getUnitFromId(unitId);

        if (unit === null || refItem === null) {
            root.log('Error: Unit with ID ' + unitId + ' or item with ID ' + itemId + ' not found in database.');
            return null;
        }

        var i;
        var isMatch = false;
        var count = UnitItemControl.getPossessionItemCount(unit);

        for (i = 0; i < count; i++) {
            item = UnitItemControl.getItem(unit, i);
            if (item.getId() === refItem.getId()) {
                isMatch = true;
                break;
            }
        }

        if (!isMatch) {
            root.log('Error: No item match found for item with ID ' + itemId + ' on unit with ID ' + unitId);
            return null;
        }

        if (!isWeapon) {
            value = this.getItemValue(item, craftingType, index);
        } else {
            value = this.getWeaponValue(item, craftingType, index);
        }

        return value;
    },

    getItemValue: function (item, type, index) {
        if (!this.verifyProperty(item, type)) {
            return null;
        }

        var c = item.custom.craftedProperties;
        var isIndex = typeof index === 'number';

        if (type === FotF_ItemCraftingType.PRICE) {
            return c.price;
        } else if (type === FotF_ItemCraftingType.WEIGHT) {
            return c.weight;
        } else if (type === FotF_ItemCraftingType.DAMAGE) {
            return c.damage;
        } else if (type === FotF_ItemCraftingType.DAMAGETYPE) {
            return c.damageType;
        } else if (type === FotF_ItemCraftingType.RESURRECTION) {
            return c.resurrectionType;
        } else if (type === FotF_ItemCraftingType.SCOPE) {
            return c.scope;
        } else if (type === FotF_ItemCraftingType.MAXRANGE) {
            return c.maxRange;
        } else if (type === FotF_ItemCraftingType.HIT) {
            return c.hit;
        } else if (type === FotF_ItemCraftingType.EXP) {
            return c.exp;
        } else if (type === FotF_ItemCraftingType.SKILL) {
            return isIndex ? c.skill[index] : c.skill;
        } else if (type === FotF_ItemCraftingType.STATE) {
            return isIndex ? c.state[index] : c.state;
        } else if (type === FotF_ItemCraftingType.GUARDSTATE) {
            return isIndex ? c.guardState[index] : c.guardState;
        } else if (type === FotF_ItemCraftingType.FILTER) {
            return isIndex ? c.filter[index] : c.filter;
        } else if (type === FotF_ItemCraftingType.SWITCH) {
            return isIndex ? c.switches[index] : c.switches;
        } else if (type === FotF_ItemCraftingType.PARAMBONUS) {
            return isIndex ? c.paramBonus[index] : c.paramBonus;
        } else if (type === FotF_ItemCraftingType.GROWTHBONUS) {
            return isIndex ? c.growthBonus[index] : c.growthBonus;
        }

        return null;
    },

    getWeaponValue: function (item, type, index) {
        if (!this.verifyProperty(item, type)) {
            return null;
        }

        var c = item.custom.craftedProperties;
        var isIndex = typeof index === 'number';

        if (type === FotF_ItemCraftingType.PRICE) {
            return c.price;
        } else if (type === FotF_ItemCraftingType.WEIGHT) {
            return c.weight;
        } else if (type === FotF_ItemCraftingType.DAMAGE) {
            return c.damage;
        } else if (type === FotF_ItemCraftingType.MAXRANGE) {
            return c.maxRange;
        } else if (type === FotF_ItemCraftingType.HIT) {
            return c.hit;
        } else if (type === FotF_ItemCraftingType.CRIT) {
            return c.crit;
        } else if (type === FotF_ItemCraftingType.ATTACKCOUNT) {
            return c.attackCount;
        } else if (type === FotF_ItemCraftingType.WLV) {
            return c.wlv;
        } else if (type === FotF_ItemCraftingType.SKILL) {
            return isIndex ? c.skill[index] : c.skill;
        } else if (type === FotF_ItemCraftingType.WEAPONOPTION) {
            return isIndex ? c.weaponOption[index] : c.weaponOption;
        } else if (type === FotF_ItemCraftingType.STATE) {
            return isIndex ? c.state[index] : c.state;
        } else if (type === FotF_ItemCraftingType.ONEWAY) {
            return c.oneway;
        } else if (type === FotF_ItemCraftingType.REVERSE) {
            return c.reverse;
        } else if (type === FotF_ItemCraftingType.PARAMBONUS) {
            return isIndex ? c.paramBonus[index] : c.paramBonus;
        } else if (type === FotF_ItemCraftingType.GROWTHBONUS) {
            return isIndex ? c.growthBonus[index] : c.growthBonus;
        }

        return null;
    }
};

var FotF_CustomCraftRenderer = {
    drawList: function (x, y, obj) {
        var ctrl = FotF_CustomCraftControl;
        var custom = obj.custom.craftedProperties;
        var objectType = obj.isWeapon() ? ObjectType.WEAPON : ObjectType.ITEM;
        yBase = y;

        x += FotF_CusparaRenderer.drawText(x, y, FotF_CraftedItemSettings.propertiesString);
        x += FotF_CusparaRenderSettings.itemStatSpacingX;

        for (string in custom) {
            var type = ctrl.getCraftTypeFromString(string, objectType);
            var prop = custom[string];

            if (type !== null && FotF_CustomCraftControl.verifyProperty(obj, type)) {
                y += this.drawProperty(x, y, obj, prop, type);
            } else {
                var cuspara = FotF_CusparaRenderer.checkCraftedObject(obj, string, objectType);

                if (typeof cuspara === 'undefined') {
                    continue;
                }

                FotF_CusparaRenderer.drawContent(x, y, cuspara, obj);
                y += FotF_CusparaRenderSettings.lineSpacingY * FotF_CusparaRenderer.getCustomSpacing(cuspara, obj);
            }
        }

        return y - yBase;
    },

    drawProperty: function (x, y, obj, prop, type) {
        var i;
        var tp = FotF_ItemCraftingType;
        var cfg = FotF_CusparaRenderSettings;
        var renderer = FotF_CusparaRenderer;
        yBase = y;

        if (type === tp.SKILL || type === tp.STATE || type === tp.GUARDSTATE) {
            y += this.drawObjectList(x, y, prop, type) * cfg.lineSpacingY;
        } else if (type === tp.WEAPONOPTION) {
            y += this.drawWeaponOption(x, y, prop) * cfg.lineSpacingY;
        } else if (type === tp.PARAMBONUS || type === tp.GROWTHBONUS) {
            y += this.drawBonusList(x, y, prop, type) * cfg.lineSpacingY;
        } else if (type === tp.SWITCH) {
            y += this.drawSwitches(x, y, prop);
        } else if (type === tp.DAMAGE) {
            var text = !obj.isWeapon() && prop < 0 ? FotF_CraftedItemStrings.DAMAGE[1] : FotF_CraftedItemStrings.DAMAGE[0];
            x += renderer.drawText(x, y, text);
            x += cfg.itemStatSpacingX;
            x += renderer.drawSign(x, y, '+');
            if (prop < 0) {
                prop *= -1;
            }
            x += renderer.drawNumber(x, y, prop, null, null);
            y += cfg.lineSpacingY;
        } else if (type === tp.DAMAGETYPE) {
            var dmgType = '';
            if (prop === DamageType.PHYSICS) {
                dmgType = StringTable.DamageType_Physics;
            } else if (prop === DamageType.MAGIC) {
                dmgType = StringTable.DamageType_Magic;
            } else if (prop === DamageType.FIXED) {
                dmgType = StringTable.DamageType_Fixed;
            }

            var text = FotF_CraftedItemStrings.DAMAGETYPE;
            x += renderer.drawText(x, y, text);
            x += renderer.drawName(x, y, dmgType);
            y += cfg.lineSpacingY;
        } else if (type === tp.RESURRECTION) {
            var resType = '';
            if (prop === ResurrectionType.HALF) {
                resType = FotF_CraftedItemSettings.resurrectionTypes[1];
            } else if (prop === ResurrectionType.MAX) {
                resType = FotF_CraftedItemSettings.resurrectionTypes[0];
            }

            x += renderer.drawText(x, y, FotF_CraftedItemStrings.RESURRECTION[0]);
            x += FotF_CusparaRenderSettings.itemStatSpacingX;
            if (prop === ResurrectionType.MIN) {
                x += renderer.drawNumber(x, y, 1, null, null);
            } else {
                x += renderer.drawText(x, y, resType);
            }
            x += renderer.drawText(x, y, FotF_CraftedItemStrings.RESURRECTION[1]);
            y += cfg.lineSpacingY;
        } else if (type === tp.SCOPE) {
            var type = '';
            if (prop === SelectionRangeType.SELFONLY) {
                type = StringTable.Range_Self;
            } else if (prop === SelectionRangeType.ALL) {
                type = StringTable.Range_All;
            }

            x += renderer.drawText(x, y, FotF_CraftedItemStrings.SCOPE);
            x += FotF_CusparaRenderSettings.itemStatSpacingX;
            if (prop === SelectionRangeType.MULTI) {
                var range = typeof item.getRangeValue() === 'number' ? item.getRangeValue() : 0;

                if (FotF_CustomCraftControl.verifyProperty(item, FotF_ItemCraftingType.MAXRANGE)) {
                    range += item.custom.craftedProperties.maxRange;
                }

                x += renderer.drawNumber(x, y, range, null, null);
            } else {
                x += renderer.drawText(x, y, type);
            }
            y += cfg.lineSpacingY;
        } else if (type === tp.FILTER) {
            var count = 0;
            var string = '';
            if (prop.indexOf(UnitFilterFlag.PLAYER) > -1) {
                string += FotF_CusparaRenderSettings.filterTypes[0];
                count++;
            }
            if (prop.indexOf(UnitFilterFlag.ENEMY) > -1) {
                if (count > 0) {
                    string += ', ';
                }
                string += FotF_CusparaRenderSettings.filterTypes[1];
                count++;
            }
            if (prop.indexOf(UnitFilterFlag.ALLY) > -1) {
                if (count > 0) {
                    string += ', ';
                }
                string += FotF_CusparaRenderSettings.filterTypes[2];
                count++;
            }

            if (count >= 3) {
                string = FotF_CusparaRenderSettings.filterTypes[3];
            }

            x += renderer.drawText(x, y, FotF_CraftedItemStrings.FILTER);
            x += renderer.drawText(x, y, string);
            y += cfg.lineSpacingY;
        } else if (type === tp.ONEWAY) {
            var type = '';
            if (prop === true) {
                type = FotF_CraftedItemSettings.enableString;
            } else if (prop === false) {
                type = FotF_CraftedItemSettings.disableString;
            }

            x += renderer.drawText(x, y, type);
            x += renderer.drawText(x, y, FotF_CraftedItemStrings.ONEWAY);
            y += cfg.lineSpacingY;
        } else if (type === tp.REVERSE) {
            var type = obj.getWeaponCategoryType() === WeaponCategoryType.MAGIC ? StringTable.DamageType_Physics : StringTable.DamageType_Magic;

            x += renderer.drawText(x, y, FotF_CraftedItemStrings.REVERSE[0]);
            x += renderer.drawText(x, y, type);
            x += renderer.drawText(x, y, FotF_CraftedItemStrings.REVERSE[1]);
            y += cfg.lineSpacingY;
        } else if (typeof prop === 'number') {
            var text = this.getTextFromType(type);
            x += renderer.drawText(x, y, text);
            x += cfg.itemStatSpacingX;
            x += renderer.drawSign(x, y, prop < 0 ? '-' : '+');
            if (prop < 0) {
                prop *= -1;
            }
            x += renderer.drawNumber(x, y, prop, null, null);
            y += cfg.lineSpacingY;
        }

        return y - yBase;
    },

    drawObjectList: function (x, y, prop, type) {
        var i;
        var CFG = FotF_CraftedItemSettings;
        var cfg = FotF_CusparaRenderSettings;
        var renderer = FotF_CusparaRenderer;
        var count = 0;
        var text = this.getTextFromType(type);

        if (prop.length < 1) {
            return;
        }

        if (type === FotF_ItemCraftingType.SKILL) {
            x += renderer.drawText(x, y, text);

            for (i = 0; i < prop.length; i++) {
                var skill = root.getBaseData().getSkillList().getDataFromId(prop[i]);
                if (skill !== null) {
                    renderer.drawName(x, y, skill.getName());
                    y += cfg.lineSpacingY;
                    count++;
                }
            }
        } else if (type === FotF_ItemCraftingType.STATE) {
            x += renderer.drawText(x, y, text);
            xBase = x;

            for (i = 0; i < prop.length; i++) {
                var state = root.getBaseData().getStateList().getDataFromId(prop[i][0]);
                x += renderer.drawInvocation(x, y, state, prop[i][1], InvocationType.ABSOLUTE);
                y += cfg.lineSpacingY;
                x = xBase;
                count++;
            }
        } else if (type === FotF_ItemCraftingType.GUARDSTATE) {
            x += renderer.drawText(x, y, text);

            for (i = 0; i < prop.length; i++) {
                var state = root.getBaseData().getStateList().getDataFromId(prop[i]);
                if (state !== null) {
                    renderer.drawName(x, y, state.getName());
                    y += cfg.lineSpacingY;
                    count++;
                }
            }
        }

        return count;
    },

    drawBonusList: function (x, y, prop, type) {
        var i, n, text;
        var cfg = FotF_CusparaRenderSettings;
        var CFG = FotF_CraftedItemSettings;
        var renderer = FotF_CusparaRenderer;
        var count = ParamGroup.getParameterCount();
        var lineCount = 0;

        if (type === FotF_ItemCraftingType.PARAMBONUS) {
            x += renderer.drawText(x, y, FotF_CraftedItemStrings.PARAMBONUS);
        } else if (type === FotF_ItemCraftingType.GROWTHBONUS) {
            x += renderer.drawText(x, y, FotF_CraftedItemStrings.GROWTHBONUS);
        }

        x += cfg.itemStatSpacingX;

        var xBase = x;

        for (i = 0; i < count; i++) {
            n = prop[i];

            if (n !== 0) {
                text = ParamGroup.getParameterName(i);
                x += renderer.drawText(x, y, text);
                x += renderer.drawSign(x, y, n > 0 ? '+' : '-');

                if (n < 0) {
                    n *= -1;
                }

                x += renderer.drawNumber(x, y, n, null, null);

                if (type === FotF_ItemCraftingType.GROWTHBONUS) {
                    x += renderer.drawSign(x, y, '%');
                }

                y += cfg.lineSpacingY;
                lineCount++;

                x = xBase;
            }
        }

        return lineCount;
    },

    drawWeaponOption: function (x, y, prop) {
        var i;
        var CFG = FotF_CraftedItemSettings;
        var cfg = FotF_CusparaRenderSettings;
        var renderer = FotF_CusparaRenderer;
        var count = 0;

        for (i = 0; i < prop.length; i++) {
            if (prop[i] === true) {
                x += renderer.drawText(x, y, CFG.enableString);
                x += renderer.drawText(x, y, FotF_CraftedItemStrings.WEAPONOPTION[i]);
                y += cfg.lineSpacingY;
                count++;
            } else if (prop[i] === false) {
                x += renderer.drawText(x, y, CFG.disableString);
                x += renderer.drawText(x, y, FotF_CraftedItemStrings.WEAPONOPTION[i]);
                y += cfg.lineSpacingY;
                count++;
            }
        }

        return count;
    },

    drawSwitches: function (x, y, prop) {
        var i;
        var cfg = FotF_CusparaRenderSettings;
        var renderer = FotF_CusparaRenderer;
        var count = 0;
        var table = root.getMetaSession().getGlobalSwitchTable();

        for (i = 0; i < arr.length; i++) {
            table.setSwitch(index, !state);
        }

        x += renderer.drawText(x, y, FotF_CraftedItemStrings.SWITCH);
        xBase = x;

        for (i = 0; i < prop.length; i++) {
            var index = table.getSwitchIndexFromId(prop[i]);
            var state = table.isSwitchOn(index);
            var name = table.getSwitchName(index);
            x += renderer.drawText(x, y, name);

            if (state) {
                x += renderer.drawName(x, y, FotF_CraftedItemSettings.offString);
            } else {
                x += renderer.drawName(x, y, FotF_CraftedItemSettings.onString);
            }

            y += cfg.lineSpacingY;
            count++;
            x = xBase;
        }

        return count;
    },

    getTextFromType: function (type) {
        var arr = FotF_CraftedItemStringArray;
        var text = arr[type];

        if (typeof text === 'string') {
            return text;
        }

        return '';
    },

    getItemName: function (item) {
        var name = item.getName();

        if (typeof item.custom.craftedName === 'string') {
            name = item.custom.craftedName;
        }

        if (typeof item.custom.craftedPrefix === 'string') {
            name = item.custom.craftedPrefix + name;
        }

        if (typeof item.custom.craftedSuffix === 'string') {
            name = name + item.custom.craftedSuffix;
        }

        return name;
    },

    getItemColor: function (item, defaultColor) {
        if (typeof item.custom.craftedColor === 'number') {
            return item.custom.craftedColor;
        }

        return defaultColor;
    },

    getTotalSpacing: function (obj) {
        var i;
        var tp = FotF_ItemCraftingType;
        var ctrl = FotF_CustomCraftControl;
        var custom = obj.custom.craftedProperties;
        var objectType = obj.isWeapon() ? ObjectType.WEAPON : ObjectType.ITEM;
        var count = 0;

        if (typeof custom !== 'object') {
            return 0;
        }

        for (string in custom) {
            var type = ctrl.getCraftTypeFromString(string, objectType);
            var prop = custom[string];

            if (type === null || !FotF_CustomCraftControl.verifyProperty(obj, type)) {
                var cuspara = FotF_CusparaRenderer.checkCraftedObject(obj, string, objectType);

                if (typeof cuspara === 'undefined') {
                    continue;
                }

                count += FotF_CusparaRenderer.getCustomSpacing(cuspara, obj);
                continue;
            }

            if (type === tp.SKILL || type === tp.STATE || type === tp.GUARDSTATE || type === tp.SWITCH) {
                count += prop.length;
            } else if (type === tp.WEAPONOPTION) {
                for (i = 0; i < prop.length; i++) {
                    if (typeof prop[i] === 'boolean') {
                        count++;
                    }
                }
            } else if (type === tp.PARAMBONUS || type === tp.GROWTHBONUS) {
                for (i = 0; i < prop.length; i++) {
                    if (typeof prop[i] === 'number' && prop[i] !== 0) {
                        count++;
                    }
                }
            } else if (type === tp.FILTER || type === tp.ONEWAY || type === tp.REVERSE) {
                count++;
            } else if (typeof prop === 'number') {
                count++;
            }
        }

        return count;
    }
};

var FotF_ResurrectionScreen = defineObject(ResurrectionScreen, {
    getResurrectionTargetArray: function (unit, item) {
        var i, j, count, list, targetUnit;
        var filter = FilterControl.getNormalFilter(unit.getUnitType());
        var listArray = FilterControl.getDeathListArray(filter);
        var listCount = listArray.length;
        var arr = [];
        var aggregation = item.getTargetAggregation();

        for (i = 0; i < listCount; i++) {
            list = listArray[i];
            count = list.getCount();
            for (j = 0; j < count; j++) {
                targetUnit = list.getData(j);
                if (!aggregation.isCondition(targetUnit)) {
                    continue;
                }

                arr.push(targetUnit);
            }
        }

        return arr;
    },

    _combineDeathList: function (screenParam) {
        var arr = this.getResurrectionTargetArray(screenParam.unit, screenParam.item);
        var list = StructureBuilder.buildDataList();

        list.setDataArray(arr);

        return list;
    }
});

/*
//For items
{
    craftedProperties: {
        price: 0,
        weight: 0,
        damage: 0,
        damageType: DamageType.FIXED,
        resurrectionType: ResurrectionType.MAX,
        scope: SelectionRangeType.SELFONLY,
        maxRange: 0,
        hit: 0,
        exp: 0,
        skill: [],
        state: [],
        guardState: [],
        filter: [],
        switches: [],
        paramBonus: [],
        growthBonus: []
    }
}

//For weapons
{
    craftedProperties: {
        price: 0,
        weight: 0,
        damage: 0,
        maxRange: 0,
        hit: 0,
        crit: 0,
        attackCount: 0,
        wlv: 0,
        skill: [],
        weaponOption: WeaponOption.NONE,
        state: [],
        oneway: false,
        reverse: false,
        paramBonus: [],
        growthBonus: []
    }
}
*/
