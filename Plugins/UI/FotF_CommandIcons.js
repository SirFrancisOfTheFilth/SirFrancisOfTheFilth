/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                        Add icons to commands!
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

A simple plugin to add icons to commands on the map, during battle prep and
in the title and extras screens.

_____________________________________________________________________________
						         Setup
_____________________________________________________________________________

First, create a sub-folder in your Material folder called "FotF_CommandIcons"
(name can be changed in the settings). This folder will contain all icons
you want to draw to commands. The file type (.png by default) has to be the
same for all images.

Now simply fill the folder with icons that are named exactly after the
command they should be drawn to. So for example an icon for the "Wait" map
command would be named "Wait.png". The plugin is case sensitive!

If you rename a command, you also need to rename the icon, otherwise it won't
be recognized.

Custom commands are supported, as long as they have one of these functions:

    getCommandName()    or    getExtraDisplayName()

For example, this plugin works with MarkyJoe's Unit Command Grouping plugin.
_____________________________________________________________________________
						    Compatibility
_____________________________________________________________________________

No function were overwritten :)

Compatibility with plugins that overwrite the following functions may not be
given:

    ListCommandScrollbar.drawScrollContent
    TitleScreenScrollbar.drawScrollContent
    ExtraScrollbar.drawScrollContent
    MarshalCommandScrollbar.drawScrollContent

_____________________________________________________________________________
								 EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2025/08/25
Released

--------------------------------------------------------------------------*/

/*___________________________________________________________________________
								 Settings
___________________________________________________________________________*/

var FotF_CommandIconSettings = {
    materialFolder: 'FotF_CommandIcons', //Name of the material folder that contains the icons
    fileType: '.png', //File extension for images. Only one type can be used (.png, .jpeg, .bmp)
    listIconOffsetX: 20, //Horizontal offset for map command icons
    listIconOffsetY: 2, //Vertical offset for map command icons
    titleIconOffsetX: 20, //Horizontal offset for title command icons
    titleIconOffsetY: 0, //Vertical offset for title command icons
    extraIconOffsetX: 0, //Horizontal offset for extras command icons
    extraIconOffsetY: 0, //Vertical offset for extras command icons
    marshalIconOffsetX: 0, //Horizontal offset for battle prep command icons
    marshalIconOffsetY: 0 //Vertical offset for battle prep command icons
};

(function () {
    var FotF_DrawListCommandIcons = ListCommandScrollbar.drawScrollContent;
    ListCommandScrollbar.drawScrollContent = function (x, y, object, isSelect, index) {
        FotF_DrawListCommandIcons.call(this, x, y, object, isSelect, index);

        var cfg = FotF_CommandIconSettings;
        var icon = FotF_CommandIconControl.getIconFromCommand(object);

        if (icon !== null) {
            icon.draw(x + cfg.listIconOffsetX, y + cfg.listIconOffsetY);
        }
    };

    var FotF_DrawTitleCommandIcons = TitleScreenScrollbar.drawScrollContent;
    TitleScreenScrollbar.drawScrollContent = function (x, y, object, isSelect, index) {
        FotF_DrawTitleCommandIcons.call(this, x, y, object, isSelect, index);

        var cfg = FotF_CommandIconSettings;
        var icon = FotF_CommandIconControl.getIconFromCommand(object);

        if (icon !== null) {
            icon.draw(x + cfg.titleIconOffsetX, y + cfg.titleIconOffsetY);
        }
    };

    var FotF_DrawExtraCommandIcons = ExtraScrollbar.drawScrollContent;
    ExtraScrollbar.drawScrollContent = function (x, y, object, isSelect, index) {
        FotF_DrawExtraCommandIcons.call(this, x, y, object, isSelect, index);

        var cfg = FotF_CommandIconSettings;
        var icon = FotF_CommandIconControl.getIconFromCommand(object);

        if (icon !== null) {
            icon.draw(x + cfg.extraIconOffsetX, y + cfg.extraIconOffsetY);
        }
    };

    var FotF_DrawMarshalCommandIcons = MarshalCommandScrollbar.drawScrollContent;
    MarshalCommandScrollbar.drawScrollContent = function (x, y, object, isSelect, index) {
        FotF_DrawMarshalCommandIcons.call(this, x, y, object, isSelect, index);

        var cfg = FotF_CommandIconSettings;
        var icon = FotF_CommandIconControl.getIconFromCommand(object);

        if (icon !== null) {
            icon.draw(x + cfg.marshalIconOffsetX, y + cfg.marshalIconOffsetY);
        }
    };
})();

var FotF_CommandIconControl = {
    getIconFromCommand: function (command) {
        var string = '';
        var folder = FotF_CommandIconSettings.materialFolder;

        if (typeof command.getCommandName === 'function') {
            string = command.getCommandName() + '.png';
        } else if (typeof command.getExtraDisplayName === 'function') {
            string = command.getExtraDisplayName() + FotF_CommandIconSettings.fileType;
        }

        var icon = root.getMaterialManager().createImage(folder, string);

        return icon;
    }
};
