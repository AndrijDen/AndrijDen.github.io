function slide(wrapper, prev, next, screenSize, smallCarouselWidth, bigCarousel) {
	this.screenSize = screenSize;
	this.items = wrapper.getElementsByClassName("carousel__items")[0];
	this.slides = this.items.getElementsByClassName("carousel__slide");
	this.slideSize = wrapper.clientWidth;
	this.radios = document.getElementById(wrapper.id + "Radios").children;
	this.position = {
		index: 0,
		posX1: 0,
		posX2: 0,
		posInitial: 0,
		posFinal: 0
	};
	this.threshold = (screenSize < 460) ? 50 : 100;
	this.columns = (screenSize < smallCarouselWidth) ? 1 : (screenSize >= 992) ? 3 : 2;
	this.percents = (screenSize < smallCarouselWidth) ? 100 : (screenSize >= 992) ? 33 : 50;

  let addMobileEvents = () => {
  	// Mouse and Touch events
	  this.items.addEventListener("mousedown", this.dragStart, {passive: false});
		// Touch events
	  this.items.addEventListener("touchstart", this.dragStart, {passive: true});
	  this.items.addEventListener("touchend", this.dragEnd, {passive: true});
	  this.items.addEventListener("touchmove", this.dragAction, {passive: true});
  };
  let removeMobileEvents = () => {
		this.items.removeEventListener("mousedown", this.dragStart);
  	this.items.removeEventListener("touchstart", this.dragStart);
  	this.items.removeEventListener("touchend", this.dragEnd);
  	this.items.removeEventListener("touchmove", this.dragAction);
  };
  let addOtherEvents = () => {
  	// Click events
	  prev.addEventListener("click", this.prevListenerFunction);
	  next.addEventListener("click", this.nextListenerFunction);
	  // Transition events
	  this.items.addEventListener("transitionend", this.removeShift);
	  // radio events
	  for (let i = 0; i < this.radios.length; i++) {
			this.radios[i].addEventListener("click", this.moveToSlide, {passive: true});
		}
  };
  let removeOtherEvents = () => {
  	prev.removeEventListener("click", this.prevListenerFunction);
		next.removeEventListener("click", this.nextListenerFunction);
		this.items.removeEventListener("transitionend", this.removeShift);
  };

	//methods
	this.dragStart = (e) => {
		e = e || window.event;
    this.position.posInitial = this.items.offsetLeft;
    if (e.type == "touchstart") {
      this.position.posX1 = e.touches[0].clientX;
    } else {
    	e.preventDefault();
      this.position.posX1 = e.clientX;
      document.addEventListener("mouseup", this.dragEnd, {passive: true});
      document.addEventListener("mousemove", this.dragAction, {passive: true});
    }
	};
	this.dragAction = (e) => {
    e = e || window.event;
    if (e.type == "touchmove") {
      this.position.posX2 = this.position.posX1 - e.touches[0].clientX;
      this.position.posX1 = e.touches[0].clientX;
    } else {
      this.position.posX2 = this.position.posX1 - e.clientX;
      this.position.posX1 = e.clientX;
    }
    this.items.style.left = (this.items.offsetLeft - this.position.posX2) + "px";
  };
	this.dragEnd = (e) => {
		this.position.posFinal = this.items.offsetLeft;
    if (this.position.posFinal - this.position.posInitial < -this.threshold) {
      this.shiftSlide(1, "drag");
    } else if (this.position.posFinal - this.position.posInitial > this.threshold) {
      this.shiftSlide(-1, "drag");
    } else {
      this.items.style.left = (this.position.posInitial) + "px";
    }
    document.removeEventListener("mouseup", this.dragEnd);
    document.removeEventListener("mousemove", this.dragAction);
	};
  this.shiftSlide = (dir, action) => {
    this.items.classList.add("shifting");
    if (!action) {
    	this.position.posInitial = this.items.offsetLeft;
    }
    if (screenSize >= smallCarouselWidth) {
			this.slideSize = this.slides[0].clientWidth;
			this.position.posInitial = -this.position.index * this.slideSize;
		} 
    if (dir == 1) {
    	if (this.position.index + 1 < this.slides.length) {
				this.items.style.left = (this.position.posInitial - this.slideSize) / this.slideSize * this.percents + "%";
        this.position.index++;
    	} else {
				this.items.style.left = this.position.posInitial / this.slideSize * this.percents + "%";
    	}
    }
    if (dir == -1) {
    	if (this.position.index - 1 >= 0) {
				this.items.style.left = (this.position.posInitial + this.slideSize) / this.slideSize * this.percents + "%";
        this.position.index--;
    	} else {
				this.items.style.left = this.position.posInitial / this.slideSize * this.percents + "%";
    	}
    }
    if (dir == 0) {
    	this.items.style.left = -this.position.index * this.percents + "%";
    }
    this.radios[this.position.index].checked = true;
  };
  this.removeShift = () => {
  	this.items.classList.remove("shifting");
  };
  this.prevListenerFunction = () => {
  	this.shiftSlide(-1)
  };
  this.nextListenerFunction = () => {
  	this.shiftSlide(1)
  };
  this.moveToSlide = (e) => {
  	let index = e.target.value;
  	if (index < this.slides.length) {
  		this.position.index = index;
  		this.shiftSlide(0)
  	}
  };
  this.resize = (newScreenSize) => {
  	this.slideSize = wrapper.clientWidth;
  	if ((this.screenSize < smallCarouselWidth) && (newScreenSize >= smallCarouselWidth)) {
	  	removeMobileEvents();
	  	this.threshold = 100;
	  	if (!bigCarousel) {
	  		removeOtherEvents();
	  		this.items.removeAttribute("style");
	  		// this.items.style.removeProperty("width");
	  		// this.items.style.removeProperty("left");
	  	} else {
	  		this.slideSize = this.slides[0].clientWidth;
	  		this.items.style.width = "100%";
	  		if (newScreenSize >= 992) {
	  			this.items.style.left = -this.position.index * 33 + "%";
	  		} else {
	  			this.items.style.left = -this.position.index * 50 + "%";
	  		}
	  	}
  	}
  	if ((this.screenSize >= smallCarouselWidth) && (newScreenSize < smallCarouselWidth)) {
	  	this.threshold = (newScreenSize < 460) ? 50 : 100;
			addMobileEvents();
			if (!bigCarousel) {addOtherEvents()}
			this.items.style.width = (this.slides.length) * 100 + "%";
  		this.items.style.left = "0";
  	}
  	if ((this.screenSize >= smallCarouselWidth) && (newScreenSize > smallCarouselWidth) && (bigCarousel)) {
  		this.slideSize = this.slides[0].clientWidth;
  		if (newScreenSize >= 992) {
  			this.items.style.left = -this.position.index * 33 + "%";
  		} else {
				this.items.style.left = -this.position.index * 50 + "%";
  		}
  	}
  	this.screenSize = newScreenSize;
  	this.columns = (newScreenSize < smallCarouselWidth) ? 1 : (newScreenSize >= 992) ? 3 : 2;
  	this.percents = (newScreenSize < smallCarouselWidth) ? 100 : (newScreenSize >= 992) ? 33 : 50;
  }
	// do some code
	if (this.radios.length == 0) {
		let div = document.getElementById(wrapper.id + "Radios");
		for (let i = 0; i < this.slides.length; i++) {
			let it = document.createElement("input");
			it.type = "radio";
			it.name = wrapper.id;
			it.id = it.name + "Link_" + i;
			it.value = i;
			let ll = document.createElement("label");
			ll.htmlFor = it.id;
			ll.classList.add("radioButton");
			div.appendChild(it);
			div.appendChild(ll);
		}
	}
	this.radios = document.getElementsByName(wrapper.id);
	this.radios[0].checked = true;
	// do more code
  if (screenSize < smallCarouselWidth) {
		this.items.style.width = (this.slides.length) * 100 + "%";
	  this.items.style.left = "0";
		addMobileEvents();
		addOtherEvents();
  } else {
  	if (bigCarousel) {
  		this.slideSize = this.slides[0].clientWidth;
  		this.items.style.width = "100%";
  		if (screenSize >= 992) {
  			this.items.style.left = -this.position.index * 33 + "%";
  		} else {
  			this.items.style.left = -this.position.index * 50 + "%";
  		}
		  addOtherEvents();
  	}
  }

};

