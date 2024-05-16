/*--------------------------------------------------------------------------
This plugin gives you unlimited power over SRPG Studio's 2-Layer Mapchip system!

Ever wanted to overlay a transparent mapchip with another transparent mapchip?
SRPG Studio won't let you do that, as it overwrites the first with the second one.
But with this plugin, exactly this and so much more is possible now!
And it even works with the Third Layer plugin! (My version at least)

___________________________________________________________________________
So how does it work?
___________________________________________________________________________

First things first. Download my Layer Renderer plugin (FotF_LayerRenderer.js)
and put it in your Plugin folder alongside this plugin.
Without it this plugin will not work.

There are 3 ways to set this up, each with their own advantages and disadvantages,
so choose depending on what you want to achieve. All 3 methods can be used in
combination.

1. 	By far the easiest way is to use the export/import feature. This allows you
	to export the information inside a "dummy map" to a file and re-import the
	information from the file to another map.
	
	Pro: Fairly easy to use, saves lots of time, especially with many tiles
	Con: While the files themselves and the imported arrays can be manipulated
		 during the running game, it's hard to keep track of

		 
2.	If you just want a few additional tiles (under 10 maybe) and maybe you
	already have experience with this plugin, you can just specify the tiles
	manually inside the map's custom parameters.
	
	Pro: Straightforward if you know what you're doing
	Con: Very tedious and time-consuming, depending on number of tiles
	
	
3.	If you want to add/hide tiles during the game, there are functions for
	this. You can run them through the execute script event command.
	
	Pro: Dynamically alter the additional layers
	Con: Hard to find the tile's index
	
	
Rendering order:	For convenience and to reduce load, all specified tiles
					from all 3 methods are collected in a single array. this
					means there is a rendering order to all of this. Whatever
					is rendered last, will be "on top" of what was rendered
					on that tile before.
					The rendering order for the methods is 1 > 2 > 3, so
					Layer 3 takes precedence over 2, and 2 over 1.
	
All of these methods are explained in detail below.

___________________________________________________________________________
I'm lazy, how do I use the export/import feature?
___________________________________________________________________________

This makes use of the writeTestFile() function of the SRPG Studio API, so it
will only export in test play. It is best to create a new map and place all
the tiles to be processed on that map for every layer you want to add. So if
you want to add 3 additional layers, create 3 new maps with the same size as
the map you want to use these layers on.

Now place all the tiles you want in the first of the 3 layers on the first map.			<--- 	The function will recognize if the mapchip is opaque or an ornament.
Choose 1 specific mapchip (tile) you want the function to ignore. This can be					Ornaments above "ignored" opaque tiles are processed of course.
any tile, as long as you know the ID of it's mapchip file and it's coordinates
within said file (xSrc and ySrc). So for every tile you don't want the function
to record, place down the "ignored" tile. For this example we'll just use the
default grass tile of the RTP mapchip file with ID:0.

Now that you have your first "layer map", you just need an opening event on
it, in which you execute the function

FotF_ExportLayerMap(ignoreIsRuntime, ignoreID, ignoreXSrc, ignoreYSrc);					<---	ignoreIsRuntime: If the ignored tile is part of the runtime package of SRPG Studio. 0(false) --> original / 1(true) --> RTP
																								ignoreID: ID of the mapchip file containing the ignored tile. Specify "null" to not ignore any tiles.
through Execute Script > Execute Code.															ignoreXSrc: xSrc of the ignored tile within its file. Specify "null" to not ignore any tiles.
																								ignoreYSrc: ySrc of the ignored tile within its file. Specify "null" to not ignore any tiles.

An example for using this function to ignore the default grass tiles would be:

FotF_ExportLayerMap(true, 0, 0, 0);
																								
Upon starting the map in test play now, a file named "srpg_log.txt" will be
generated inside your project folder (the one with the game.srpgs file inside).
This file contains the layer information to be used with the rendering function
of this plugin.

Warning: 	There is no way to specify the name of the .txt file, so every time
			you execute the command (in this case start the layer map), the old
			log file is overwritten. It is advised to move the output file into
			a different folder or to rename it, to prevent this from happening.
			
Once you have generated a layer file, rename it however you like (keeping the
.txt extension of course) and put it into the FotF_UnlimitedLayers folder inside
of your Material folder.

So let's say you named the file "Layer1.txt" and created 2 more layer files the
same way, "Layer2.txt" and "Layer3.txt". The last step would now be to go into
the map custom parameters of the map you want to render this layer on and specify:

{
importLayer:[['Layer1.txt'], ['Layer2.txt']],											<---	This will render Layer2 over Layer1 under units and additional layer tiles added in manually, but over normal mapchips.
importThirdLayer:[['Layer3.txt']]														<---	This will render Layer3 above everything else, including units and the third layer rendered by FotF_ThirdLayer.js.
}

as parameters. Remember: Custom parameters need to be separated by a comma (,).
The apostrophes around the file names are intentional and needed, as they are
converted to strings this way.

___________________________________________________________________________
I don't trust your weird automatic export function, I wanna do it manually!
___________________________________________________________________________

Fair. But it's just so convenient :)

In the map's custom parameters, specify an array of arrays like this:

{
addLayer:[
[isRuntime, id, xSrc, ySrc, xDest, yDest],
[isRuntime, id, xSrc, ySrc, xDest, yDest],
[isRuntime, id, xSrc, ySrc, xDest, yDest],
...
]
}

isRuntime: 		Whether you want to draw an RTP (Runtime) Mapchip or an original one					Visual guide to xSrc & ySrc:
				RTP --> true	Original --> false
				
id:				The ID of the mapchip image file containing the mapchip you want to draw
																										0/0		1/0		2/0		3/0		...
xSrc & ySrc:	The X- and Y-Coordinates of the mapchip within the mapchip file. So the					0/1		1/1		2/1		3/1		...
				third mapchip in the second row would have 2 for xSrc and 1 for ySrc.					0/2		1/2		2/2		3/2		...
																										...		...		...		...		...
xDest & yDest:	Same principle as xSrc and ySrc, but these describe the target coordinates
				to which the mapchip will be drawn on the map.
				
To render the tiles above units (as in the Third Layer plugin), use addThirdLayer
instead of addLayer. This can be used instead of or in conjunction with my version of
the third layer plugin (FotF_ThirdLayer v3.js). Third layer tiles rendered by this plugin
will be rendered above ones rendered with the third layer plugin.

Example:

You want to render 3 mapchips above the already existing terrain. Mapchip 1 is an RTP
mapchip, 2 & 3 are original. Also mapchip 3 is to be rendered above units.
In the map's custom parameters you would add:

{
addLayer:[
[true, 60, 3, 2, 4, 4],			<-- Comma after array because it is not the last			<-- This will render mapchip 1 (which is the open blue chest of the RTP Ornaments) to the position 4/4 on the map
[false, 7, 4, 10, 4, 4]			<-- No comma after array because it is the last				<-- This will render mapchip 2 (which is the 5th mapchip in the 11th row of the original mapchip file with id 7) to the position 4/4 on the map
]

addThirdLayer:[
[false, 3, 0, 0, 4, 4]																		<-- This will render mapchip 3 (which is the 1st mapchip in the 1st row of the original mapchip file with id 3) to the position 4/4 on the map, above units
]
}

Notice anything? All 3 mapchips will be rendered to the same position.
And they will all be rendered above another! No replacing!
You could for example render a potion above the open chest and a symbol
above everything (including the unit standing on the tile).

___________________________________________________________________________
I want to add more tiles through events!
___________________________________________________________________________

That's possible too!

To follow up on our example, let's say you want to render a 4th mapchip during
play with the use of an event command. You are now familiar with the information
you have to give the plugin: isRuntime, id, xSrc, ySrc, xDest, yDest

Simply use the functions:

FotF_PushAdditionalLayerTile(isRuntime, id, xSrc, ySrc, xDest, yDest);

or

FotF_PushAdditionalThirdLayerTile(isRuntime, id, xSrc, ySrc, xDest, yDest);

These functions add given data at the end of the render array. If you want to
disable tiles added through this method, you have to know their index
(position in the array).
In this example, as we have 3 tiles in our map's custom parameters and 1 added
later, this tile's index would be 3 (4-1).

___________________________________________________________________________
That's cool, but what if I want to erase the additional mapchips?
___________________________________________________________________________

Don't worry, I got you. To erase a specific additional mapchip, first determine
2 things:

1. Is it a normal mapchip (rendered under units) or a third layer mapchip (rendered above units)?
2. Which position is it at inside the respective custom parameter array?

Number 1 determines if we use the function FotF_DisableAdditionalLayer(index) for normal
mapchips or FotF_DisableAdditionalThirdLayer(index) for third layer mapchips.

Number 2 determines which mapchip is to be erased. For this you take the arrays from the
imported layer maps, your map's custom parameters and the additionally added tiles through
execute script events (in this order) and combine them into a large array.
(Don't actually do that, just imagine it or write it down somewhere lol)
Now find the mapchip you want to erase. Then count at which position your mapchip's array is in
the combined array and subtract 1 from that number (because arrays start at 0).

So if for example we want mapchip 2 & 3 from our previous example erased, we
would run the functions

FotF_DisableAdditionalLayer(1);

and

FotF_DisableAdditionalThirdLayer(0);

through the Execute Script > Execute Code event command.

Be aware that finding the index of a tile can get very hard, especially if you're
using the export/import feature, as you probably have dozens or even hundreds of
tiles in the combined array. Remember: There is a rendering order. The first items
in the array will be the tiles added through import, then those added through
manual addition and finally those added in-game through execute script functions.

___________________________________________________________________________
So now they are gone, but I want them back!
___________________________________________________________________________

Also possible!

See, they are not erased from the array, only not allowed to be rendered.
To re-enable a specific mapchip that has been disabled, run the function
FotF_EnableAdditionalLayer(index) for normal mapchips or 
FotF_EnableAdditionalThirdLayer(index) for third layer mapchips.
They work the same as the functions to disable mapchips.

Let's say you want mapchips 2 & 3 from our example back after you disabled
them previously. You would simply run the functions

FotF_EnableAdditionalLayer(1);

and

FotF_EnableAdditionalThirdLayer(0);

through the Execute Script > Execute Code event command.
The index of a tile doesn't change if you disable it, so the index needed for
re-enabling it is always the same as it is for disabling.

___________________________________________________________________________
I want to draw animated mapchips with this.
___________________________________________________________________________

And you sure can. There are some limitations though.
To ensure not lagging out the game, compatible animated mapchips are cached.
For this reason, only certain combinations of frame count and looping order
can be drawn that way.

Supported frame counts for repeating order (1 -> 2 -> 3 -> 1):
2,3,4,6 and 12 frames

Supported frame counts for ascending/descending order (1 -> 2 -> 3 -> 2 -> 1):
2,3,4 and 7 frames

If your animated mapchips falls under these specifications: Great! Use:

FotF_PushAdditionalAnimeTile(isRuntime, id, xSrc, ySrc, xDest, yDest, count, mode, isThird);				<-- count means frame count (e.g. 3 for 3-frame animations)
																												mode is true for repeating order and false for ascending/descending order
																												isThird is true if it should be drawn into the third layer, false otherwise
																												
For example

FotF_PushAdditionalAnimeTile(false, 17, 0, 1, 25, 6, 4, true, false);

will render the mapchip at position 0/1 inside the original mapchip file with ID 17 to the
map coordinates 25/6. The animation will be 4 frames long (so the 3 mapchips under the original
one will also be used too, just like normally) and loop 1 --> 2 --> 3 --> 4 --> 1.
It will not be rendered to the third layer, but under units.

Now if your animations don't follow aforementioned specifications (for example if
they have 5 frames), use this function:

FotF_PushAdditionalAnimeTileAsync(isRuntime, id, xSrc, ySrc, xDest, yDest, count, start, mode, isThird);	<-- start is the starting frame of the mapchip (normally 0).

It works exactly the same as the previous one, except you additionally need to set
the starting frame, which normally should be 0.

Use the second function sparingly, because these are not cached and drawing
too many WILL lag out your game.


___________________________________________________________________________
Now how do I remove animated mapchips?
___________________________________________________________________________

As with disabling non-animated mapchips, you need to know the index of the
tile you want removed. Then just use

FotF_DeleteAdditionalAnimeTile(index, isThird);																

or

FotF_DeleteAdditionalAnimeTileAsync(index, isThird)

Here it's important if you are dealing with a cached tile (created by using
FotF_PushAdditionalAnimeTile) or a asynchronous tile (FotF_PushAdditionalAnimeTileAsync).
Also you need to specify if it's a third layer tile or not.
Index is determined by the order in which you created the animated mapchips of a certain
type.
This step can be hard to understand, so I suggest playing the sample project as
it is explained there in detail.

Note: Normal layer and third layer are split here, so for determining the index
for a normal tile, ignore third layer tiles and vice versa.
___________________________________________________________________________
Is this synchronized with the transparency of the third layer plugin?
___________________________________________________________________________

Yes it is. If it is not for you, set SynchronizeThirdLayers in the Layer Renderer
settings to true. Conversely, if you never want the additional third layer to
have transparency, set it to false.

For performance reasons, animated mapchips drawn with this plugin are not
subject of this behaviour.

___________________________________________________________________________
Sidenote about additional third layer tiles above already existing third layer tiles
___________________________________________________________________________

Third layer tiles will always be rendered above all other tiles. That means to render
a tile above a third layer tile, it has to be third layer too. This means you have
to use addThirdLayer in the custom parameters.

___________________________________________________________________________
Weird or funny stuff about this plugin
___________________________________________________________________________

When specifying coordinates (xSrc/ySrc or xDest/yDest), it's possible to use
decimal values like 3.5 for expample. So if you specified 3.5/10 for xDest/yDest
your tile would end up between x = 3 and x = 4.
Make sure the value you use multiplied with your mapchip size (default 32x32)
results in a whole number though, or you get an error.

So for 32x32 graphics you could use 0.5; 0.25; 0.125; 0.0625 and 0.03125
and shift your source/rendering coordinates by 16; 8; 4; 2 or 1 pixels


If you have any questions about this unnecessarily complex plugin, feel free to
reach out to me over the SRPG Studio Univerity Discord server @francisofthefilth


Original Plugin Author:
Francis of the Filth
  
Plugin History:
2023/12/03
Released

2023/12/13
Fixed stationary units being covered by non-third layer tiles during movement of
other units.

2024/01/07
Fixed a whole lot of other bugs (I can't remember all of them °-°).

2024/02/02
Added functions FotF_PushAdditionalLayerTile and FotF_PushAdditionalThirdLayerTile.
These can be used in Execute Script > Exexute Code to add additional tiles.

Added a see-through function for additional third layer tiles. This function can
be turned on and off by a global switch.

2024/03/07
Removed see-through function (it just looks so weird), will synchronize this with
the new third layer transparency at a later date.

Added import/export of "layer map" files. Just run a function on a map to export
it as a layer and import it into another map. Can specify tiles to be ignored.

2024/03/17
Animated mapchips are now supported. Added functions to add/remove them.

Synchronization with third layer transparency now possible.

2024/03/25
Fixed a bug regarding the custom save objects for additional arrays which
could lead to all kinds of janky behaviour and crashes under certain
conditions.

Fixed FotF_ExportLayerMap only accepting numbers for the first parameter, not
booleans. Both can be used now.

Fixed a minor inconvenience with import arrays reverting to standard every
tick if one of them was null. This should only happen once for every one of
them now.

2024/05/05
Reworked some of the instructions (added examples, more detailed instructions)

--------------------------------------------------------------------------*/

