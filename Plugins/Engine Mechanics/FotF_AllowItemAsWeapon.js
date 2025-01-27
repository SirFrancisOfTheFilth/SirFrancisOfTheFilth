/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			            Use items as weapons!
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This plugin makes items with custom parameter "allowAsWeapon" selectable in
the weapon select menu when attacking. The item is then used normally as if
done by the item use dialog. Works with wands too!
_____________________________________________________________________________
						    How to use
_____________________________________________________________________________

Give the item you want to use in the weapon selection the custom parameter

    {
        allowAsWeapon:x
    }

where x is the ID number of a reference weapon. This reference weapon is used
as a fake weapon that gets swapped in during the item usage, so as not to mess
with calculations that need a weapon to work properly.
_____________________________________________________________________________
						    Compatibility
_____________________________________________________________________________

The plugin is made for maximum compatibility. Even custom items like those
of PCMath's AOE script (https://github.com/pcmath/SRPG-Studio/tree/main/aoe)
will work. That means you can have AOE weapons now. Just make sure the ID of
the aoe.weapon custom parameter and allowAsWeapon parameter match, else it
might behave weirdly.

Only one function had to be overwritten: UnitCommand.Attack._moveTop
_____________________________________________________________________________
								NICE TO KNOW
_____________________________________________________________________________

To prevent funny interactions (crashes) with ItemControl.getEquippedWeapon, 
an actual weapon is equipped after the item is used. This might seem a bit
weird, since the weapon wasn't used, but actually is standard behaviour
restored, since if you used the item from the Items dialog, the weapon would
be equipped as well.
_____________________________________________________________________________
								EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth

  
Original Plugin Author:
Francis of the Filth
  
2025/01/27
Released

--------------------------------------------------------------------------*/

/////////////////////////////////////////////////////////////////////////////
/////					    		Code								/////
/////////////////////////////////////////////////////////////////////////////

//Add itemUse and itemSelection to subobjects of UnitCommand.Attack
UnitCommand.Attack._itemSelection = null;
UnitCommand.Attack._itemUse = null;
UnitCommand.Attack._savedWeapon = null;

//Add additional item modes to AttackCommandMode
AttackCommandMode.ITEM_SELECTION = 3;
AttackCommandMode.ITEM_USE = 4;

//For easy access to the last used item
var FotF_LastUsedItem = null;

