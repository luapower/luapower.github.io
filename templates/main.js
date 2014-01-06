
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
