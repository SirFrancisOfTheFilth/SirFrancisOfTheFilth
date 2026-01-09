/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            Easily set a background image to your message events
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Simply set up a material folder called "FotF_MessageBackground" and put an
image named "BG.png" in it. These names can be changed in this file's
settings.

Offsets can also be set to shift the image around.

_____________________________________________________________________________
								 EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2026/01/09
Release

--------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------
                                SETTINGS
--------------------------------------------------------------------------*/

var FotF_MessageBackgroundSettings = {
    materialFolder: 'FotF_MessageBackground', //material folder name
    imageName: 'BG.png', //image name, including file extension
    offsetX: 0, //x offset (+ --> right)
    offsetY: 0 //y offset (+ --> down)
};

(function () {
    var FotF_DrawMessageBackground = FaceView._drawFaceViewCharIllust;
    FaceView._drawFaceViewCharIllust = function (isTopActive, isCenterActive, isBottomActive) {
        var cfg = FotF_MessageBackgroundSettings;
        var pic = root.getMaterialManager().createImage(cfg.materialFolder, cfg.imageName);

        if (pic !== null) {
            pic.draw(cfg.offsetX, cfg.offsetY);
        }

        FotF_DrawMessageBackground.call(this, isTopActive, isCenterActive, isBottomActive);
    };
})();
