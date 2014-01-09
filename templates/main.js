
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

	$.getJSON('packages.json', function(packages) {

		/*
		var package_list = []
		$.each(packages, function(k, t) {
			t.name = k
			package_list.push(t)
		})

		app.controller('myCtrl', function($scope) {
			 $scope.myData = package_list
			 $scope.gridOptions = {
				  data: 'myData',
				  showGroupPanel: true
			 }
		})
		*/

		var s = '<table width="100%"><tr><th width="1%">Lib</th><th width="1%">Type</th><th width="1%">Version</th><th width="20%">What</th>' +
				'<th width="1%" align="center" colspan="2">Platforms</th>' +
				'<th width="1%">License</th></tr>'
		$.each(packages, function(k, t) {
			s = s + '<tr>'
			s = s + '<td><a href="' + k + '.html">' + k + '</td>'
			s = s + '<td>' + t.type + '</td>'
			s = s + '<td>' + t.git_tag + '</td>'
			s = s + '<td>' + (t.tagline || '') + '</td>'
			s = s + '<td align="center">' +
				(t.platforms.mingw32 && '<img class="svg-icon" src="templates/windows.svg" width="20" height="20" alt="Win32"/>' || '') + '</td>'
			s = s + '<td align="center">' +
				(t.platforms.linux32 && '<img class="svg-icon" src="templates/linux.svg" width="20" height="20" alt="Tux32"/>' || '') + '</td>'
			s = s + '<td nowrap>' + (t.c_license || 'PD') + '</td>'
			s = s + '</tr>'
		})
		s = s + '</table>'
		console.log(s)
		$('#package_table').html(s)

	})
})

// load TOC
jQuery(function() {
	$("#toc_container" ).load("toc.html", doc_ready)
})

function doc_ready() {
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
}
