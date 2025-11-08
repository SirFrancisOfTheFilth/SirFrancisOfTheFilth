/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     Add multiplicative stat modifiers to items,skills, states and more
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Ever thought multiplicative parameter boni would be nice? Well here you go!
With just one custom parameter you can have weapons, items, (support-)skills,
states, fusions or transformations add or substract a percentage of the
unit's base parameter values. You can also make them regenerate a percentage
of a unit's max HP.

Weapon, item, skill and terrain info windows will show the boni in a format
such as

Heal    +15%
Bonus   STR +10%
        MAG -20%
        DEF +5%

The terrain window now also shows the same information, as well as the
normal auto recovery value. (Why doesn't the engine show this by default?)


_____________________________________________________________________________
						         Setup
_____________________________________________________________________________

This plugin relies heavily on my Infowindow Overhaul plugin to display it's
stats. If you (for whatever reason) don't want to use it, there's an old
standalone version of this plugin on my github. Otherwise, please also get
and configure the Infowindow Overhaul.

_____________________________________________________________________________
						         Setup
_____________________________________________________________________________

The custom parameter required is always the same and works in the same way:

    {
        paramFactor: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]
    }

Every number in the array represents one base parameter in order of
[MHP, STR, MAG, SKL, SPD, LCK, DEF, RES, MOV, WLV, BLD]. The numbers always
modify the base value (unit value + class value). So a custom parameter like

    {
        paramFactor: [0, 25, -10, 0, 0, 0, 0, 0, 0, 0, 0,]
    }

with base values of [20, 16, 10, 11, 14, 5, 11, 15, 6, 0, 0] without any
other modifiers would result in [20, 20, 9, 11, 14, 5, 11, 15, 6, 0, 0].

There are also 2 more optional custom parameters that can multiply these
boni depending on the unit's surroundings and current health:

    surroundedBonus: x

This will multiply the specified paramFactor boni by the number of enemies
in range x of the unit.

    healthBonus: x

This divides the unit's max health into x segments. If x is positive, the
paramFactor boni will be multiplied by the amount of full segments, if x is
negative, empty segments instead. So a unit at 69 of 100 health with the
divider set to 10 will get it's boni multiplied by 6. A divider of -10 will
instead give a multiplier of 3.

Please refrain from using any decimal numbers, as the native NumberRenderer
method does only support whole numbers. Negative numbers are supported.

_____________________________________________________________________________
						Multiplicative Regeneration
_____________________________________________________________________________

Skills, states and terrain can additionally have the custom parameter

{
    paramFactorRegen: x
}

with x being the percentage of a unit's max HP to regenerate (or deal damage
if negative) at turn end. This value is also affected by surroundedBonus and
healthBonus. The normal paramFactor cuspara is not necessarily required.

_____________________________________________________________________________
						        Supports
_____________________________________________________________________________

Because supports don't have custom parameters (why even?), there's only the
option to either treat all supports additive like normal or multiplicative
like this plugin does with everything else. No exceptions. Enable/Disable
this in the settings section of the plugin.

_____________________________________________________________________________
						        Fusions
_____________________________________________________________________________

Fusion boni are separated into two categories: Normal fusion boni that always
apply and fusion attack boni that only apply when initiating a fusion attack.
To account for this, the normal cuspara "paramFactor" is used for the normal
fusion bonus and "paramFactorAttack", which works exactly the same, is used
for the fusion attack bonus. They are not mutually exclusive, so feel free to
use both at once if you so desire.

_____________________________________________________________________________
						 How the calculation works
_____________________________________________________________________________

Normal parameter corrections still apply, but are never multiplied.
The multiplication is additive, meaning 2 buffs of +50% to a base value of
12, you will get 12 + (0.5 * 12) + (0.5 * 12) = 24 which is a combined +100%
instead of 12 + (0.5 * 12) = 18 and 18 + (0.5 * 18) = 27 which would be a
total +125%. Rounding occurs for every instance, so two +33% buffs to 10 STR
would be 10 + 3 + 3 = 16 instead of 10 + (0.66 * 10) ≈ 17. This is partly
because SRPG Studio calculates parameter boni all over the place and partly
because I wanted it to work like this for my own project.

The default behavior that only the HP regeneration skill with the highest
value triggers is still in effect, only now it accounts for the normal value
plus the value added by this plugin. State regeneration/damage does stack
however.

_____________________________________________________________________________
						    Custom multiplication
_____________________________________________________________________________

If you want to multiply the paramFactor boni with a custom function of yours,
you can specify

    customBonus: function(unit) {
        var value = ... //calculate your value here
        return value;
    }

and the boni will be multiplied by the return value of this function. You
don't have to define the unit argument in advance, the plugin handles it.
This multiplication behaves the same as surroundedBonus and healthBonus.

If you want the info windows to show text related to this, additionally
specify any number of these custom parameter(s)

    customBonusText1: "Text"

    customBonusValue: true

    customBonusText2: "Text"

and replace "Text" with any text you desire. Text1 will be drawn before the
value. If customBonusValue is true, the value will then be drawn, and lastly
Text2 will be drawn. If any of these is not specified, it's skipped.
_____________________________________________________________________________
						    Overwritten functions
_____________________________________________________________________________

Projected compatibility with other plugins that use these functions:

BaseUnitParameter.getUnitTotalParamBonus - Limited
BaseUnitParameter._getItemBonus - Limited
SupportCalculator._checkSkillStatus - Unlikely
SkillInfoWindow.drawWindowContent - Only visual incompatibility
RecoveryAllFlowEntry._getRecoveryValueInternalForSkill - Unlikely

_____________________________________________________________________________
								 EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2025/07/10
Released

2025/11/08
- Fixed crash on map start with adjacentBonus
- Restructured render functions for use with Infowindow Overhaul

--------------------------------------------------------------------------*/

FotF_ParamFactorSettings = {
    bonusKeyword: 'Bonus', //Parameter bonus keyword used in item/state/skill info
    abilityBonusKeyword: 'Bonus', //Ability bonus keyword used in skill info
    critAvoString: 'Crit Avo', //Keyword used for critical avoid in skill info window
    recoveryString: 'Heal', //Keyword used for auto recovery in skill and terrain window
    adjacentString: '/ enemy in ', //String used before range if object has enemy scaling
    adjacentString2: 'range', //String used after range if object has enemy scaling
    healthStrings: ['/ ', ' health'], //Strings used if object has health scaling
    mHealthStrings: ['/ ', ' health missing'], //Strings used if object has missing health scaling
    overrideSupportValues: true, //true to change the support system to use multiplicative modifiers (e.g. 20 means +20%), false not to change it
    skillInfoBonusWidth: 200, //Bonus width for skill info window (can also be negative)
    itemInfoBonusWidth: 180, //Bonus width for item info window
    terrainWindowBonusWidth: 200 //Bonus width for terrain window
};

MapParts.Terrain._unit = null;
var FotF_InsertBonusFactorTerrainAvoid = AbilityCalculator.getAvoid;

