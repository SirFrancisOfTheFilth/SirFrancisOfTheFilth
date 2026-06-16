/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
         Create custom config options that flip global switches
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

With this plugin you can create your own config options, so your players are
able to flip an associated switch at any time.

DUE TO GLOBAL SWITCHES BEING INITIALIZED AFTER THE TITLE SCREEN, CONFIG ITEMS
CREATED BY THIS PLUGIN WON'T SHOW UP BEFORE STARTING/LOADING A GAME SESSION!

_____________________________________________________________________________
						          Setup
_____________________________________________________________________________

All you have to do is create as many entries as you want in the library
section below. Entries are structured like this:

    entry1: {
        name: 'Name of the config option',
        description: 'Description of what it does',
        id: 0,
        options: ['On', 'Off'],
        values: [true, false]
    },

    entry2: {
        name: 'Name of the config option',
        description: 'Description of what it does',
        id: 1,
        options: ['On', 'Off'],
        values: [true, false]
    }

As you can see, entries are separated by comma. The id parameter is the ID
number of the associated global switch. You can also customize the name,
description and selectable options here. The values should be left like they
are, with true representing an active switch and false an inactive one.


_____________________________________________________________________________
							  Compatibility
_____________________________________________________________________________

No functions were overwritten :)

_____________________________________________________________________________
								 EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2026/04/20
Release

2026/06/16
Removed options from the title screen config only, because switch table is 
not initialized at this point, which would lead to an error

--------------------------------------------------------------------------*/

/*-------------------------------------------------------------
                            LIBRARY
-------------------------------------------------------------*/

var FotF_CustomConfigLibrary = {
    nsfw: {
        name: 'NSFW',
        description: 'Toggles adult content',
        id: 46,
        options: ['On', 'Off'],
        values: [true, false]
    }
};

/*-------------------------------------------------------------
                             CODE
-------------------------------------------------------------*/

ConfigItem.CustomConfig = defineObject(BaseConfigtItem, {
    _configData: null,

    selectFlag: function (index) {
        var arr = this.getValueArray();

        var switchIndex = root.getMetaSession().getGlobalSwitchTable().getSwitchIndexFromId(this._configData.id);
        root.getMetaSession().getGlobalSwitchTable().setSwitch(switchIndex, arr[index]);
    },

    setupCustomConfigItem: function (obj) {
        this._configData = {
            name: obj.name,
            description: obj.description,
            id: obj.id,
            options: obj.options,
            values: obj.values
        };
    },

    getFlagValue: function () {
        var switchIndex = root.getMetaSession().getGlobalSwitchTable().getSwitchIndexFromId(this._configData.id);
        return root.getMetaSession().getGlobalSwitchTable().isSwitchOn(switchIndex) === true ? 0 : 1;
    },

    getFlagCount: function () {
        return this._configData.options.length;
    },

    getConfigItemTitle: function () {
        return this._configData.name;
    },

    getConfigItemDescription: function () {
        return this._configData.description;
    },

    getObjectArray: function () {
        return this._configData.options;
    },

    getValueArray: function () {
        return this._configData.values;
    }
});

(function () {
    var FotF_AppendCustomConfigItems = ConfigWindow._configureConfigItem;
    ConfigWindow._configureConfigItem = function (groupArray) {
        FotF_AppendCustomConfigItems.call(this, groupArray);

        var session = root.getMetaSession().getGlobalSwitchTable();

        //Unfortunately the global switch table isn't initialized in the title screen, so check that and not display the option(s) as it would lead to an error
        if (session !== null) {
            for (string in FotF_CustomConfigLibrary) {
                var data = FotF_CustomConfigLibrary[string];
                var configItem = createObject(ConfigItem.CustomConfig);
                configItem.setupCustomConfigItem(data);
                groupArray.appendObject(configItem);
            }
        }
    };
})();
