
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
		set_lights(!lights_state())
		return false
	})
})

var package_db_loaded = false
var toc_loaded = false
function check_ready() {
	if(package_db_loaded && toc_loaded)
		doc_ready()
}

function ahref(href, text, attrs) {
	return '<a' + (attrs ? ' ' + attrs : '') + (href ? ' href="' + href + '"' : '') + '>' + text + '</a>'
}

function link(link, attrs) {
	return ahref(link[1], link[0], attrs)
}

function build_concise_package_table() {
	//sorted list of categories and item count
	var cats = {}
	var n = 0
	$.each(packages, function(pkg, t) {
		cats[t.category] = {}
		n = n + 1
	})
	var cat_list = Object.keys(cats).sort()
	n = n + cat_list.length
	//attach packages to their categories
	$.each(packages, function(pkg, t) {
		cats[t.category][pkg] = t
	})
	//build the final list of categories and packages
	var name_list = []
	$.each(cat_list, function(i, cat) {
		name_list.push('<td><strong style="font-size: 100%; text-transform: uppercase; font-weight: normal;">' +
								cat + '</strong></td>')
		$.each(Object.keys(cats[cat]).sort(), function(i, pkg) {
			var t = cats[cat][pkg]
			name_list.push('<td>' + (t.link && link(t.link) || pkg)  + '</td>')
		})
	})
	//distribute name_list over a n-col table in top-to-bottom-then-left-to-right order
	var s = '<table width="100%">'
	var cols = 5
	var rows = Math.ceil(n / cols)
	for(var i = 0; i < rows; i++) {
		s = s + '<tr>'
		for(var j = 0; j < cols; j++)
			s = s + name_list[j * rows + i] || '<td></td>'
		s = s + '</tr>'
	}
	$('#package_table').html(s)
}

function build_long_package_table() {

	var s = '<table id="package_table_table" width="100%"><thead>' +
			'<tr>' +
				'<th title="Hold Shift to sort by multiple columns" class="header" style="width: 1%;">Type</th>' +
				'<th title="Hold Shift to sort by multiple columns" class="header" style="width: 1%;">Package</th>' +
				'<th style="width: 20%;" data-sorter="false" class="header" >What</th>' +
				'<th title="Hold Shift to sort by multiple columns" class="header" style="width: 1%;">Tag</th>' +
				'<th title="Hold Shift to sort by multiple columns" class="header" style="width: 1%;">Platforms</th>' +
				'<th title="Hold Shift to sort by multiple columns" class="header" style="width: 1%;">License</th>' +
			'</tr></thead><tbody>'

	var platforms = ['mingw32', 'linux32', 'osx32', 'android']

	$.each(packages, function(k, t) {
		s = s + '<tr>'
		s = s + '<td>' + t.type + '</td>'
		s = s + '<td>' + link(t.link) + '</td>'
		s = s + '<td>' + (t.tagline || '') + '</td>'
		s = s + '<td>' + (t.git_tag || '') + '</td>'
		s = s + '<td style="min-width: 136px;" >'

		//platform icons: display and sorting order

		var has_lua = t.type.indexOf('Lua') >= 0
		var has_ffi = t.type.indexOf('ffi') >= 0

		var imgs1 = ''
		if (has_ffi)
			imgs1 += '<div title="LuaJIT" class="icon icon-luajit-enabled"></div>'
		else if (has_lua)
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
		if (pn == 0 && has_lua)
			pn = platforms.length + (has_ffi ? 1 : 2)
		else if (pn > 0)
			ps = (has_lua ? (has_ffi ? 1 : 2) : 0) + ';' + ps

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
		sortList: [[1,0]],
	})
}

function build_package_table() {
	if ($('#package_table').length == 0) return
	//build_concise_package_table()
	build_long_package_table()
}

function ellipsis(s, maxlen) {
	return s.substring(0, maxlen-1) + (s.length <= maxlen ? '' : '...')
}

function set_doc_page() {
	if (!PROJECT) return
	var pkg = packages[PROJECT]
	if (!pkg) return

	// list package dependencies
	// -----------------------------------------------------------------

	var t = []

	// package C tags
	t.push(pkg.git_tag)
	t.push(pkg.type)
	if(pkg.c_link) t.push(link(pkg.c_link) + ' (' + pkg.c_license + ')')

	// package package dependencies
	var tt = []
	//...not anymore: turns out that these are not very relevant in the context of the whole package.
	//for (var i=0; i < pkg.pdep_links.length; i++)
	//	tt.push(link(pkg.pdep_links[i]))
	if (tt.length > 0) t.push('depends: ' + tt.join(', '))

	$('#package_info').html(t.join(' | '))

	// show commit log
	// -----------------------------------------------------------------

	var url
	if (window.location.protocol == 'file:')
		url = PROJECT + '-commits.json'
	else
		url = 'https://api.github.com/repos/luapower/' + PROJECT + '/commits?callback=?'

	function get_commit_line(t, index) {
		var date = t.commit.committer.date
		var date = strftime('%b %d, %Y', new Date(date))
		var message = t.commit.message
		var url = 'https://github.com/luapower/' + PROJECT + '/commit/' + t.sha
		return ahref(url, ellipsis(message, 30) + ' ' + date,
			' target="_blank"' +
			' title="' + message + '"' +
			(index >= 0 ? ' class="faint"' : '')
		)
	}

	$.getJSON(url, function(json) {
		var t = []
		for(var i=0; i < 4 && json.data.length > i; i++)
			t.push(get_commit_line(json.data[i], i))
		$('#commit_log').html('<hr id="package_info_hr">' + t.join('<br>'))
	})

	// list module dependencies
	// -----------------------------------------------------------------

	var mod = pkg.modules[DOCNAME]
	if (!mod) return

	// list module module dependencies
	var pdeps = []
	for (var i=0; i < mod.pdep_links.length; i++)
		pdeps.push(link(mod.pdep_links[i]))
	// list module package dependencies
	var mdeps = []
	for (var i=0; i < mod.mdep_links.length; i++)
		mdeps.push(link(mod.mdep_links[i]))

	var tt = []
	if (mod.source_link) tt.push(link(mod.source_link))
	if (mod.test_link) tt.push(link(mod.test_link))
	if (mod.demo_link) tt.push(link(mod.demo_link))
	if (pdeps.length > 0) tt.push('<span title="package dependencies">depends: ' + pdeps.join(', ') + '</span>')
	if (mdeps.length > 0) tt.push('<span title="module dependencies">requires: ' + mdeps.join(', ') + '</span>')
	$('#module_info').html(tt.join(' | '))

}

//load package db
jQuery(function() {

	$.getJSON('packages.json', function(packages) {

		window.packages = packages; // set as global

		build_package_table()
		set_doc_page()

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
		// DOCNAME is set in the html template by pandoc
		var clink = $('#toc_container li > a[href="' + DOCNAME + '.html"], #toc_container li > a[href="' + DOCNAME + '"]')
		clink.parents().show()
		clink.parent().wrapInner('<span/>').find('span').addClass('toc-selected')
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
}

// add disqus comments
jQuery(function() {

	// don't load when viewing the documentation offline
	if (window.location.protocol == 'file:')
		return
	if (!disqus_shortname)
		return

	var disqus_identifier = DOCNAME; //discussion identifier (when a page will be renamed, the comments will be gone!)

	var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
            dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);

})

// load analytics
jQuery(function() {

	// don't load when viewing the documentation offline
	if (window.location.protocol == 'file:')
		return
	if (!analytics_id || !analytics_website)
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
	ga('create', analytics_id, analytics_website);
	ga('send', 'pageview');

})
