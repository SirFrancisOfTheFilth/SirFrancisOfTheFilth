var FotF_FPSCounterSettings = {
    isEnabled: true, //true to enable counter, false to disable it
    prefix: '', //text before fps number, specify "" to leave blank
    x: 8, //x drawing coordinate
    y: 8, //y drawing coordinate
    fontId: 0, //font ID, this produces an error if no font is found!
    color: 0xffffff, //color, hexadecimal value
    alpha: 255 //opacity, 0-255
};

(function () {
    var FotF_DrawFPSCounter = MapLayer.drawUnitLayer;
    MapLayer.drawUnitLayer = function () {
        FotF_DrawFPSCounter.call(this);

        var cfg = FotF_FPSCounterSettings;

        if (cfg.isEnabled) {
            var fps = root.getFPS();
            var font = root.getBaseData().getFontList().getDataFromId(cfg.fontId);
            var text = cfg.prefix + fps.toString();

            TextRenderer.drawAlphaText(cfg.x, cfg.y, text, -1, cfg.color, cfg.alpha, font);
        }
    };
})();