FotF_LayerRendererConstants.EnableUnlimitedLayers = true											//So FotF_LayerRenderer.js knows it has to render the additional layers, set to false to disable additional layer rendering
var additionalLayerCache = null;
var additionalThirdLayerCache = null;
var FotF_ImportArray = null;
var FotF_ImportArrayThird = null;
var addThirdLayerIndexArray = null;
var addThirdLayerCutArray = null;
var additionalCutOutCache = null;
var FotF_AdditionalAnimeArray1 = null;
var FotF_AdditionalAnimeArray2 = null;
var FotF_AsyncAnimeArray1 = null;
var FotF_AsyncAnimeArray2 = null;
var FotF_blockAnime = null;
var FotF_AnimeCounter = null;
var FotF_AnimeCacheArray = null;
var FotF_DisableAdditionalCacheCreation = null;


(function () {

	//Clears the cutout caches at the end of unit movement
	var FotF_ResetAdditionalLayerCache = SimulateMove._endMove;
	SimulateMove._endMove = function(unit) {
		FotF_ResetAdditionalLayerCache.call(this, unit);
		
		if (additionalLayerCache !== null) {
			additionalLayerCache = null;
			//root.log('additionalLayerCache reset');
		}
		if (additionalThirdLayerCache !== null) {
			additionalThirdLayerCache = null;
			//root.log('additionalThirdLayerCache reset');
		}
		if (additionalCutOutCache !== null) {
			additionalCutOutCache = null;
		}
		
		FotF_LayerRendererConstants.unlimitedLayersIndexArray = [];
		FotF_LayerRendererConstants.ULCutOutIndexArray = [];
	};

	//Clears the cutout caches when canceling unit movement
	var FotF_ResetAdditionalLayerCache2 = PlayerTurn.setPosValue;
	PlayerTurn.setPosValue = function(unit) {
		FotF_ResetAdditionalLayerCache2.call(this, unit);
		
		if (additionalLayerCache !== null) {
			additionalLayerCache = null;
			//root.log('additionalLayerCache reset');
		}
		if (additionalThirdLayerCache !== null) {
			additionalThirdLayerCache = null;
			//root.log('additionalThirdLayerCache reset');
		}
		if (additionalCutOutCache !== null) {
			additionalCutOutCache = null;
		}
		
		FotF_LayerRendererConstants.unlimitedLayersIndexArray = [];
		FotF_LayerRendererConstants.ULCutOutIndexArray = [];
	};
	
	//Initialization of the plugin's arrays, also checks if coconut isn't missing
	var FotF_PrepareMapLayerUnlimited = CurrentMap.prepareMap;//MapLayer.prepareMapLayer;
	/*MapLayer.prepareMapLayer*/CurrentMap.prepareMap = function () {
		FotF_PrepareMapLayerUnlimited.call(this);
		
		var coconutError = "Error: Shouldn't have removed the coconut"
		var coconut = root.getMaterialManager().createImage('FotF_UnlimitedLayers', 'Coconut - DO NOT REMOVE.png');
		
		if (coconut === null || typeof coconut === 'undefined') {
			root.getMaterialManager().soundPlay('FotF_UnlimitedLayers', 'lego-yoda-death-sound.mp3', 1);
			throw new Error(coconutError);
		}
		
		//var mapID = root.getCurrentSession().getCurrentMapInfo().getId();
		//root.log('mapID: ' + mapID);
		
		var extData = root.getExternalData();
		var manager = root.getLoadSaveManager();
		var saveIndex = extData.getActiveSaveFileIndex();
		var saveFileInfo = manager.getSaveFileInfo(saveIndex);
		//var saveMapID = saveFileInfo.getMapInfo().getId();
		//root.log('saveMapID: ' + saveMapID);
		//root.log('------------------------ ' + saveIndex);
		var saveObject = saveFileInfo.custom;
		
		if (FotF_DisableAdditionalCacheCreation !== true) {
			
				FotF_AdditionalLayerArray = []
				FotF_AdditionalThirdLayerArray = []
				FotF_DisableAdditionalLayerArray = []
				FotF_DisableAdditionalThirdLayerArray = []
				FotF_AdditionalAnimeArray1 = []
				FotF_AdditionalAnimeArray2 = []
				FotF_AsyncAnimeArray1 = []
				FotF_AsyncAnimeArray2 = []
				root.log('created empty arrays');
		}
		/*
		if (saveMapID !== mapID || typeof saveObject.addArr !== 'undefined' || saveObject.addArr === null) {
			FotF_AdditionalLayerArray = []
			root.log('created empty FotF_AdditionalLayerArray');
		} else {
			FotF_AdditionalLayerArray = saveObject.addArr
			root.log('loaded FotF_AdditionalLayerArray from saveObject');
		}
		
		if (typeof saveObject.addArr2 === 'undefined' ||saveObject.addArr2 === null) {
			FotF_AdditionalThirdLayerArray = []
			//root.log('created empty FotF_AdditionalThirdLayerArray');
		}
		
		if (typeof saveObject.disArr === 'undefined' || saveObject.disArr === null) {
			FotF_DisableAdditionalLayerArray = []
			//root.log('created empty FotF_DisableAdditionalLayerArray');
		}

		if (typeof saveObject.disArr2 === 'undefined' || saveObject.disArr2 === null) {
			FotF_DisableAdditionalThirdLayerArray = []
			//root.log('created empty FotF_DisableAdditionalThirdLayerArray');
		}
		
		if (typeof saveObject.animArr1 === 'undefined' || saveObject.animArr1 === null) {
			FotF_AdditionalAnimeArray1 = []
			//root.log('created empty FotF_AnimeCacheArray');
		}
		
		if (typeof saveObject.animArr2 === 'undefined' || saveObject.animArr2 === null) {
			FotF_AdditionalAnimeArray2 = []
			//root.log('created empty FotF_AnimeCacheArrayThird');
		}
		
		if (typeof saveObject.animArr3 === 'undefined' || saveObject.animArr3 === null) {
			FotF_AsyncAnimeArray1 = []
			//root.log('created empty FotF_AsyncAnimeArray1');
		}
		
		if (typeof saveObject.animArr4 === 'undefined' || saveObject.animArr4 === null) {
			FotF_AsyncAnimeArray2 = []
			//root.log('created empty FotF_AsyncAnimeArray2');
		}
		*/
		
		additionalLayerCache = null;
		additionalThirdLayerCache = null;
		additionalCutOutCache = null;
		FotF_LayerRendererConstants.blockThirdLayerCacheUL = false;
		FotF_blockAnime = false;
		FotF_AnimeCounter = 0;
		
		FotF_LayerRendererConstants.unlimitedLayersIndexArray = [];
		FotF_LayerRendererConstants.ULCutOutIndexArray = [];
		/*FotF_AdditionalAnimeArray1 = [];
		FotF_AdditionalAnimeArray2 = [];
		FotF_AsyncAnimeArray1 = [];
		FotF_AsyncAnimeArray2 = [];*/

		//root.log('Unlimited Layer Cache reset');
		
		FotF_DisableAdditionalCacheCreation = true;
	};
	
	//Loads saved arrays upon save file load
	FotF_InitializeLayerArrayChanges = LoadSaveScreen._executeLoad;
	LoadSaveScreen._executeLoad = function () {
		FotF_InitializeLayerArrayChanges.call(this);
		
		var extData = root.getExternalData();
		var manager = root.getLoadSaveManager();
		var saveIndex = extData.getActiveSaveFileIndex();
		var saveFileInfo = manager.getSaveFileInfo(saveIndex);
		//root.log('------------------------ ' + saveIndex);
		var saveObject = saveFileInfo.custom;
		
		if (typeof saveObject.addArr !== 'undefined' && saveObject.addArr !== null) {
			FotF_AdditionalLayerArray = saveObject.addArr
			//root.log('saved array loaded');
		} else {
			FotF_AdditionalLayerArray = [];
			//root.log('new array created');
		}
		
		if (typeof saveObject.addArr2 !== 'undefined' && saveObject.addArr2 !== null) {
			FotF_AdditionalThirdLayerArray = saveObject.addArr2
		} else {
			FotF_AdditionalThirdLayerArray = [];
		}
		
		if (typeof saveObject.disArr !== 'undefined' && saveObject.disArr !== null) {
			FotF_DisableAdditionalLayerArray = saveObject.disArr
		} else {
			FotF_DisableAdditionalLayerArray = []
		}

		if (typeof saveObject.disArr2 !== 'undefined' && saveObject.disArr2 !== null) {
			FotF_DisableAdditionalThirdLayerArray = saveObject.disArr2
		} else {
			FotF_DisableAdditionalThirdLayerArray = []
		}
		
		if (typeof saveObject.animArr1 !== 'undefined' && saveObject.animArr1 !== null) {
			FotF_AdditionalAnimeArray1 = saveObject.animArr1
		} else {
			FotF_AdditionalAnimeArray1 = []
		}
		
		if (typeof saveObject.animArr2 !== 'undefined' && saveObject.animArr2 !== null) {
			FotF_AdditionalAnimeArray2 = saveObject.animArr2
		} else {
			FotF_AdditionalAnimeArray2 = []
		}
		
		if (typeof saveObject.animArr3 !== 'undefined' && saveObject.animArr3 !== null) {
			FotF_AsyncAnimeArray1 = saveObject.animArr3
		} else {
			FotF_AsyncAnimeArray1 = []
		}
		
		if (typeof saveObject.animArr4 !== 'undefined' && saveObject.animArr4 !== null) {
			FotF_AsyncAnimeArray2 = saveObject.animArr4
		} else {
			FotF_AsyncAnimeArray2 = []
		}

		FotF_DisableAdditionalCacheCreation = true;
		root.log('loaded saved arrays');
	};
	
	//Imports layer map files
	var FotF_ImportLayerArrays = MapLayer.drawMapLayer;
	MapLayer.drawMapLayer = function () {
		FotF_ImportLayerArrays.call(this);
		
		var i;
		var session = root.getCurrentSession();
		
		if (FotF_ImportArray === null && session !== null) {
			
			var mapInfo = session.getCurrentMapInfo();
			
			if (mapInfo.custom.importLayer && mapInfo.custom.importLayer.length > 0) {
				var names = mapInfo.custom.importLayer;
			} else {
				var names = null;
			}
			
			FotF_ImportArray = []
			
			if (names !== null) {
				for (i = 0; i < names.length; i++) {
					var name = names[i]
					FotF_ImportArray = FotF_ImportArray.concat(FotF_ImportLayerMap(name));
				}
			}
			root.log('importLayer imported');
		}

		if (FotF_ImportArrayThird === null && session !== null) {
			
			var mapInfo = session.getCurrentMapInfo();
			
			if (mapInfo.custom.importThirdLayer && mapInfo.custom.importThirdLayer.length > 0) {
				var names2 = mapInfo.custom.importThirdLayer;
			} else {
				var names2 = null;
			}

			FotF_ImportArrayThird = []
			
			if (names2 !== null) {
				for (i = 0; i < names2.length; i++) {
					var name = names2[i]
					FotF_ImportArrayThird = FotF_ImportArrayThird.concat(FotF_ImportLayerMap(name));
				}
			}
			root.log('importThirdLayer imported');
		}
	};
	
	
	//Saves the layer arrays to the custom object of the save file
	var FotF_SaveLayerArrayChanges = LoadSaveScreen._getCustomObject;
	LoadSaveScreen._getCustomObject = function() {
			
		var obj = FotF_SaveLayerArrayChanges.call(this);
		
		if (typeof FotF_AdditionalLayerArray !== 'undefined' && FotF_AdditionalLayerArray.length !== 0) {
			obj.addArr = FotF_AdditionalLayerArray;
			//root.log('added array to object');
		}
		
		if (typeof FotF_AdditionalThirdLayerArray !== 'undefined' && FotF_AdditionalThirdLayerArray.length !== 0) {
			obj.addArr2 = FotF_AdditionalThirdLayerArray;
		}
		
		if (typeof FotF_DisableAdditionalLayerArray !== 'undefined' && FotF_DisableAdditionalLayerArray.length !== 0) {
			obj.disArr = FotF_DisableAdditionalLayerArray;
		}
		
		if (typeof FotF_DisableAdditionalThirdLayerArray !== 'undefined' && FotF_DisableAdditionalThirdLayerArray.length !== 0) {
			obj.disArr2 = FotF_DisableAdditionalThirdLayerArray;
		}
		
		if (typeof FotF_AdditionalAnimeArray1 !== 'undefined' && FotF_AdditionalAnimeArray1.length !== 0) {
			obj.animArr1 = FotF_AdditionalAnimeArray1;
		}
		
		if (typeof FotF_AdditionalAnimeArray2 !== 'undefined' && FotF_AdditionalAnimeArray2.length !== 0) {
			obj.animArr2 = FotF_AdditionalAnimeArray2;
		}
		
		if (typeof FotF_AsyncAnimeArray1 !== 'undefined' && FotF_AsyncAnimeArray1.length !== 0) {
			obj.animArr3 = FotF_AsyncAnimeArray1;
		}
		
		if (typeof FotF_AsyncAnimeArray2 !== 'undefined' && FotF_AsyncAnimeArray2.length !== 0) {
			obj.animArr4 = FotF_AsyncAnimeArray2;
		}
		
		return this._screenParam.customObject;
	};

	//For cycling through anime caches and updating cutout caches during map layer drawing
	var FotF_MoveUnitCounter = UnitCounter.moveUnitCounter;
	UnitCounter.moveUnitCounter = function() {
		
		var result = this._counter.moveCycleCounter();
		
		if (result !== MoveResult.CONTINUE) {
			if (++this._unitAnimationIndex === this._getAnimationArray().length) {
				this._unitAnimationIndex = 0;
				FotF_blockAnime = false;
				
				if (typeof FotF_AnimeCounter === 'undefined' || FotF_AnimeCounter === null) {
					FotF_AnimeCounter = 0
				} else if (FotF_AnimeCounter >= 11) {
					FotF_AnimeCounter = 0
				} else {
					FotF_AnimeCounter++
				}
				//root.log('now rendering animeCache' + FotF_AnimeCounter);
			}
		}
		
		result = this._counter2.moveCycleCounter();
		if (result !== MoveResult.CONTINUE) {
			if (++this._unitAnimationIndex2 === 2) {
				this._unitAnimationIndex2 = 0;
				FotF_LayerRendererConstants.LayerCounter2 = true;
			}
		}
	
		return result;
		
		//return FotF_MoveUnitCounter(this);		Move this function to layer renderer and alias it using this line
	};

})();

