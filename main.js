// luapower.com (Cosmin Apreutesei, public domain)

// helpers
// -----------------------------------------------------------------------------------------------------------------------

var LOCAL = window.location.protocol == 'file:'

function current_package(packages) {
	return PROJECT && packages[PROJECT]
}

function current_module(packages) {
	var pkg = current_package(packages)
	if (!pkg) return
	return pkg.modules[DOCNAME]
}

function ellipsis(s, maxlen) {
	return s.substring(0, maxlen-1) + (s.length <= maxlen ? '' : '...')
}

function github_api_(url, success) {
	$.ajax({
		url: 'https://api.github.com/' + url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=?',
		cache: true,  // because of github's aggressive throttling policies
		dataType: 'jsonp',
		jsonpCallback:'ghajpc', // a global function will be created so careful what you name here
		success: success,
	})
}

function github_api(url, success) {
	var try_again
	try_again = function(data) {
		if (data.meta.status == 304) { // github api is shit
			github_api_(url, try_again)
		} else {
			success(data)
		}
	}
	github_api_(url, try_again)
}

function github_date(date) {
	return strftime('%b %d, %Y', new Date(date))
}

function ahref(href, text, attrs) {
	return '<a' + (attrs ? ' ' + attrs : '') + (href ? ' href="' + href + '"' : '') + '>' + text + '</a>'
}

function link(link, attrs) {
	return ahref(link[1], link[0], attrs)
}

// lights
// -----------------------------------------------------------------------------------------------------------------------

function get_lights_state() { return jQuery.cookie('lights') == 'on' }
function set_lights_state(on) { jQuery.cookie('lights', on ? 'on' : 'off') }

function set_lights_button_text(on) {
	jQuery('#lights').html('lights ' + (on ? 'off' : 'on'))
}

function set_lights(on) {
	if (on !== true && on !== false)
		on = get_lights_state()

	var css = on ? 'light' : 'dark'
	jQuery('#lights_css').attr('href', 'templates/hack_' + css + '.css')
	set_lights_state(on)
	set_lights_button_text(on)
}

function set_lights_button() {
	// there was no button to set when the lights was set so we set it now
	set_lights_button_text(get_lights_state())
	$('#lights').click(function() {
		set_lights(!get_lights_state())
		return false
	})
}

// package db
// -----------------------------------------------------------------------------------------------------------------------

// package tables

function set_concise_package_table(packages) {

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

function set_long_package_table(packages) {

	var s = '<table id="package_table_table" width="100%"><thead>' +
			'<tr>' +
				'<th title="Hold Shift to sort by multiple columns" class="header" style="width: 1%;">Type</th>' +
				'<th title="Hold Shift to sort by multiple columns" class="header" style="width: 1%;">Package</th>' +
				'<th style="width: 20%;" data-sorter="false" class="header" >What</th>' +
				'<th title="Hold Shift to sort by multiple columns" class="header" style="width: 1%;">Tag</th>' +
				'<th title="Hold Shift to sort by multiple columns" class="header" style="width: 1%;">Platforms</th>' +
				'<th title="Hold Shift to sort by multiple columns" class="header" style="width: 1%;">License</th>' +
			'</tr></thead><tbody>'

	var platforms = ['mingw32', 'linux32', 'osx64', 'android']

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
		sortList: [[1,0]], //initial sort by name
	})
}

function get_table_type_state() { return $.cookie('table_type') || 'long' }
function set_table_type_state(type) { $.cookie('table_type', type) }

function set_package_table(packages) {
	if ($('#package_table').length == 0) return

	var table_type = get_table_type_state()
	if (table_type == 'concise')
		set_concise_package_table(packages)
	else if (table_type == 'long')
		set_long_package_table(packages)
}

// current package & current module info

function get_package_dependencies(pkg) {
	return //disabled
	if (pkg.pdep_links.length == 0) return
	var t = []
	for (var i=0; i < pkg.pdep_links.length; i++)
		t.push(link(pkg.pdep_links[i]))
	return t.join(', ')
}

function set_package_info(packages) {
	if ($('#package_info').length == 0) return

	var pkg = current_package(packages)
	if (!pkg) return

	var t = []
	t.push(pkg.git_tag)
	t.push(pkg.type)
	if(pkg.c_link)
		t.push(link(pkg.c_link) + ' (' + pkg.c_license + ')')
	var deps = get_package_dependencies(pkg)
	if (deps)
		t.push('depends: ' + deps)

	$('#package_info').html(t.join(' | '))
}

