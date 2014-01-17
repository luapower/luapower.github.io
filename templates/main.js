
function lights_state() {
	return jQuery.cookie('lights') == 'on'
}

function update_lights_button() {
	jQuery('#lights').html('lights ' + (!lights_state() ? 'on' : 'off'))
}

function set_lights(on) {
	if (on !== true && on !== false)
		on = lights_state()
	var css = on ? 'light' : 'dark'
	jQuery('#lights_css').attr('href', 'templates/hack_' + css + '.css')
	jQuery.cookie('lights', on ? 'on' : 'off')
	update_lights_button()
}

// setup lights
jQuery(function() {
	//there was no button to set when the lights was set so we set it now
	update_lights_button()

	$('#lights').click(function() {
		event.preventDefault()
		set_lights(!lights_state())
	})
})

var package_db_loaded = false
var toc_loaded = false
function check_ready() {
	if(package_db_loaded && toc_loaded)
		doc_ready()
}


//load package db
jQuery(function() {

	if($('#package_table').length == 0) {//only load the packages on the homepage
		package_db_loaded = true
		check_ready()
		return
	}

	$.getJSON('packages.json', function(packages) {

		var s = '<table id="package_table_table" width="100%"><thead>' +
				'<tr>' +
					'<th title="Hold Shift to sort by multiple columns" class="header" style="width: 1%;">Lib</th>' +
					'<th title="Hold Shift to sort by multiple columns" class="header" style="width: 1%;">Type</th>' +
					'<th title="Hold Shift to sort by multiple columns" class="header" style="width: 1%;">Version</th>' +
					'<th style="width: 20%;" data-sorter="false">What</th>' +
					'<th title="Hold Shift to sort by multiple columns" class="header" style="width: 1%;">Platforms</th>' +
					'<th title="Hold Shift to sort by multiple columns" class="header" style="width: 1%;">License</th>' +
				'</tr></thead><tbody>'

		var platforms = ['mingw32', 'linux32', 'macosx32', 'android']

		$.each(packages, function(k, t) {
			s = s + '<tr>'
			s = s + '<td><a href="' + (t.has_doc ? k + '.html' : 'http://github.com/luapower/' + k) + '">' + k + '</td>'
			s = s + '<td>' + t.type + '</td>'
			s = s + '<td>' + t.git_tag + '</td>'
			s = s + '<td>' + t.tagline + '</td>'
			s = s + '<td style="min-width: 136px;" >'

			//platform icons: display and sorting order

			var imgs1 = ''
			if (t.has_ffi)
				imgs1 += '<div title="LuaJIT" class="icon icon-luajit-enabled"></div>'
			else if (t.has_lua)
				imgs1 += '<div title="Lua" class="icon icon-lua-enabled"></div>'
			else
				imgs1 += '<div class="icon"></div>'

			var pn = 0     // number of platforms
			var ps = ''    // platforms sort string
			var imgs = ''
			for (var i = 0; i < platforms.length; i++) {
				var platform = platforms[i]
				var enabled = t.platforms[platform]
				imgs += '<div' + (enabled ? ' title="' + platform + '"' : '') +
							' class="icon icon-' + platform + '-' + (enabled ? 'enabled' : 'disabled') + '"></div>'
				if (enabled) {
					pn += 1
					ps += platform + ';'
				}
			}
			// if no explicit platforms, remove the disabled buttons
			if (pn == 0) imgs = ''

			// fix platforms sorting order
			if (pn == 0 && t.has_lua)
				pn = platforms.length + (t.has_ffi ? 1 : 2)
			else if (pn > 0)
				ps = (t.has_lua ? (t.has_ffi ? 1 : 2) : 0) + ';' + ps

			s = s + '<span style="display: none;">' + pn + ';' + ps + '</span>' // sort string for tablesorter
			s = s + imgs1 + imgs
			s = s + '</td>'

			s = s + '<td>' + (t.c_license || 'PD') + '</td>'
			s = s + '</tr>'
		})
		s = s + '</tbody></table>'
		$('#package_table').html(s)
		$('#package_table_table').tablesorter({
			cancelSelection: true,
			sortList: [[0,0]],
		})

		package_db_loaded = true
		check_ready()
	})
})

// load TOC
jQuery(function() {

	$("#toc_container" ).load("toc.html", function() {

		// find list items representing TOC items and style them accordingly.
		// also, turn them into links that can expand/collapse the tree leaf.
		$('#toc_container li > ul').each(function(i) {

			// find this list's parent list item.
			var parent_li = $(this).parent('li')

			// style the list item as folder.
			parent_li.addClass('folder')

			// temporarily remove the list from the parent list item,
			// wrap the remaining text in an anchor, then reattach it.
			var sub_ul = $(this).remove()
			parent_li.wrapInner('<a/>').find('a').attr('href', 'javascript:void(0)').click(function() {
				// Make the anchor toggle the leaf display.
				sub_ul.toggle()
			})
			parent_li.append(sub_ul)
		})

		// hide all lists except the outermost.
		$('#toc_container ul ul').hide()

		// expand the list containing the element that links to the current page
		var cfile = window.parent.document.location.pathname.split('/').slice(-1)[0]
		var clink = $('#toc_container li > a[href="' + cfile + '.html"], #toc_container li > a[href="' + cfile + '"]')
		clink.parents().show()
		clink.replaceWith(clink.html())

		toc_loaded = true
		check_ready()
	})

})

function doc_ready() {

	// make extenral links open in new window
	$("a[href^='http']").not('.btn').each(function() {
		if (this.hostname != location.hostname)
			$(this).attr('target', '_blank')
	})

	//fix homepage links for file:/// access
	if (window.location.protocol == 'file:')
		$('a[href="/"]').attr('href', 'index.html')

	/* TODO
	//remove .html from links if loading from the web
	if (window.location.protocol != 'file:') {
		$('a').each(function() {
			var s = $(this).attr('href')
			if (s.indexOf('/') == -1 && s.indexOf('.html') != -1)
				$(this).attr('href', s.substring(0, s.length - 5))
		})
	}
	*/
}

// load analytics
jQuery(function() {

	if (window.location.protocol == 'file:')
		return

	(function(i,s,o,g,r,a,m) {
		i['GoogleAnalyticsObject']=r;
		i[r] = i[r] || function() {
			(i[r].q = i[r].q || []).push(arguments)
		}, i[r].l = 1*new Date();
		a = s.createElement(o),
		m = s.getElementsByTagName(o)[0];
		a.async=1;
		a.src=g;
		m.parentNode.insertBefore(a,m)
	})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
	ga('create', 'UA-10841867-16', 'luapower.com');
	ga('send', 'pageview');

})