//Disables a specific tile inside the additional layer array
var FotF_DisableAdditionalLayer = function(index) {
	if (typeof index === 'number' && FotF_DisableAdditionalLayerArray.indexOf(index) < 0) {
		FotF_DisableAdditionalLayerArray.push(index);
		additionalLayerCache = null;
	}
	//root.log('disableArray: ' + FotF_DisableAdditionalLayerArray);
};

//Re-enables a specific tile inside the additional layer array
var FotF_EnableAdditionalLayer = function(index) {
	if (typeof index === 'number' && FotF_DisableAdditionalLayerArray.indexOf(index) > -1) {
		var indexIndex = FotF_DisableAdditionalLayerArray.indexOf(index);
		FotF_DisableAdditionalLayerArray.splice(indexIndex, 1);
		additionalLayerCache = null;
	}
	//root.log('disableArray: ' + FotF_DisableAdditionalLayerArray);
};

//Disables a specific tile inside the additional third layer array
var FotF_DisableAdditionalThirdLayer = function(index) {
	if (typeof index === 'number' && FotF_DisableAdditionalThirdLayerArray.indexOf(index) < 0) {
		FotF_DisableAdditionalThirdLayerArray.push(index);
		additionalThirdLayerCache = null;
	}
	//root.log('disableThirdArray: ' + FotF_DisableAdditionalThirdLayerArray);
};