(function () {
    //Allow items with allowAsWeapon to be passed into the weapon select menu
    var FotF_AllowItemSelection = WeaponSelectMenu._isWeaponAllowed;
    WeaponSelectMenu._isWeaponAllowed = function (unit, item) {
        if (!item.isWeapon() && typeof item.custom.allowAsWeapon === 'number') {
            return true;
        }
        return FotF_AllowItemSelection.call(this, unit, item);
    };

    //Add itemUse and itemSelection to subobjects
    var FotF_PrepareAdditionalItemData = UnitCommand.Attack._prepareCommandMemberDataItem;
    UnitCommand.Attack._prepareCommandMemberDataItem = function () {
        this._itemUse = null;
        this._itemSelection = null;
        FotF_LastUsedItem = null;
        FotF_PrepareAdditionalItemData.call(this);
    };

    //Add item modes to move function
    var FotF_MoveItemAttackCommand = UnitCommand.Attack.moveCommand;
    UnitCommand.Attack.moveCommand = function () {
        var mode = this.getCycleMode();
        if (mode === AttackCommandMode.ITEM_SELECTION) {
            result = this._moveSelectionItem();
            return result;
        } else if (mode === AttackCommandMode.ITEM_USE) {
            result = this._moveUse();
            return result;
        }
        return FotF_MoveItemAttackCommand.call(this);
    };

    //Add item modes to draw function
    var FotF_DrawItemAttackCommand = UnitCommand.Attack.drawCommand;
    UnitCommand.Attack.drawCommand = function () {
        var mode = this.getCycleMode();
        if (mode === AttackCommandMode.ITEM_SELECTION) {
            this._drawSelectionItem();
        } else if (mode === AttackCommandMode.ITEM_USE) {
            this._drawUse();
        }
        FotF_DrawItemAttackCommand.call(this);
    };

    //Unfortunately needs to be overwritten to split into attack preparation and item preparation.
    UnitCommand.Attack._moveTop = function () {
        var item;
        var unit = this.getCommandTarget();
        var result = this._weaponSelectMenu.moveWindowManager();

        if (result === ScrollbarInput.SELECT) {
            item = this._weaponSelectMenu.getSelectWeapon();
            if (item.isWeapon()) {
                this._savedWeapon = item;
                this._startSelection(item);
            } else {
                this._savedWeapon = ItemControl.getEquippedWeapon(unit);
                var fakeWeapon = root.getBaseData().getWeaponList().getDataFromId(item.custom.allowAsWeapon);
                UnitItemControl.pushItem(unit, fakeWeapon);
                ItemControl.setEquippedWeapon(unit, fakeWeapon);
                this._itemSelection = ItemPackageControl.getItemSelectionObject(item);
                if (this._itemSelection !== null) {
                    if (this._itemSelection.enterItemSelectionCycle(unit, item) === EnterResult.NOTENTER) {
                        this._useItem();
                        this.changeCycleMode(AttackCommandMode.ITEM_USE);
                    } else {
                        this.changeCycleMode(AttackCommandMode.ITEM_SELECTION);
                    }
                }
            }
        } else if (result === ScrollbarInput.CANCEL) {
            if (typeof item !== 'undefined' && item.isWeapon()) {
                var unit = this.getCommandTarget();
                var item = this._itemSelection.getResultItemTargetInfo().item;
                var refWeapon = root.getBaseData().getWeaponList().getDataFromId(item.custom.allowAsWeapon);
                var fakeWeapon = UnitItemControl.getMatchItem(unit, refWeapon);
                if (fakeWeapon !== null) {
                    var generator = root.getEventGenerator();
                    generator.unitItemChange(unit, fakeWeapon, IncreaseType.DECREASE, true);
                    generator.execute();
                }
                ItemControl.setEquippedWeapon(unit, this._savedWeapon);
            }
            if (this._weaponPrev !== this._weaponSelectMenu.getSelectWeapon()) {
                // Rebuild the command because the equipped weapon has changed.
                // For example, if the equipped weapon includes "Steal" as "Optional Skills", "Steal" must be removed from the command.
                this.rebuildCommand();
            }
            return MoveResult.END;
        }

        return MoveResult.CONTINUE;
    };

    //If unit has only one applicable item and no weapons, move straight to item usage
    var FotF_CompleteItemAttackCommandData = UnitCommand.Attack._completeCommandMemberData;
    UnitCommand.Attack._completeCommandMemberData = function () {
        if (DataConfig.isWeaponSelectSkippable()) {
            if (this._getWeaponCount() === 1) {
                this._isWeaponSelectDisabled = true;
            }
        }
        var weapon = ItemControl.getEquippedWeapon(this.getCommandTarget());
        if (this._isWeaponSelectDisabled && !weapon.isWeapon()) {
            this._weaponSelectMenu.setMenuTarget(this.getCommandTarget());
            this.changeCycleMode(AttackCommandMode.ITEM_SELECTION);
        } else {
            FotF_CompleteItemAttackCommandData.call(this);
        }
    };

    //Increase weapon count by number of usable items allowed as weapons
    var FotF_AttackCommandGetWeaponAndItemCount = UnitCommand.Attack._getWeaponCount;
    UnitCommand.Attack._getWeaponCount = function () {
        var weaponCount = FotF_AttackCommandGetWeaponAndItemCount.call(this);
        var i, weapon;
        var unit = this.getCommandTarget();
        var count = UnitItemControl.getPossessionItemCount(unit);

        for (i = 0; i < count; i++) {
            weapon = UnitItemControl.getItem(unit, i);
            if (weapon === null) {
                continue;
            }

            if (typeof weapon.custom.allowAsWeapon === 'number' && ItemControl.isItemUsable(unit, weapon)) {
                weaponCount++;
            }
        }

        return weaponCount;
    };
})();

//Move function for when choosing target position for item use
UnitCommand.Attack._moveSelectionItem = function () {
    if (this._itemSelection.moveItemSelectionCycle() !== MoveResult.CONTINUE) {
        if (this._itemSelection.isSelection()) {
            this._useItem();
            this.changeCycleMode(AttackCommandMode.ITEM_USE);
        } else {
            var unit = this.getCommandTarget();
            var item = this._weaponSelectMenu.getSelectWeapon();
            var refWeapon = root.getBaseData().getWeaponList().getDataFromId(item.custom.allowAsWeapon);
            var fakeWeapon = UnitItemControl.getMatchItem(unit, refWeapon);
            if (fakeWeapon !== null) {
                var generator = root.getEventGenerator();
                generator.unitItemChange(unit, fakeWeapon, IncreaseType.DECREASE, true);
                generator.execute();
            }
            ItemControl.setEquippedWeapon(unit, this._savedWeapon);
            this._weaponSelectMenu.setMenuTarget(this.getCommandTarget());
            this.changeCycleMode(AttackCommandMode.TOP);
        }
    }

    return MoveResult.CONTINUE;
};

//Uses the item
UnitCommand.Attack._useItem = function () {
    var itemTargetInfo;
    var item = this._weaponSelectMenu.getSelectWeapon();

    this._itemUse = ItemPackageControl.getItemUseParent(item);
    itemTargetInfo = this._itemSelection.getResultItemTargetInfo();

    itemTargetInfo.unit = this.getCommandTarget();
    itemTargetInfo.item = item;
    itemTargetInfo.isPlayerSideCall = true;
    this._itemUse.enterUseCycle(itemTargetInfo);
};

