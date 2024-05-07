/**
* event-Javascript routines
* 
* @author ah <harald.angerer@schule.suedtirol.it>
* @version 20110329
* @package event
*/

// storage object
var store = {};

/**
 * Onload-Funktionen werden eingebunden
 */
function onLoad() {
	var func = function (e) {
		var id = this.id.split('_');
		if (id[1]) {
			setmark(id[1]);
			onmark(id[1]);
		}
	};
	var toggle_info = function (e) {
		var els = this.parentNode.parentNode.childNodes;
		var el;
		for (var i=0; i<els.length;i++) {
			if (els[i].className == 'infotext') {
				if (els[i].style.display == 'block') {
					els[i].style.display = 'none';
				} else {
					els[i].style.display = 'block';
				}
			}
		}
		if (e) {
			e.stopPropagation();
		} else {
			window.event.cancelBubble = true;
		}
		return false;
	};

	var toggle_bio = function (e) {
		var els = this.parentNode.parentNode.childNodes;
		var el;
		for (var i=0; i<els.length;i++) {
			if (els[i].className == 'biotext') {
				if (els[i].style.display == 'block') {
					els[i].style.display = 'none';
				} else {
					els[i].style.display = 'block';
				}
			}
		}
		if (e) {
			e.stopPropagation();
		} else {
			window.event.cancelBubble = true;
		}
		return false;
	};

	var calcHeight = function (classname, tagname) {
		var els = $_class(classname,tagname);
		if (els.length > 0) {
			for (var i=0; i<els.length;i++) {
				els[i].setAttribute('data-height',els[i].offsetHeight + 'px');
				els[i].style.height = '0px';
				//console.log(els[i].getAttribute('data-height'))
			}
		}
	};

	var prevent_choice = function(e) {
		try {
			e.stopPropagation();
		} catch(ex) {
			window.event.cancelBubble = true;
		}		
	}

	// add event handler
	var addHandler = function(eventtype,selector,callback) {
		var elements = document.querySelectorAll(selector);
		if (elements && elements.length > 0) {
			for (i=0;i<elements.length;i++) {
				elements[i][eventtype] = callback;
			}
		}
	}

	// set the handler
	addHandler('onclick','.abstract,.ttitle a',prevent_choice);
	addHandler('onclick','.wschoice',func);
	addHandler('onclick','.wschoicemark',func);
	addHandler('onclick','.group',func);
	addHandler('onclick','.info',toggle_info);
	addHandler('onclick','.bio',toggle_bio);
	
	// get choosen ones on init
	setAllMarks();

	// calc height of wstype-opener-elements
	calcHeight('wstype-opener-container','DIV');
	
	// google maps ggf. loaden
	if ($_get('maproute')) {
		loadGoogleMap();
	}

	// open conditional fields
	condView();
}

/**
 * Zeilenmarkierungen vorbelegen falls input gecheckt
 */
function setAllMarks() {
	var inpobj = $_class('group','INPUT');
	var i,id;
	for (i=0;i < inpobj.length; i++) {
		if (inpobj[i].checked) {
			id = inpobj[i].id.split('_')[1];
			$_addClass('wsrow_'+id,'wschoosen');
		}
	}
}

/**
 * Google-Maps-Funktionen
 */
function loadGoogleMap() {
	if (GBrowserIsCompatible() && $_get('maproute')) {
		var picoords = new GLatLng(maproutelat,maproutelon);
		var map = new GMap2($_get('maproute'));
		map.setCenter(picoords,maproutezoom);
		map.addControl(new GLargeMapControl());
		map.addControl(new GMapTypeControl());
		map.addOverlay(createMarker(picoords));
	}
}
// Creates a marker at the given point with the given number label
function createMarker(point) {
	var marker = new GMarker(point);
	GEvent.addListener(marker, "click", function() {
		location.href = maproutehome;
	});
	return marker;
}

/**
 * Zeilenmarkierungsklasse setzen oder löschen
 * 
 */
function setmark(id, action) {
	var inpobj = $_get('fchreg_'+id);
	var obj = $_get('wsrow_'+id);
	if (inpobj.checked || action == 'uncheck') {
		$_removeClass(obj.id,'wschoosen');
		inpobj.checked = false;
	} else {
		$_addClass(obj.id,'wschoosen');
		inpobj.checked = true;
	}
}

/**
 * gruppierte Einträge gleichzeitig setzen/löschen
 * sich ausschließende Beiträge alternativ setzen
 * 
 * @param integer Id der Zeile/des Input-Elements
 */
function onmark(id) {
	var inpobj, cl;
	inpobj = $_get('fchreg_'+id);
	if (!inpobj) {
		return;
	}
	cl = inpobj.className.split(' ');
	// gruppierungen
	setGroup(inpobj,cl);
	// auschließlichkeiten (mehrere möglich)
	setExclude(inpobj,cl);
}

/**
 * Sich ausschließende Ereignisse deaktivieren
 * 
 * @param object inpobj Objekt das onmark ausgelöst hat
 * @param array cl class-Names des inpobj
 */