//Re-enables a specific tile inside the additional layer array
var FotF_EnableAdditionalThirdLayer = function(index) {
	if (typeof index === 'number' && FotF_DisableAdditionalThirdLayerArray.indexOf(index) > -1) {
		var indexIndex = FotF_DisableAdditionalThirdLayerArray.indexOf(index);
		FotF_DisableAdditionalThirdLayerArray.splice(indexIndex, 1);
		additionalThirdLayerCache = null;
	}
	//root.log('disableThirdArray: ' + FotF_DisableAdditionalThirdLayerArray);
};

//Adds a tile to the additional layer array
var FotF_PushAdditionalLayerTile = function(isRuntime, id, xSrc, ySrc, xDest, yDest) {
	if (typeof isRuntime === 'boolean' && typeof (id && xSrc && ySrc && xDest && yDest) === 'number') {
		FotF_AdditionalLayerArray.push([isRuntime, id, xSrc, ySrc, xDest, yDest]);
		additionalLayerCache = null;
	}
	//root.log('additionalLayerArray: ' + FotF_AdditionalLayerArray);
};

//Adds a tile to the additional third layer array
var FotF_PushAdditionalThirdLayerTile = function(isRuntime, id, xSrc, ySrc, xDest, yDest) {
	if (typeof isRuntime === 'boolean' && typeof (id && xSrc && ySrc && xDest && yDest) === 'number') {
		FotF_AdditionalThirdLayerArray.push([isRuntime, id, xSrc, ySrc, xDest, yDest]);
		additionalThirdLayerCache = null;
	}
	//root.log('additionalThirdLayerArray: ' + FotF_AdditionalThirdLayerArray);
};

//Removes a tile from the animated mapchip array (for tiles added with FotF_PushAdditionalAnimeTile)
var FotF_DeleteAdditionalAnimeTile = function (index, isThird) {
	if (typeof index === 'number' && isThird === false) {
		root.log(FotF_AdditionalAnimeArray1);
		FotF_AdditionalAnimeArray1.splice(index, 1);
		FotF_CreateAnimeCache();
	} else if (typeof index === 'number' && isThird === true) {
		FotF_AdditionalAnimeArray2.splice(index, 1);
		FotF_CreateAnimeCacheThird();
	}
};

//Removes a tile from the animated mapchip array (for tiles added with FotF_PushAdditionalAnimeTileAsync)
var FotF_DeleteAdditionalAnimeTileAsync = function (index, isThird) {
	if (typeof index === 'number' && isThird === false) {
		FotF_AsyncAnimeArray1.splice(index, 1);
	} else if (typeof index === 'number' && isThird === true) {
		FotF_AsyncAnimeArray2.splice(index, 1);
	}
};

var FotF_DrawAdditionalMapLayer = function() {

	var session = root.getCurrentSession();
	var mapInfo = session.getCurrentMapInfo();
	var scrollPixelX = session.getScrollPixelX();
	var scrollPixelY = session.getScrollPixelY();
	
	if (session !== null) {
		if (mapInfo.custom.addLayer || FotF_AdditionalLayerArray !== null) {
			if (additionalLayerCache === null) {
				FotF_CreateAdditionalLayerCache();
			}
			
			if (additionalLayerCache !== null) {
				additionalLayerCache.draw(-scrollPixelX, -scrollPixelY);
			}
		}
	}
};

var FotF_DrawAdditionalThirdLayer = function() {
		
	var session = root.getCurrentSession();
	var mapInfo = session.getCurrentMapInfo();
	var scrollPixelX = session.getScrollPixelX();
	var scrollPixelY = session.getScrollPixelY();
	var mapColorIndex = mapInfo.getMapColorIndex();
	var mapColorData = root.getBaseData().getMapColorList().getData(mapColorIndex);
	var mapColorAlpha = mapColorData.getAlpha();
	var mapColorUsed = FotF_MapColorUnjumbler();
	
	if (session !== null) {
		if (mapInfo.custom.addThirdLayer || FotF_AdditionalThirdLayerArray !== null) {
			if (additionalThirdLayerCache === null) {
				FotF_CreateAdditionalThirdLayerCache();
			}
			
			if (additionalCutOutCache === null) {
				FotF_CreateAdditionalCutOutCache();
			}
			
			if (additionalThirdLayerCache !== null && FotF_LayerRendererConstants.blockThirdLayerCacheUL === false && FotF_LayerRendererConstants.cutOutSwitch === false) {
				additionalThirdLayerCache.draw(-scrollPixelX, -scrollPixelY);
				//root.log('additionalThirdLayerCache drawn');
			} else {
				additionalCutOutCache.draw(-scrollPixelX, -scrollPixelY);
				//root.log('cutOutCache UL drawn');
			}
		}
	}
};

var FotF_DrawAdditionalScrollLayer = function (unit, x, y, unitRenderParam) {

	var session = root.getCurrentSession();
	var mapInfo = session.getCurrentMapInfo();
	var scrollPixelX = session.getScrollPixelX();
	var scrollPixelY = session.getScrollPixelY();
	
	if (session !== null) {
		if (mapInfo.custom.addLayer) {
			if (additionalLayerCache === null) {
				FotF_CreateAdditionalLayerCache();
			}
			
			if (additionalLayerCache !== null) {
				additionalLayerCache.draw(-scrollPixelX, -scrollPixelY);
			}
		}
	}
};
	
var FotF_DrawAdditionalThirdScrollLayer = function (unit, x, y, unitRenderParam) {

	var session = root.getCurrentSession();
	var mapInfo = session.getCurrentMapInfo();
	var scrollPixelX = session.getScrollPixelX();
	var scrollPixelY = session.getScrollPixelY();
	
	if (session !== null) {
		if (mapInfo.custom.addThirdLayer) {
			if (additionalThirdLayerCache === null) {
				FotF_CreateAdditionalThirdLayerCache();
			}
			
			if (additionalCutOutCache === null) {
				FotF_CreateAdditionalCutOutCache();
			}
			
			if (additionalThirdLayerCache !== null && (FotF_LayerRendererConstants.blockThirdLayerCacheUL === false || FotF_LayerRendererConstants.cutOutSwitch === false)) {
				additionalThirdLayerCache.draw(-scrollPixelX, -scrollPixelY);
			} else if (FotF_LayerRendererConstants.cutOutSwitch === true) {
				additionalCutOutCache.draw(-scrollPixelX, -scrollPixelY);
			}
		}
	}
};

