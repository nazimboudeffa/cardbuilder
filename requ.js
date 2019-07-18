function require(urls) {
	if(!(urls instanceof Array)) urls = [urls];
	return Promise.all(urls.map(function(url) {
		return fetch(url)
			.then(function (response) {
				return response.text();
			})
			.then(function(scriptText) {
			var _module = {exports: {}};
			eval('(function (module, exports) { ' + scriptText + '\n//*/\n})(_module, _module.exports);\n//# sourceURL=' + url);
			return _module.exports;
		});
	}));
}

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

function cancelEvent(e) {
	e.stopPropagation();
	e.preventDefault();
}

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

function throttle(type, name, obj) {
	var obj = obj || window;
	var running = false;
	var func = function() {
		if (running) { return; }
		running = true;
		requestAnimationFrame(function() {
			obj.dispatchEvent(new CustomEvent(name));
			running = false;
		});
	};
	obj.addEventListener(type, func);
};

function loadRemoteImage(url) {
	var img = new Image();
	img.crossOrigin = 'anonymous';
	img.src = url;
	return imgToPromise(img);
}

function loadLocalImage(file, maxSize, acceptedTypes) {
	return new Promise(function(resolve, reject) {
		if(file.size > (maxSize || 1024*1024)) {
			return reject(new Error('File exceeds maximum size: '+file.size+' > '+maxSize));
		}
		if(acceptedTypes !== undefined && acceptedTypes.indexOf(file.type) === -1) {
			return reject(new Error('File is of invalid type: "'+file.type+'"'));
		}
		var fileReader = new FileReader();
		fileReader.readAsDataURL(file);
		fileReader.onerror = function(e) {
			reject(new Error('Error while loading file: '+ e));
		};
		fileReader.onloadend = function () {
			var img = new Image();
			img.crossOrigin = 'anonymous';
			img.src = fileReader.result;
			resolve(imgToPromise(img));
		};
	});
}
