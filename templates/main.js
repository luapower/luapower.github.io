
function lights(on) {
	var css = on ? 'light' : 'dark';
	$('#lights_css').
		html($('<link rel="stylesheet" href="templates/hack_' + css + '.css" type="text/css" />'));
	$('iframe').contents().find('#lights_css').
		html($('<link rel="stylesheet" href="templates/hack_' + css + '.css" type="text/css" />'));

	$('#lights').html('lights ' + (on ? 'off' : 'on'));
	$.cookie('lights', on ? 'on' : 'off');
}

function resize_iframe(obj) {
	console.log('resize_iframe');
	obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
	lights($.cookie('lights') == 'on');
}

$(document).ready(function() {

	$('#lights').click(function() {
		event.preventDefault();
		lights($('#lights').html() == 'lights on');
	});

	// Put custom repo URL's in this object, keyed by repo name.
	var repoUrls = {
		"bootstrap": "http://twitter.github.com/bootstrap/",
		"finagle": "http://twitter.github.com/finagle/",
		"hogan.js": "http://twitter.github.com/hogan.js/"
	};

	function repoUrl(repo) {
		return repoUrls[repo.name] || repo.html_url;
	}

	// Put custom repo descriptions in this object, keyed by repo name.
	var repoDescriptions = {
		"bootstrap": "An HTML, CSS, and JS toolkit designed to kickstart development of webapps and sites",
		"naggati2": "A protocol builder for Netty using Scala 2.8"
	};

	function repoDescription(repo) {
		return repoDescriptions[repo.name] || repo.description;
	}

	function addRecentlyUpdatedRepo(repo) {
		var $item = $("<li>");

		var $name = $("<a>").attr("href", repo.html_url).text(repo.name);
		$item.append($("<span>").addClass("name").append($name));

		var $time = $("<a>").attr("href", repo.html_url + "/commits").text(strftime("%h %e, %Y", repo.pushed_at));
		$item.append($("<span>").addClass("time").append($time));

		$item.append('<span class="bullet">&sdot;</span>');

		var $watchers = $("<a>").attr("href", repo.html_url + "/watchers").text(repo.watchers + " stargazers");
		$item.append($("<span>").addClass("watchers").append($watchers));

		$item.append('<span class="bullet">&sdot;</span>');

		var $forks = $("<a>").attr("href", repo.html_url + "/network").text(repo.forks + " forks");
		$item.append($("<span>").addClass("forks").append($forks));

		$item.appendTo("#recently-updated-repos");
	}

	function addRepo(repo) {
		var $item = $("<li>").addClass("repo grid-1 " + (repo.language || '').toLowerCase());
		var $link = $("<a>").attr("href", repoUrl(repo)).appendTo($item);
		$link.append($("<h2>").text(repo.name));
		$link.append($("<h3>").text(repo.language));
		$link.append($("<p>").text(repoDescription(repo)));
		$item.appendTo("#repos");
	}

	function addRepos(repos, page) {
		repos = repos || [];
		page = page || 1;

		var uri = "https://api.github.com/users/capr/repos?callback=?"
						+ "&per_page=100"
						+ "&page="+page;

		$.getJSON(uri, function (result) {
			if (result.data && result.data.length > 0) {
				repos = repos.concat(result.data);
				addRepos(repos, page + 1);
			}
			else {
				$(function () {
					$("#num-repos").text(repos.length);

					// Convert pushed_at to Date.
					$.each(repos, function (i, repo) {
						repo.pushed_at = new Date(repo.pushed_at);

						var weekHalfLife  = 1.146 * Math.pow(10, -9);

						var pushDelta    = (new Date) - Date.parse(repo.pushed_at);
						var createdDelta = (new Date) - Date.parse(repo.created_at);

						var weightForPush = 1;
						var weightForWatchers = 1.314 * Math.pow(10, 7);

						repo.hotness = weightForPush * Math.pow(Math.E, -1 * weekHalfLife * pushDelta);
						repo.hotness += weightForWatchers * repo.watchers / createdDelta;
					});

					// Sort by highest # of watchers.
					repos.sort(function (a, b) {
						if (a.hotness < b.hotness) return 1;
						if (b.hotness < a.hotness) return -1;
						return 0;
					});

					$.each(repos, function (i, repo) {
						addRepo(repo);
					});

					// Sort by most-recently pushed to.
					repos.sort(function (a, b) {
						if (a.pushed_at < b.pushed_at) return 1;
						if (b.pushed_at < a.pushed_at) return -1;
						return 0;
					});

					$.each(repos.slice(0, 3), function (i, repo) {
						addRecentlyUpdatedRepo(repo);
					});
				});
			}
		});
	}
	addRepos();

});