FotF_DrawAdditionalAnimeLayer = function () {
	
	var i;
	var session = root.getCurrentSession();
	var mapInfo = session.getCurrentMapInfo();
	var scrollPixelX = session.getScrollPixelX();
	var scrollPixelY = session.getScrollPixelY();
	var mapColorIndex = mapInfo.getMapColorIndex();
	var mapColorData = root.getBaseData().getMapColorList().getData(mapColorIndex);
	var mapColorAlpha = mapColorData.getAlpha();
	var mapColorUsed = FotF_MapColorUnjumbler();
	var animArr1 = FotF_AsyncAnimeArray1;
	
	if (typeof FotF_AnimeCacheArray === 'undefined' || FotF_AnimeCacheArray === null) {
		FotF_CreateAnimeCache();
	}
	
	if (typeof FotF_AnimeCacheArray !== 'undefined' && FotF_AnimeCacheArray !== null && FotF_AnimeCacheArray.length !== 0) {
		var arr2 = FotF_AnimeCacheArray;
		//root.watchTime();
		var cacheIndex = FotF_AnimeCounter;
		arr2[cacheIndex].draw(-scrollPixelX, -scrollPixelY);
		//root.log('animeCache ' + cacheIndex + ' drawn');
		//root.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + root.getElapsedTime());
	}
	
	for (i = 0; i < animArr1.length; i++) {
		var isRuntime = animArr1[i][0]
		var id = animArr1[i][1]
		var colorIndex = 0
		var xSrc = animArr1[i][2] * GraphicsFormat.MAPCHIP_WIDTH
		var ySrc = animArr1[i][3] * GraphicsFormat.MAPCHIP_HEIGHT
		var xDest = animArr1[i][4] * GraphicsFormat.MAPCHIP_WIDTH;
		var yDest = animArr1[i][5] * GraphicsFormat.MAPCHIP_HEIGHT;
		var count = animArr1[i][6] - 1;
		var index = animArr1[i][7];
		var mode = animArr1[i][8];
		var isUp = animArr1[i][9];
		
		if (FotF_blockAnime === false) {
			if (mode === true) {
				if (index < count) {
					index += 1
					animArr1[i].splice(7, 1, index);
				} else if (index === count) {
					index = 0
					animArr1[i].splice(7, 1, index);
				}
			} else {
				if (isUp === true) {
					if (index < count) {
						index += 1
						animArr1[i].splice(7, 1, index);
					} else if (index === count) {
						isUp = false;
						index -= 1
						animArr1[i].splice(7, 1, index);
						animArr1[i].splice(9, 1, isUp);
					}
				} else {
					if (index > 0) {
						index -= 1
						animArr1[i].splice(7, 1, index);
					} else {
						isUp = true;
						index += 1
						animArr1[i].splice(7, 1, index);
						animArr1[i].splice(9, 1, isUp);
					}
				}
			}
		}
		
		var handle = root.createResourceHandle(isRuntime, id, colorIndex, xSrc, ySrc);
		
		ySrc += (index * GraphicsFormat.MAPCHIP_HEIGHT);

		var pic = GraphicsRenderer.getGraphics(handle, GraphicsType.MAPCHIP);
		
		if (pic === null || 0 > xSrc || 0 > ySrc || pic.getWidth() < xSrc || pic.getHeight() < ySrc) {
			root.log('pic is null :(');
			pic = root.getMaterialManager().createImage('FotF_UnlimitedLayers', 'Coconut - DO NOT REMOVE.png');
			pic.drawStretchParts(xDest - scrollPixelX, yDest - scrollPixelY, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, 0, 0, 32, 32);
			continue;
		}

		pic.setColor(mapColorUsed, mapColorAlpha);
		pic.drawParts(xDest - scrollPixelX, yDest - scrollPixelY, xSrc, ySrc, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT)
	}

	//FotF_blockAnime = true;
};

FotF_DrawAdditionalAnimeLayerThird = function () {
	
	var i;
	var session = root.getCurrentSession();
	var mapInfo = session.getCurrentMapInfo();
	var scrollPixelX = session.getScrollPixelX();
	var scrollPixelY = session.getScrollPixelY();
	var mapColorIndex = mapInfo.getMapColorIndex();
	var mapColorData = root.getBaseData().getMapColorList().getData(mapColorIndex);
	var mapColorAlpha = mapColorData.getAlpha();
	var mapColorUsed = FotF_MapColorUnjumbler();
	var animArr1 = FotF_AsyncAnimeArray2;
	
	if (typeof FotF_AnimeCacheArrayThird === 'undefined' || FotF_AnimeCacheArrayThird === null) {
		FotF_CreateAnimeCacheThird();
	}
	
	if (typeof FotF_AnimeCacheArrayThird !== 'undefined' && FotF_AnimeCacheArrayThird !== null && FotF_AnimeCacheArrayThird.length !== 0) {
		var arr2 = FotF_AnimeCacheArrayThird;
		//root.watchTime();
		var cacheIndex = FotF_AnimeCounter;
		arr2[cacheIndex].draw(-scrollPixelX, -scrollPixelY);
		//root.log('animeCache ' + cacheIndex + ' drawn');
		//root.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ' + root.getElapsedTime());
	}
	
	for (i = 0; i < animArr1.length; i++) {
		var isRuntime = animArr1[i][0]
		var id = animArr1[i][1]
		var colorIndex = 0
		var xSrc = animArr1[i][2] * GraphicsFormat.MAPCHIP_WIDTH
		var ySrc = animArr1[i][3] * GraphicsFormat.MAPCHIP_HEIGHT
		var xDest = animArr1[i][4] * GraphicsFormat.MAPCHIP_WIDTH;
		var yDest = animArr1[i][5] * GraphicsFormat.MAPCHIP_HEIGHT;
		var count = animArr1[i][6] - 1;
		var index = animArr1[i][7];
		var mode = animArr1[i][8];
		var isUp = animArr1[i][9];
		
		if (FotF_blockAnime === false) {
			if (mode === true) {
				if (index < count) {
					index += 1
					animArr1[i].splice(7, 1, index);
				} else if (index === count) {
					index = 0
					animArr1[i].splice(7, 1, index);
				}
			} else {
				if (isUp === true) {
					if (index < count) {
						index += 1
						animArr1[i].splice(7, 1, index);
					} else if (index === count) {
						isUp = false;
						index -= 1
						animArr1[i].splice(7, 1, index);
						animArr1[i].splice(9, 1, isUp);
					}
				} else {
					if (index > 0) {
						index -= 1
						animArr1[i].splice(7, 1, index);
					} else {
						isUp = true;
						index += 1
						animArr1[i].splice(7, 1, index);
						animArr1[i].splice(9, 1, isUp);
					}
				}
			}
		}
		
		var handle = root.createResourceHandle(isRuntime, id, colorIndex, xSrc, ySrc);
		
		ySrc += (index * GraphicsFormat.MAPCHIP_HEIGHT);

		var pic = GraphicsRenderer.getGraphics(handle, GraphicsType.MAPCHIP);
		
		if (pic === null || 0 > xSrc || 0 > ySrc || pic.getWidth() < xSrc || pic.getHeight() < ySrc) {
			root.log('pic is null :(');
			pic = root.getMaterialManager().createImage('FotF_UnlimitedLayers', 'Coconut - DO NOT REMOVE.png');
			pic.drawStretchParts(xDest - scrollPixelX, yDest - scrollPixelY, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, 0, 0, 32, 32);
			continue;
		}

		pic.setColor(mapColorUsed, mapColorAlpha);
		pic.drawParts(xDest - scrollPixelX, yDest - scrollPixelY, xSrc, ySrc, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT)
	}

	FotF_blockAnime = true;
};

var FotF_CreateAdditionalLayerCache = function() {
	
	var i;
	var session = root.getCurrentSession();
	var mapInfo = session.getCurrentMapInfo();
	var graphicsManager = root.getGraphicsManager();
	var mapwidth = mapInfo.getMapWidth() * GraphicsFormat.MAPCHIP_WIDTH;
	var mapheight = mapInfo.getMapHeight() * GraphicsFormat.MAPCHIP_HEIGHT;
	var mapColorIndex = mapInfo.getMapColorIndex();
	var mapColorData = root.getBaseData().getMapColorList().getData(mapColorIndex);
	var mapColorAlpha = mapColorData.getAlpha();
	var mapColorUsed = FotF_MapColorUnjumbler();
	var arrImp = FotF_ImportArray;
	var arrPre = mapInfo.custom.addLayer;
	var arrA = FotF_AdditionalLayerArray;
	
	if (!arrImp) {
		arrImp = []
	}
	
	if (!arrPre) {
		arrPre = []
	}
	
	arr1 = arrImp.concat(arrPre)
	
	if (arrA.length > 0) {
		arr1 = arr1.concat(arrA);
	}

	additionalLayerCache = graphicsManager.createCacheGraphics(mapwidth, mapheight);
	graphicsManager.setRenderCache(additionalLayerCache);
			
	for (i = 0; i < arr1.length; i++) {
		if (FotF_DisableAdditionalLayerArray.indexOf(i) < 0) {
			var isRuntime = arr1[i][0]
			var id = arr1[i][1]
			var colorIndex = 0
			var xSrc = arr1[i][2] * GraphicsFormat.MAPCHIP_WIDTH
			var ySrc = arr1[i][3] * GraphicsFormat.MAPCHIP_HEIGHT
			var xDest = arr1[i][4] * GraphicsFormat.MAPCHIP_WIDTH;
			var yDest = arr1[i][5] * GraphicsFormat.MAPCHIP_HEIGHT;
			var handle = root.createResourceHandle(isRuntime, id, colorIndex, xSrc, ySrc);

			var pic = GraphicsRenderer.getGraphics(handle, GraphicsType.MAPCHIP);
			
			if (pic === null || 0 > xSrc || 0 > ySrc || pic.getWidth() < xSrc || pic.getHeight() < ySrc) {
				root.log('pic is null :(');
				pic = root.getMaterialManager().createImage('FotF_UnlimitedLayers', 'Coconut - DO NOT REMOVE.png');
				pic.drawStretchParts(xDest, yDest, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, 0, 0, 32, 32);
				continue;
			}

			pic.setColor(mapColorUsed, mapColorAlpha);
			pic.drawParts(xDest, yDest, xSrc, ySrc, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT)
		} else {
			//root.log('-----------------blocked index ' + i + ' at ' + arr1[i][4] + ' / ' + arr1[i][5]);
		}
	}
			
	graphicsManager.resetRenderCache();
	//root.log('additional Layer Cache created');
};