(function () {
    //Adds weapon, items and non-support skills
    BaseUnitParameter.getUnitTotalParamBonus = function (unit, weapon) {
        var i, count, skill;
        var d = 0;
        var arr = [];

        // Weapon parameter bonus
        if (weapon !== null) {
            d += this.getParameterBonus(weapon);
            d += FotF_ParamFactorControl.calculateBonus(unit, this.getParameterType(), weapon, false);
        }

        // Item parameter bonus
        d += this._getItemBonus(unit, true);

        //Check all skills (except support skills)
        arr = SkillControl.getSkillObjectArray(unit, weapon, -1, '', this._getParamBonusObjectFlag());
        count = arr.length;
        for (i = 0; i < count; i++) {
            skill = arr[i].skill;

            if (skill.getSkillType() === SkillType.SUPPORT) {
                continue;
            } else if (skill.getSkillType() === SkillType.PARAMBONUS) {
                d += this.getParameterBonus(skill);
            }

            if (skill !== null) {
                var bonus = FotF_ParamFactorControl.calculateBonus(unit, this.getParameterType(), skill, false);
                d += bonus;
            }
        }

        return d;
    };

    //Internal item check
    BaseUnitParameter._getItemBonus = function (unit, isParameter) {
        var i, item, n;
        var d = 0;
        var checkerArray = [];
        var count = UnitItemControl.getPossessionItemCount(unit);

        for (i = 0; i < count; i++) {
            item = UnitItemControl.getItem(unit, i);
            if (!ItemIdentityChecker.isItemReused(checkerArray, item)) {
                continue;
            }

            if (isParameter) {
                n = this.getParameterBonus(item);
            } else {
                n = this.getGrowthBonus(item);
            }

            if (item !== null) {
                n += FotF_ParamFactorControl.calculateBonus(unit, this.getParameterType(), item, false);
            }

            // Correction is not added for the unit who cannot use the item.
            if (n !== 0 && ItemControl.isItemUsable(unit, item)) {
                d += n;
            }
        }

        return d;
    };

    //Adds states
    var FotF_InsertBonusFactorState = StateControl.getStateParameter;
    StateControl.getStateParameter = function (unit, index) {
        var list = unit.getTurnStateList();
        var count = list.getCount();
        var value = FotF_InsertBonusFactorState.call(this, unit, index);
        var state;

        for (var i = 0; i < count; i++) {
            state = list.getData(i).getState();
            if (state !== null) {
                value += FotF_ParamFactorControl.calculateBonus(unit, index, state, false);
            }
        }

        return value;
    };

    //Adds supports
    var FotF_InsertBonusFactorSupport = SupportCalculator._collectStatus;
    SupportCalculator._collectStatus = function (unit, targetUnit, totalStatus) {
        var cfg = FotF_ParamFactorSettings;

        if (cfg.overrideSupportValues === true) {
            var i, data;
            var count = targetUnit.getSupportDataCount();

            for (i = 0; i < count; i++) {
                data = targetUnit.getSupportData(i);
                if (unit === data.getUnit() && data.isGlobalSwitchOn() && data.isVariableOn()) {
                    this._addStatusSupport(targetUnit, totalStatus, data.getSupportStatus());
                    break;
                }
            }
        } else {
            FotF_InsertBonusFactorSupport.call(this, unit, targetUnit, totalStatus);
        }
    };

    //Adds support skills
    //Overwrite instead of alias because this function takes A LOT of processing power
    //and we don't wanna do that twice now, do we?
    SupportCalculator._checkSkillStatus = function (unit, targetUnit, isSelf, totalStatus) {
        var i, skill, isSet, indexArray;
        var arr = SkillControl.getDirectSkillArray(unit, SkillType.SUPPORT, '');
        var count = arr.length;

        for (i = 0; i < count; i++) {
            skill = arr[i].skill;
            isSet = false;

            if (isSelf) {
                if (skill.getRangeType() === SelectionRangeType.SELFONLY) {
                    isSet = true;
                    targetUnit = unit;
                }
            } else {
                if (skill.getRangeType() === SelectionRangeType.ALL) {
                    // If it's "All", always enable to support.
                    isSet = true;
                } else if (skill.getRangeType() === SelectionRangeType.MULTI) {
                    indexArray = IndexArray.getBestIndexArray(unit.getMapX(), unit.getMapY(), 1, skill.getRangeValue());
                    // If it's "Specify", check if the unit exists at the position in arr.
                    isSet = IndexArray.findUnit(indexArray, targetUnit);
                }
            }

            if (isSet && this._isSupportable(unit, targetUnit, skill)) {
                this._addStatus(totalStatus, skill.getSupportStatus());
                this._addStatusFactor(totalStatus, skill, targetUnit);
            }
        }
    };

    //Adds Fusion. Separated into two cusparas for general fusion and fusion attack
    var FotF_InsertBonusFactorFusion = FusionControl.getLastValue;
    FusionControl.getLastValue = function (unit, index, n) {
        var value = FotF_InsertBonusFactorFusion.call(this, unit, index, n);
        var isCalc = false;
        var isAttack = false;
        var child = null;
        var fusionData = FusionControl.getFusionData(unit);

        index = ParamGroup.getParameterType(index);

        if (fusionData !== null) {
            // If normal fusion, get "Correction while fusion".
            isCalc = true;
            child = FusionControl.getFusionChild(unit);
            if (child === null) {
                isCalc = false;
            }
        } else {
            fusionData = FusionControl.getFusionAttackData(unit);
            if (fusionData !== null) {
                // If it's "Fusion Attack", get "Fusion Attack Correction".
                isCalc = true;
                isAttack = true;
            }
        }

        var bonus = 0;

        if (isCalc === true) {
            if (isAttack === true) {
                bonus = FotF_ParamFactorControl.calculateFusionAttackBonus(unit, index, fusionData);
            } else {
                bonus = FotF_ParamFactorControl.calculateFusionBonus(unit, index, fusionData);
            }
        }

        return value + bonus;
    };

    //Adds Transformation
    var FotF_InsertBonusFactorTransformation = MetamorphozeControl.getLastValue;
    MetamorphozeControl.getLastValue = function (unit, index, n) {
        var value = FotF_InsertBonusFactorTransformation.call(this, unit, index, n);
        var isCalc = false;
        var metamorphozeData = MetamorphozeControl.getMetamorphozeData(unit);

        if (metamorphozeData !== null) {
            isCalc = true;
        }

        var bonus = 0;

        if (isCalc === true) {
            bonus = FotF_ParamFactorControl.calculateBonus(unit, index, metamorphozeData, false);
        }

        return value + bonus;
    };

    //Adds Terrain (Avoid)
    //Alias is defined globally, cause it's used elsewhere as well
    AbilityCalculator.getAvoid = function (unit) {
        var value = FotF_InsertBonusFactorTerrainAvoid.call(this, unit);

        var cls = unit.getClass();

        if (cls.getClassType().isTerrainBonusEnabled()) {
            var terrain = PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY());
            if (terrain !== null) {
                value += FotF_ParamFactorControl.calculateTerrainBonus(value - terrain.getAvoid(), 0, terrain);
            }
        }

        return value;
    };

    //Add terrain (DEF)
    var FotF_InsertBonusFactorTerrainDef = RealBonus.getDef;
    RealBonus.getDef = function (unit) {
        var value = FotF_InsertBonusFactorTerrainDef.call(this, unit);
        var terrain;

        if (unit.getClass().getClassType().isTerrainBonusEnabled()) {
            terrain = PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY());
            if (terrain !== null) {
                value += FotF_ParamFactorControl.calculateTerrainBonus(unit, 1, terrain);
            }
        }

        return value;
    };

    //Add terrain (MDF)
    var FotF_InsertBonusFactorTerrainMdf = RealBonus.getMdf;
    RealBonus.getMdf = function (unit) {
        var value = FotF_InsertBonusFactorTerrainMdf.call(this, unit);
        var terrain;

        if (unit.getClass().getClassType().isTerrainBonusEnabled()) {
            terrain = PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY());
            if (terrain !== null) {
                value += FotF_ParamFactorControl.calculateTerrainBonus(unit, 2, terrain);
            }
        }

        return value;
    };
    /*
    //Append item sentence
    var FotF_AppendItemBonusFactor = ItemInfoWindow._configureItem;
    ItemInfoWindow._configureItem = function (groupArray) {
        FotF_AppendItemBonusFactor.call(this, groupArray);
        groupArray.appendObject(ItemSentence.ParamFactor);
    };

    //Append weapon sentence
    var FotF_AppendWeaponBonusFactor = ItemInfoWindow._configureWeapon;
    ItemInfoWindow._configureWeapon = function (groupArray) {
        FotF_AppendWeaponBonusFactor.call(this, groupArray);
        groupArray.appendObject(ItemSentence.ParamFactor);
    };*/
    /*
    //Draw bonus in skill info
    SkillInfoWindow.drawWindowContent = function (x, y) {
        var text, skillText, count;
        var length = this._getTextLength();
        var textui = this.getWindowTextUI();
        var color = textui.getColor();
        var font = textui.getFont();

        if (this._skill === null) {
            return;
        }

        this._drawName(x, y, this._skill, length, color, font);
        y += ItemInfoRenderer.getSpaceY();

        if (this._isInvocationType()) {
            this._drawInvocationValue(x, y, this._skill, length, color, font);
            y += ItemInfoRenderer.getSpaceY();
        }

        if (this._aggregationViewer !== null) {
            count = this._aggregationViewer.getAggregationViewerCount();
            if (count !== 0) {
                this._aggregationViewer.drawAggregationViewer(x, y, this._getMatchName());
                y += ItemInfoRenderer.getSpaceY() * this._aggregationViewer.getAggregationViewerCount();
            }
        }

        text = this._getSkillTypeText();
        if (text !== '') {
            skillText = root.queryCommand('skill_object');
            TextRenderer.drawKeywordText(x, y, text + ' ' + skillText, length, ColorValue.KEYWORD, font);
        } else {
            text = this._getCategoryText();
            TextRenderer.drawKeywordText(x, y, text, length, ColorValue.KEYWORD, font);
        }

        if (typeof this._skill.custom.paramFactorRegen === 'number' && this._skill.custom.paramFactorRegen !== 0) {
            y += ItemInfoRenderer.getSpaceY();
            FotF_ParamFactorRenderer.drawRecovery(x, y, this._skill);
            y += FotF_ParamFactorRenderer.getRecoverySpacing(this._skill, 0, ItemInfoRenderer.getSpaceY());
        }

        var bonusCount = FotF_ParamFactorRenderer.getBonusCount(this._skill);

        if (bonusCount !== 0) {
            if (this._skill.getSkillType() === SkillType.SUPPORT) {
                FotF_ParamFactorRenderer.drawAbilityBonus(x, y, this._skill);
            } else {
                FotF_ParamFactorRenderer.drawParamBonus(x, y, this._skill);
            }
        }
    };
*/
    /*
    //Increase skill info window height if mult bonus/regen is displayed
    var FotF_ExtendSkillInfoHeightMult = SkillInfoWindow.getWindowHeight;
    SkillInfoWindow.getWindowHeight = function () {
        var count = FotF_ExtendSkillInfoHeightMult.call(this);
        count = FotF_ParamFactorRenderer.getRecoverySpacing(this._skill, count, ItemInfoRenderer.getSpaceY()) + FotF_ParamFactorRenderer.getParamSpacing(this._skill, count, ItemInfoRenderer.getSpaceY());

        return count;
    };
*/
    /*
    //Increase skill info window width if mult bonus/regen is displayed
    var FotF_ExtendSkillInfoWidthMult = SkillInfoWindow.getWindowWidth;
    SkillInfoWindow.getWindowWidth = function () {
        var width = FotF_ExtendSkillInfoWidthMult.call(this);
        return width + FotF_ParamFactorSettings.skillInfoBonusWidth;
    };
*/
    //Adds recovery skills
    RecoveryAllFlowEntry._getRecoveryValueInternalForSkill = function (unit) {
        var i;
        var recoveryValue = 0;
        var bestValue = 0;
        var bestSkill = null;
        var arr = SkillControl.getDirectSkillArray(unit, SkillType.AUTORECOVERY, '');

        for (i = 0; i < arr.length; i++) {
            var skill = arr[i].skill;
            var value = 0;

            if (skill !== null) {
                value = skill.getSkillValue() + FotF_ParamFactorControl.calculateRegenBonus(unit, skill);
            }

            if (value > bestValue) {
                bestValue = value;
                bestSkill = skill;
            }
        }

        if (bestSkill !== null) {
            recoveryValue = bestValue;
            this._recentRecoverySkill = skill;
        } else {
            this._recentRecoverySkill = null;
        }

        return recoveryValue;
    };

    //Adds state recovery
    var FotF_AddParamFactorRegenState = StateControl.getHpValue;
    StateControl.getHpValue = function (unit) {
        var value = FotF_AddParamFactorRegenState.call(this, unit);
        var i, state;
        var list = unit.getTurnStateList();
        var count = list.getCount();
        var bonus = 0;

        for (i = 0; i < count; i++) {
            state = list.getData(i).getState();
            bonus += FotF_ParamFactorControl.calculateRegenBonus(unit, state);
        }

        return value + bonus;
    };

    //Adds terrain recovery
    var FotF_AddParamFactorRegenTerrain = RecoveryAllFlowEntry._getRecoveryValueInternalForTerrain;
    RecoveryAllFlowEntry._getRecoveryValueInternalForTerrain = function (unit) {
        var value = FotF_AddParamFactorRegenTerrain.call(this, unit);

        var terrain = PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY());

        if (terrain !== null) {
            value += FotF_ParamFactorControl.calculateRegenBonus(unit, terrain);
        }

        return value;
    };

    MapParts.Terrain.setUnit = function (unit) {
        this._unit = unit;
    };

    //Draws Terrain bonus stats
    var FotF_DrawTerrainBonus = MapParts.Terrain._drawContent;
    MapParts.Terrain._drawContent = function (x, y, terrain) {
        FotF_DrawTerrainBonus.call(this, x, y, terrain);

        if (terrain === null || !terrain.custom.paramFactor) {
            return;
        }
        /*
        y += this._getPartsCount(terrain) * this.getIntervalY();

        if (terrain.getAutoRecoveryValue() !== 0) {
            text = FotF_ParamFactorSettings.recoveryString;
            this._drawKeyword(x + 2, y, text, terrain.getAutoRecoveryValue());
            y += this.getIntervalY();
        }
*/
        /*
        FotF_ParamFactorRenderer.drawRecovery(x, y, terrain);
        y += FotF_ParamFactorRenderer.getRecoverySpacing(terrain, 0, this.getIntervalY());
        FotF_ParamFactorRenderer.drawTerrainBonus(x, y, terrain, this.getIntervalY());

        
        if (typeof terrain.custom.paramFactor === 'object') {
            for (i = 0; i < 3; i++) {
                if (terrain.custom.paramFactor[i] !== 0) {
                    text = FotF_ParamFactorRenderer.getTerrainFactorName(i);
                    this._drawKeywordPercent(x + 2, y, text, terrain.custom.paramFactor[i]);
                    y += this.getIntervalY();
                }
            }
        }

        if (typeof terrain.custom.paramFactorRegen === 'number') {
            if (terrain.custom.paramFactorRegen !== 0) {
                text = FotF_ParamFactorSettings.recoveryString;
                this._drawKeywordPercent(x + 2, y, text, terrain.custom.paramFactorRegen);
                y += this.getIntervalY();
            }
        }*/
    };
    /*
    //Increase terrain window height for recovery and multiplicative boni
    var FotF_AdjustTerrainPartsCountRecovery = MapParts.Terrain._getPartsCount;
    MapParts.Terrain._getPartsCount = function (terrain) {
        var count = FotF_AdjustTerrainPartsCountRecovery.call(this, terrain);

        if (terrain.getAutoRecoveryValue() !== 0) {
            count++;
        }

        count += this._getPartsCountFactor(terrain);

        return count;
    };
*/
    /*
    //Draws skill recovery
    var FotF_DrawSkillRecovery = SkillInfoWindow.drawWindowContent;
    SkillInfoWindow.drawWindowContent = function (x, y) {
        FotF_DrawSkillRecovery.call(this, x, y);

        if (this._skill === null) {
            return;
        }

        FotF_ParamFactorRenderer.drawRecovery(x, y, this._skill);
    };
*/
    /*
    //Increase terrain window width
    var FotF_ExtendTerrainWindowWidthMult = MapParts.Terrain._getWindowWidth;
    MapParts.Terrain._getWindowWidth = function () {
        return FotF_ExtendTerrainWindowWidthMult.call(this) + FotF_ParamFactorSettings.terrainWindowBonusWidth;
    };

    //Increase Item window width
    var FotF_ExtendItemWindowWidthMult = ItemInfoWindow.getWindowWidth;
    ItemInfoWindow.getWindowWidth = function () {
        return FotF_ExtendItemWindowWidthMult.call(this) + FotF_ParamFactorSettings.itemInfoBonusWidth;
    };
    */
})();

