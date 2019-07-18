(function(){
'use strict';

var codeSnippets = (function() {
  var thickOutlineCss = 'text-shadow: '+
		'-2px -2px 0 #000, -1px -2px 0 #000, -0px -2px 0 #000, +1px -2px 0 #000, +2px -2px 0 #000,'+
		'-2px -1px 0 #000, +2px -1px 0 #000,'+
		'-2px +0px 0 #000, +2px +0px 0 #000,'+
		'-2px +1px 0 #000, +2px +1px 0 #000,'+
		'-2px +2px 0 #000, -1px +2px 0 #000, +0px +2px 0 #000, +1px +2px 0 #000, +2px +2px 0 #000;';
  var thinOutlineCss = 'text-shadow: 0px 0px 0.7px #fff;';
  var textCss =
		'position: absolute; display: table-cell; text-align: center; '+
		'color: hsla(180, 100%, 100%, 1); font-family: \'ProximaNova\';';
	var statCss = textCss+thickOutlineCss+
		'width: 120px; height: 60px;'+
		'line-height: 60px; font-size: 60px; font-weight: bold;';
	var costCss = statCss+'top: 19px; left: -12px;';
	var attCss = statCss+'top: 380px; left: -12px;';
	var hpCss = statCss+'top: 380px; left: 228px;';
	var attUnitCss = statCss+'top: 370px; left: -12px;';
	var hpUnitCss = statCss+'top: 370px; left: 228px;';
	var titleCss = textCss+thickOutlineCss+
		'top: 226px; left: -1000px; width: 2336px; height: 40px;'+
		'line-height: 40px; font-size: 32px; white-space: nowrap;';
	var titleBoxCss =
		'position: absolute; top: 226px; left: 33px; width: 270px; height: 40px;'+
		'border: 1.5px solid #9d8275; background-color: rgba(0,0,0,0.65);';

	var descriptionCss = textCss+
    //'text-shadow: 0px 0px 1px #000, 0px 0px 2px #fff, 0px 0px 2px #fff, 0px 0px 2px #fff;'+
		'position: relative; top: 314px; left: 73px; width: 190px; height: 100px;'+
		'vertical-align: middle; color: black;'+
		'font-size: 21px; line-height: 20px; letter-spacing: -1px;';
  return {
    css: {
      cost: costCss,
      att: attCss,
      hp: hpCss,
      unit_att: attUnitCss,
      unit_hp: hpUnitCss,
      title: titleCss,
      titleBox: titleBoxCss,
      description: descriptionCss
    }
  };
})();


function CardRenderer(opts) {
  this.opts = opts;
  this.cardWidth = 336;
  this.cardHeight = 460;
  this.cardTemplates = [];
  this.atlas = {parts: {}, images: {}};
  this.textWidthCanvas = this.createCanvas(0, 0);
  this.textWidthCtx = this.textWidthCanvas.getContext('2d');
  this.textWidthCtx.font = 'bold 32px \'ProximaNova\'';
}

CardRenderer.v = '0.0.1';

CardRenderer.unitcardTransform = {
	left: 40, top: -11,
	width: 256, height: 350
};

CardRenderer.prototype.drawCardFront = function(canvas, template, isUnit) {
  var w = this.cardWidth;
  var h = this.cardHeight;
	var ctx = canvas.getContext('2d');
	/*
  this.applyCss(canvas, {
 		position: 'absolute', left: 0, right: 0,
    backfaceVisibility: 'hidden'
  });
	*/
  if(template.type == 'action') { // action card
		this.drawAtlasPart(ctx, 'actioncard', 0, 0);
		this.drawAtlasPart(ctx, template.portrait, 0, 0, 336, 230);
		this.drawAtlasPart(ctx, 'cost', 8, 9, 80, 80);
  } else if(isUnit) { // unit
		this.drawAtlasPart(ctx, 'unit', 0, 0);
		this.drawAtlasPart(ctx, template.portrait, 0, 0);
		this.drawAtlasPart(ctx, 'att', 8, 360, 80, 80);
		this.drawAtlasPart(ctx, 'hp', 248, 360, 80, 80);
  } else { // unit card
		this.drawAtlasPart(ctx, 'unitcard', 0, 0);
		var trans = CardRenderer.unitcardTransform;
		this.drawAtlasPart(ctx, template.portrait, trans.left, trans.top, trans.width, trans.height);
		this.drawAtlasPart(ctx, 'cost', 8, 9, 80, 80);
		this.drawAtlasPart(ctx, 'att', 8, 370, 80, 80);
		this.drawAtlasPart(ctx, 'hp', 248, 370, 80, 80);
  }
  ctx.font = '20px ProximaNova';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillText(template.name, w/2, 80);
  return canvas;
};

CardRenderer.prototype.drawAtlasPart = function(ctx, partName, x, y, w, h) {
	//console.error('drawAtlasPart(ctx, "%s", %s, %s);', part, x, y, w || this.cardWidth, h || this.cardWidth);
	var part = this.atlas.parts[partName];
	if(part === undefined) {
		console.error('Invalid atlas part: "%s"', partName);
		return;
	}
	var img = this.atlas.images[part.atlas];
	if(w === undefined) w = this.cardWidth;
	if(h === undefined) h = this.cardHeight;
	ctx.drawImage(img, part.x, part.y, part.w, part.h, x, y, w, h);
};

CardRenderer.prototype.drawCardText = function(canvas, template, isUnit) {
  var w = this.cardWidth;
  var h = this.cardHeight;
	var ctx = this.createCanvas(w, h).getContext('2d');
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, w, h);
  var svg = this.generateSvg(template, isUnit);
  var img = new Image(this.cardWidth, this.cardHeight);
  img.src = 'data:image/svg+xml;base64,'+btoa(svg);
  return imgToPromise(img).then(function(img) {
    canvas.getContext('2d').drawImage(img, 0, 0);
    return img;
  });
};

CardRenderer.prototype.generateSvg = function(template, isUnit) {
	var svg = '';
  svg += '<svg xmlns="http://www.w3.org/2000/svg" width="336" height="460">'+
		'<foreignObject width="100%" height="100%">'+
    '<div xmlns="http://www.w3.org/1999/xhtml" style="position: absolute; width: 336px; height: 460px;">';
  if(template.type === 'action') {
    svg += this.generateSvgSnippet('cost', template.cost);
    svg += this.generateSvgSnippet('titleBox');
    var titleCss = codeSnippets.css.title;
    var titleSpace = 250;
    var titleWidth =  this.getTextWidth(template.name);
    if(titleWidth > titleSpace) {
      var titleScale = titleSpace / this.getTextWidth(template.name);
      titleCss += 'transform: scale('+titleScale.toFixed(3)+', 1);';
    }
    svg += this.generateSvgSnippet('title', template.name, titleCss);
    svg += this.generateSvgSnippet('description', this.formatDescription(template.text));
  } else if(isUnit) {
    svg += this.generateSvgSnippet('unit_att', template.att);
    svg += this.generateSvgSnippet('unit_hp', template.hp);
    svg += this.generateSvgSnippet('title', template.name,
      codeSnippets.css.title+'font-size: 18px; font-weight: normal; top: 384px;');
  } else {
    svg += this.generateSvgSnippet('cost', template.cost);
    svg += this.generateSvgSnippet('att', template.att);
    svg += this.generateSvgSnippet('hp', template.hp);
    svg += this.generateSvgSnippet('titleBox');
    var titleCss = codeSnippets.css.title;
    var titleSpace = 250;
    var titleWidth =  this.getTextWidth(template.name);
    if(titleWidth > titleSpace) {
      var titleScale = titleSpace / this.getTextWidth(template.name);
      titleCss += 'transform: scale('+titleScale.toFixed(3)+', 1);';
    }
    svg += this.generateSvgSnippet('title', template.name, titleCss);
    svg += this.generateSvgSnippet('description', this.formatDescription(template.text));
  }
  svg += '</div></foreignObject></svg>';
  return svg;
};

CardRenderer.prototype.generateSvgSnippet = function(name, text, css) {
  return '<div class="'+name+'" xmlns="http://www.w3.org/1999/xhtml" style="'+
    (css || codeSnippets.css[name])+'">'+
    (text!==undefined?text:'')+'</div>';
};

CardRenderer.prototype.getTextWidth = function(text) {
  return this.textWidthCtx.measureText(text).width;
};

CardRenderer.prototype.formatDescription = function(description) {
  description = description || '';
  if(description.length === 0) {
    return '';
  }
  return description
    .replace(/\[([^\]]+)\]\{([^\}]+)\}/g, '<strong>$1</strong>$2')
		.replace(/\[([^\]]+)\]/g, '<strong>$1</strong>')
		.replace(/\*([^\*]+)\*/g, '<strong>$1</strong>')
		.replace(/(Rapid)-(fire)/gi, '$1&#8209;$2');
};

