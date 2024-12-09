/*--------------------------------------------------------------------------
Quick little plugin to adjust how many frames the map cursor animation has
(only 2 by default) and how fast it cycles between frames (once every 22 ticks
by default). All (positive, whole number) values are possible.
You can have a 100 frame animation that cycles once per tick if you so please.
_____________________________________________________________________________
                             HOW TO USE
_____________________________________________________________________________
You need a folder inside your Material folder. The name can be adjusted in
the settings of this file. You also need an image containing all the frames
(in order, from left to right) of your map cursor animation. The image should
be (Mapchip size * frameCount) by (Mapchip size) pixels. So a 4 frame cursor
would require a 128x32 pixel image with 4 cursor frames in it.

Once you have an image, match it's name with the one in the settings and
set frameCount to the number of frames it has and cycleSpeed to your desired
animation speed. (1 means 1 tick - very fast, while 100 means 100 ticks - very slow)
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @francisofthefilth
  
Original Plugin Author:
Francis of the Filth
  
2024/09/12 Released
--------------------------------------------------------------------------*/

var FotF_MapCursorSettings = {
    materialFolder: 'FotF_CustomMapCursor', //Material folder name
    graphicName: 'MapCursor8Frames.png', //Map cursor graphic name
    frameCount: 8, //No. of frames the cursor will rotate through
    cycleSpeed: 4 //Duration in game ticks (1/60s) to cycle through animation frames
};

(function () {
    var FotF_ChangeMapCursorCycleSpeed = MapCursor.initialize;
    MapCursor.initialize = function () {
        FotF_ChangeMapCursorCycleSpeed.call(this);
        this._counter.setCounterInfo(FotF_MapCursorSettings.cycleSpeed);
    };

    MapCursor.moveCursorAnimation = function () {
        if (this._counter.moveCycleCounter() !== MoveResult.CONTINUE) {
            if (this._mapCursorSrcIndex < FotF_MapCursorSettings.frameCount - 1) {
                this._mapCursorSrcIndex++;
            } else {
                this._mapCursorSrcIndex = 0;
            }
        }

        return MoveResult.CONTINUE;
    };

    MapCursor.drawCursor = function () {
        var cfg = FotF_MapCursorSettings;
        var session = root.getCurrentSession();
        var width = UIFormat.MAPCURSOR_WIDTH / 2;
        var height = UIFormat.MAPCURSOR_HEIGHT;
        var x = session.getMapCursorX() * GraphicsFormat.MAPCHIP_WIDTH - session.getScrollPixelX();
        var y = session.getMapCursorY() * GraphicsFormat.MAPCHIP_HEIGHT - session.getScrollPixelY();
        var pic = root.getMaterialManager().createImage(cfg.materialFolder, cfg.graphicName);

        if (pic === null) {
            pic = this._getCursorUI;
        }

        if (pic !== null) {
            pic.drawStretchParts(x, y, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, this._mapCursorSrcIndex * width, 0, width, height);
        }
    };
})();