$(() => {
	const rootDiv = document.getElementById("root"),
				headerDiv = document.getElementById("headerContainer"),
				headerMenuDiv = document.getElementById("headerMenuContainer"),
				headerTitleDiv = document.getElementById("headerTitleContainer"),
				graphContainer = document.getElementById("graphContainer"),
				carouselWelcomeDiv = document.getElementById("welcomeCarousel"),
				prevWelcomeLink = document.getElementById("prevWelcome"),
				nextWelcomeLink = document.getElementById("nextWelcome"),
				carouselProgramsDiv = document.getElementById("programsCarousel"),
				prevProgramsLink = document.getElementById("prevProgram"),
				nextProgramsLink = document.getElementById("nextProgram"),
				footerFacebookPageDiv = document.getElementById("footerFacebookPage");
	let headerTitleDivHeight = headerTitleDiv.clientHeight;

	const changeHeadersHeight = () => {
		let headerMenuDivHeight = headerMenuDiv.clientHeight;
		let currentHeight = headerTitleDivHeight - window.scrollY;
		if (currentHeight > 0) {
			headerDiv.style.maxHeight = headerMenuDivHeight + currentHeight + "px"
		} else {
			headerDiv.style.maxHeight = headerMenuDivHeight + "px"
		}
	};

	if (rootDiv.clientWidth >= 1200) {
		footerFacebookPageDiv.setAttribute("data-width", "300");
	};

	// header graph
	let countElements = 30;
	let curnode = 0;
	function step(timestamp) {
    nodeId = curnode++;
    if (curnode >= countElements) curnode = 0;
    direction = (Math.round(Math.random()) * 2 - 1) * 0.01;
    window.s.graph.nodes(nodeId).x += direction;
    window.s.graph.nodes(nodeId).y += direction;
    window.s.refresh();
	};
	let g = {
    nodes: [],
    edges: []
  };
  for (i = 0; i < countElements; i++) {
	  g.nodes.push({
	    id: i,
	    x: Math.random(),
	    y: Math.random(),
	    size: Math.random(),
	    color: "rgba(255,255,255,0.5)"
	  });
  }
  for (i = 0; i < countElements * 2; i++) {
    g.edges.push({
      id: i,
      source: (Math.random() * countElements | 0),
      target: (Math.random() * countElements | 0),
      size: Math.random(),
      color: "rgba(204,204,204,0.75)"
    });
  }
 	window.s = new sigma({
   graph: g,
    renderer: {
    	container: graphContainer,
    	type: "canvas"
    },
    settings: {
      scalingMode: "outside",
      mouseWheelEnabled: false
    }
  });
  document.querySelector('.sigma-mouse').remove();
  setInterval(step, 100);

	window.addEventListener("scroll", () => {
		changeHeadersHeight()
	}, {passive: true});
	window.addEventListener("resize", () => {
		let newWindowWidth = window.innerWidth;
		// update header
		headerDiv.style.maxHeight = "none";
		headerTitleDivHeight = headerTitleDiv.clientHeight;
		changeHeadersHeight();
		// update slide
		sliderWelcome.resize(newWindowWidth);
		sliderPropgrams.resize(newWindowWidth);
	});

	// Facebook SDK
	(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); 
	  js.id = id;
	  // change language en_GB/ru_RU/uk_UA
	  js.src = 'https://connect.facebook.net/uk_UA/sdk.js#xfbml=1&version=v3.1';
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	let sliderWelcome = new slide(carouselWelcomeDiv, prevWelcomeLink, nextWelcomeLink, window.innerWidth, 768, true);
	let sliderPropgrams = new slide(carouselProgramsDiv, prevProgramsLink, nextProgramsLink, window.innerWidth, 680, false);

});