//Move function for when the item is finally used
UnitCommand.Attack._moveUse = function () {
    if (this._itemUse.moveUseCycle() !== MoveResult.CONTINUE) {
        var unit = this.getCommandTarget();
        var item = this._weaponSelectMenu.getSelectWeapon();
        var refWeapon = root.getBaseData().getWeaponList().getDataFromId(item.custom.allowAsWeapon);
        var fakeWeapon = UnitItemControl.getMatchItem(unit, refWeapon);
        if (fakeWeapon !== null) {
            ItemControl.deleteItem(unit, fakeWeapon);
        }
        ItemControl.setEquippedWeapon(unit, this._savedWeapon);
        FotF_LastUsedItem = item;
        this.endCommandAction();
        return MoveResult.END;
    }

    return MoveResult.CONTINUE;
};

//Draw function for target pos selection
UnitCommand.Attack._drawSelectionItem = function () {
    this._itemSelection.drawItemSelectionCycle();
};

//Draw function for item usage
UnitCommand.Attack._drawUse = function () {
    this._itemUse.drawUseCycle();
};

//An actual weapon is equipped during the event, so some calculations
//will not return errors. This is kind of a smoke and mirrors solution,
//but if you want me to change dozens of other functions instead of
//doing this you can suck my ass. To prevent usage of leftover movement
//if that equipped weapon has the skill.
UnitCommand.Attack.isRepeatMoveAllowed = function () {
    var unit = this.getCommandTarget();
    var item = this._weaponSelectMenu.getSelectWeapon();
    if (typeof item.custom.allowAsWeapon === 'number') {
        var refWeapon = root.getBaseData().getWeaponList().getDataFromId(item.custom.allowAsWeapon);
        var skillArr = SkillControl.getSkillMixArray(unit, refWeapon, SkillType.REPEATMOVE, '');
        var skill = SkillControl._returnSkill(SkillType.REPEATMOVE, skillArr);
        if (skill !== null) {
            return DataConfig.isUnitCommandMovable(RepeatMoveType.ATTACK);
        } else {
            return false;
        }
    }
    return DataConfig.isUnitCommandMovable(RepeatMoveType.ATTACK);
};

//Determine if reference weapon of last used item actually grants
//re-action or if it's the re-equipped one
ReactionFlowEntry.isReActionDisallowed = function () {
    var unit = this._targetUnit;
    var item = FotF_LastUsedItem;
    if (item !== null && typeof item.custom.allowAsWeapon === 'number') {
        var refWeapon = root.getBaseData().getWeaponList().getDataFromId(item.custom.allowAsWeapon);
        var skillArr = SkillControl.getSkillMixArray(unit, refWeapon, SkillType.REACTION, '');
        var skill = SkillControl._returnSkill(SkillType.REACTION, skillArr);
        if (skill === null) {
            FotF_LastUsedItem = null;
            return true;
        }
    }
    FotF_LastUsedItem = null;
    return false;
};

//Override re-action flow entry result if re-action was found, but reference
//weapon of item does not have the skill
var FotF_PreventFakeWeaponReaction = ReactionFlowEntry._completeMemberData;
ReactionFlowEntry._completeMemberData = function (playerTurn) {
    var result = FotF_PreventFakeWeaponReaction.call(this, playerTurn);
    var isPrevent = false;
    if (result === EnterResult.OK) {
        isPrevent = this.isReActionDisallowed();
    }
    if (isPrevent) {
        result = EnterResult.NOTENTER;
    }
    return result;
};

//Check for items with allowAsWeapon when searching if unit has weapons to attack with
var FotF_IsUnitAttackable = AttackChecker.isUnitAttackable;
AttackChecker.isUnitAttackable = function (unit) {
    var i, item, indexArray;
    var count = UnitItemControl.getPossessionItemCount(unit);

    for (i = 0; i < count; i++) {
        item = UnitItemControl.getItem(unit, i);
        if (item !== null && typeof item.custom.allowAsWeapon === 'number') {
            indexArray = this.getAttackIndexArray(unit, item, true);
            if (indexArray.length !== 0) {
                return true;
            }
        }
    }

    return FotF_IsUnitAttackable.call(this, unit);
};

//Make weapons not equippable in battle if they're actually items
var FotF_IsItemWeaponEnabled = AttackChecker._isWeaponEnabled;
AttackChecker._isWeaponEnabled = function (weapon) {
    if (!weapon.isWeapon()) {
        return false;
    }
    // Checks whether the Attack command or counterattacks are allowed with the specified weapon.
    // Return false for cases where the weapon can be equipped but it's broken and you don't want it to be used in battle.
    return true;
};