function set_module_info(packages) {
	if ($('#module_info').length == 0) return

	var mod = current_module(packages)
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

function load_package_db() {
	if ($('#package_table,#package_info,#module_info').length == 0) {
		package_db_loaded()
		return
	}

	$.getJSON('packages.json', function(packages) {
		set_package_table(packages)
		set_package_info(packages)
		set_module_info(packages)
		load_github_events(packages)
		package_db_loaded()
	})
}

// toc file
// -----------------------------------------------------------------------------------------------------------------------

function set_toc_tree() {
	// find items representing TOC items and style them accordingly.
	// also, turn them into links that can expand/collapse the tree leaf.
	$('#toc_container li > ul').each(function(i) {

		// find this list's parent list item.
		var parent_li = $(this).parent('li')

		// style the list item as folder.
		parent_li.addClass('folder')

		// temporarily remove the list from the parent list item,
		// wrap the remaining text in an anchor, then reattach it.
		var sub_ul = $(this).remove()
		if (parent_li.find('a').length == 0)
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
	if (clink.length > 0) {
		clink.parents().show() //expand parents
		clink.parent().find('ul').show() //expand children
		clink.parent().wrapInner('<span/>').find('span').addClass('toc-selected')
		clink.replaceWith(clink.html())
	}
}

function load_toc_file() {
	if ($('#toc_container').length == 0) {
		toc_file_loaded()
		return
	}

	$('#toc_container').load('toc.html', function() {
		set_toc_tree()
		toc_file_loaded()
	})
}

// doc-ready
// -----------------------------------------------------------------------------------------------------------------------

// make extenral links open in new window
function fix_external_links() {
	$("a[href^='http']").not('.btn').each(function() {
		if (this.hostname != location.hostname)
			$(this).attr('target', '_blank')
	})
}

//fix homepage links for file:/// access
function fix_homepage_links() {
	if (LOCAL)
		$('a[href="/"]').attr('href', 'index.html')
}

// doc-ready dispatcher

var _package_db_loaded = false
var _toc_file_loaded = false

function package_db_loaded() {_package_db_loaded = true; check_ready() }
function toc_file_loaded() { _toc_file_loaded = true; check_ready() }
function check_ready() { if (_package_db_loaded && _toc_file_loaded) doc_ready() }

function doc_ready() {
	fix_external_links()
	fix_homepage_links()
}

// github commit log
// -----------------------------------------------------------------------------------------------------------------------

function get_commit_log_line(entry) {
	var date = github_date(entry.commit.committer.date)
	var message = entry.commit.message
	var url = 'https://github.com/luapower/' + PROJECT + '/commit/' + entry.sha
	if (message == 'unimportant')
		return
	return ahref(url, ellipsis(message, 26) + ' ' + date,
		' title="' + message + '"' +
		' class="faint"')
}

function set_commit_log(commits) {
	var t = []
	for(var i=0, c=0; c < 4 && i < commits.data.length; i++) {
		var s = get_commit_log_line(commits.data[i])
		if (!s)
			continue
		t.push(s)
		c++
	}

	$('#package_info').html($('#package_info').html() + '<hr id="package_info_hr">') // TODO: not repeatable!
	$('#commit_log').html(t.join('<br>'))
	fix_external_links()
}

function load_commit_log() {
	if ($('#commit_log').length == 0) return
	github_api('repos/luapower/' + PROJECT + '/commits', set_commit_log)
}

// github events
// -----------------------------------------------------------------------------------------------------------------------

function get_repo_link(repo, packages) {
	var plink
	var project
	if (repo.match(/^luapower\//)) { // it's a luapower repo
		var project = repo.replace(/^luapower\//, '')
		if (project in packages)
			plink = link(packages[project].link)
	}
	// we're not interested in news for non-packages (if we were, we would do the following)
	// if(!plink) plink = ahref('https://github.com/' + repo, project || repo)
	return plink
}

function add_news_rows(rows, event, packages) {
	var maxtext = 50

	if (event.type != 'PushEvent' && event.type != 'CreateEvent' && event.type != 'IssuesEvent')
		return

	var plink = get_repo_link(event.repo.name, packages)
	if (!plink) return

	var s = '<td style="width: 15%">' + github_date(event.created_at) +
				'</td><td style="width: 20%">' + plink + '</td><td style="width: 65%">'

	if (event.type == 'PushEvent') {
		for (var i = 0; i < event.payload.commits.length; i++) {
			var commit = event.payload.commits[i]
			var url = 'https://github.com/' + event.repo.name + '/commit/' + commit.sha
			if (commit.message != 'unimportant')
				rows.push(s + ahref(url, ellipsis(commit.message, maxtext)) + '</td>')
		}
	} else if (event.type == 'CreateEvent' && event.payload.ref_type == 'tag') {
		var url = 'https://github.com/' + event.repo.name + '/tree/' + event.payload.ref
		rows.push(s + 'New tag: <b>' + ahref(url, event.payload.ref) + '</b>' + '</td>')
	} else if (event.type == 'IssuesEvent') {
		var url = 'https://github.com/' + event.repo.name + '/issues/' + event.payload.issue.number
		var text = 'issue <b>' + event.payload.action + '</b>: ' +
						ahref(url, ellipsis(event.payload.issue.title, maxtext - 15))
		rows.push(s + text + '</td>')
	}
}

function set_news_table(rows, events, packages) {
	var s = '<table width="100%">'

	s = s + '<tr>' + rows.join('</tr><tr>') + '</tr>'
	s = s + '</table>'

	$('#news_table').html(s)
	fix_external_links()
}

function load_github_events(packages) {
	if ($('#news_table').length == 0) return
	var page = 1
	var maxpage = 10
	var rows = []
	var maxrows = 10
	var try_next
	try_next = function(events) {
		for(var i=0; i < events.data.length; i++) {
			add_news_rows(rows, events.data[i], packages)
		}
		if (page < maxpage && rows.length < maxrows) {
			page += 1
			github_api('orgs/luapower/events?page=' + page, try_next)
		} else {
			rows = rows.slice(0, maxrows)
			set_news_table(rows, events, packages)
		}
	}
	github_api('orgs/luapower/events?page=' + page, try_next)
}

// disqus
// -----------------------------------------------------------------------------------------------------------------------

function load_disqus() {
	if (LOCAL) return // don't load offline
	if (!disqus_shortname) return //disabled

	var disqus_identifier = DOCNAME; //discussion identifier (when a page will be renamed, the comments will be gone!)

	var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
            dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
}

// analytics
// -----------------------------------------------------------------------------------------------------------------------

function load_analytics() {
	if (LOCAL) return //don't load offline
	if (!analytics_id || !analytics_website) return //disabled

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
}

// main
// -----------------------------------------------------------------------------------------------------------------------

jQuery(set_lights_button)
jQuery(load_package_db)
jQuery(load_toc_file)
jQuery(load_commit_log)
jQuery(load_disqus)
jQuery(load_analytics)
