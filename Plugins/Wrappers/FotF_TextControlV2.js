/////////////////////////////////////////////////////////////////////////////
/////		            TEXT CONTROL FOR LINE BREAKS                    /////
/////////////////////////////////////////////////////////////////////////////

var FotF_TextControlV2 = {
    insertLineBreaks: function (text, font, maxLength) {
        var arr = this.convertTextToLineArray(text, font, maxLength);
        arr = arr.join('/\n/');

        return arr;
    },

    convertTextToLineArray: function (text, font, maxLength) {
        if (typeof text !== 'string' || text.length === 0) {
            return [];
        }
        var i;
        var line = '';
        var word;
        var length = 0;
        var arr = [];
        var lineArr = [];
        var wordArr = text.split(' ');

        for (i = 0; i < wordArr.length; i++) {
            length = TextRenderer.getTextWidth(line, font);

            if (length > maxLength && typeof word === 'string') {
                wordArr.unshift(word);
                lineArr.pop();
                arr.push(lineArr.join(''));
                line = '';
                lineArr = [];
            }

            word = wordArr[i] + ' ';
            line += word;
            lineArr.push(word);
        }

        //Last line may exist, so push it as well
        var restText = lineArr.join('');
        var restLength = TextRenderer.getTextWidth(restText, font);
        if (restLength > maxLength) {
            var line2 = lineArr[lineArr.length - 1];
            lineArr.pop();
            var line1 = lineArr.join('');
            arr.push(line1);
            arr.push(line2);
        } else {
            arr.push(restText);
        }

        return arr;
    },

    //This function is slightly superior in text separation, but slow as fuck to the point it lags out when switching units
    //I leave this here in case it's needed for some weird edge cases
    /*
    convertTextToLineArray: function (text, font, maxLength, removeSpaces, removeLineBreaks) {
        var i;
        var line = '';
        var lastIndex = 0;
        var arr = [];

        for (i = 0; i < text.length; i++) {
            var n = text.charAt(i);
            if (!removeLineBreaks && n === '\n') {
                arr.push(line);
                continue;
            }
            line += n;
            if (removeSpaces && i === 0 && n === ' ') {
                line = line.slice(0);
                text = text.slice(0);
            }
            var width = TextRenderer.getTextWidth(line, font);
            if (width < maxLength && this.isLineBreakChar(n)) {
                lastIndex = i;
            } else if (width > maxLength) {
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
                var spaceCheck = text.charAt(0);
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
    */

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

    splitWord: function (text, font, maxLength) {
        var i = 0;
        var line = '';
        var obj = {
            split: '',
            rest: ''
        };

        var width = TextRenderer.getTextWidth(text, font);

        while (width < maxLength) {
            line += text.charAt(i);
            width = TextRenderer.getTextWidth(line);
            i++;
        }

        obj.split = line;
        obj.rest = text.slice(i);

        return obj;
    },

    isLineBreakChar: function (char) {
        arr = this.getLineBreakCharacters();
        if (arr.indexOf(char) > -1) {
            return true;
        }
        return false;
    },

    getLineBreakCharacters: function () {
        return [' ', '-'];
    },

    shortenText: function (text, font, maxWidth) {
        var i;

        if (typeof text !== 'string') {
            return '';
        }

        var width = TextRenderer.getTextWidth(text, font);

        while (width > maxWidth) {
            text = text.slice(0, text.length - 1);
            width = TextRenderer.getTextWidth(text, font);
        }

        return text;
    }
};