//Terrain window extension
MapParts.Terrain._getPartsCountFactor = function (terrain) {
    if (terrain === null || typeof terrain.custom.paramFactor !== 'object') {
        return 0;
    }

    //Interval of 1 to get number of lines to space
    return FotF_ParamFactorRenderer.getRecoverySpacing(terrain, 0, 1) + FotF_ParamFactorRenderer.getParamSpacing(terrain, 0, 1);
};

//Internal terrain bonus drawing
MapParts.Terrain._drawKeywordPercent = function (x, y, text, value) {
    ItemInfoRenderer.drawKeyword(x, y, text);

    x += 45;
    if (value !== 0) {
        TextRenderer.drawSignText(x, y, value > 0 ? ' + ' : ' - ');
        if (value < 0) {
            // Minus cannot be specified for drawNumber, so times -1 to be positive.
            value *= -1;
        }
    }
    x += 40;

    NumberRenderer.drawNumber(x, y, value);

    x += value.toString().length * 11;

    TextRenderer.drawSignText(x, y, '%');
};

//Internal support check
SupportCalculator._addStatusSupport = function (targetUnit, totalStatus, data) {
    totalStatus.powerTotal += FotF_ParamFactorControl.calculateSupportBonus(targetUnit, 0, data);
    totalStatus.defenseTotal += FotF_ParamFactorControl.calculateSupportBonus(targetUnit, 1, data);
    totalStatus.hitTotal += FotF_ParamFactorControl.calculateSupportBonus(targetUnit, 2, data);
    totalStatus.avoidTotal += FotF_ParamFactorControl.calculateSupportBonus(targetUnit, 3, data);
    totalStatus.criticalTotal += FotF_ParamFactorControl.calculateSupportBonus(targetUnit, 4, data);
    totalStatus.criticalAvoidTotal += FotF_ParamFactorControl.calculateSupportBonus(targetUnit, 5, data);
};