CardRenderer.prototype.loadAtlasResource = function(atlasJsonUrl) {
  var self = this;
  var atlasNames = [];
  this.atlas = {
    parts: {},
    images: {}
  };
	console.time('Load atlas json');
	return CardRenderer.loadJsonResource(atlasJsonUrl).then(function(atlasParts) {
    console.timeEnd('Load atlas json');
    self.atlas.parts = atlasParts;
    Object.keys(atlasParts).forEach(function(name) {
      var atlasName = atlasParts[name].atlas;
      if(atlasNames.indexOf(atlasName) === -1) {
        atlasNames.push(atlasName);
      }
    });
    return atlasNames.map(function(imageName) {return self.opts.resources[imageName].url;});
	}).then(function(urls) {
	  console.time('Load atlas images');
    return promisePar(urls, CardRenderer.loadImageResource)
		.then(function(images){
      console.timeEnd('Load atlas images');
      return images;
    });
	}).then(function(images) {
    images.forEach(function(img, idx) {
      self.atlas.images[atlasNames[idx]] = img;
    });
	}).then(function(images) {
	  console.time('Apply alpha');
    var parts = self.atlas.parts;
    // Group by atlas
    var alphaParts = {};
    Object.keys(parts).forEach(function(partName) {
      var part = parts[partName];
      alphaParts[part.atlas] = alphaParts[part.atlas] || [];
      if(part.alpha !== undefined) {
        alphaParts[part.atlas].push(part);
      }
    });
    Object.keys(alphaParts).forEach(function(atlasName) {
      var atlasImg = self.atlas.images[atlasName];
      var canvas = self.createCanvas(atlasImg.width, atlasImg.height);
      var ctx = canvas.getContext('2d');
      ctx.drawImage(atlasImg, 0, 0);
      ctx.globalCompositeOperation = 'destination-out';
      alphaParts[atlasName].forEach(function(partWithAlpha) {
        var dx = partWithAlpha.x;
        var dy = partWithAlpha.y;
        var dw = partWithAlpha.w;
        var dh = partWithAlpha.h;
        self.drawAtlasPart(ctx, partWithAlpha.alpha, dx, dy, dw, dh);
      });
      self.atlas.images[atlasName] = canvas;
    });
	  console.timeEnd('Apply alpha');
  });
};

