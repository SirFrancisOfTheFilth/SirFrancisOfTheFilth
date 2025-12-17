/*
Original script by unknown creator

FotF changes:	Limited the animation to only the title screen. Previously
				this affected all scroll backgrounds in the game. Also
				created a custom scroll background object for this and
				improved the logic a bit.
*/

/*--------------------------------------------------------------------------
								SETTINGS
--------------------------------------------------------------------------*/

var FotF_TitleAnimationSettings = {
	frameSpeed: 1, //Time (in frames) a single image is shown
	materialFolder: "title", //Material folder name
	//Image names in animation order
	materialPics: [
		"ti00.png",
		"ti01.png",
		"ti02.png",
		"ti03.png",
		"ti04.png",
		"ti05.png",
		"ti06.png",
		"ti07.png",
		"ti08.png",
		"ti09.png",
		"ti10.png",
		"ti11.png",
		"ti12.png",
		"ti13.png",
		"ti14.png",
		"ti15.png",
		"ti16.png",
		"ti17.png",
		"ti18.png",
		"ti19.png",
		"ti20.png"
	]
};

(function () {
	var FotF_ChangeTitleScrollBG = TitleScene._prepareSceneMemberData;
	TitleScene._prepareSceneMemberData = function () {
		FotF_ChangeTitleScrollBG.call(this);
		this._scrollBackground = createObject(FotF_TitleAnimeScrollBG);
	};
	/*
	var alias_ScrollBackground_initialize = ScrollBackground.initialize;
	ScrollBackground.initialize = function () {
		// root.log('ScrollBackground.initialize');

		alias_ScrollBackground_initialize.call(this);
		this._counter.setCounterInfo(COUNTER_INFO);
		this._titleIndex = 0;
	};

	ScrollBackground.moveScrollBackground = function () {
		if (this._counter.moveCycleCounter() === MoveResult.CONTINUE && this._counter.getCounter() % COUNTER_INFO === 0) {
			this._titleIndex++;
			if (this._titleIndex >= MATERIAL_PIC_NAMES.length) {
				this._titleIndex = 0;
			}
			return MoveResult.CONTINUE;
		}
		return MoveResult.CONTINUE;
	};

	ScrollBackground.drawScrollBackground = function () {
		var pic = getBackgroundPic(this._titleIndex);
		pic.drawStretchParts(0, 0, root.getGameAreaWidth(), root.getGameAreaHeight(), this._xScroll, this._yScroll, pic.getWidth(), pic.getHeight());
	};

	// 逐个加载标题背景图片
	var getBackgroundPic = function (index) {
		//root.log(index);

		var pic = picArr[index];
		if (typeof pic === "undefined") {
			pic = root.getMaterialManager().createImage(MATERIAL_FOLDER_NAMES, MATERIAL_PIC_NAMES[index]);
			picArr.push(pic);
		}
		return pic;
	};
	*/
})();

var FotF_TitleAnimeScrollBG = defineObject(ScrollBackground, {
	_titleIndex: 0,
	_picArr: null,

	initialize: function () {
		var cfg = FotF_TitleAnimationSettings;
		this._counter = createObject(CycleCounter);
		this._counter.setCounterInfo(cfg.frameSpeed);
		this._titleIndex = 0;
		this._picArr = [];
	},

	moveScrollBackground: function () {
		var cfg = FotF_TitleAnimationSettings;

		if (this._counter.moveCycleCounter() === MoveResult.CONTINUE && this._counter.getCounter() % cfg.frameSpeed === 0) {
			this._titleIndex++;
			if (this._titleIndex >= cfg.materialPics.length) {
				this._titleIndex = 0;
			}
			return MoveResult.CONTINUE;
		}
		return MoveResult.CONTINUE;
	},

	drawScrollBackground: function () {
		var pic = this.getBackgroundPic(this._titleIndex);

		if (pic !== null) {
			pic.drawStretchParts(0, 0, root.getGameAreaWidth(), root.getGameAreaHeight(), this._xScroll, this._yScroll, pic.getWidth(), pic.getHeight());
		}
	},

	getBackgroundPic: function (index) {
		var cfg = FotF_TitleAnimationSettings;
		var pic = this._picArr[index];

		if (typeof pic === "undefined") {
			pic = root.getMaterialManager().createImage(cfg.materialFolder, cfg.materialPics[index]);
			this._picArr.push(pic);
		}

		return pic;
	}
});