//Internal support skill check
SupportCalculator._addStatusFactor = function (totalStatus, data, targetUnit) {
    totalStatus.powerTotal += FotF_ParamFactorControl.calculateBonus(targetUnit, 0, data, true);
    totalStatus.defenseTotal += FotF_ParamFactorControl.calculateBonus(targetUnit, 1, data, true);
    totalStatus.hitTotal += FotF_ParamFactorControl.calculateBonus(targetUnit, 2, data, true);
    totalStatus.avoidTotal += FotF_ParamFactorControl.calculateBonus(targetUnit, 3, data, true);
    totalStatus.criticalTotal += FotF_ParamFactorControl.calculateBonus(targetUnit, 4, data, true);
    totalStatus.criticalAvoidTotal += FotF_ParamFactorControl.calculateBonus(targetUnit, 5, data, true);
};

//Item sentence to show multiplicative boni
ItemSentence.ParamFactor = defineObject(BaseItemSentence, {
    drawItemSentence: function (x, y, item) {
        var bonusCount = FotF_ParamFactorRenderer.getBonusCount(item);

        if (bonusCount === 0) {
            return;
        }

        FotF_ParamFactorRenderer.drawParamBonus(x, y, item);
    },

    getItemSentenceCount: function (item) {
        var count = FotF_ParamFactorRenderer.getBonusCount(item);
        return count;
    }
});

