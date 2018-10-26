$(() => {
	const rootDiv = document.getElementById("root"),
				headerDiv = document.getElementById("headerContainer"),
				headerMenuDiv = document.getElementById("headerMenuContainer"),
				headerTitleDiv = document.getElementById("headerTitleContainer"),
				graphContainer = document.getElementById("graphContainer"),
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
});