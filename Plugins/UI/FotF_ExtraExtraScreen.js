/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                Need a second glossary screen? Well here it is!
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This plugin adds another glossary screen to the "Extras" screen (and the title
screen if you want). You can choose the name and description yourself in the
settings section.

_____________________________________________________________________________
						How to set up categories
_____________________________________________________________________________

First of all, check the settings in this file. The most important ones are
choosing an original data index for the categories and data. This determines
the original data tabs (Database > Config > Original Data) this plugin
accesses for it's categories and data respectively.
Bear in mind that to get your desired tab number, you have to specify the
index one digit lower. So tab 3 would translate to index 2.

So for example, setting originalDataIndexCat to 2 and originalDataIndex to 3
will let you create categories in tab 3 and data to out into these categories
in tab 4.

The only things you have to set for the categories are icon, name and value 6.
Value 6 determines the "group" this category represents and is used later on
to assign data to it. It's recommended to let each category have it's unique
group number.

_____________________________________________________________________________
							How to set up data
_____________________________________________________________________________

After you're done setting up categories, proceed to the original data tab for
your actual data. There you can create as many entries as you want following
this template:

Icon : You can set an icon to be displayed in the selection phase
Name: Name of the data in the selection phase, displayed alongside icon
Description: This text will be displayed above the main text when selecting data
Value 1: 1 to show an additional image (defined later), 0 to omit
Value 2: 1 if the image is a RTP (standard SRPGS material) image, 0 if original
Value 3: Image ID as seen in Resources > Graphics > Picture
Value 4: x offset for image drawing
Value 5: y offset for image drawing
Value 6: category group number

Now for the main text to be displayed, you need to set a custom parameter for
the entry like this:

{
extraScreenText:[
"Page 1 Text",
"Page 2 Text",
"Page 3 Text"
]
}

Notice that this is structured as an array of strings, so all text must be in
quotation marks "" and pages separated by comma. NO COMMA AFTER LAST STRING!
There's no line breaks allowed in the custom parameters, but don't worry, the
plugin automatically sets them for you.

_____________________________________________________________________________
								Example
_____________________________________________________________________________

You want to add lore entries for your game's countries. You have set up icons
and images with their banners and prepared lore text. You could now set up the
fictional and very much not real country of West Taiwan like this:

