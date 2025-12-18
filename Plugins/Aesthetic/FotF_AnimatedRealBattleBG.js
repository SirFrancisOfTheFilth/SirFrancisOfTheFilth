/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                    Animate real battle backgrounds!
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

No more static background images! Easily animate the background of fights
with this little plugin. Supports map-wide and terrain specific animations,
just like the base engine does with images.

_____________________________________________________________________________
						         Setup
_____________________________________________________________________________

First off, you will need a material folder named "FotF_AnimatedRBBG" (can be
changed in this file's settings) where all the animation frames will go.

Real battle backgrounds have a size of 840x480 pixels, so your frames should
also have that resolution.

The custom parameter used for this plugin is always the same, whether you
apply it to the map information or terrain:

{
    ARBBG: {
        image: "Shrek-The-Movie",   //Name of the subsequent image files WITHOUT numbering or file extension
        speed: 10,                  //Animation speed (60 ticks = 1s)
        fileType: ".png"            //File type as string, .png/.jpeg/.bmp are supported
    }
}

File naming has to be done a certain way. Let's assume you have a 60 image
series of a scene from everyone's favorite movie - Shrek. All images must
have the same base name. The first one will have no number suffix, the second
one will have -1, the third -2 and so on. So our example could look like this:

Shrek-The-Movie.png
Shrek-The-Movie-1.png
Shrek-The-Movie-2.png
...

It's important not to have gaps in the numbering, as they stop the counting
function, leading to an unfinished animation playing.
_____________________________________________________________________________
						    Background priority
_____________________________________________________________________________

When multiple background sources are set, only one of them can be drawn. The
priority decreases as follows:

1. This plugin's animated background set for the whole map (in map info)
2. This plugin's animated background set for a single terrain tile (ornament > ground tiles)
3. The standard background image set in map info
4. Background images set for individual terrain

This follows the same priority system as the base engine, but additionally
prioritizes the plugin's animated backgrounds.

_____________________________________________________________________________
						      Compatibility
_____________________________________________________________________________

No functions were overwritten :)

Compatibility with plugins that modify real battle background drawing
(UIBattleLayout._drawBackground) might not be given.

_____________________________________________________________________________
								 EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2025/08/14
Released

--------------------------------------------------------------------------*/

var FotF_AnimatedRBBGSettings = {
    materialFolder: 'FotF_AnimatedRBBG'
};

RealBattle._ARBBGCounter = null;
RealBattle._ARBBGIndex = null;
RealBattle._ARBBGMax = null;

(function () {
    var FotF_SetARBBGInfo = RealBattle.openBattleCycle;
    RealBattle.openBattleCycle = function (coreAttack) {
        FotF_SetARBBGInfo.call(this, coreAttack);

        this._ARBBGIndex = 0;
        this._ARBBGMax = this.getARBBGImageCount() - 1;
        this._ARBBGCounter = createObject(CycleCounter);
        this._ARBBGCounter.setCounterInfo(this.getARBBGFrameSpeed() - 2);
    };

    var FotF_MoveARBBGCounter = RealBattle.moveBattleCycle;
    RealBattle.moveBattleCycle = function () {
        if (this._ARBBGCounter.moveCycleCounter() === MoveResult.END) {
            this._ARBBGIndex++;
        }

        if (this._ARBBGIndex > this._ARBBGMax) {
            this._ARBBGIndex = 0;
        }

        return FotF_MoveARBBGCounter.call(this);
    };

    var FotF_DrawAnimatedRBBG = UIBattleLayout._drawBackground;
    UIBattleLayout._drawBackground = function (xScroll, yScroll) {
        if (this._isBackgroundDisabled()) {
            return;
        }

        var pic = this._realBattle.getARBBGFrameImage(this._realBattle._ARBBGIndex);

        if (pic !== null) {
            pic.drawParts(0, 0, xScroll, yScroll, this._getBattleAreaWidth(), this._getBattleAreaHeight());
        } else {
            FotF_DrawAnimatedRBBG.call(this, xScroll, yScroll);
        }
    };
})();

RealBattle.getARBBGFrameSpeed = function () {
    var mapInfo = root.getCurrentSession().getCurrentMapInfo();
    if (FotF_ARBBGControl.verifyCuspara(mapInfo)) {
        return mapInfo.custom.ARBBG.speed;
    } else {
        var terrain = this.getAttackInfo().terrain;
        var terrainLayer = this.getAttackInfo().terrainLayer;

        if (FotF_ARBBGControl.verifyCuspara(terrainLayer)) {
            return terrainLayer.custom.ARBBG.speed;
        } else if (FotF_ARBBGControl.verifyCuspara(terrain)) {
            return terrain.custom.ARBBG.speed;
        }
    }

    return 0;
};

RealBattle.getARBBGFrameImage = function (index) {
    var mapInfo = root.getCurrentSession().getCurrentMapInfo();
    if (FotF_ARBBGControl.verifyCuspara(mapInfo)) {
        return FotF_ARBBGControl.getImageFromIndex(mapInfo, index);
    } else {
        var terrain = this.getAttackInfo().terrain;
        var terrainLayer = this.getAttackInfo().terrainLayer;

        if (FotF_ARBBGControl.verifyCuspara(terrainLayer)) {
            return FotF_ARBBGControl.getImageFromIndex(terrainLayer, index);
        } else if (FotF_ARBBGControl.verifyCuspara(terrain)) {
            return FotF_ARBBGControl.getImageFromIndex(terrain, index);
        }
    }

    return null;
};

RealBattle.getARBBGImageCount = function () {
    var mapInfo = root.getCurrentSession().getCurrentMapInfo();
    if (FotF_ARBBGControl.verifyCuspara(mapInfo)) {
        return FotF_ARBBGControl.getImageCount(mapInfo);
    } else {
        var terrain = this.getAttackInfo().terrain;
        var terrainLayer = this.getAttackInfo().terrainLayer;

        if (terrainLayer !== null && FotF_ARBBGControl.verifyCuspara(terrainLayer)) {
            return FotF_ARBBGControl.getImageCount(terrainLayer);
        } else if (terrain !== null && FotF_ARBBGControl.verifyCuspara(terrain)) {
            return FotF_ARBBGControl.getImageCount(terrain);
        }
    }

    return 0;
};

var FotF_ARBBGControl = {
    verifyCuspara: function (obj) {
        return typeof obj === 'object' && typeof obj.custom === 'object' && typeof obj.custom.ARBBG === 'object' && this.verifyParameters(obj.custom.ARBBG);
    },

    verifyParameters: function (custom) {
        return typeof custom.image === 'string' && typeof custom.fileType === 'string' && typeof custom.speed === 'number';
    },

    getImageFromIndex: function (obj, index) {
        if (!this.verifyCuspara(obj)) {
            return null;
        }

        var cfg = FotF_AnimatedRBBGSettings;
        var name = obj.custom.ARBBG.image;
        var extension = obj.custom.ARBBG.fileType;

        if (index > 0) {
            var suffix = '-' + index.toString();
        } else {
            var suffix = '';
        }

        var fullName = name + suffix + extension;
        var image = root.getMaterialManager().createImage(cfg.materialFolder, fullName);

        return image;
    },

    getImageCount: function (obj) {
        if (!this.verifyCuspara(obj)) {
            return 0;
        }

        var i = 0;

        for (;;) {
            var image = this.getImageFromIndex(obj, i);

            if (image === null) {
                break;
            }

            i++;
        }

        return i;
    },

    getARBBGImage: function (index) {}
};