function setExclude(inpobj,cl) {
	var i, j, gn, mobs, mobsid;
	for (i=0;i<cl.length;i++) {
		if (cl[i].indexOf('exclude_') === 0) {
			gn = cl[i].split('_');
			if (gn[1]) {
				mobs = $_class(cl[i],'INPUT');
				if (mobs) {
					for (j=0;j<mobs.length;j++) {
						if (mobs[j].id != inpobj.id) {
							mobsid = mobs[j].id.split('_');
							setmark(mobsid[1],'uncheck');
							// evtl. gruppierungen prüfen
							setGroup(mobs[j],mobs[j].className.split(' '),'uncheck');
						}
					}
				}
			}
		}
	}
}

/**
 * Gruppierungen setzen/löschen
 * 
 * @param object inpobj Objekt das onmark ausgelöst hat
 * @param array cl class-Names des inpobj
 * @param string action Optionaler Action-string ('uncheck')
 */
function setGroup(inpobj,cl,action) {
	var i, j, gn, mobs, mobsid;
	for (i=0;i<cl.length;i++) {
		if (cl[i].indexOf('group_') === 0) {
			gn = cl[i].split('_');
			if (gn[1]) {
				mobs = $_class(cl[1],'INPUT');
				if (mobs) {
					for (j=0;j<mobs.length;j++) {
						if (mobs[j].id != inpobj.id) {
							mobsid = mobs[j].id.split('_');
							setmark(mobsid[1],action);
							// evtl. auschließungen prüfen
							setExclude(mobs[j],mobs[j].className.split(' '));
						}
					}
				}
			}
		}
	}
}

/**
 * View href-Title
 */
function viewTitle(e) {
	alert(this.title);
	if (e) {
		e.stopPropagation();
	} else {
		window.event.cancelBubble = true;
	}
	return false;
}

// store disclaimer checkbox
store.disclaimer = null;

// Opens disclaimer as overlay blikk-style
function openDisclaimer(obj) {
	store.disclaimer = obj;
	var disclaimercontent = document.querySelector('#disclaimer-content');
	if (disclaimercontent) {
		_blikk.layer.openOpacLayer(disclaimercontent.innerHTML);
		return false;
	}
}

// closes disclaimer
function closeDisclaimer(action) {
	_blikk.layer.closeOpacLayer();
	if (action === true) {
		if (store.disclaimer) {
			store.disclaimer.checked = true;
		}
	} else {
		if (store.disclaimer) {
			store.disclaimer.checked = false;
		}
	}
}

// toggle classname, needs transition.min.js from http://www.transitionjs.org/
function toggleClass(obj,classname, childid) {
	var el = childid ? document.getElementById(childid) : null;
	if ( ! el) return;
	// has classname?
	var rp = new RegExp('\\b\\s*' + classname + '\\s*\\b','g');
	if (rp.exec(obj.className)) {
		// remove classname
		obj.className = obj.className.replace(rp,' ');
		try {
			transition.begin(el,["height", el.getAttribute('data-height'), "0px", "500ms", "linear"]);
		} catch(e) {
			el.style.height = '0px';
		}
	} else {
		// add classname
		obj.className += ' ' + classname;
		try {
			transition.begin(el,["height", "0px", el.getAttribute('data-height'), "500ms", "linear"]);
		} catch (e) {
			el.style.height = el.getAttribute('data-height');
		}
	}
}

/** 
 * Bedingte Felder ggf. öffnen
 * 
 * @TODO: zuzeit nur für radio-Buttons
 * 
 * @param string target class-Attribut des zu zeigenden/versteckenden Containers und
 * 						  id-Attribut des zugehörigen Input-Feldes
 * 						  Bei leerem target werden alle Inputfelder mit dem class-Attribut 'condinput' auf
 * 						  den dazugehörigen checked-Status geprüft
 * @param bool view=true, hide=false
 * @param string targetinputid id-Attribut des Input-Feldes
 */
function condView(target,action) {
	// mit übergebenem target
	if (target) {
		var targets = $_class(target,'DIV');
		if (targets) {
			var targetid = targets[0].id;
		}
		if (targetid) {
			if (action === true) {
				_blikk.layer.show(targetid);
			} else {
				cleanInput(targetid);
				_blikk.layer.hide(targetid);
			}
		}
	// für alle potentiellen targets
	} else {
		var cfs = $_class('condinput','INPUT');
		var target;
		if (cfs) {
			for (j=0;j<cfs.length;j++) {
				if (cfs[j].checked) {
					cfs[j].click();
				}
			}
		}
	}
}

/**	
* Löscht die Inputfelder des Zieltargets oder dessen children
*
* @param string targetid ID des Target-Elements
*/
function cleanInput(targetid) {
	// closure
	var clear = function(target) {
		var type;
		type = target.getAttribute('type');
		if (type == 'text' || type == 'textarea') {
			target.value = '';
		}
		if (type == 'checkbox' || type == 'radio') {
			target.checked = false;
		}		
	}
	// target ist selber input
	if ($_get(targetid).hasAttribute('value')) {
		clear($_get(targetid));
	}
	// target hat inputchildren
	var ch = document.querySelectorAll('#' + targetid + ' input');
	for (var i=0;i<ch.length;i++) {
		clear(ch[i]);
	}
}