Icon: A red square with yellow stars
Name: West Taiwan
Description: West Taiwan - Some say it's not even a country
Value 1: 1 (To show an image of the flag)
Value 2: 0 (Because SRPGS has no West Taiwan flag, so it must be original)
Value 3: 1989 (That's the ID of the flag you want to show, you have many images, wow!)
Value 4: -100 (100 pixels to the left)
Value 5: 20 (20 pixels down)
Value 6: 3 (So it's assigned to the category with group number 3)

Custom Parameters:

{
extraScreenText:[
"West Taiwan, officially the People's Republic of West Taiwan (PRWT), is a country in East Asia. With a population exceeding 1.4 billion, it is the second-most populous country after India, representing 17.4% of the world population. West Taiwan spans the equivalent of five time zones and borders fourteen countries by land across an area of nearly 9.6 million square kilometers (3,700,000 sq mi), making it the second-largest country by land area. The country is divided into 33 province-level divisions: 22 provinces, 5 autonomous regions, 4 municipalities, and 2 semi-autonomous special administrative regions. West Taipeh is the country's capital and its most populous city by urban area and largest financial center.",
"West Taiwan is considered one of the six cradles of civilization, with the first human inhabitants in the region arriving during the Paleolithic. By the late 2nd millennium BCE, the earliest dynastic states had emerged in the Yellow River basin. The 8th–3rd centuries BCE saw a breakdown in the authority of the Zhou dynasty, accompanied by the emergence of administrative and military techniques, literature, philosophy, and historiography. In 221 BCE, West Taiwan was unified under an emperor, ushering in more than two millennia of imperial dynasties including the Qin, Han, Tang, Yuan, Ming, and Qing. With the invention of gunpowder and paper, the establishment of the Silk Road, and the building of the Great Wall, West Taiwanese culture flourished and has heavily influenced both its neighbors and lands further afield. However, West Taiwan began to cede parts of the country in the late 19th century to various European powers by a series of unequal treaties.",
"Yes I ripped this totally trustworthy and in no way falsified information from Wikipedia, sue me."
]
}

Now do that for every country ever and you have a nice compendium of all of
your game's cultures.

_____________________________________________________________________________
							Tips and Tricks
_____________________________________________________________________________

If you really want a manual line break in the main text, insert \n into it.
For example "This is a\n line break" will become

This is a
 line break     <-- space taken into second line, so you can omit those

There's a limit to how long the custom parameter prompt will let you write a
line before it breaks it, which is about the same length a page on the screen
can be without being cut off at the end. So just split your text into
appropriately sized chunks.

_____________________________________________________________________________
								EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2025/03/23
Released

2025/06/19
Fixed data not being scrollable/becoming empty

--------------------------------------------------------------------------*/

/////////////////////////////////////////////////////////////////////////////
/////							SETTINGS								/////
/////////////////////////////////////////////////////////////////////////////

var FotF_ExtraExtraScreenSettings = {
    screenName: 'Compendium', //Command name in the command list
    screenDescription: 'Lists all sorts of things I guess.', //Description when hovering over the command
    showInTitleScreen: true, //true to show the command in the title screen, false to show it only in the extras screen
    titleScreenIndex: 1, //position index from the bottom of the title screen commands (1 means 2nd to last)
    originalDataIndexCat: 2, //Original Data index for categories (index = tab - 1, so tab 4 would be index 3)
    originalDataIndex: 3, //Original Data index for data (index = tab - 1, so tab 3 would be index 2)
    maxLineLength: 360 //Maximum text line length in pixels
};

/////////////////////////////////////////////////////////////////////////////
/////					  	    	CODE		    					/////
/////////////////////////////////////////////////////////////////////////////

(function () {
    var FotF_AppendExtraExtraScreen = ExtraScreen._configureExtraScreens;
    ExtraScreen._configureExtraScreens = function (groupArray) {
        FotF_AppendExtraExtraScreen.call(this, groupArray);
        groupArray.appendObject(FotF_ExtraWordScreen);
    };

    var FotF_AppendExtraExtraScreenToTitle = TitleScene._configureTitleItem;
    TitleScene._configureTitleItem = function (groupArray) {
        var cfg = FotF_ExtraExtraScreenSettings;
        var index = groupArray.length - cfg.titleScreenIndex;

        FotF_AppendExtraExtraScreenToTitle.call(this, groupArray);

        if (cfg.showInTitleScreen === true) {
            groupArray.insertObject(TitleCommand.ExtraExtraScreen, index);
        }
    };
})();

DictionaryMode.TOPTOP = 2;

TitleCommand.ExtraExtraScreen = defineObject(BaseTitleCommand, {
    _extraExtraScreen: null,

    openCommand: function () {
        var screenParam = this._createScreenParam();

        this._extraExtraScreen = createObject(FotF_ExtraWordScreen);
        SceneManager.addScreen(this._extraExtraScreen, screenParam);
        SceneManager.setForceForeground(true);
    },

    moveCommand: function () {
        if (SceneManager.isScreenClosed(this._extraExtraScreen)) {
            SceneManager.setForceForeground(false);
            return MoveResult.END;
        }

        return MoveResult.CONTINUE;
    },

    _createScreenParam: function () {
        var screenParam = {};

        return screenParam;
    },

    getCommandName: function () {
        return FotF_ExtraExtraScreenSettings.screenName;
    }
});

var FotF_ExtraWordScreen = defineObject(DictionaryScreen, {
    _contentArray: null,
    _subContentArray: null,
    _scrollBar2: null,

    setScrollbarData: function () {
        var dictionaryScrollbarParam = this._createDictionaryScrollbarParam();

        this._scrollbar = createScrollbarObject(DictionaryScrollbar, this);
        this._scrollbar.setDictionaryScrollbarParam(dictionaryScrollbarParam);
        this._scrollbar.setDictionaryFormation();
        this._scrollbar.setActive(true);
        this._scrollbar2 = createScrollbarObject(DictionaryScrollbar, this);
        this._scrollbar2.setDictionaryScrollbarParam(dictionaryScrollbarParam);
        this._scrollbar2.setDictionaryFormation();
        this._scrollbar2.setActive(false);

        this._contentArray = this.createContentArray();
        this._scrollbar.setObjectArray(this._contentArray);

        this._storyDataChanger.setConditionData(root.getStoryPreference().isWordNumberVisible(), dictionaryScrollbarParam.funcCondition);
    },

    _prepareScreenMemberData: function (screenParam) {
        this._scrollbar = createScrollbarObject(DictionaryScrollbar, this);
        this._storyDataChanger = createObject(FotF_StoryDataChanger);
        this._messagePager = createObject(MessagePager);
        this._secretViewer = createObject(SecretViewer);
        this._dataChanger = createObject(VerticalDataChanger);
    },

    _completeScreenMemberData: function (screenParam) {
        this.setScrollbarData();
        this._setMessagePagerData();

        this.changeCycleMode(DictionaryMode.TOPTOP);
    },

    moveScreenCycle: function () {
        var mode = this.getCycleMode();
        var result = MoveResult.CONTINUE;

        if (mode === DictionaryMode.TOPTOP) {
            result = this._moveTopTop();
        } else if (mode === DictionaryMode.TOP) {
            result = this._moveTop();
        } else if (mode === DictionaryMode.MAIN) {
            result = this._moveMain();
        }

        return result;
    },

    _moveTopTop: function () {
        var input = this._scrollbar.moveInput();
        var result = MoveResult.CONTINUE;

        if (input === ScrollbarInput.SELECT) {
            this.switchSub();
            this.changeCycleMode(DictionaryMode.TOP);
        } else if (input === ScrollbarInput.CANCEL) {
            result = MoveResult.END;
        }

        return result;
    },

    _moveTop: function () {
        var input = this._scrollbar2.moveInput();
        var result = MoveResult.CONTINUE;

        if (input === ScrollbarInput.SELECT) {
            this._changeNewPageSub(true);
            this.changeCycleMode(DictionaryMode.MAIN);
        } else if (input === ScrollbarInput.CANCEL) {
            this.switchTop();
            this.changeCycleMode(DictionaryMode.TOPTOP);
            result = MoveResult.CONTINUE;
        }

        return result;
    },

    _moveMain: function () {
        var index;

        this._storyDataChanger.movePage();

        if (InputControl.isCancelAction()) {
            MouseControl.changeCursorFromScrollbar(this._scrollbar, this._scrollbar.getIndex());
            this._playCancelSound();
            this.changeCycleMode(DictionaryMode.TOP);
        } else if (this._storyDataChanger.checkPage()) {
            this._changeNewPageSub(false);
        } else {
            index = this._dataChanger.checkDataIndex(this._scrollbar2, null);
            if (index !== -1) {
                this._scrollbar2.setIndex(index);
                this._changeNewPageSub(true);
            }
        }

        return MoveResult.CONTINUE;
    },

    drawScreenCycle: function () {
        var mode = this.getCycleMode();

        if (mode === DictionaryMode.TOPTOP) {
            this._drawTopTop();
        } else if (mode === DictionaryMode.TOP) {
            this._drawTop();
        } else if (mode === DictionaryMode.MAIN) {
            this._drawMain();
        }
    },

    _drawTopTop: function () {
        var x = LayoutControl.getCenterX(-1, this._scrollbar.getScrollbarWidth());
        var y = LayoutControl.getCenterY(-1, this._scrollbar.getScrollbarHeight());

        this._scrollbar.drawScrollbar(x, y);
    },

    _drawTop: function () {
        var x = LayoutControl.getCenterX(-1, this._scrollbar2.getScrollbarWidth());
        var y = LayoutControl.getCenterY(-1, this._scrollbar2.getScrollbarHeight());

        this._scrollbar2.drawScrollbar(x, y);
    },

    _drawMain: function () {
        var obj = this._scrollbar2.getObject();

        if (this._scrollbar.isNameDisplayable(obj, 0)) {
            this._drawTopName(obj);
            this._drawExplanation(obj);
            this.drawDictionaryImage(obj);
        } else {
            this._secretViewer.drawSecretCharacter(obj, 0);
        }

        this._drawPage();
    },

    getScreenInteropData: function () {
        return root.queryScreen('Word');
    },

    getScreenTitleName: function () {
        return FotF_ExtraExtraScreenSettings.screenName;
    },

    getExtraDescription: function () {
        return FotF_ExtraExtraScreenSettings.screenDescription;
    },

    drawDictionaryImage: function (obj) {
        var x, y;
        var image = obj.getPictureImage();

        if (image !== null) {
            x = this._getPictureX(image, obj);
            y = this._getPictureY(image, obj);
            image.draw(x, y);
        }
    },

    _createDictionaryScrollbarParam: function () {
        var dictionaryScrollbarParam = StructureBuilder.buildDictionaryScrollbarParam();

        dictionaryScrollbarParam.funcCondition = function (object, index) {
            return object.isPageEnabled(index);
        };

        return dictionaryScrollbarParam;
    },

    switchSub: function () {
        var data = this._scrollbar.getObject();
        var categoryId = data.getCategoryId();
        this._subContentArray = this.createContentArraySub(categoryId);
        this._scrollbar.setActive(false);
        this._scrollbar2.setActive(true);
        this._scrollbar2.setObjectArray(this._subContentArray);
        this._scrollbar2.setIndex(0);
    },

    switchTop: function () {
        this._scrollbar2.setActive(false);
        this._scrollbar.setActive(true);
        this._scrollbar.setObjectArray(this._contentArray);
        MouseControl.changeCursorFromScrollbar(this._scrollbar2, this._scrollbar2.getIndex());
        this._playCancelSound();
    },

    _changeNewPage: function (isTarget) {
        var text;
        var cfg = FotF_ExtraExtraScreenSettings;
        var data = this._scrollbar.getObject();

        this._storyDataChanger.setCurrentData(data);

        if (isTarget) {
            this._setPageData();
        }

        text = data.getPageText(this._storyDataChanger.getTruePageIndex());

        var font = this._messagePagerParam.font;
        lineArray = FotF_TextControl.convertTextToLineArray(text, font, cfg.maxLineLength, true);
        text = FotF_TextControl.convertLineArrayToLineBreakText(lineArray);
        this._messagePager.setMessagePagerText(text, this._messagePagerParam);
    },

    _changeNewPageSub: function (isTarget) {
        var text;
        var cfg = FotF_ExtraExtraScreenSettings;
        var data = this._scrollbar2.getObject();

        this._storyDataChanger.setCurrentData(data);

        if (isTarget) {
            this._setPageData();
        }

        text = data.getPageText(this._storyDataChanger.getTruePageIndex());

        var font = this._messagePagerParam.font;
        lineArray = FotF_TextControl.convertTextToLineArray(text, font, cfg.maxLineLength, true);
        text = FotF_TextControl.convertLineArrayToLineBreakText(lineArray);
        this._messagePager.setMessagePagerText(text, this._messagePagerParam);
    },

    createContentArray: function () {
        var i;
        var arr = [];
        var cfg = FotF_ExtraExtraScreenSettings;
        var list = root.getBaseData().getOriginalDataList(cfg.originalDataIndexCat);

        for (i = 0; i < list.getCount(); i++) {
            var data = list.getData(i);
            var obj = this.createScrollbarObject(data);
            arr.push(obj);
        }

        return arr;
    },

    createContentArraySub: function (categoryId) {
        var i;
        var arr = [];
        var cfg = FotF_ExtraExtraScreenSettings;
        var list = root.getBaseData().getOriginalDataList(cfg.originalDataIndex);

        for (i = 0; i < list.getCount(); i++) {
            var data = list.getData(i);
            var oc = data.getOriginalContent();
            var category = oc.getValue(5);

            if (category === categoryId) {
                var obj = this.createScrollbarObject(data);
                arr.push(obj);
            }
        }

        return arr;
    },

    checkFileExtension: function (name) {
        if (typeof name !== 'string') {
            return false;
        }
        var lenght = name.length;
        var a = name[length - 1] === 't';
        var b = name[length - 2] === 'x';
        var c = name[length - 3] === 't';
        var d = name[length - 4] === '.';

        if (a && b && c && d) {
            return true;
        }
        return false;
    },

    getImageName: function (textName) {
        var i;
        var clearName = '';

        for (i = 0; i < textName.length; i++) {
            var n = textName.slice(i, i + 1);
            if (i === '.') {
                break;
            }
            clearName += n;
        }

        return clearName;
    },

    completeFileExtension: function (name) {
        var i = 0;
        var arr = this.getImageFileExtensions();

        for (i = 0; i < arr.length; i++) {
            var checkName = name + arr[i];
            var checkImage = root.getMaterialManager().createImage(FotF_ExtraExtraScreenSettings.imageFolder, checkName);
            if (checkImage !== null) {
                return checkImage;
            }
        }

        return null;
    },

    getImageFileExtensions: function () {
        return ['.png', '.jpeg', '.bmp'];
    },

    createScrollbarObject: function (data) {
        var obj = createObject(FotF_ExtraExtraScreenObject);
        obj.setInfo(data);
        return obj;
    },

    _getPictureX: function (image, obj) {
        return this.getContentX() + obj.getImageOffsetX() + obj.getImageOffsetX();
    },

    _getPictureY: function (image, obj) {
        return this.getContentY() + obj.getImageOffsetY() + obj.getImageOffsetY();
    }
});

var FotF_ExtraExtraScreenObject = defineObject(BaseObject, {
    _name: null,
    _formalName: null,
    _textArray: null,
    _image: null,
    _iconHandle: null,
    _offsetX: null,
    _offsetY: null,
    _categoryId: null,

    setInfo: function (originalData) {
        this._name = originalData.getName();
        this._formalName = originalData.getDescription();
        this._textArray = originalData.custom.extraScreenText;
        if (typeof this._textArray === 'undefined') {
            this._textArray = [];
        }
        var useImage = originalData.getOriginalContent().getValue(0);
        var runTime = originalData.getOriginalContent().getValue(1);
        if (runTime == true) {
            var isRuntime = true;
        } else {
            var isRuntime = false;
        }
        var id = originalData.getOriginalContent().getValue(2);
        var list = root.getBaseData().getGraphicsResourceList(GraphicsType.PICTURE, isRuntime);
        if (useImage == true) {
            this._image = list.getCollectionDataFromId(id, 0);
        }
        this._iconHandle = originalData.getIconResourceHandle();
        this._offsetX = originalData.getOriginalContent().getValue(3);
        this._offsetY = originalData.getOriginalContent().getValue(4);
        this._categoryId = originalData.getOriginalContent().getValue(5);
    },

    isPageEnabled: function (index) {
        return true;
    },

    getName: function () {
        return this._name;
    },

    getFormalName: function () {
        return this._formalName;
    },

    getIconResourceHandle: function () {
        return this._iconHandle;
    },

    getPictureImage: function () {
        return this._image;
    },

    getImageOffsetX: function () {
        return this._offsetX;
    },

    getImageOffsetY: function () {
        return this._offsetY;
    },

    getPageCount: function () {
        return this._textArray.length;
    },

    getPageText: function (index) {
        return this._textArray[index];
    },

    getCategoryId: function () {
        return this._categoryId;
    }
});

var FotF_StoryDataChanger = defineObject(BaseObject, {
    _pageChanger: null,
    _data: null,
    _funcCondition: null,
    _isMultiPage: false,
    xRendering: 0,
    yRendering: 0,

    initialize: function () {
        this._pageChanger = createObject(HorizontalPageChanger);
    },

    setPageData: function (width, height) {
        this._pageChanger.setPageData(this.getTruePageCount(), width, height);
    },

    setCurrentData: function (data) {
        this._data = data;
    },

    setConditionData: function (isMultiPage, funcCondition) {
        this._isMultiPage = isMultiPage;
        this._funcCondition = funcCondition;
    },

    movePage: function () {
        return this._pageChanger.movePage();
    },

    checkPage: function () {
        var index = this._getPressedIndex();

        if (index !== -1) {
            this._pageChanger.setPageIndex(index);
            return true;
        }

        return this._pageChanger.checkPage();
    },

    drawPage: function (x, y) {
        this._pageChanger.drawPage(x, y);
    },

    drawPageNumber: function (x, y) {
        var i, colorIndex;
        var count = this.getTruePageCount();
        var index = this._pageChanger.getPageIndex();

        if (count === 1 || !this._isMultiPage) {
            return;
        }

        this.xRendering = x;
        this.yRendering = y;

        for (i = count - 1; i >= 0; i--) {
            if (i === index) {
                colorIndex = 0;
            } else {
                colorIndex = 4;
            }

            NumberRenderer.drawNumberColor(x, y, i + 1, colorIndex, 255);
            x -= 22;
        }
    },

    getTruePageIndex: function () {
        var i;
        var count = this._data.getPageCount();
        var n = 0;
        var index = this._pageChanger.getPageIndex();

        if (this._isMultiPage) {
            for (i = 0; i < count; i++) {
                if (this._isPageEnabled(this._data, i)) {
                    if (index === n) {
                        index = i;
                        break;
                    }
                    n++;
                }
            }
        } else {
            // Refer to the final page.
            for (i = 0; i < count; i++) {
                if (this._isPageEnabled(this._data, i)) {
                    index = i;
                }
            }
        }

        return index;
    },

    getTruePageCount: function () {
        var i;
        var count = this._data.getPageCount();
        var n = 0;

        if (!this._isMultiPage) {
            return 1;
        }

        for (i = 0; i < count; i++) {
            if (this._isPageEnabled(this._data, i)) {
                n++;
            }
        }

        return n;
    },

    _getPressedIndex: function () {
        var i, range;
        var dx = 0;
        var count = this.getTruePageCount();
        var width = UIFormat.NUMBER_WIDTH / 10;
        var height = UIFormat.NUMBER_HEIGHT / 5;

        if (count === 1 || !this._isMultiPage) {
            return -1;
        }

        for (i = count - 1; i >= 0; i--) {
            range = createRangeObject(this.xRendering + dx, this.yRendering, width, height);
            if (MouseControl.isRangePressed(range)) {
                return i;
            }

            dx -= 22;
        }

        return -1;
    },

    _isPageEnabled: function (object, index) {
        return root.getStoryPreference().isTestPlayPublic() || this._funcCondition(object, index);
    }
});

/////////////////////////////////////////////////////////////////////////////
/////		            TEXT CONTROL FOR LINE BREAKS                    /////
/////////////////////////////////////////////////////////////////////////////

var FotF_TextControl = {
    convertTextToLineArray: function (text, font, maxLength, removeSpaces) {
        if (typeof text !== 'string') {
            return [];
        }

        var i;
        var line = '';
        var lastIndex = 0;
        var arr = [];
        for (i = 0; i < text.length; i++) {
            var n = text.slice(i, i + 1);
            line += n;
            if (removeSpaces && i === 0 && n === ' ') {
                line = line.slice(0);
                text = text.slice(0);
            }
            if (TextRenderer.getTextWidth(line, font) < maxLength && this.isLineBreakChar(n)) {
                lastIndex = i;
            } else if (TextRenderer.getTextWidth(line, font) > maxLength) {
                if (lastIndex === 0) {
                    lastIndex = i;
                }
                line = line.slice(0, lastIndex);
                arr.push(line);
                text = text.slice(lastIndex);
                lastIndex = 0;
                i = 0;
                line = '';
            } else if (TextRenderer.getTextWidth(text, font) <= maxLength) {
                var spaceCheck = text.slice(0, 1);
                if (removeSpaces && spaceCheck === ' ') {
                    text = text.slice(1);
                }
                arr.push(text);
                break;
            }
        }

        //Sometimes a last word can still be left
        if (text.length !== 0 && text !== arr[arr.length - 1]) {
            var spaceCheck = text.slice(0, 1);
            if (removeSpaces && spaceCheck === ' ') {
                text = text.slice(1);
            }
            arr.push(text);
        }

        return arr;
    },

    convertLineArrayToLineBreakText: function (array) {
        var i;
        var text = '';

        for (i = 0; i < array.length; i++) {
            var line = array[i];
            line += '\n';
            text += line;
        }

        return text;
    },

    isLineBreakChar: function (char) {
        arr = this.getLineBreakCharacters();
        if (arr.indexOf(char) > -1) {
            return true;
        }
        return false;
    },

    getLineBreakCharacters: function () {
        return [' ', '.', ':', ',', '-'];
    }
};
