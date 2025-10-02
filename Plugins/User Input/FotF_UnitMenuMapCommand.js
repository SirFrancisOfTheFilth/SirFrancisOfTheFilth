/*
Quick little plugin to add a unit command to open the unit menu.
Works well in conjunction with the walkies plugin.
*/

var FotF_UnitMenuCommandSettings = {
    commandName: 'Unit Menu', //Command name
    commandIndex: 3, //Position of the command in the command list
    switchId: 44 //ID of global switch to enable/disable the command
};

(function () {
    //Append new command object to list command manager
    var FotF_AppendUnitMenuCommand = UnitCommand.configureCommands;
    UnitCommand.configureCommands = function (groupArray) {
        FotF_AppendUnitMenuCommand.call(this, groupArray);
        groupArray.insertObject(UnitCommand.UnitMenu, FotF_UnitMenuCommandSettings.commandIndex);
    };

    //Disallow duplicate cancel sound (from command and menu)
    var FotF_DisallowListCommandCancelSound = BaseListCommandManager._playCommandCancelSound;
    BaseListCommandManager._playCommandCancelSound = function () {
        var object = this._commandScrollbar.getObject();
        if (object.isCancelSoundAllowed() === true) {
            FotF_DisallowListCommandCancelSound.call(this);
        }
    };
})();

//Add function to control if cancel sound is allowed for commands
BaseCommand.isCancelSoundAllowed = function () {
    return true;
};

var FotF_UnitMenuCommandMode = {};

UnitCommand.UnitMenu = defineObject(UnitListCommand, {
    _unitMenuScreen: null,

    openCommand: function () {
        this._completeCommandMemberData();
    },

    moveCommand: function () {
        //Not checking the move function, cause it would execute it a second time per tick
        if (SceneManager.isScreenClosed(this._unitMenuScreen)) {
            this.endCommandAction(null);
            return MoveResult.END;
        }
        return MoveResult.CONTINUE;
    },

    endCommandAction: function (command) {
        this._listCommandManager.endCommandAction(command);
    },

    _completeCommandMemberData: function () {
        var screenParam = this._createScreenParam();
        this._unitMenuScreen = createObject(UnitMenuScreen);
        SceneManager.addScreen(this._unitMenuScreen, screenParam);
    },

    _createScreenParam: function () {
        var screenParam = ScreenBuilder.buildUnitMenu();

        screenParam.unit = this.getCommandTarget();
        screenParam.enummode = UnitMenuEnum.ALIVE;

        return screenParam;
    },

    isCommandDisplayable: function () {
        var table = root.getMetaSession().getGlobalSwitchTable();
        var index = table.getSwitchIndexFromId(FotF_UnitMenuCommandSettings.switchId);

        return table.isSwitchOn(index);
    },

    getCommandName: function () {
        return FotF_UnitMenuCommandSettings.commandName;
    },

    isRepeatMoveAllowed: function () {
        return true;
    },

    //Disallow command cancel sound to prevent doubling
    isCancelSoundAllowed: function () {
        return false;
    }
});
