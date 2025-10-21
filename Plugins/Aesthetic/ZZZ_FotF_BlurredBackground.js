/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            Blur the background when text boxes are shown
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This simple plugin makes it so the map background is blurred (and frozen) if
textboxes or choices are shown. Works with the following event commands:

- Show Message
- Narration Message
- Simple Message
- Message Scroll
- Message Title
- Show Info Window
- Show Choice

There's currently no way I am aware of to get the current event background,
which is why this doesn't work with event backgrounds.

_____________________________________________________________________________
						         Setup
_____________________________________________________________________________

The plugin is almost plug-and-play. Head into the settings further below in
this file and change the blur settings to your liking, as well as set the ID
for the global switch to toggle blurring behavior on/off.

_____________________________________________________________________________
						        Usage
_____________________________________________________________________________

Toggle on/off with the designated global switch.

_____________________________________________________________________________
						    Compatibility
_____________________________________________________________________________

No functions were overwritten :)

I suggest keeping the file name, as there are some plugins that overwrite
functions this plugin uses. That way, this file gets applied last, which
ensures functionality.

_____________________________________________________________________________
								 EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2025/10/22
Released

--------------------------------------------------------------------------*/

var FotF_BlurredBGSettings = {
    globalSwitchId: 45, //ID of global switch to toggle blurring
    blurStrength: 3, //Strength of blurring
    blurBrightness: 0.5 //Brightness adjustment. Gaussian blur brightens the blurred image.
};

BaseMessageView._blurredBG = null;
BaseMessageView._blurComposition = null;
FaceView._blurredBG = null;
FaceView._blurComposition = null;