//Wrapper functions
var FotF_ParamFactorControl = {
    calculateBonus: function (unit, index, obj, isAbility) {
        if (!this.validateCuspara(obj)) {
            return 0;
        }

        var bonus = 0;
        var factor = obj.custom.paramFactor[index];

        var factorFactor = 0;
        var factorFactor2 = 0;
        var factorFactor3 = 0;

        if (typeof obj.custom.surroundedBonus === 'number') {
            factorFactor = this.getAdjacentCount(unit, obj.custom.surroundedBonus);
        }

        if (typeof obj.custom.healthBonus === 'number') {
            factorFactor2 = this.getHealthFactor(unit, obj.custom.healthBonus);
        }

        if (typeof obj.custom.customBonus === 'function') {
            factorFactor3 = this.getCustomFactor(unit, obj.custom.customBonus);
        }

        factor += factor * factorFactor + factor * factorFactor2 + factor * factorFactor3;

        if (isAbility) {
            var baseValue = this.getAbilityBaseValue(unit, index);
        } else {
            var baseValue = ParamGroup.getClassUnitValue(unit, index);
        }

        if (typeof factor === 'number') {
            var pre = (baseValue * factor) / 100;
            //If it's -x.50 round down, to prevent stats with low values to be unable to be decreased
            if (pre < 0 && pre % 1 != 0 && pre % 0.5 == 0) {
                bonus = Math.floor(pre);
            } else {
                bonus = Math.round(pre);
            }
        }

        return bonus;
    },

    calculateTerrainBonus: function (unit, index, terrain) {
        if (!this.validateCuspara(terrain) || unit === null) {
            return 0;
        }

        var baseValue = 0;
        var bonus = 0;
        var factor = terrain.custom.paramFactor[index];

        if (index === 0) {
            //It's stupid, but to prevent infinite loops in getAvoid,
            //I push the value from getAvoid instead of the unit lol
            baseValue = unit;
        } else if (index === 1) {
            baseValue = ParamGroup.getClassUnitValue(unit, ParamType.DEF);
        } else if (index === 2) {
            baseValue = ParamGroup.getClassUnitValue(unit, ParamType.MDF);
        }

        if (typeof factor === 'number') {
            var pre = (baseValue * factor) / 100;
            //If it's -x.50 round down, to prevent stats with low values to be unable to be decreased
            if (pre < 0 && pre % 1 != 0 && pre % 0.5 == 0) {
                bonus = Math.floor(pre);
            } else {
                bonus = Math.round(pre);
            }
        }

        return bonus;
    },

    calculateSupportBonus: function (unit, index, obj) {
        var bonus = 0;
        var factor = this.getSupportFactor(obj, index);
        var baseValue = this.getAbilityBaseValue(unit, index);

        if (typeof factor === 'number') {
            var pre = (baseValue * factor) / 100;
            //If it's -x.50 round down, to prevent stats with low values to be unable to be decreased
            if (pre < 0 && pre % 1 != 0 && pre % 0.5 == 0) {
                bonus = Math.floor(pre);
            } else {
                bonus = Math.round(pre);
            }
        }

        return bonus;
    },

    calculateFusionBonus: function (unit, index, obj) {
        if (!this.validateCuspara(obj)) {
            return 0;
        }

        var bonus = this.calculateBonus(unit, index, obj, false);
        return bonus;
    },

    calculateFusionAttackBonus: function (unit, index, obj) {
        if (!this.validateFusionCuspara(obj)) {
            return 0;
        }

        var bonus = 0;
        var factor = obj.custom.paramFactorAttack[index];
        var baseValue = ParamGroup.getClassUnitValue(unit, index);

        var factorFactor = 0;
        var factorFactor2 = 0;
        var factorFactor3 = 0;

        if (typeof obj.custom.surroundedBonus === 'number') {
            factorFactor = this.getAdjacentCount(unit, obj.custom.surroundedBonus);
        }

        if (typeof obj.custom.healthBonus === 'number') {
            factorFactor2 = this.getHealthFactor(unit, obj.custom.healthBonus);
        }

        if (typeof obj.custom.customBonus === 'function') {
            factorFactor3 = this.getCustomFactor(unit, obj.custom.customBonus);
        }

        factor += factor * factorFactor + factor * factorFactor2 + factor * factorFactor3;

        if (typeof factor === 'number') {
            var pre = (baseValue * factor) / 100;
            //If it's -x.50 round down, to prevent stats with low values to be unable to be decreased
            if (pre < 0 && pre % 1 != 0 && pre % 0.5 == 0) {
                bonus = Math.floor(pre);
            } else {
                bonus = Math.round(pre);
            }
        }

        return bonus;
    },

    calculateRegenBonus: function (unit, obj) {
        if (!this.validateRecoveryCuspara(obj)) {
            return 0;
        }

        var bonus = 0;
        var factor = obj.custom.paramFactorRegen;
        var baseValue = ParamGroup.getClassUnitValue(unit, ParamType.MHP);

        var factorFactor = 0;
        var factorFactor2 = 0;
        var factorFactor3 = 0;

        if (typeof obj.custom.surroundedBonus === 'number') {
            factorFactor = this.getAdjacentCount(unit, obj.custom.surroundedBonus);
        }

        if (typeof obj.custom.healthBonus === 'number') {
            factorFactor2 = this.getHealthFactor(unit, obj.custom.healthBonus);
        }

        if (typeof obj.custom.customBonus === 'function') {
            factorFactor3 = this.getCustomFactor(unit, obj.custom.customBonus);
        }

        factor += factor * factorFactor + factor * factorFactor2 + factor * factorFactor3;

        if (typeof factor === 'number') {
            var pre = (baseValue * factor) / 100;
            //If it's -x.50 round down, to prevent stats with low values to be unable to be decreased
            if (pre < 0 && pre % 1 != 0 && pre % 0.5 == 0) {
                bonus = Math.floor(pre);
            } else {
                bonus = Math.round(pre);
            }
        }

        return bonus;
    },

    validateCuspara: function (obj) {
        return typeof obj === 'object' && typeof obj.custom === 'object' && typeof obj.custom.paramFactor === 'object';
    },

    validateFusionCuspara: function (obj) {
        return typeof obj === 'object' && typeof obj.custom === 'object' && typeof obj.custom.paramFactor === 'object';
    },

    validateRecoveryCuspara: function (obj) {
        return typeof obj === 'object' && typeof obj.custom === 'object' && typeof obj.custom.paramFactorRegen === 'number';
    },

    isScalingFactor: function (obj) {
        return typeof obj === 'object' && typeof obj.custom === 'object' && (typeof obj.custom.surroundedBonus === 'number' || typeof obj.custom.healthBonus === 'number' || typeof obj.custom.customBonus === 'function');
    },

    //Subtract weapon values because only unit values should be multiplied
    getAbilityBaseValue: function (unit, type) {
        var value = 0;
        var weapon = ItemControl.getEquippedWeapon(unit);
        var terrain = PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY());

        if (weapon === null && (type === 0 || type === 2 || type === 4)) {
            return 0;
        }

        if (type === ParamType.DEF) {
            return ParamGroup.getClassUnitValue(unit, ParamType.DEF);
        }

        if (type === 0) {
            value += AbilityCalculator.getPower(unit, weapon) - weapon.getPow();
        } else if (type === 1) {
            value += ParamGroup.getClassUnitValue(unit, ParamType.DEF);
        } else if (type === 2) {
            value += AbilityCalculator.getHit(unit, weapon) - weapon.getHit();
        } else if (type === 3) {
            value += FotF_InsertBonusFactorTerrainAvoid.call(this, unit) - (terrain !== null ? terrain.getAvoid() : 0); //This is base value because AbilityCalculator.getAvoid is aliased
        } else if (type === 4) {
            value += AbilityCalculator.getCritical(unit, weapon) - weapon.getCritical();
        } else if (type === 5) {
            value += AbilityCalculator.getCriticalAvoid(unit);
        }

        return value;
    },

    getSupportFactor: function (data, type) {
        var value = 0;
        data = data;

        if (type === 0) {
            value += data.getPower();
        } else if (type === 1) {
            value += data.getDefense();
        } else if (type === 2) {
            value += data.getHit();
        } else if (type === 3) {
            value += data.getAvoid();
        } else if (type === 4) {
            value += data.getCritical();
        } else if (type === 5) {
            value += data.getCriticalAvoid();
        }

        return value;
    },

    getAdjacentCount: function (unit, range) {
        var i;
        var count = 0;

        if (unit === null || cur_map === null) {
            return count;
        }

        var indexArray = IndexArray.getBestIndexArray(unit.getMapX(), unit.getMapY(), 1, range);

        for (i = 0; i < indexArray.length; i++) {
            var x = CurrentMap.getX(indexArray[i]);
            var y = CurrentMap.getY(indexArray[i]);
            var targetUnit = PosChecker.getUnitFromPos(x, y);
            if (targetUnit !== null && FilterControl.isReverseUnitTypeAllowed(unit, targetUnit)) {
                count++;
            }
        }

        return count;
    },

    getHealthFactor: function (unit, divider) {
        var factor = 0;
        var max = ParamGroup.getClassUnitValue(unit, ParamType.MHP);
        var current = unit.getHp();
        var isReverse = divider < 0 ? true : false;

        if (isReverse) {
            divider *= -1;
            factor = divider - Math.ceil(divider * (current / max));
        } else {
            factor = Math.floor(divider * (current / max));
        }

        return factor;
    },

    getCustomFactor: function (unit, customFunction) {
        if (typeof customFunction === 'function') {
            var value = customFunction(unit);
            if (typeof value === 'number') {
                return value;
            }
        }

        return 0;
    }
};

