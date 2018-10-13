(function() {
	var globe,
		tweens = [],
		set = ["medals", "population", "sunshine"];
	
	
	if (!Detector.webgl) {
		prepareBackground();
		Detector.addGetWebGLMessage();
	} else {
		jQuery.ajax({
			url: "input.json"
		}).done(function(data) {
			presentData(data);
		});
	}
	
	
	function prepareBackground() {
		jQuery("body").css("background-image", "none");
	}
	
	
	function presentData(input) {
		window.data = input;
		
		createGlobe();
		prepareMenu();
		
		TWEEN.start();
		
		addData(input);
		visualize();
	}
	
	
	function createGlobe() {
		globe = DAT.Globe(document.getElementById("globe"), function(label) {
			return new THREE.Color([
				0xE18038, 0xE1A638, 0x305496, 0x238C81,
				0xBCC43E, 0x85B73A, 0xA6346A, 0x6D2D84,
				0xBC3E88, 0xEA4D51, 0x46C03F, 0xAEDD49,
				0x3FA1CB, 0x4E61D3, 0xFFCB47, 0xFFA847,
				0x6CAB37, 0x2A845D, 0xC0633E, 0xAC375A][label]);
		});
	}
	
	
	function prepareMenu() {
		for (var i = 0; i < set.length; i++) {
			var mode = document.getElementById(set[i]);
			mode.addEventListener("mouseover", changeView(globe, i), false);
		}
	}
	
	
	function addData(data) {
		for (i = 0; i < data.length; i++) {
			var name = data[i][0];
			var values = data[i][1];
			
			globe.addData(values, {format: "legend", name: name, animated: true});
		}
	}
	
	
	function visualize() {
		globe.createPoints();
		changeView(globe, 0)();
		globe.animate();
	}
	
	
	function changeView(globe, t) {
		return function() {
			new TWEEN.Tween(globe).to({time: t / (set.length - 1)}, 500).easing(TWEEN.Easing.Cubic.EaseOut).start();
			
			var mode = document.getElementById(set[t]);
			if (mode.getAttribute("class") === "set active") {
				return;
			}
			
			var modes = document.getElementsByClassName("set");
			for (var i = 0; i < modes.length; i++) {
				modes[i].setAttribute("class", "set");
			}
			
			mode.setAttribute("class", "set active");
		};
	}
})();