var FotF_CreateAdditionalThirdLayerCache = function() {
	
	var i, pic;
	var session = root.getCurrentSession();
	var mapInfo = session.getCurrentMapInfo();
	var graphicsManager = root.getGraphicsManager();
	var mapwidth = mapInfo.getMapWidth() * GraphicsFormat.MAPCHIP_WIDTH;
	var mapheight = mapInfo.getMapHeight() * GraphicsFormat.MAPCHIP_HEIGHT;
	var mapColorIndex = mapInfo.getMapColorIndex();
	var mapColorData = root.getBaseData().getMapColorList().getData(mapColorIndex);
	var mapColorAlpha = mapColorData.getAlpha();
	var mapColorUsed = FotF_MapColorUnjumbler();
	var arrImp = FotF_ImportArrayThird;
	var arrPre = mapInfo.custom.addThirdLayer;
	var arrA = FotF_AdditionalThirdLayerArray;
	
	if (!arrImp) {
		arrImp = []
	}
	
	if (!arrPre) {
		arrPre = []
	}
	
	arr1 = arrImp.concat(arrPre)
	
	if (arrA.length > 0) {
		arr1 = arr1.concat(arrA);
	}

	additionalThirdLayerCache = graphicsManager.createCacheGraphics(mapwidth, mapheight);
	graphicsManager.setRenderCache(additionalThirdLayerCache);
	
		for (i = 0; i < arr1.length; i++) {
			if (FotF_DisableAdditionalThirdLayerArray.indexOf(i) < 0) {
				
				var isRuntime = arr1[i][0]
				var id = arr1[i][1]
				var colorIndex = 0
				var xSrc = arr1[i][2] * GraphicsFormat.MAPCHIP_WIDTH
				var ySrc = arr1[i][3] * GraphicsFormat.MAPCHIP_HEIGHT
				var xDest = arr1[i][4] * GraphicsFormat.MAPCHIP_WIDTH;
				var yDest = arr1[i][5] * GraphicsFormat.MAPCHIP_HEIGHT;
				var handle = root.createResourceHandle(isRuntime, id, colorIndex, xSrc, ySrc);
				var index = CurrentMap.getIndex(arr1[i][4], arr1[i][5]);

				var pic = GraphicsRenderer.getGraphics(handle, GraphicsType.MAPCHIP);
				
				if (pic === null || 0 > xSrc || 0 > ySrc || pic.getWidth() < xSrc || pic.getHeight() < ySrc) {
					root.log('pic is null :(');
					pic = root.getMaterialManager().createImage('FotF_UnlimitedLayers', 'Coconut - DO NOT REMOVE.png');
					pic.drawStretchParts(xDest, yDest, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, 0, 0, 32, 32);
					continue;
				}

				pic.setColor(mapColorUsed, mapColorAlpha);
				pic.drawParts(xDest, yDest, xSrc, ySrc, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT)
				/*
				if (FotF_LayerRendererConstants.unlimitedLayersIndexArray.indexOf(index) < 0) {
					FotF_LayerRendererConstants.unlimitedLayersIndexArray.push(index)
				}
				*/
			} else {
				//root.log('-----------------blocked index ' + i + ' at ' + arr1[i][4] + ' / ' + arr1[i][5]);
			}
		}
	//}
	/*
	var unit;
    var p_List = PlayerList.getAliveList();
    var p_Count = p_List.getCount();
    var a_List = AllyList.getAliveList();
    var a_Count = a_List.getCount();
    var e_List = EnemyList.getAliveList();
    var e_Count = e_List.getCount();

    for (i = 0; i < p_Count; i++) {
        unit = p_List.getData(i);
        x = unit.getMapX();
        y = unit.getMapY();
        terrain = PosChecker.getTerrainFromPos(x, y);
        terrainEx = PosChecker.getTerrainFromPos(x, y);

        if ((terrain.custom.StealthCL || terrainEx.custom.StealthCL) && unit.isInvisible() === false) {
			var handle = unit.getFaceResourceHandle();
			var faceX = handle.getSrcX();
			var faceY = handle.getSrcY();
            pic = GraphicsRenderer.getGraphics(handle, GraphicsType.FACE);
			var faceFrame = root.getMaterialManager().createImage('FotF_UnlimitedLayers', 'FaceFrame.png');
			faceFrame.setColor(0x3867ea, 255);
			var srcWidth = root.getLargeFaceWidth();
			var srcHeight = root.getLargeFaceHeight();
			
			if (!pic.isLargeImage()) {
				srcWidth = GraphicsFormat.FACE_WIDTH;
				srcHeight = GraphicsFormat.FACE_HEIGHT;
			}
			pic.drawStretchParts(x * GraphicsFormat.MAPCHIP_WIDTH, y * GraphicsFormat.MAPCHIP_HEIGHT, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, faceX, faceY, srcWidth, srcHeight)
			faceFrame.draw(x * GraphicsFormat.MAPCHIP_WIDTH, y * GraphicsFormat.MAPCHIP_HEIGHT)
        }
    }

    for (i = 0; i < a_Count; i++) {
        unit = a_List.getData(i);
        x = unit.getMapX();
        y = unit.getMapY();
        terrain = PosChecker.getTerrainFromPos(x, y);
        terrainEx = PosChecker.getTerrainFromPos(x, y);

        if ((terrain.custom.StealthCL || terrainEx.custom.StealthCL) && unit.isInvisible() === false) {
			var handle = unit.getFaceResourceHandle();
			var faceX = handle.getSrcX();
			var faceY = handle.getSrcY();
            pic = GraphicsRenderer.getGraphics(handle, GraphicsType.FACE);
			var faceFrame = root.getMaterialManager().createImage('FotF_UnlimitedLayers', 'FaceFrame.png');
			faceFrame.setColor(0x58c11c, 255);
			var srcWidth = root.getLargeFaceWidth();
			var srcHeight = root.getLargeFaceHeight();
			
			if (!pic.isLargeImage()) {
				srcWidth = GraphicsFormat.FACE_WIDTH;
				srcHeight = GraphicsFormat.FACE_HEIGHT;
			}
			pic.drawStretchParts(x * GraphicsFormat.MAPCHIP_WIDTH, y * GraphicsFormat.MAPCHIP_HEIGHT, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, faceX, faceY, srcWidth, srcHeight)
			faceFrame.draw(x * GraphicsFormat.MAPCHIP_WIDTH, y * GraphicsFormat.MAPCHIP_HEIGHT)
        }
    }

    for (i = 0; i < e_Count; i++) {
        unit = e_List.getData(i);
        x = unit.getMapX();
        y = unit.getMapY();
        terrain = PosChecker.getTerrainFromPos(x, y);
        terrainEx = PosChecker.getTerrainFromPos(x, y);

        if ((terrain.custom.StealthCL || terrainEx.custom.StealthCL) && unit.isInvisible() === false) {
			var handle = unit.getFaceResourceHandle();
			var faceX = handle.getSrcX();
			var faceY = handle.getSrcY();
            pic = GraphicsRenderer.getGraphics(handle, GraphicsType.FACE);
			var faceFrame = root.getMaterialManager().createImage('FotF_UnlimitedLayers', 'FaceFrame.png');
			faceFrame.setColor(0xf41600, 255);
			var srcWidth = root.getLargeFaceWidth();
			var srcHeight = root.getLargeFaceHeight();
			
			if (!pic.isLargeImage()) {
				srcWidth = GraphicsFormat.FACE_WIDTH;
				srcHeight = GraphicsFormat.FACE_HEIGHT;
			}
			pic.drawStretchParts(x * GraphicsFormat.MAPCHIP_WIDTH, y * GraphicsFormat.MAPCHIP_HEIGHT, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, faceX, faceY, srcWidth, srcHeight)
			faceFrame.draw(x * GraphicsFormat.MAPCHIP_WIDTH, y * GraphicsFormat.MAPCHIP_HEIGHT)
        }
    }
	*/
	graphicsManager.resetRenderCache();
	//root.log('additional Layer Cache created');
};

var FotF_CreateAdditionalCutOutCache = function() {
	
	var i;
	var session = root.getCurrentSession();
	var mapInfo = session.getCurrentMapInfo();
	var graphicsManager = root.getGraphicsManager();
	var mapwidth = mapInfo.getMapWidth() * GraphicsFormat.MAPCHIP_WIDTH;
	var mapheight = mapInfo.getMapHeight() * GraphicsFormat.MAPCHIP_HEIGHT;
	var mapColorIndex = mapInfo.getMapColorIndex();
	var mapColorData = root.getBaseData().getMapColorList().getData(mapColorIndex);
	var mapColorAlpha = mapColorData.getAlpha();
	var mapColorUsed = FotF_MapColorUnjumbler();
	var arrImp = FotF_ImportArrayThird;
	var arrPre = mapInfo.custom.addThirdLayer;
	var arrA = FotF_AdditionalThirdLayerArray;
	
	if (!arrImp) {
		arrImp = []
	}
	
	if (!arrPre) {
		arrPre = []
	}
	
	arr1 = arrImp.concat(arrPre)
	
	if (arrA.length > 0) {
		arr1 = arr1.concat(arrA);
	}

	additionalCutOutCache = graphicsManager.createCacheGraphics(mapwidth, mapheight);
	graphicsManager.setRenderCache(additionalCutOutCache);
	
	if (FotF_LayerRendererConstants.SynchronizeThirdLayers === true) {
		var mergeArray = FotF_CreatePlayerIndexArray();
		
		for (i = 0; i < arr1.length; i++) {
			//root.log('array at ' + i + ' : ' + arr1[i]);
			var index = CurrentMap.getIndex(arr1[i][4], arr1[i][5]);
			
			if (FotF_DisableAdditionalThirdLayerArray.indexOf(i) < 0) {
				var isRuntime = arr1[i][0]
				var id = arr1[i][1]
				var colorIndex = 0
				var xSrc = arr1[i][2] * GraphicsFormat.MAPCHIP_WIDTH
				var ySrc = arr1[i][3] * GraphicsFormat.MAPCHIP_HEIGHT
				var xDest = arr1[i][4] * GraphicsFormat.MAPCHIP_WIDTH;
				var yDest = arr1[i][5] * GraphicsFormat.MAPCHIP_HEIGHT;
				var handle = root.createResourceHandle(isRuntime, id, colorIndex, xSrc, ySrc);

				var pic = GraphicsRenderer.getGraphics(handle, GraphicsType.MAPCHIP);
				
				if (pic === null || 0 > xSrc || 0 > ySrc || pic.getWidth() < xSrc || pic.getHeight() < ySrc) {
					root.log('pic is null :(');
					pic = root.getMaterialManager().createImage('FotF_UnlimitedLayers', 'Coconut - DO NOT REMOVE.png');
					pic.drawStretchParts(xDest, yDest, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, 0, 0, 32, 32);
					continue;
				}

				pic.setColor(mapColorUsed, mapColorAlpha);

				if (mergeArray.indexOf(index) > -1 || FotF_LayerRendererConstants.AlwaysRenderWithTransparency === true) {
					pic.setAlpha(FotF_LayerRendererConstants.ThirdLayerAlpha);
					//root.log('set alpha at ' + arr1[i][4] + ' / ' + arr1[i][5]);
				}

				pic.drawParts(xDest, yDest, xSrc, ySrc, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT)
				/*
				if (FotF_LayerRendererConstants.ULCutOutIndexArray.indexOf(index) < 0) {
					FotF_LayerRendererConstants.ULCutOutIndexArray.push(index)
				}
				*/
			} else {
				
				//root.log('-----------------blocked index ' + i + ' at ' + arr1[i][4] + ' / ' + arr1[i][5]);
			}
		}
		
	} else {
		
		for (i = 0; i < arr1.length; i++) {
			if (FotF_DisableAdditionalThirdLayerArray.indexOf(i) < 0) {
				
				var isRuntime = arr1[i][0]
				var id = arr1[i][1]
				var colorIndex = 0
				var xSrc = arr1[i][2] * GraphicsFormat.MAPCHIP_WIDTH
				var ySrc = arr1[i][3] * GraphicsFormat.MAPCHIP_HEIGHT
				var xDest = arr1[i][4] * GraphicsFormat.MAPCHIP_WIDTH;
				var yDest = arr1[i][5] * GraphicsFormat.MAPCHIP_HEIGHT;
				var handle = root.createResourceHandle(isRuntime, id, colorIndex, xSrc, ySrc);
				var index = CurrentMap.getIndex(arr1[i][4], arr1[i][5]);

				var pic = GraphicsRenderer.getGraphics(handle, GraphicsType.MAPCHIP);
				
				if (pic === null || 0 > xSrc || 0 > ySrc || pic.getWidth() < xSrc || pic.getHeight() < ySrc) {
					root.log('pic is null :(');
					pic = root.getMaterialManager().createImage('FotF_UnlimitedLayers', 'Coconut - DO NOT REMOVE.png');
					pic.drawStretchParts(xDest, yDest, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, 0, 0, 32, 32);
					continue;
				}

				pic.setColor(mapColorUsed, mapColorAlpha);
				pic.drawParts(xDest, yDest, xSrc, ySrc, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT)
				/*
				if (FotF_LayerRendererConstants.ULCutOutIndexArray.indexOf(index) < 0) {
					FotF_LayerRendererConstants.ULCutOutIndexArray.push(index)
				}
				*/
			} else {
				//root.log('-----------------blocked index ' + i + ' at ' + arr1[i][4] + ' / ' + arr1[i][5]);
			}
		}
	}
			
	graphicsManager.resetRenderCache();
	//root.log('additionalCutOutCache created');
};