//Renderer functions
FotF_ParamFactorRenderer = {
    drawParamBonus: function (x, y, obj) {
        var i;
        var count = ParamGroup.getParameterCount();
        var cfg = FotF_CusparaRenderSettings;
        var renderer = FotF_CusparaRenderer;

        renderer.drawText(x, y, FotF_ParamFactorSettings.bonusKeyword);
        bonusX = x + cfg.itemStatSpacingX;

        for (i = 0; i < count; i++) {
            var n = obj.custom.paramFactor[i];

            if (n === 0) {
                continue;
            }

            if (!FotF_ParamFactorControl.isScalingFactor(obj)) {
                x = bonusX;
                x += renderer.drawText(x, y, ParamGroup.getParameterName(i));
                x += renderer.drawSign(x, y, n > 0 ? '+' : '-');

                if (n < 0) {
                    n *= -1;
                }

                x += renderer.drawNumber(x, y, n, null, null);
                x += renderer.drawSign(x, y, '%');
                y += cfg.lineSpacingY;
            } else {
                if (typeof obj.custom === 'object' && typeof obj.custom.surroundedBonus === 'number') {
                    x = bonusX;
                    x += renderer.drawText(x, y, ParamGroup.getParameterName(i));
                    x += renderer.drawSign(x, y, n > 0 ? '+' : '-');

                    if (n < 0) {
                        n *= -1;
                    }

                    x += renderer.drawNumber(x, y, n, null, null);
                    x += renderer.drawSign(x, y, '%');

                    x += renderer.drawText(x, y, FotF_ParamFactorSettings.adjacentString);
                    x += renderer.drawNumber(x, y, obj.custom.surroundedBonus, null, null);
                    x += renderer.drawText(x, y, FotF_ParamFactorSettings.adjacentString2);
                    y += cfg.lineSpacingY;
                }

                if (typeof obj.custom === 'object' && typeof obj.custom.healthBonus === 'number') {
                    var divider = Math.ceil(100 / obj.custom.healthBonus);

                    if (divider !== 0) {
                        x = bonusX;
                        x += renderer.drawText(x, y, ParamGroup.getParameterName(i));
                        x += renderer.drawSign(x, y, n > 0 ? '+' : '-');

                        if (n < 0) {
                            n *= -1;
                        }

                        x += renderer.drawNumber(x, y, n, null, null);
                        x += renderer.drawSign(x, y, '%');
                    }

                    if (divider < 0) {
                        divider *= -1;
                        x += renderer.drawText(x, y, FotF_ParamFactorSettings.mHealthStrings[0]);
                        x += renderer.drawNumber(x, y, divider, null, null);
                        x += renderer.drawSign(x, y, '%');
                        x += renderer.drawText(x, y, FotF_ParamFactorSettings.mHealthStrings[1]);
                    } else if (divider > 0) {
                        x += renderer.drawText(x, y, FotF_ParamFactorSettings.HealthStrings[0]);
                        x += renderer.drawNumber(x, y, divider, null, null);
                        x += renderer.drawSign(x, y, '%');
                        x += renderer.drawText(x, y, FotF_ParamFactorSettings.HealthStrings[1]);
                    }

                    if (divider !== 0) {
                        y += cfg.lineSpacingY;
                    }
                }

                if (typeof obj.custom === 'object' && typeof obj.custom.customBonus === 'function') {
                    var string1 = obj.custom.customBonusText1;
                    var string2 = obj.custom.customBonusText2;
                    var value = obj.custom.customBonusValue;

                    x = bonusX;
                    x += renderer.drawText(x, y, ParamGroup.getParameterName(i));
                    x += renderer.drawSign(x, y, n > 0 ? '+' : '-');

                    if (n < 0) {
                        n *= -1;
                    }

                    x += renderer.drawNumber(x, y, n, null, null);
                    x += renderer.drawSign(x, y, '%');

                    if (typeof string1 === 'string') {
                        x += renderer.drawText(x, y, string1);
                    }
                    if (typeof value === 'number') {
                        x += renderer.drawNumber(x, y, value, null, null);
                    }

                    if (typeof string2 === 'string') {
                        x += renderer.drawText(x, y, string2);
                    }

                    y += cfg.lineSpacingY;
                }
            }
        }
    },

    drawAbilityBonus: function (x, y, obj) {
        var i;
        var count = 6;
        var cfg = FotF_CusparaRenderSettings;
        var renderer = FotF_CusparaRenderer;

        renderer.drawText(x, y, FotF_ParamFactorSettings.bonusKeyword);
        bonusX = x + cfg.itemStatSpacingX;

        for (i = 0; i < count; i++) {
            var n = obj.custom.paramFactor[i];

            if (n === 0) {
                continue;
            }

            if (!FotF_ParamFactorControl.isScalingFactor(obj)) {
                x = bonusX;
                x += renderer.drawText(x, y, this.getAbilityName(i));
                x += renderer.drawSign(x, y, n > 0 ? '+' : '-');

                if (n < 0) {
                    n *= -1;
                }

                x += renderer.drawNumber(x, y, n, null, null);
                x += renderer.drawSign(x, y, '%');
                y += cfg.lineSpacingY;
            } else {
                if (typeof obj.custom === 'object' && typeof obj.custom.surroundedBonus === 'number') {
                    x = bonusX;
                    x += renderer.drawText(x, y, this.getAbilityName(i));
                    x += renderer.drawSign(x, y, n > 0 ? '+' : '-');

                    if (n < 0) {
                        n *= -1;
                    }

                    x += renderer.drawNumber(x, y, n, null, null);
                    x += renderer.drawSign(x, y, '%');

                    x += renderer.drawText(x, y, FotF_ParamFactorSettings.adjacentString);
                    x += renderer.drawNumber(x, y, obj.custom.surroundedBonus, null, null);
                    x += renderer.drawText(x, y, FotF_ParamFactorSettings.adjacentString2);
                    y += cfg.lineSpacingY;
                }

                if (typeof obj.custom === 'object' && typeof obj.custom.healthBonus === 'number') {
                    var divider = Math.ceil(100 / obj.custom.healthBonus);

                    if (divider !== 0) {
                        x = bonusX;
                        x += renderer.drawText(x, y, this.getAbilityName(i));
                        x += renderer.drawSign(x, y, n > 0 ? '+' : '-');

                        if (n < 0) {
                            n *= -1;
                        }

                        x += renderer.drawNumber(x, y, n, null, null);
                        x += renderer.drawSign(x, y, '%');
                    }

                    if (divider < 0) {
                        divider *= -1;
                        x += renderer.drawText(x, y, FotF_ParamFactorSettings.mHealthStrings[0]);
                        x += renderer.drawNumber(x, y, divider, null, null);
                        x += renderer.drawSign(x, y, '%');
                        x += renderer.drawText(x, y, FotF_ParamFactorSettings.mHealthStrings[1]);
                    } else if (divider > 0) {
                        x += renderer.drawText(x, y, FotF_ParamFactorSettings.HealthStrings[0]);
                        x += renderer.drawNumber(x, y, divider, null, null);
                        x += renderer.drawSign(x, y, '%');
                        x += renderer.drawText(x, y, FotF_ParamFactorSettings.HealthStrings[1]);
                    }

                    if (divider !== 0) {
                        y += cfg.lineSpacingY;
                    }
                }

                if (typeof obj.custom === 'object' && typeof obj.custom.customBonus === 'function') {
                    var string1 = obj.custom.customBonusText1;
                    var string2 = obj.custom.customBonusText2;
                    var value = obj.custom.customBonusValue;

                    x = bonusX;
                    x += renderer.drawText(x, y, this.getAbilityName(i));
                    x += renderer.drawSign(x, y, n > 0 ? '+' : '-');

                    if (n < 0) {
                        n *= -1;
                    }

                    x += renderer.drawNumber(x, y, n, null, null);
                    x += renderer.drawSign(x, y, '%');

                    if (typeof string1 === 'string') {
                        x += renderer.drawText(x, y, string1);
                    }
                    if (typeof value === 'number') {
                        x += renderer.drawNumber(x, y, value, null, null);
                    }

                    if (typeof string2 === 'string') {
                        x += renderer.drawText(x, y, string2, null, null);
                    }

                    y += cfg.lineSpacingY;
                }
            }
        }
    },

    //obj is terrain
    drawTerrainBonus: function (x, y, obj) {
        var i;
        var count = 3;
        var cfg = FotF_CusparaRenderSettings;
        var renderer = FotF_CusparaRenderer;

        renderer.drawText(x, y, FotF_ParamFactorSettings.bonusKeyword);
        bonusX = x + cfg.itemStatSpacingX;

        for (i = 0; i < count; i++) {
            var n = obj.custom.paramFactor[i];

            if (n === 0) {
                continue;
            }

            if (!FotF_ParamFactorControl.isScalingFactor(obj)) {
                x = bonusX;
                x += renderer.drawText(x, y, this.getTerrainFactorName(i));
                x += renderer.drawSign(x, y, n > 0 ? '+' : '-');

                if (n < 0) {
                    n *= -1;
                }

                x += renderer.drawNumber(x, y, n, null, null);
                x += renderer.drawSign(x, y, '%');
                y += cfg.lineSpacingY;
            } else {
                if (typeof obj.custom === 'object' && typeof obj.custom.surroundedBonus === 'number') {
                    x = bonusX;
                    x += renderer.drawText(x, y, this.getTerrainFactorName(i));
                    x += renderer.drawSign(x, y, n > 0 ? '+' : '-');

                    if (n < 0) {
                        n *= -1;
                    }

                    x += renderer.drawNumber(x, y, n, null, null);
                    x += renderer.drawSign(x, y, '%');

                    x += renderer.drawText(x, y, FotF_ParamFactorSettings.adjacentString);
                    x += renderer.drawNumber(x, y, obj.custom.surroundedBonus, null, null);
                    x += renderer.drawText(x, y, FotF_ParamFactorSettings.adjacentString2);
                    y += cfg.lineSpacingY;
                }

                if (typeof obj.custom === 'object' && typeof obj.custom.healthBonus === 'number') {
                    var divider = Math.ceil(100 / obj.custom.healthBonus);

                    if (divider !== 0) {
                        x = bonusX;
                        x += renderer.drawText(x, y, this.getTerrainFactorName(i));
                        x += renderer.drawSign(x, y, n > 0 ? '+' : '-');

                        if (n < 0) {
                            n *= -1;
                        }

                        x += renderer.drawNumber(x, y, n, null, null);
                        x += renderer.drawSign(x, y, '%');
                    }

                    if (divider < 0) {
                        divider *= -1;
                        x += renderer.drawText(x, y, FotF_ParamFactorSettings.mHealthStrings[0]);
                        x += renderer.drawNumber(x, y, divider, null, null);
                        x += renderer.drawSign(x, y, '%');
                        x += renderer.drawText(x, y, FotF_ParamFactorSettings.mHealthStrings[1]);
                    } else if (divider > 0) {
                        x += renderer.drawText(x, y, FotF_ParamFactorSettings.HealthStrings[0]);
                        x += renderer.drawNumber(x, y, divider, null, null);
                        x += renderer.drawSign(x, y, '%');
                        x += renderer.drawText(x, y, FotF_ParamFactorSettings.HealthStrings[1]);
                    }

                    if (divider !== 0) {
                        y += cfg.lineSpacingY;
                    }
                }

                if (typeof obj.custom === 'object' && typeof obj.custom.customBonus === 'function') {
                    var string1 = obj.custom.customBonusText1;
                    var string2 = obj.custom.customBonusText2;
                    var value = obj.custom.customBonusValue;

                    x = bonusX;
                    x += renderer.drawText(x, y, this.getTerrainFactorName(i));
                    x += renderer.drawSign(x, y, n > 0 ? '+' : '-');

                    if (n < 0) {
                        n *= -1;
                    }

                    x += renderer.drawNumber(x, y, n, null, null);
                    x += renderer.drawSign(x, y, '%');

                    if (typeof string1 === 'string') {
                        x += renderer.drawText(x, y, string1);
                    }
                    if (typeof value === 'number') {
                        x += renderer.drawNumber(x, y, value, null, null);
                    }

                    if (typeof string2 === 'string') {
                        x += renderer.drawText(x, y, string2);
                    }

                    y += cfg.lineSpacingY;
                }
            }
        }
    },

    drawRecovery: function (x, y, obj) {
        var cfg = FotF_CusparaRenderSettings;
        var renderer = FotF_CusparaRenderer;

        var n = this.getRecoveryValue(obj);

        if (n === 0) {
            return;
        }

        renderer.drawText(x, y, FotF_ParamFactorSettings.recoveryString);
        bonusX = x + cfg.itemStatSpacingX;

        if (!FotF_ParamFactorControl.isScalingFactor(obj)) {
            var numberColor = 4;
            x = bonusX;
            x += renderer.drawSign(x, y, n > 0 ? '+' : '-');

            if (n < 0) {
                n *= -1;
                numberColor = 3;
            }

            x += renderer.drawNumber(x, y, n, null, numberColor);
            x += renderer.drawSign(x, y, '%');
            y += cfg.lineSpacingY;
        } else {
            if (typeof obj.custom === 'object' && typeof obj.custom.surroundedBonus === 'number') {
                var numberColor = 4;
                x = bonusX;
                x += renderer.drawSign(x, y, n > 0 ? '+' : '-');

                if (n < 0) {
                    n *= -1;
                    numberColor = 3;
                }

                x += renderer.drawNumber(x, y, n, null, numberColor);
                x += renderer.drawSign(x, y, '%');

                x += renderer.drawText(x, y, FotF_ParamFactorSettings.adjacentString);
                x += renderer.drawNumber(x, y, obj.custom.surroundedBonus, null, null);
                x += renderer.drawText(x, y, FotF_ParamFactorSettings.adjacentString2);
                y += cfg.lineSpacingY;
            }

            if (typeof obj.custom === 'object' && typeof obj.custom.healthBonus === 'number') {
                var divider = Math.ceil(100 / obj.custom.healthBonus);
                var numberColor = 4;

                if (divider !== 0) {
                    x = bonusX;
                    x += renderer.drawSign(x, y, n > 0 ? '+' : '-');

                    if (n < 0) {
                        n *= -1;
                        numberColor = 3;
                    }

                    x += renderer.drawNumber(x, y, n, null, numberColor);
                    x += renderer.drawSign(x, y, '%');
                }

                if (divider < 0) {
                    divider *= -1;
                    x += renderer.drawText(x, y, FotF_ParamFactorSettings.mHealthStrings[0]);
                    x += renderer.drawNumber(x, y, divider, null, null);
                    x += renderer.drawSign(x, y, '%');
                    x += renderer.drawText(x, y, FotF_ParamFactorSettings.mHealthStrings[1]);
                } else if (divider > 0) {
                    x += renderer.drawText(x, y, FotF_ParamFactorSettings.HealthStrings[0]);
                    x += renderer.drawNumber(x, y, divider, null, null);
                    x += renderer.drawSign(x, y, '%');
                    x += renderer.drawText(x, y, FotF_ParamFactorSettings.HealthStrings[1]);
                }

                if (divider !== 0) {
                    y += cfg.lineSpacingY;
                }
            }

            if (typeof obj.custom === 'object' && typeof obj.custom.customBonus === 'function') {
                var string1 = obj.custom.customBonusText1;
                var string2 = obj.custom.customBonusText2;
                var value = obj.custom.customBonusValue;
                var numberColor = 4;

                x = bonusX;
                x += renderer.drawSign(x, y, n > 0 ? '+' : '-');

                if (n < 0) {
                    n *= -1;
                    numberColor = 3;
                }

                x += renderer.drawNumber(x, y, n, null, numberColor);
                x += renderer.drawSign(x, y, '%');

                if (typeof string1 === 'string') {
                    x += renderer.drawText(x, y, string1);
                }
                if (typeof value === 'number') {
                    x += renderer.drawNumber(x, y, value, null, null);
                }

                if (typeof string2 === 'string') {
                    x += renderer.drawText(x, y, string2);
                }

                y += cfg.lineSpacingY;
            }
        }
    },

    getBonusCount: function (obj) {
        var i;
        var count = 0;

        if (typeof obj !== 'object' || obj === null || typeof obj.custom !== 'object') {
            return 0;
        }

        if (typeof obj.custom.paramFactor === 'object') {
            for (i = 0; i < obj.custom.paramFactor.length; i++) {
                var value = obj.custom.paramFactor[i];
                if (value !== 0) {
                    count++;
                }
            }
        }

        return count;
    },

    getAbilityName: function (index) {
        var text = '';

        if (index === 0) {
            text = root.queryCommand('attack_capacity');
        } else if (index === 1) {
            text = ParamGroup.getParameterName(ParamType.DEF);
        } else if (index === 2) {
            text = root.queryCommand('hit_capacity');
        } else if (index === 3) {
            text = root.queryCommand('avoid_capacity');
        } else if (index === 4) {
            text = root.queryCommand('critical_capacity');
        } else if (index === 5) {
            text = FotF_ParamFactorSettings.critAvoString;
        }

        return text;
    },

    getTerrainFactorName: function (index) {
        var text = '';

        if (index === 0) {
            text = root.queryCommand('avoid_capacity');
        } else if (index === 1) {
            text = ParamGroup.getParameterName(ParamType.DEF);
        } else if (index === 2) {
            text = ParamGroup.getParameterName(ParamType.MDF);
        }

        return text;
    },

    getRecoveryValue: function (obj) {
        if (typeof obj === 'object' && typeof obj.custom === 'object' && typeof obj.custom.paramFactorRegen === 'number') {
            return obj.custom.paramFactorRegen;
        } else {
            return 0;
        }
    },

    getRecoverySpacing: function (obj, count, interval) {
        var bonusCount = 0;
        var isSpecial = false;

        if (obj !== null) {
            if (typeof obj.custom.paramFactorRegen === 'number' && obj.custom.paramFactorRegen !== 0) {
                if (typeof obj.custom.surroundedBonus === 'number' && obj.custom.surroundedBonus !== 0) {
                    bonusCount++;
                    isSpecial = true;
                }
                if (typeof obj.custom.healthBonus === 'number' && obj.custom.healthBonus !== 0) {
                    bonusCount++;
                    isSpecial = true;
                }
                if (typeof obj.custom.customBonus === 'function') {
                    bonusCount++;
                    isSpecial = true;
                }

                if (!isSpecial) {
                    bonusCount++;
                }
            }
        }

        bonusCount *= interval;

        return count + bonusCount;
    },

    getParamSpacing: function (obj, count, interval) {
        var paramCount = FotF_ParamFactorRenderer.getBonusCount(obj);
        var bonusCount = 0;
        var isSpecial = false;

        if (obj !== null) {
            if (typeof obj.custom.surroundedBonus === 'number' && obj.custom.surroundedBonus !== 0) {
                bonusCount += paramCount;
                isSpecial = true;
            }
            if (typeof obj.custom.healthBonus === 'number' && obj.custom.healthBonus !== 0) {
                bonusCount += paramCount;
                isSpecial = true;
            }
            if (typeof obj.custom.customBonus === 'function') {
                bonusCount += paramCount;
                isSpecial = true;
            }

            if (!isSpecial) {
                bonusCount += paramCount;
            }
        }

        bonusCount *= interval;

        return count + bonusCount;
    }
};
