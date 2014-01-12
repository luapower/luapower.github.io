
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

//load package table
jQuery(function() {

	if($('#package_table').length == 0) //only load the packages on the homepage
		return

	$.getJSON('packages.json', function(packages) {

		var s = '<table id="package_table_table" width="100%"><thead>' +
				'<tr title="Hold Shift to sort by multiple columns">' +
					'<th class="header" width="1%">Lib</th>' +
					'<th class="header" width="1%">Type</th>' +
					'<th class="header" width="1%">Version</th>' +
					'<th class="header" width="20%">What</th>' +
				'<th width="1%" align="center">Platforms</th>' +
				'<th width="1%">License</th></tr></thead><tbody>'

		var platforms = ['mingw32', 'mingw64', 'linux32', 'linux64', 'macosx32', 'macosx64', 'android']

		$.each(packages, function(k, t) {
			s = s + '<tr>'
			s = s + '<td><a href="' + k + '.html">' + k + '</td>'
			s = s + '<td>' + t.type + '</td>'
			s = s + '<td>' + t.git_tag + '</td>'
			s = s + '<td>' + (t.tagline || '') + '</td>'
			s = s + '<td>'
			var has_platforms = false
			for (var i = 0; i < platforms.length; i++) {
				var platform = platforms[i]
				if (t.platforms[platform]) {
					s = s + '<img class="icon icon-' + platform + '" alt="' + platform + '" />'
					has_platforms = true
				}
			}
			if (!has_platforms)
				s = s + '<img class="icon icon-lua" alt="Lua" />'
			s = s + '</td>'
			s = s + '<td nowrap>' + (t.c_license || 'PD') + '</td>'
			s = s + '</tr>'
		})
		s = s + '</tbody></table>'
		$('#package_table').html(s)
		$('#package_table_table').tablesorter({
			cancelSelection: true,
			sortList: [[0,0]],
		})

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

			// temporarily remove the list from the
			// parent list item, wrap the remaining
			// text in an anchor, then reattach it.
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
		clink.parent().parent().show()
		clink.replaceWith(clink.html())

		// make extenral links open in new window
		$("a[href^='http']").not('.btn').each(function() {
			if (this.hostname != location.hostname)
				$(this).attr('target', '_blank')
		})
	})

})

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