FotF_CreateAnimeCache = function () {
	
	var i, j;
	var session = root.getCurrentSession();
	var mapInfo = session.getCurrentMapInfo();
	var mapwidth = mapInfo.getMapWidth() * GraphicsFormat.MAPCHIP_WIDTH;
	var mapheight = mapInfo.getMapHeight() * GraphicsFormat.MAPCHIP_HEIGHT;
	var scrollPixelX = session.getScrollPixelX();
	var scrollPixelY = session.getScrollPixelY();
	var mapColorIndex = mapInfo.getMapColorIndex();
	var mapColorData = root.getBaseData().getMapColorList().getData(mapColorIndex);
	var mapColorAlpha = mapColorData.getAlpha();
	var mapColorUsed = FotF_MapColorUnjumbler();
	var graphicsManager = root.getGraphicsManager();
	var arr = FotF_AdditionalAnimeArray1;
	var animeCache1, animeCache2, animeCache3, animeCache4, animeCache5, animeCache6;
	var animeCache7, animeCache8, animeCache9, animeCache10, animeCache11, animeCache12;
	FotF_AnimeCacheArray = [animeCache1, animeCache2, animeCache3, animeCache4, animeCache5, animeCache6, animeCache7, animeCache8, animeCache9, animeCache10, animeCache11, animeCache12];
	
	for (j = 0; j < FotF_AnimeCacheArray.length; j++) {
		
		FotF_AnimeCacheArray[j] = graphicsManager.createCacheGraphics(mapwidth, mapheight);
		graphicsManager.setRenderCache(FotF_AnimeCacheArray[j]);
		
		for (i = 0; i < arr.length; i++) {
			
			var count = arr[i][6];
			var mode = arr[i][7];
			
			switch (j) {
				
				//Cache 1
				case 0: index = 0;
				break;
				
				//Cache 2
				case 1: index = 1;
				break;
				
				//Cache 3
				case 2:
				if (count === 2) {
					index = 0
				} else {
					index = 2
				}
				break;
				
				//Cache 4
				case 3:
				if (count === 2 || (count === 3 && mode === false)) {
					index = 1
				} else if (count === 3 && mode === true) {
					index = 0
				} else {
					index = 3
				}
				break;
				
				//Cache 5
				case 4:
				if (count === 2 || (count === 4 && mode === true) || (count === 3 && mode === false)) {
					index = 0
				} else if (count === 3 && mode === true) {
					index = 1
				} else if (count === 4 && mode === false) {
					index = 2
				} else {
					index = 4
				}
				break;
				
				//Cache 6
				case 5:
				if (count === 3 && mode === true) {
					index = 2
				} else if (count === 6 || count === 7) {
					index = 5
				} else {
					index = 1
				}
				break;
				
				//Cache 7
				case 6:
				if ((count === 4 && mode === true) || (count === 3 && mode === false)) {
					index = 2
				} else if (count === 7) {
					index = 6
				} else {
					index = 0
				}
				break;
				
				//Cache 8
				case 7:
				if (count === 4 && mode === true) {
					index = 3
				} else if (count === 7) {
					index = 5
				} else {
					index = 1
				}
				break;
				
				//Cache 9
				case 8:
				if (count === 7) {
					index = 4
				} else if ((count === 3 && mode === true) || (count === 4 && mode === false) || count === 6) {
					index = 2
				} else {
					index = 0
				}
				break;
				
				//Cache 10
				case 9:
				if (count === 3 && mode === true) {
					index = 0
				} else if (count === 2 || (count === 4 && mode === true) || (count === 3 && mode === false)) {
					index = 1
				} else {
					index = 3
				}
				break;
				
				//Cache 11
				case 10:
				if (count === 6) {
					index = 4
				} else if (count === 2) {
					index = 0
				} else if (count === 3 && mode === true) {
					index = 1
				} else {
					index = 2
				}
				break;
				
				//Cache 12
				case 11:
				if (count === 2 || mode === false) {
					index = 1
				} else if (count === 6) {
					index = 5
				} else if (count === 3 && mode === true) {
					index = 2
				} else {
					index = 3
				}
				break;
				
				index = 0
				//root.log('exception in switch statement');
				break;
				
			}
			
			if (count === 12 && mode === true) {
				index = j;
				//root.log('index set to cache index');
			}
			
			if (count === (6 || 12) && mode !== true) {
				index = 0
				//root.log('exception 1');
			}
			
			if (count === 7 && mode !== false) {
				index = 0
				//root.log('exception 2');
			}
			
			if ([2,3,4,6,7,12].indexOf(count) < 0 || typeof mode !== 'boolean') {
				index = 0
				//root.log(count);
				//root.log('exception 3');
			}
			
			var isRuntime = arr[i][0]
			var id = arr[i][1]
			var colorIndex = 0
			var xSrc = arr[i][2] * GraphicsFormat.MAPCHIP_WIDTH
			var ySrc = arr[i][3] * GraphicsFormat.MAPCHIP_HEIGHT
			var xDest = arr[i][4] * GraphicsFormat.MAPCHIP_WIDTH;
			var yDest = arr[i][5] * GraphicsFormat.MAPCHIP_HEIGHT;
			
			var handle = root.createResourceHandle(isRuntime, id, colorIndex, xSrc, ySrc);
			
			ySrc += (index * GraphicsFormat.MAPCHIP_HEIGHT);

			var pic = GraphicsRenderer.getGraphics(handle, GraphicsType.MAPCHIP);
			
			if (pic === null || 0 > xSrc || 0 > ySrc || pic.getWidth() < xSrc || pic.getHeight() < ySrc) {
				root.log('pic is null :(');
				pic = root.getMaterialManager().createImage('FotF_UnlimitedLayers', 'Coconut - DO NOT REMOVE.png');
				pic.drawStretchParts(xDest, yDest, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, 0, 0, 32, 32);
				continue;
			}

			pic.setColor(mapColorUsed, mapColorAlpha);
			pic.drawParts(xDest, yDest, xSrc, ySrc, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT)
		
		}
			
		graphicsManager.resetRenderCache();
	}
 };