CardRenderer.prototype.loadResources = function() {
  var self = this;
  return Promise.all(this.opts.resources.map(function(res) {
    var resourceReady = false;
    switch(res.type) {
      case 'image': return self.loadImageResource(res.url);
      case 'font': return self.loadFontResource(res);
      default: return Promise.reject('Unkown resource type:'+res.type);
    }
  })).then(function(){
    return self;
  });
};

CardRenderer.prototype.getTemplate = function(id) {
  var template;
  var i = this.cardTemplates.length; while(i--) {
    if(this.cardTemplates[i].id == id) {
      template = this.cardTemplates[i];
      break;
    }
  }
  return template;
};

CardRenderer.prototype.createCanvas = function(width, height) {
	var canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	return canvas;
};

CardRenderer.prototype.applyCss = function(elem, css) {
  var keys = Object.keys(css);
  for(var i = 0; i < keys.length; i++) {
    var name = keys[i];
    var val = css[name];
    if(typeof val === 'number') {
      switch(name) {
        case 'left':
        case 'top':
          val += 'px';
      }
    }
		elem.style[name] = val;
  }
};

// Resource loaders

CardRenderer.loadJsonResource = function(url) {
  return fetch(url).then(function (response) {
		return response.text();
	}).then(function(responseText) {
		return JSON.parse(responseText);
	});
};

CardRenderer.loadImageResource = function(url) {
  var img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = url;
  return imgToPromise(img);
};

CardRenderer.loadFontResource = function(res) {
  var font = {
    name: res.name,
    family: res.fontFamily,
    weight: res.fontWeight,
    src: res.url
  };
  font.css = font.weight+' 32px \''+font.family+'\'';
  var css = '@font-face {'+
    'font-family: \''+font.family+'\';'+
    'font-weight: '+font.weight+';'+
    'src: url('+font.src+') format(\'woff2\');'+
    '}';
  var style = document.createElement('style');
  font.style = style;
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(style);
  return document.fonts.load(font.css);
};

// Helpers
  function imgToPromise(img) {
    return new Promise(function(resolve, reject) {
      if(img.complete) return resolve(img);
      img.onload = function() {
        resolve(img);
      };
      img.onerror = function() {
        reject(new Error('Error loading image: '+img.src));
      };
    });
  };

  function promiseSer(tasks, f) {
    return tasks.reduce(function(p, task, idx) {
      return p.then(function() {
        f(task, idx);
      });
    }, Promise.resolve());
  }

  function promisePar(tasks, f) {
    return Promise.all(tasks.map(function(task, idx) {
      return f(task, idx);
    }));
  }


// export in common js
if( typeof module !== "undefined" && ('exports' in module)){
	module.exports = CardRenderer;
}
})();
