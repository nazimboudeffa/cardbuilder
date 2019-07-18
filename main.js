console.error('Begin...');
(function(){
'use strict';

var codepenRoot = 'https://codepen.io/killroy/pen/';
var dropboxRoot = 'https://dl.dropbox.com/s/';
var xadevRoot = 'http://dev.xenocideacademy.com/vendor/codepen/';
var xaalphaRoot = 'http://alpha.xenocideacademy.com/vendor/codepen/';
var urlSource = {
	dropbox: {
		'CardRenderer.js': codepenRoot+'1b3c228d64749cd13dc397b41d36fe88.js',
		'ProximaNovaCond-Semibold.woff2': dropboxRoot+'4buz70s9ue5ue5r/ProximaNovaCond-Semibold.woff2',
		'ProximaNova-Bold.woff2': dropboxRoot+'dde6dm15u5ckm3c/ProximaNova-Bold.woff2',
		'atlas_frames01.png': dropboxRoot+'u05s6si3v6lqzxw/atlas_frames01.png',
		'atlas_units01.jpg': dropboxRoot+'pr6lfr3grbjwptk/atlas_units01.jpg',
		'atlas_units02.jpg':  dropboxRoot+'yzrtxsigwl8dtac/atlas_units02.jpg',
		'atlas_actions01.jpg': dropboxRoot+'6g3tx6merf83ana/atlas_actions01.jpg',
		'atlas_promo01.jpg': dropboxRoot+'4x49jlyyf00k8iq/atlas_promo01.jpg',
		'cardTemplates.json': dropboxRoot+'59t05jon6bpznne/cardTemplates.json',
		'atlas.json': dropboxRoot+'fd690thahs7oi8v/atlas.json',
	},
	xadev: {
		'CardRenderer.js': codepenRoot+'1b3c228d64749cd13dc397b41d36fe88.js',
		'ProximaNovaCond-Semibold.woff2': xadevRoot+'ProximaNovaCond-Semibold.woff2',
		'ProximaNova-Bold.woff2': xadevRoot+'ProximaNova-Bold.woff2',
		'atlas_frames01.png': xadevRoot+'atlas_frames01.png',
		'atlas_units01.jpg': xadevRoot+'atlas_units01.jpg',
		'atlas_units02.jpg': xadevRoot+'atlas_units02.jpg',
		'atlas_actions01.jpg': xadevRoot+'atlas_actions01.jpg',
		'atlas_promo01.jpg': xadevRoot+'atlas_promo01.jpg',
		'atlas_promo02.jpg': xadevRoot+'atlas_promo02.jpg',
		'cardTemplates.json': xadevRoot+'cardTemplates.json',
		'atlas.json': xadevRoot+'atlas.json',
	},
	local: {
		'CardRenderer.js': 'CardRenderer.js',
		'ProximaNovaCond-Semibold.woff2': 'ProximaNovaCond-Semibold.woff2',
		'ProximaNova-Bold.woff2': 'ProximaNova-Bold.woff2',
		'atlas_frames01.png': 'atlas_frames01.png',
		'atlas_units01.jpg': 'atlas_units01.jpg',
		'atlas_units02.jpg':  'atlas_units02.jpg',
		'atlas_actions01.jpg': 'atlas_actions01.jpg',
		'atlas_promo01.jpg': 'atlas_promo01.jpg',
		'cardTemplates.json': 'cardTemplates.json',
		'atlas.json': 'atlas.json',
	}
};
var urls = urlSource.local;//urlSource.dropbox;

var modules = [
	urls['CardRenderer.js'] // CardRenderer
];
var CardRenderer;

var fontResources = [
	{
		name: 'ProximaNovaCond-Semibold',
		type: 'font',
		fontFamily: 'ProximaNova',
		fontWeight: 'normal',
		url: urls['ProximaNovaCond-Semibold.woff2']
	},
	{
		name: 'ProximaNova-Bold',
		type: 'font',
		fontFamily: 'ProximaNova',
		fontWeight: 'bold',
		url: urls['ProximaNova-Bold.woff2']
	}
];
var cardRendererOptions = {
	resources: {
		'atlas_frames01.png': {type: 'image',	url: urls['atlas_frames01.png']},
		'atlas_units01.jpg': {type: 'image', url: urls['atlas_units01.jpg']},
		'atlas_units02.jpg': {type: 'image', url: urls['atlas_units02.jpg']},
		'atlas_actions01.jpg': {type: 'image', url: urls['atlas_actions01.jpg']},
		'atlas_promo01.jpg': {type: 'image', url: urls['atlas_promo01.jpg']},
		'atlas_promo02.jpg': {type: 'image', url: urls['atlas_promo02.jpg']}
	}
};
var cardTemplatesUrl = urls['cardTemplates.json'];
var atlasJsonUrl = urls['atlas.json'];

var cardRenderer;
var FILE_MAX_SIZE = 1*1024*1024;
var validFileTypes = ['image/jpeg', 'image/png', 'image/gif'];

taskLoadModules(modules)
.then(taskCreateCardRenderer)
.then(taskLoadCardTemplates)
.then(taskLoadAtlas)
.then(taskLoadFonts)
.then(taskCreateUI)
.then(function() {
	var cardX = 30;
	var cardY = 60;
	var cardW = cardRenderer.cardWidth;
	var cardH = cardRenderer.cardHeight;
	var template = {
		type: 'unit',
		cost: 1, att: 1, hp: 2,
		name: 'Card of Awesomeness',
		text: '[Termination]: Put a random [ExoMarine] from your hand into the battlefield.',
		portrait: 'orbitaljumper'
	};
	var card, cardCanvas;
	var portraits = {unit: [], action: []};
	var parts = cardRenderer.atlas.parts;

	// Card set up
	(function() {
		card = $('<div>')
			.css({
				position: 'absolute',
				left: cardX, top: cardY,
				width: cardW, height: cardH,
				//transform: 'translate3d('+cardX+'px, '+cardY+'px, 0px) scale(1, 1)'
			})
			.appendTo(document.body);
		cardCanvas = cardRenderer.createCanvas(cardW, cardH);
		$(cardCanvas)
			.css({position: 'absolute'})
			.appendTo(card);
		$('#export').click(function() {
			var dataURL = cardCanvas.toDataURL('image/png');
			window.open(dataURL, 'Card', 'menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=336,height=460');
			var canvas = cardRenderer.createCanvas(cardW,cardH);
			cardRenderer.drawAtlasPart(
				canvas.getContext('2d'), template.portrait, 0, 0);
			var data = {};
			for(var key in template) data[key] = template[key];
			data.image = canvas.toDataURL();
			console.log(data.image.length);
			console.log(JSON.stringify(data).length);
			console.log(JSON.stringify(data));
			//var portrait = template
			//console.log(atlas.images);
			//console.log(portraits[template.type]);
			//console.log(portraits[template.type][template.portrait]);
			//console.log(atlas.images[template.portrait]);
			//console.log(atlas.images[template.portrait].toDataUrl());
			//template.portrait =
			//window.prompt('Your Card', JSON.stringify(template));
		});
	})();
	// Card type
	(function() {
		$('#cardtype button')
		.click(function() {
			$(this).addClass('active').siblings().removeClass('active');
			template.type = $('#cardtype .active').val();
			template.portrait = portraits[template.type][0];
			updatePortraitDropdown();
			paintCard(template, true, function() {
				$('#portrait').text(template.portrait);
				if(template.type == 'action') {
					$('#att-up,#att-dn,#hp-up,#hp-dn').hide();
				} else {
					$('#att-up,#att-dn,#hp-up,#hp-dn').show();
				}
		 	});
		 });
	})();
	// Card stats
	(function() {
		$('<span id="cost-up" class="glyphicon-menu-up" data-key="cost" data-val="+1"></span>'+
			'<span id="cost-dn" class="glyphicon-menu-down" data-key="cost" data-val="-1"></span>'+
			'<span id="att-up" class="glyphicon-menu-up" data-key="att" data-val="+1"></span>'+
			'<span id="att-dn" class="glyphicon-menu-down" data-key="att" data-val="-1"></span>'+
			'<span id="hp-up" class="glyphicon-menu-up" data-key="hp" data-val="+1"></span>'+
			'<span id="hp-dn" class="glyphicon-menu-down" data-key="hp" data-val="-1"></span>'
		 )
		.addClass('glyphicon')
		.click(function(e) {
			e.preventDefault();
			template[this.dataset.key] += parseInt(this.dataset.val);
			template[this.dataset.key] = Math.max(0, template[this.dataset.key]);
			paintCard(template, false);
		})
		.appendTo(card);
		$('#cost-up').css({left: 70, top: 19});
		$('#cost-dn').css({left: 70, top: 59});
		$('#att-up').css({left: 70, top: 361+19});
		$('#att-dn').css({left: 70, top: 361+59});
		$('#hp-up').css({left: 240+70, top: 361+19});
		$('#hp-dn').css({left: 240+70, top: 361+59});
	})();
	// Title
	(function() {
		function updateTitle() {
			template.name = $('#title').val();
			$('#title').hide();
			$('#titlehotspot').show();
			paintCard(template, false);
		}
		$('<input id="title" type="text"></input>')
		.css({
			position: 'absolute', display: 'table-cell',
			left: 0, top: 226, width: 336, height: 40, lineHeight: '40px',
			padding: 0, border: 0,
			fontSize: 32, textAlign: 'center',
			color: '#fff', fontFamily: 'ProximaNova', fontWeight: 'bold',
			backgroundColor: 'rgba(0,0,0,0.75)'
		})
		.val(template.name)
		.hide()
		.focusout(updateTitle)
		.keypress(function(e) {if(e.which == 13) updateTitle();})
		.appendTo(card);
		$('<div id="titlehotspot"></div>')
		.css({position: 'absolute', left: 33, top: 226, width: 279, height: 40, cursor: 'text'})
		.click(function() {
			$('#title').toggle().focus();
			$(this).hide();
		})
		.appendTo(card);
	})();
	// Text
	(function() {
		$('<div id="text" contentEditable="true"></div>')
		.css({
			position: 'absolute',
			left: 71, top: 312, width: 194, height: 104, verticalAlign: 'middle',
			padding: 4, border: 0,
			fontSize: '21px', lineHeight: '20px', textAlign: 'center',
			color: '#000', fontFamily: 'ProximaNova', fontWeight: 'normal',
			backgroundColor: 'rgba(255,255,255,0.85)'
		})
		.text(template.text)
		.hide()
		.focusout(updateText)
		.keypress(function(e) {if(e.which == 13) updateText();})
		.appendTo(card);
		$('<div id="texthotspot"></div>')
		.css({position: 'absolute', left: 73, top: 314, width: 190, height: 100, cursor: 'text'})
		.click(function() {
			$('#text').toggle().focus();
			$(this).hide();
		})
		.appendTo(card);
	})();
	// Portrait Selection
	(function() {
		$('<div class="dropdown-container"><div class="dropdown">'+
			'<div class="btn btn-default btn-lg dropdown-toggle" id="portrait" data-toggle="dropdown"></div>'+
			'<ul class="dropdown-menu scrollable-menu"></ul></div>')
		.appendTo(card);
		Object.keys(parts).forEach(function(partName) {
			var part = parts[partName];
			if(part.alpha == 'unitalphainv') {
				portraits.unit.push(partName);
			} else if(part.alpha == 'actionalphainv') {
				portraits.action.push(partName);
			}
		});
	})();
	// Portrait Cam
	(function() {
		$('<span id="camera" class="glyphicon-camera"></span>')
		.addClass('glyphicon')
		.css({left: 256, top: 20})
		.click(function(e) {
			e.preventDefault();
			var portrait, alphaMask,  vidx, vidy, vidw, vidh;
			var portraitCanvas = document.createElement('canvas');
			portraitCanvas.width = cardW;
			$(portraitCanvas).appendTo(card);
			if(template.type == 'unit') {
				portrait = 'camera-unit';
				portraitCanvas.height = cardH;
				alphaMask = 'unitalphainv';
				vidy = 57;
				vidh = 330;
				$(portraitCanvas).css({position: 'absolute', left: 40, top: -11, width: 256, height: 350});
			} else if(template.type == 'action') {
				portrait = 'camera-action';
				portraitCanvas.height = 230;
				alphaMask = 'actionalphainv';
				vidy = 20;
				vidh = 200;
				$(portraitCanvas).css({position: 'absolute', left: 0, top: 0,
					width: portraitCanvas.width, height: portraitCanvas.height});
			}
			if(portraits[template.type].indexOf(portrait) === -1) portraits[template.type].unshift(portrait);
			updatePortraitDropdown();
			var atlas = cardRenderer.atlas;
			atlas.images[portrait] = portraitCanvas;
			atlas.parts[portrait] = {
				atlas: portrait, x: 0, y: 0,
				w: portraitCanvas.width, h: portraitCanvas.height, alpha: alphaMask
			};
			template.portrait = portrait;
			var countdownDiv = $('<div id="countdown">Accessing camera...<br>(Click "allow" above)</div>')
			.css({
				position: 'absolute', left: 0, top: 0,
				width: cardW, height: cardH, paddingTop: 100,
				textAlign: 'center', fontSize: '20px', color: '#fff', background: 'rgba(0,0,0,0.7)'
			})
			.appendTo(card);
			var ctx = portraitCanvas.getContext('2d');
			ctx.fillStyle = 'rgba(0,0,0,0.9)';
    	ctx.fillRect(0, 0, cardW, cardH);
			ctx.globalCompositeOperation = 'destination-out';
			cardRenderer.drawAtlasPart(ctx, alphaMask, 0, 0, portraitCanvas.width, portraitCanvas.height);
			ctx.globalCompositeOperation = 'source-over';
			getVideo().then(function(video) {
				vidw = vidh/video.videoHeight*video.videoWidth;
				vidx = Math.round((cardW - vidw)/2);
				var rafId;
				function paintPreview(timestamp) {
					rafId = requestAnimationFrame(paintPreview);
					ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, vidx, vidy, vidw, vidh);
					ctx.globalCompositeOperation = 'destination-out';
					cardRenderer.drawAtlasPart(ctx, alphaMask, 0, 0, portraitCanvas.width, portraitCanvas.height);
					ctx.globalCompositeOperation = 'source-over';
				}
				rafId = requestAnimationFrame(paintPreview);
				var countdown = 3;
				$('#countdown')
				.css({paddingTop: 200, fontSize: '60px', color: 'red', background: 'none'})
				.text(countdown);
				var interval = setInterval(function() {
					countdown--;
					if(countdown < 0) {
						clearInterval(interval);
						cancelAnimationFrame(rafId);
						countdownDiv.remove();
						$(portraitCanvas).remove();
						paintCard(template, false);
						stopVideo();
					}
					$('#countdown').text(countdown);
				}, 1000);
			});
		})
		.appendTo(card);
	})();
	// Portrait Image
	(function() {
		var isDragging = false;
		var dropzone;
		function paintCanvas(canvas, frame, alphaMask) {
			canvas.width = document.documentElement.clientWidth;
			canvas.height = document.documentElement.clientHeight;
			var ctx = canvas.getContext('2d');
			ctx.beginPath();
			ctx.fillStyle = 'rgba(0,0,0,0.7)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.closePath();
			cardRenderer.drawAtlasPart(ctx, frame, cardX, cardY);
			ctx.globalCompositeOperation = 'destination-out';
			cardRenderer.drawAtlasPart(ctx, alphaMask, cardX, cardY,
																 cardW, alphaMask=='actionalpha'?230:cardH);
			ctx.globalCompositeOperation = 'source-over';
		}
		function showPortraitImage(img) {
			return new Promise(function(resolve, reject) {
				function handleResize() {
					paintCanvas(canvas, frame, alphaMask);
				}
				var bounds, frame, alphaMask;
				if(template.type == 'unit') {
					frame = 'unit';
					alphaMask = 'unitalpha';
					bounds = {
						left: 30, top: 56,
						right: 30+276, bottom: 56+332,
						width: 276, height: 332
					};
				} else {
					frame = 'actioncard';
					alphaMask = 'actionalpha';
					bounds = {
						left: 44, top: 28,
						right: 44+248, bottom: 28+186,
						width: 248, height: 186
					};
				}
				var aspect = img.width/img.height;
				var portraitW = bounds.width;
				var portraitH = Math.round(bounds.width/aspect);
				if(portraitH < bounds.height) {
					portraitH = bounds.height;
					portraitW = Math.round(bounds.height*aspect);
				}
				var portraitLeft = Math.round(bounds.left - (portraitW-bounds.width)/2);
				var portraitTop = Math.round(bounds.top - (portraitH-bounds.height)/2);
				var portrait = $('<div>').appendTo(card)
					.css({
						position: 'absolute', left: 0, top: 0,
						width: cardW, height: cardH,
						zIndex: 20, background: '#000'
					})
				$(img).appendTo(portrait)
					.css({
						position: 'absolute', left: portraitLeft, top: portraitTop,
						width: portraitW, height: portraitH,
						border: '1px dotted blue',
						zIndex: 21, pointerEvents: 'none'
					});
				var imgFrame = $('<div>').appendTo(portrait)
					.css({
						position: 'absolute', left: portraitLeft, top: portraitTop,
						width: portraitW, height: portraitH,
						border: '1px dashed rgba(255,255,255,0.8)',
						zIndex: 23, cursor: 'move'
					})
					.on('mousedown', function(e) {
						cancelEvent(e);
						var src = elToRect(imgFrame);
						startDragging(e, function(e, dx, dy) {
							var dst = applyBounds(bounds, src, 1, dx, dy);
							var css = {
								left: Math.round(dst.left),
								top: Math.round(dst.top),
								width: Math.round(dst.right-dst.left),
								height: Math.round(dst.bottom-dst.top)
							};
							imgFrame.css(css);
							$(img).css(css);
						});
					})
					.on('mousewheel', function(e) {
						cancelEvent(e);
						var src = elToRect(imgFrame);
						var scale = 1+Math.sign(e.deltaY)*0.1;
						var dst = applyBounds(bounds, src, scale, 0, 0);
						var css = {
							left: Math.round(dst.left),
							top: Math.round(dst.top),
							width: Math.round(dst.right-dst.left),
							height: Math.round(dst.bottom-dst.top)
						};
						imgFrame.css(css);
						$(img).css(css);
					});
				$('<div class="resizehandle">').appendTo(imgFrame)
					.on('mousedown', function(e) {
						var src = elToRect(imgFrame);
						var w = src.right - src.left;
						var h = src.bottom - src.top;
						startDragging(e, function(e, dx, dy) {
							var scale = 1+dx/w;
							var dx = -(w-w*scale)/2;
							var dy = -(h-h*scale)/2;
							var dst = applyBounds(bounds, src, scale, dx, dy);
							var dx = src.left - dst.left;
							var dy = src.top - dst.top;
							dst.left += dx; dst.right += dx;
							dst.top += dy; dst.bottom += dy;
							var css = {
								left: Math.round(dst.left),
								top: Math.round(dst.top),
								width: Math.round(dst.right-dst.left),
								height: Math.round(dst.bottom-dst.top)
							};
							imgFrame.css(css);
							$(img).css(css);
						});
					});
				var canvas = document.createElement('canvas');
				paintCanvas(canvas, frame, alphaMask);
				window.addEventListener('resize', handleResize);
				$(canvas).appendTo(portrait)
					.css({
						position: 'absolute', left: -cardX, top: -cardY,
						zIndex: 22, pointerEvents: 'none'
					});
				$('<span class="glyphicon glyphicon-ok"></span>').appendTo(portrait)
					.css({left: 266, top: 400, zIndex: 30, color: 'green', borderColor: 'green'})
					.click(function(e) {
						window.removeEventListener('resize', handleResize);
						var pos = elToRect(imgFrame);
						portrait.remove().empty();
						portrait = undefined;
						img.remove();
						resolve(img);
					});
				$('<span class="glyphicon glyphicon-remove"></span>').appendTo(portrait)
					.css({left: 70, top: 400, zIndex: 30, color: 'red', borderColor: 'red'})
					.click(function(e) {
						window.removeEventListener('resize', handleResize);
						portrait.remove().empty();
						portrait = undefined;
						reject();
					});
			});
		}
		function startPortraitDrag(e) {
			cancelEvent(e);
			if(isDragging) return;
			isDragging = true;
			$(document).off('dragenter', startPortraitDrag)
			dropzone = $('<div>').appendTo(document.body)
				.css({
					position: 'absolute', left: 0, top: 0,
					width: '100%', height: '100%', zIndex: 1000,
					background: 'rgba(255,0,0,0.3)',
					border: '4px dashed red'
				})
				.on('dragleave', stopPortraitDrag)
				.on('drop', function(e) {
					if(!isDragging) return;
					stopPortraitDrag(e);
					$(document).off('dragenter', startPortraitDrag)
					loadLocalImage(e.originalEvent.dataTransfer.files[0], FILE_MAX_SIZE, validFileTypes)
					.catch(function() {
						// Try loading URL
						var url = e.originalEvent.dataTransfer.getData('text/uri-list');
						console.log('Dropped URL:', url);
						if(url !== '') {
							var img = new Image();
							img.crossOrigin = 'anonymous';
							//img.src = 'http://crossorigin.me/'+url;
							img.src = url;
							return imgToPromise(img);
						}
						throw err;
					})
					.then(showPortraitImage)
					.then(function(img) {
						var portrait, alphaMask, portraitHeight;
						if(template.type == 'unit') {
							portrait = 'Uploaded Unit';
							alphaMask = 'unitalphainv';
							portraitHeight = cardH;
						} else {
							portrait = 'Uploaded Action';
							alphaMask = 'actionalphainv';
							portraitHeight = 230;
						}
						var atlas = cardRenderer.atlas;
						var canvas = document.createElement('canvas');
						atlas.images[portrait] = canvas;
						atlas.parts[portrait] = {
							atlas: portrait, x: 0, y: 0,
							w: cardW, h: portraitHeight, alpha: alphaMask
						};
						template.portrait = portrait;
						if(portraits[template.type].indexOf(portrait) === -1) {
							portraits[template.type].unshift(portrait);
						}
						updatePortraitDropdown();
						canvas.width = cardW; canvas.height = portraitHeight;
						var ctx = canvas.getContext('2d');
						ctx.beginPath();
						ctx.fillStlye = 'red';
						ctx.fillRect(0, 0, canvas.width, canvas.height);
						ctx.closePath();
						ctx.drawImage(
							img,
							0, 0, img.width, img.height,
							parseFloat(img.style.left), parseFloat(img.style.top),
							parseFloat(img.style.width), parseFloat(img.style.height)
						);
						ctx.globalCompositeOperation = 'destination-out';
						cardRenderer.drawAtlasPart(ctx, alphaMask,
																			 0, 0, canvas.width, canvas.height);
						ctx.globalCompositeOperation = 'source-over';
						paintCard(template, false);
						$(document).on('dragenter', startPortraitDrag);
					})
					.catch(function(err) {
						console.log('Final Catch');
						$(document).on('dragenter', startPortraitDrag);
						if(err !== undefined) {
							alert('Error loading image: '+err.message);
						}
					});
				});
		}
		function stopPortraitDrag(e) {
			cancelEvent(e);
			if(!isDragging) return;
			isDragging = false;
			dropzone.remove();
			dropzone = undefined;
			$(document).on('dragenter', startPortraitDrag);
		}
		$(document)
			.on('dragenter', startPortraitDrag)
			.on('dragover', cancelEvent)
			.on('dragleave', cancelEvent)
			.on('drop', cancelEvent);
	})();

	// Rendering
		function updateText() {
			template.text = $('#text').text();
			$('#text').hide();
			$('#texthotspot').show();
			paintCard(template, false);
		}
		function updatePortraitDropdown() {
			var portraitUl = $('#portrait').siblings('ul');
			$('#portrait').text(template.portrait);
			portraitUl.empty();/*
			portraits[template.type].forEach(function(portrait) {
				$('<li><a href="#">'+portrait+'</a></li>').click(onPortraitClick).appendTo(portraitUl);
			});*/
		}
		function onPortraitClick(event) {
			event.preventDefault();
			var toggle = $(this).closest('.dropdown').find('.dropdown-toggle');
			toggle.text($(this).text());
			template.portrait = $(this).text();
			paintCard(template, false);
		}
		function showCard(template, animate) {
			$('#cardtype button[value='+template.type+']').button('toggle');
			var elem = $('#portrait').parents('.dropdown').find('a')
				.filter(function() {return $(this).text() == template.portrait;});
			if(elem) {
				$('#portrait').text(template.portrait);
			}
			updatePortraitDropdown();
			paintCard(template, animate);
		}
		function paintCard(template, animate, onDraw) {
			function redraw() {
				if(onDraw) onDraw();
				cardCanvas.getContext('2d').clearRect(0, 0, cardCanvas.width, cardCanvas.height);
				cardRenderer.drawCardFront(cardCanvas, template, false);
				cardRenderer.drawCardText(cardCanvas, template, false).then(function() {
					if(!animate) return;
					TweenMax.to(card, 0.2, {rotationY: 0, ease: Power4.easeOut});
				});
			}
			if(!animate) return redraw();
			TweenMax.to(card, 0.2, {rotationY: 90, ease: Power4.easeIn, onComplete: redraw});
		}
		showCard(template, false);
});

function elToRect(el) {
	if(el instanceof jQuery) el = el.get(0);
	return {
		left: parseFloat(el.style.left),
		top: parseFloat(el.style.top),
		right: parseFloat(el.style.left) + parseFloat(el.style.width),
		bottom: parseFloat(el.style.top) + parseFloat(el.style.height)
	};
}

function startDragging(e, onDragHandler, onDropHandler) {
	cancelEvent(e);
	var dX = e.clientX;
	var dY = e.clientY;
	function onDrag(e) {
		if(e.buttons === 0) return onRelease(e);
		cancelEvent(e);
		if(typeof onDragHandler === 'function')
			onDragHandler(e, e.clientX-dX, e.clientY-dY);
	}
	function onRelease(e) {
		cancelEvent(e);
		document.removeEventListener('mousemove', onDrag, true);
		document.removeEventListener('mouseup', onRelease, true);
		if(typeof onDropHandler === 'function')
			onDropHandler(e, e.clientX-dX, e.clientY-dY);
	}
	document.addEventListener('mousemove', onDrag, true);
	document.addEventListener('mouseup', onRelease, true);
}

function applyBounds(bounds, src, scale, dx, dy) {
	function hitTest(a, b, c, dir) {
		a = Math.round(a * 1e9)/1e9;
		b = Math.round(b * 1e9)/1e9;
		c = Math.round(c * 1e9)/1e9;
		var hit = c > b;
		if(dir === -1) hit = c < b;
		var dist = c-a;
		var beforeHit = b-a;
		var progress = 1;
		if(hit && dist !== 0) progress = beforeHit/dist;
		return {hit: hit, progress: progress};
	}
	if(scale === 1 && Math.round(dx) === 0 && Math.round(dy) === 0) return src;
	var keys = ['left', 'top', 'right', 'bottom'];
	var dirs = [1, 1, -1, -1];
	var w = src.right - src.left;
	var h = src.bottom - src.top;
	var x = src.left + w/2;
	var y = src.top + h/2;
	x += dx; y += dy;
	w *= scale; h *= scale;
	var dst = {
		left: x - w/2,
		top: y - h/2,
		right: x + w/2,
		bottom: y + h/2
	};
	var hitInfo = keys.reduce(function(prev, edge, i, array) {
		var hitInfo = hitTest(src[edge], bounds[edge], dst[edge], dirs[i]);
		if(hitInfo.hit && hitInfo.progress < prev.progress) {
			hitInfo.edge = edge;
			return hitInfo;
		}
		return prev;
	}, {hit: false, progress: Number.POSITIVE_INFINITY})
	if(!hitInfo.hit) return dst;
	keys.forEach(function(edge, i) {
		dst[edge] = src[edge] + (dst[edge]-src[edge]) * hitInfo.progress;
	});
	if(hitInfo.progress >= 1) return dst;
	var restDx = 0, restDy = 0;
	if(hitInfo.edge == 'left' || hitInfo.edge == 'right') {
		restDy = dy*(1-hitInfo.progress);
	} else {
		restDx = dx*(1-hitInfo.progress);
	}
	if(Math.round(restDx) === 0 && Math.round(restDy) === 0) {
		return dst;
	}
	return applyBounds(bounds, dst, 1, restDx, restDy);
}

var currentVideoStream, currentVideo;
function stopVideo() {
	if(currentVideo !== undefined) {
		currentVideo.pause();
		currentVideoStream.stop();
		currentVideoStream = undefined;
	}
}

function getVideo() {
	navigator.getMedia = (
		navigator.getMedia ||
		navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia ||
		navigator.msGetUserMedia);
	console.time('getUserMedia');
	return new Promise(function(resolve, reject) {
		navigator.getMedia({video: true, audio: false}, function(stream) {
			console.timeEnd('getUserMedia');
			console.time('Enable video');
			var video = document.createElement('video');
			currentVideoStream = stream;
			currentVideo = video;
			video.src = window.URL.createObjectURL(stream);
			video.play();
			video.addEventListener('canplay', function(ev) {
				console.timeEnd('Enable video');
				resolve(video);
			}, false);
		}, reject);
	});
}

function taskLoadModules(moduleNames) {
	console.time('Load modules');
	return require(moduleNames).then(function(modules) {
		CardRenderer = modules[0];
		console.timeEnd('Load modules');
	});
}

function taskCreateCardRenderer() {
	cardRenderer = new CardRenderer(cardRendererOptions);
}

function taskLoadFonts() {
	console.time('Load fonts');
	return promisePar(fontResources, CardRenderer.loadFontResource)
	.then(function() {console.timeEnd('Load fonts');});
}

function taskLoadAtlas() {
	console.time('Load atlas');
	return cardRenderer.loadAtlasResource(atlasJsonUrl)
	.then(function() {console.timeEnd('Load atlas');});
}

function taskLoadCardTemplates() {
	console.time('Load cardTemplates json');
	return CardRenderer.loadJsonResource(cardTemplatesUrl).then(function(cardTemplates) {
		cardRenderer.cardTemplates = cardTemplates;
		console.timeEnd('Load cardTemplates json');
	});
}

function taskCreateUI() {
	$('.loader').remove();
	$('<div class="btn-toolbar" role="toolbar">'+
		'<div class="btn-group" role="group">'+
		'<button type="button" class="btn btn-default" id="export">Export</button>'+
		'</div>'+
		'<div id="cardtype" class="btn-group" role="group">'+
		'<button type="button" class="btn btn-default" value="unit">Unit</button>'+
		'<button type="button" class="btn btn-default" value="action">Action</button>'+
		'</div>'+
		'</div>'
	 ).appendTo(document.body);
}

})();