FotF_CreateAnimeCacheThird = function () {
	
	var i, j;
	var session = root.getCurrentSession();
	var mapInfo = session.getCurrentMapInfo();
	var mapwidth = mapInfo.getMapWidth() * GraphicsFormat.MAPCHIP_WIDTH;
	var mapheight = mapInfo.getMapHeight() * GraphicsFormat.MAPCHIP_HEIGHT;
	var scrollPixelX = session.getScrollPixelX();
	var scrollPixelY = session.getScrollPixelY();
	var mapColorIndex = mapInfo.getMapColorIndex();
	var mapColorData = root.getBaseData().getMapColorList().getData(mapColorIndex);
	var mapColorAlpha = mapColorData.getAlpha();
	var mapColorUsed = FotF_MapColorUnjumbler();
	var graphicsManager = root.getGraphicsManager();
	var arr = FotF_AdditionalAnimeArray2;
	var animeCacheT1, animeCacheT2, animeCacheT3, animeCacheT4, animeCacheT5, animeCacheT6;
	var animeCacheT7, animeCacheT8, animeCacheT9, animeCacheT10, animeCacheT11, animeCacheT12;
	FotF_AnimeCacheArrayThird = [animeCacheT1, animeCacheT2, animeCacheT3, animeCacheT4, animeCacheT5, animeCacheT6, animeCacheT7, animeCacheT8, animeCacheT9, animeCacheT10, animeCacheT11, animeCacheT12];
	
	for (j = 0; j < FotF_AnimeCacheArrayThird.length; j++) {
		
		FotF_AnimeCacheArrayThird[j] = graphicsManager.createCacheGraphics(mapwidth, mapheight);
		graphicsManager.setRenderCache(FotF_AnimeCacheArrayThird[j]);
		
		for (i = 0; i < arr.length; i++) {
			
			var count = arr[i][6];
			var mode = arr[i][7];
			
			switch (j) {
				
				//Cache 1
				case 0: index = 0;
				break;
				
				//Cache 2
				case 1: index = 1;
				break;
				
				//Cache 3
				case 2:
				if (count === 2) {
					index = 0
				} else {
					index = 2
				}
				break;
				
				//Cache 4
				case 3:
				if (count === 2 || (count === 3 && mode === false)) {
					index = 1
				} else if (count === 3 && mode === true) {
					index = 0
				} else {
					index = 3
				}
				break;
				
				//Cache 5
				case 4:
				if (count === 2 || (count === 4 && mode === true) || (count === 3 && mode === false)) {
					index = 0
				} else if (count === 3 && mode === true) {
					index = 1
				} else if (count === 4 && mode === false) {
					index = 2
				} else {
					index = 4
				}
				break;
				
				//Cache 6
				case 5:
				if (count === 3 && mode === true) {
					index = 2
				} else if (count === 6 || count === 7) {
					index = 5
				} else {
					index = 1
				}
				break;
				
				//Cache 7
				case 6:
				if ((count === 4 && mode === true) || (count === 3 && mode === false)) {
					index = 2
				} else if (count === 7) {
					index = 6
				} else {
					index = 0
				}
				break;
				
				//Cache 8
				case 7:
				if (count === 4 && mode === true) {
					index = 3
				} else if (count === 7) {
					index = 5
				} else {
					index = 1
				}
				break;
				
				//Cache 9
				case 8:
				if (count === 7) {
					index = 4
				} else if ((count === 3 && mode === true) || (count === 4 && mode === false) || count === 6) {
					index = 2
				} else {
					index = 0
				}
				break;
				
				//Cache 10
				case 9:
				if (count === 3 && mode === true) {
					index = 0
				} else if (count === 2 || (count === 4 && mode === true) || (count === 3 && mode === false)) {
					index = 1
				} else {
					index = 3
				}
				break;
				
				//Cache 11
				case 10:
				if (count === 6) {
					index = 4
				} else if (count === 2) {
					index = 0
				} else if (count === 3 && mode === true) {
					index = 1
				} else {
					index = 2
				}
				break;
				
				//Cache 12
				case 11:
				if (count === 2 || mode === false) {
					index = 1
				} else if (count === 6) {
					index = 5
				} else if (count === 3 && mode === true) {
					index = 2
				} else {
					index = 3
				}
				break;
				
				index = 0
				//root.log('exception in switch statement');
				break;
				
			}
			
			if (count === 12 && mode === true) {
				index = j;
				//root.log('index set to cache index');
			}
			
			if (count === (6 || 12) && mode !== true) {
				index = 0
				//root.log('exception 1');
			}
			
			if (count === 7 && mode !== false) {
				index = 0
				//root.log('exception 2');
			}
			
			if ([2,3,4,6,7,12].indexOf(count) < 0 || typeof mode !== 'boolean') {
				index = 0
				//root.log(count);
				//root.log('exception 3');
			}
			
			var isRuntime = arr[i][0]
			var id = arr[i][1]
			var colorIndex = 0
			var xSrc = arr[i][2] * GraphicsFormat.MAPCHIP_WIDTH
			var ySrc = arr[i][3] * GraphicsFormat.MAPCHIP_HEIGHT
			var xDest = arr[i][4] * GraphicsFormat.MAPCHIP_WIDTH;
			var yDest = arr[i][5] * GraphicsFormat.MAPCHIP_HEIGHT;
			
			var handle = root.createResourceHandle(isRuntime, id, colorIndex, xSrc, ySrc);
			
			ySrc += (index * GraphicsFormat.MAPCHIP_HEIGHT);

			var pic = GraphicsRenderer.getGraphics(handle, GraphicsType.MAPCHIP);
			
			if (pic === null || 0 > xSrc || 0 > ySrc || pic.getWidth() < xSrc || pic.getHeight() < ySrc) {
				root.log('pic is null :(');
				pic = root.getMaterialManager().createImage('FotF_UnlimitedLayers', 'Coconut - DO NOT REMOVE.png');
				pic.drawStretchParts(xDest, yDest, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, 0, 0, 32, 32);
				continue;
			}

			pic.setColor(mapColorUsed, mapColorAlpha);
			pic.drawParts(xDest, yDest, xSrc, ySrc, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT)
		
		}
			
		graphicsManager.resetRenderCache();
	}
};

//To export a map as a layer map file
FotF_ExportLayerMap = function (ignoreIsRuntime, ignoreID, ignoreXSrc, ignoreYSrc) {
	
	var x, y;
	var isFirst = true;
	var session = root.getCurrentSession();
	var mapInfo = session.getCurrentMapInfo();
	var width = mapInfo.getMapWidth();
	var height = mapInfo.getMapHeight();
	var string = '';
	
	for (x = 0; x <= width; x++) {
		for (y = 0; y <= height; y++) {
			
			var handle2 = session.getMapChipGraphicsHandle(x, y, true);
			
			if (handle2 !== null) {
				
				var ID = handle2.getResourceId();
				var isRuntime = handle2.getHandleType();
				var xSrc = handle2.getSrcX();
				var ySrc = handle2.getSrcY();
				
				if (Number(isRuntime) === Number(ignoreIsRuntime) && ID === ignoreID && xSrc === ignoreXSrc && ySrc === ignoreYSrc) {
					var string2 = null;
				} else {
					var string2 = /*'[' + */isRuntime + '.' + ID + '.' + xSrc + '.' + ySrc + '.' + x + '.' + y/* + ']'*/;
				}
				
			} else {
				
				var string2 = null;
				
			}
			
			var handle1 = session.getMapChipGraphicsHandle(x, y, false);
			
			if (handle1 !== null && !handle2.isEqualHandle(handle1)) {
					
				var ID = handle1.getResourceId();
				var isRuntime = handle1.getHandleType();
				var xSrc = handle1.getSrcX();
				var ySrc = handle1.getSrcY();
				
				if (Number(isRuntime) === Number(ignoreIsRuntime) && ID === ignoreID && xSrc === ignoreXSrc && ySrc === ignoreYSrc) {
					var string1 = null;
				} else {
					var string1 = /*'[' + */isRuntime + '.' + ID + '.' + xSrc + '.' + ySrc + '.' + x + '.' + y/* + ']'*/;
				}
				
			} else {
				
				var string1 = null;

			}
			
			if (isFirst === true) {
				if (string1 !== null) {
				string = string + string1
				isFirst = false;
				}
			}
			
			if (isFirst === true) {
				if (string2 !== null) {
				string = string + string2
				isFirst = false;
				}
			} else {
					
				if (string1 !== null) {
					string = string + ';' + string1
				}
				
				if (string2 !== null) {
					string = string + ';' + string2
				}
			}
		}
	}
	root.writeTestFile(string);
};

//Imports layer map files at the start of the map
FotF_ImportLayerMap = function (name) {
	
	var i, j;
	var materialManager = root.getMaterialManager();
	var string = materialManager.getText('FotF_UnlimitedLayers', name);
	
	if (string.length < 1) {
		return [];
	}
	
	var stringArr = string.split(';');
	var stringArrString = stringArr.toString();
	arr = []
	subArr = []
	
	for (i = 0; i < stringArr.length; i++ ) {
		
		subArr = []
		var subString = stringArr[i];
		subStringArr = subString.split('.');
			
		for (j = 0; j < subStringArr.length; j++) {
			var number = Number(subStringArr[j]);
			subArr.push(number);
		}
		
		arr.push(subArr);
	}
	return arr;
};

//Adds animated mapchips. Supported formats: 2,3,4,6,12 frames (repeating order 1 -> 2 -> 3 -> 1) and 2,3,4,7 frames (ascending/descending order 1 -> 2 -> 3 -> 2 -> 1)
var FotF_PushAdditionalAnimeTile = function(isRuntime, id, xSrc, ySrc, xDest, yDest, count, mode, isThird) {
	if (typeof (isRuntime && mode && isThird) === 'boolean' && typeof (id && xSrc && ySrc && xDest && yDest && count) === 'number' && isThird === false) {

		FotF_AdditionalAnimeArray1.push([isRuntime, id, xSrc, ySrc, xDest, yDest, count, mode]);
		root.log('additionalAnimeArray1: ' + FotF_AdditionalAnimeArray1);
	} else if (typeof (isRuntime && mode && isThird) === 'boolean' && typeof (id && xSrc && ySrc && xDest && yDest && count) === 'number' && isThird === true) {
		FotF_AdditionalAnimeArray2.push([isRuntime, id, xSrc, ySrc, xDest, yDest, count, mode]);
		root.log('additionalAnimeArray2: ' + FotF_AdditionalAnimeArray2);
	}
};

//Adds animated mapchips other than the ones supported in FotF_PushAdditionalAnimeTile. These are not cached, so use sparingly.
var FotF_PushAdditionalAnimeTileAsync = function(isRuntime, id, xSrc, ySrc, xDest, yDest, count, start, mode, isThird) {
	if (typeof (isRuntime && mode && isThird) === 'boolean' && typeof (id && xSrc && ySrc && xDest && yDest && count && start) === 'number' && isThird === false) {

		FotF_AsyncAnimeArray1.push([isRuntime, id, xSrc, ySrc, xDest, yDest, count, start, mode, true]);
		root.log('asyncAnimeArray1: ' + FotF_AsyncAnimeArray1);
	} else if (typeof (isRuntime && mode && isThird) === 'boolean' && typeof (id && xSrc && ySrc && xDest && yDest && count && start) === 'number' && isThird === true) {
		FotF_AsyncAnimeArray2.push([isRuntime, id, xSrc, ySrc, xDest, yDest, count, start, mode, true]);
		root.log('asyncAnimeArray2: ' + FotF_AsyncAnimeArray2);
	}
};