(function () {
    var FotF_DrawBlurredBGFaceView = FaceView.drawMessageView;
    FaceView.drawMessageView = function (isActive, pos) {
        var cfg = FotF_BlurredBGSettings;

        if (!MessageViewControl.isHidden() && !MessageViewControl.isBacklog()) {
            var table = root.getMetaSession().getGlobalSwitchTable();
            var index = table.getSwitchIndexFromId(cfg.globalSwitchId);

            if (!root.isEventBackgroundVisible() && table.isSwitchOn(index) && this._blurredBG !== null && this._blurComposition !== null) {
                this._blurComposition.setImage(this._blurredBG);
                FotF_BlurredBGRenderer.finishComposition(this._blurComposition);
                this._blurredBG.setComposition(this._blurComposition);
                this._blurredBG.draw(0, 0);
            }
        }

        FotF_DrawBlurredBGFaceView.call(this, isActive, pos);
    };

    var FotF_DrawBlurredBGTeropView = TeropView.drawMessageView;
    TeropView.drawMessageView = function (isActive, pos) {
        var cfg = FotF_BlurredBGSettings;

        if (!MessageViewControl.isHidden() && !MessageViewControl.isBacklog()) {
            var table = root.getMetaSession().getGlobalSwitchTable();
            var index = table.getSwitchIndexFromId(cfg.globalSwitchId);

            if (!root.isEventBackgroundVisible() && table.isSwitchOn(index) && this._blurredBG !== null && this._blurComposition !== null) {
                this._blurComposition.setImage(this._blurredBG);
                FotF_BlurredBGRenderer.finishComposition(this._blurComposition);
                this._blurredBG.setComposition(this._blurComposition);
                this._blurredBG.draw(0, 0);
            }
        }

        FotF_DrawBlurredBGTeropView.call(this, isActive, pos);
    };

    var FotF_DrawBlurredBGStillView = StillView.drawMessageView;
    StillView.drawMessageView = function (isActive, pos) {
        var cfg = FotF_BlurredBGSettings;

        if (!MessageViewControl.isHidden() && !MessageViewControl.isBacklog()) {
            var table = root.getMetaSession().getGlobalSwitchTable();
            var index = table.getSwitchIndexFromId(cfg.globalSwitchId);

            if (!root.isEventBackgroundVisible() && table.isSwitchOn(index) && this._blurredBG !== null && this._blurComposition !== null) {
                this._blurComposition.setImage(this._blurredBG);
                FotF_BlurredBGRenderer.finishComposition(this._blurComposition);
                this._blurredBG.setComposition(this._blurComposition);
                this._blurredBG.draw(0, 0);
            }
        }

        FotF_DrawBlurredBGStillView.call(this, isActive, pos);
    };

    var FotF_SetupBlurredBGFaceView = FaceView.setupMessageView;
    FaceView.setupMessageView = function (messageViewParam) {
        FotF_SetupBlurredBGFaceView.call(this, messageViewParam);

        var cfg = FotF_BlurredBGSettings;
        var table = root.getMetaSession().getGlobalSwitchTable();
        var index = table.getSwitchIndexFromId(cfg.globalSwitchId);

        if (table.isSwitchOn(index) && this._blurredBG === null) {
            this._blurredBG = FotF_BlurredBGRenderer.createBlurredBG();
            this._blurComposition = root.getGraphicsManager().createComposition();
        }
    };

    var FotF_SetupBlurredBGTeropView = TeropView.setupMessageView;
    TeropView.setupMessageView = function (messageViewParam) {
        FotF_SetupBlurredBGTeropView.call(this, messageViewParam);

        var cfg = FotF_BlurredBGSettings;
        var table = root.getMetaSession().getGlobalSwitchTable();
        var index = table.getSwitchIndexFromId(cfg.globalSwitchId);

        if (table.isSwitchOn(index) && this._blurredBG === null) {
            this._blurredBG = FotF_BlurredBGRenderer.createBlurredBG();
            this._blurComposition = root.getGraphicsManager().createComposition();
        }
    };

    var FotF_SetupBlurredBGStillView = StillView.setupMessageView;
    StillView.setupMessageView = function (messageViewParam) {
        FotF_SetupBlurredBGStillView.call(this, messageViewParam);

        var cfg = FotF_BlurredBGSettings;
        var table = root.getMetaSession().getGlobalSwitchTable();
        var index = table.getSwitchIndexFromId(cfg.globalSwitchId);

        if (table.isSwitchOn(index) && this._blurredBG === null) {
            this._blurredBG = FotF_BlurredBGRenderer.createBlurredBG();
            this._blurComposition = root.getGraphicsManager().createComposition();
        }
    };
})();

var FotF_BlurredBGRenderer = {
    createBlurredBG: function () {
        var scene = root.getCurrentScene();
        var baseScene = root.getBaseScene();
        var background = root.getSceneController().getSceneBackgroundImage(scene);
        var pic = null;

        if (background !== null) {
            pic = FotF_BlurredBGRenderer.createBGCache(background);
        } else if (baseScene === SceneType.FREE || baseScene === SceneType.BATTLESETUP) {
            pic = FotF_BlurredBGRenderer.createMapCache();
        }

        return pic;
    },

    createMapCache: function () {
        var manager = root.getGraphicsManager();
        var pic = manager.createCacheGraphics(root.getWindowWidth(), root.getWindowHeight());
        manager.setRenderCache(pic);

        MapLayer.drawMapLayer();
        MapLayer.drawUnitLayer();

        manager.resetRenderCache();

        return pic;
    },

    createBGCache: function (background) {
        var manager = root.getGraphicsManager();
        var pic = manager.createCacheGraphics(root.getWindowWidth(), root.getWindowHeight());
        manager.setRenderCache(pic);

        background.draw(0, 0);

        manager.resetRenderCache();

        return pic;
    },

    finishComposition: function (composition) {
        var cfg = FotF_BlurredBGSettings;
        composition.setGaussianBlur(cfg.blurStrength);
        composition.setBrightness(cfg.blurBrightness);
        composition.composite(CompositeMode.PLUS);
    },

    reset: function (cacheImage, composition) {
        cacheImage = null;
        composition = null;
    }
};
