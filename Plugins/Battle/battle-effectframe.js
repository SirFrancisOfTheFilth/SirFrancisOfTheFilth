/*--------------------------------------------------------------------------
  
  リアルバトルのモーションの任意のフレームで特定のエフェクトを再生します。
  
  使用方法:
  フレームのカスタムパラメータに
  {ef:{id:0, isRuntime: true, isCutin: false, isAsync: false}}
  のように設定します。
  isRuntime、isCutin、isAsyncは省略可能です。
  isAsync: trueが設定されている場合、エフェクトが再生している間、モーションの動きは停止しません。
  
  作成者:
  サファイアソフト
  https://srpgstudio.com/
  
  更新履歴:
  2022/07/01 公開


    2026/01/02: Changes by Sir Francis of the Filth:

    Instead of a single object, specify an array [obj, obj, ...] of objects.
    This allows you to set multiple effects at once. Also setting a new effect
    won't end previous effects.
    Example:

    {
        ef: [
            {id:0, isRuntime: true, isCutin: false, isAsync: false},
            {id:0, isRuntime: true, isCutin: false, isAsync: false},
            {id:0, isRuntime: true, isCutin: false, isAsync: false}
        ]
    }
  
--------------------------------------------------------------------------*/

(function () {
    var alias1 = BaseBattler.setupRealBattler;
    BaseBattler.setupRealBattler = function (motionParam, isSrc, realBattle) {
        this._effectFrameArray = [];
        this._checkedFrameIndex = null;
        alias1.call(this, motionParam, isSrc, realBattle);
    };

    BaseBattler._startNextFrame = function () {
        this._checkEffectFrame();

        if (this._effectFrameArray !== null && this._effectFrameArray.length > 0) {
            return this._checkEffectFrameEnd();
        }

        return true;
    };

    BaseBattler._checkEffectFrame = function () {
        var pos, i;

        if (this._checkedFrameIndex === this._motion._frameIndex) {
            return;
        } else {
            this._checkedFrameIndex = this._motion._frameIndex;
        }

        var custom = this._motion._animeData.getFrameCustom(this._motion._motionId, this._motion._frameIndex);
        var arr = getAnimeArray(custom);

        for (i = 0; i < arr.length; i++) {
            var anime = arr[i][0];

            if (anime === null) {
                return null;
            }

            if (arr[i][1]) {
                pos = getCutinPos(anime, this._realBattle);
            } else {
                pos = this._realBattle.getActiveBattler().getEffectPos(anime);
            }

            var effect = this._realBattle.createEffect(anime, pos.x, pos.y, MagicBattler._isMagicEffectRight.call(this, anime), false);

            if (arr[i][2]) {
                effect.setAsync(true);
            }

            this._effectFrameArray.push(effect);
        }
    };

    BaseBattler._checkEffectFrameEnd = function () {
        var i;
        var doneCount = 0;

        for (i = 0; i < this._effectFrameArray.length; i++) {
            var effect = this._effectFrameArray[i];
            if (effect === null || effect.isEffectLast()) {
                this._effectFrameArray.splice(i, 1);
            }

            if (effect !== null && effect.isAsync()) {
                doneCount++;
            }
        }

        if (this._effectFrameArray.length === 0 || doneCount >= this._effectFrameArray.length) {
            return true;
        }

        return false;
    };

    function getCutinPos(anime, battleObject) {
        var area = battleObject.getBattleArea();
        var size = Miscellaneous.getFirstKeySpriteSize(anime, 0);
        var x = Math.floor(area.width / 2) - Math.floor(size.width / 2);
        var y = Math.floor(area.height / 2) - Math.floor(size.height / 2);
        var pos = createPos(x, y);

        pos.x += battleObject.getAutoScroll().getScrollX();

        return pos;
    }

    function getAnimeArray(custom) {
        var list, effect, i;
        var arr = [];
        var obj = custom.ef;

        if (typeof obj !== 'object' || typeof obj.length !== 'number') {
            return [];
        }

        for (i = 0; i < obj.length; i++) {
            var data = obj[i];

            if (typeof data === 'undefined' || typeof data.id !== 'number') {
                continue;
            }

            list = root.getBaseData().getEffectAnimationList(isRuntime(data) ? true : false);
            effect = list.getDataFromId(data.id);
            arr.push([effect, isCutin(data), isAsync(data)]);
        }

        return arr;
    }

    function isRuntime(data) {
        if (typeof data.isRuntime === 'undefined') {
            return false;
        }

        return data.isRuntime;
    }

    function isCutin(data) {
        if (typeof data.isCutin === 'undefined') {
            return false;
        }

        return data.isCutin;
    }

    function isAsync(data) {
        if (typeof data.isAsync === 'undefined') {
            return false;
        }

        return data.isAsync;
    }
})();
