(function()
{
	insertTopMenuButtons();

	document.addEventListener('animationstart', function(e)
	{
		switch(e.animationName)
		{
			case 'commentInserted':
				insertTemplateUI(e, ["Ready for review", "Code review", "Patched to dev", "Merged to dev", "Merged to release/next"]);
				break;
			case 'descriptionInserted':
				insertTemplateUI(e, ["Epic", "Story", "Issue", "Bug", "Task", "Support"]);
				insertGitLinkUI(e);
				break;
			case 'ticketTopMenuInserted':
				insertTopMenuButtons();
				break;
			case 'storyPointsPopUpInserted':
				insertStoryPointsPopUpUI(e);
				break;
			case 'storyPointsInlineInserted':
				insertStoryPointsInlineUI(e);
				break;
		}
	});

	var templates =
	{
		"Ready for review":
			"h3. {color:#357FC7}Ready For Review{color}\n\n" +
			"h5. Features/Components Affected\n" + "- \n\n" +
			"h5. New/Expected Behavior\n" + "- \n\n" +
			"h5. Unsupported Scenarios or Known Issues\n" + "- \n\n" +
			"h5. Developer Testing Performed\n" + "- \n\n" +
			"h5. QA Testing Requested\n" + "- ",
		"Code review":
			"h3. {color:#357FC7}Code Reviewed{color}\n\n" +
			"h5. Must-Fix\n" + "- \n\n" +
			"h5. Suggestions or Comments\n" + "- ",
		"Patched to dev":
			"h3. {color:#357FC7}PATCHED{color}\n\nChanges have been patched into *DEV* environment.",
		"Merged to dev":
			"h3. {color:#357FC7}MERGED{color}\n\nChanges have been merged into the *DEV* code branch.",
		"Merged to release/next":
			"h3. {color:#357FC7}MERGED{color}\n\nChanges have been merged into the *RELEASE/NEXT* code branch.",
		"Epic":
			"h3. {color:#357FC7}Goal{color}\n" + " \n\n" +
			"h3. {color:#357FC7}Acceptance Criteria{color}\n" + "- \n\n",
		"Story":
			"h3. {color:#357FC7}Acceptance Criteria{color}\n" + "- \n\n" +
			"h3. {color:#357FC7}Testing Requirements{color}\n" + "- \n",
		"Issue":
			"h3. {color:#357FC7}Summary{color}\n" + "- \n\n" +
			"h3. {color:#357FC7}Impact (Affected Customers, Channels, etc){color}\n" + "- \n\n" +
			"h3. {color:#357FC7}Steps To Reproduce{color}\n" + "# \n\n" +
			"h3. {color:#357FC7}Troubleshooting Performed{color}\n" + "- \n\n" +
			"h3. {color:#357FC7}Expected Behavior{color}\n" + "- \n\n" +
			"h3. {color:#357FC7}Workarounds{color}\n" + "- \n\n" +
			"h3. {color:#357FC7}Suggested Fix{color}\n" + "- \n",
		"Bug":
			"h3. {color:#357FC7}Summary{color}\n" + "- \n\n" +
			"h3. {color:#357FC7}Steps To Reproduce{color}\n" + "- \n\n" +
			"h3. {color:#357FC7}Expected Behavior{color}\n" + "- \n\n" +
			"h3. {color:#357FC7}Workarounds{color}\n" + "- \n",
		"Task":
			"h3. {color:#357FC7}Acceptance Criteria{color}\n" + "- \n\n" +
			"h3. {color:#357FC7}Testing Requirements{color}\n" + "- \n",
		"Support":
			"h3. {color:#357FC7}Summary{color}\n" + "- \n\n" +
			"h3. {color:#357FC7}Impact (Affected Customers, Channels, etc){color}\n" + "- \n\n" +
			"h3. {color:#357FC7}Steps To Reproduce{color}\n" + "# \n\n" +
			"h3. {color:#357FC7}Troubleshooting Performed{color}\n" + "- \n\n" +
			"h3. {color:#357FC7}Expected Behavior{color}\n" + "- \n\n" +
			"h3. {color:#357FC7}Workarounds{color}\n" + "- \n\n" +
			"h3. {color:#357FC7}Suggested Fix{color}\n" + "- \n"
	};

	function insertGitLinkUI(e)
	{
		var target = e.target;
		var frag = document.createDocumentFragment();

		if(target.previousElementSibling && target.previousElementSibling.classList.contains("insertGitLink"))
			return;

		var container = document.createElement("div");
		container.className = "headcrab insertGitLink";
		frag.appendChild(container);

		var button = document.createElement("a");
		button.className = "aui-button";
		container.appendChild(button);
		button.addEventListener("click", function(e)
		{
			target.value = target.value + getGitBranchInfo();
		});

		var label = document.createElement("span");
		label.appendChild(document.createTextNode("Insert Branch"));
		button.appendChild(label);

		target.parentNode.insertBefore(frag, e.target);
	}

	function insertTemplateUI(e, templateKeys)
	{
		var target = e.target;
		var frag = document.createDocumentFragment();

		if(target.previousElementSibling && target.previousElementSibling.classList.contains("headcrab"))
			return;

		var container = document.createElement("div");
		container.className = "headcrab insertTemplate";
		frag.appendChild(container);

		var button = document.createElement("a");
		button.className = "aui-button";
		container.appendChild(button);
		button.addEventListener("click", function(e){ container.classList.toggle("show"); });

		var label = document.createElement("span");
		label.appendChild(document.createTextNode("Insert Template"));
		button.appendChild(label);

		var icon = document.createElement("span");
		icon.className = "icon drop-menu";
		button.appendChild(icon);

		var menu = document.createElement("ul");
		menu.className = "ajs-layer box-shadow";
		container.appendChild(menu);

		for(var i = 0, len = templateKeys.length; i < len; i++)
		{
			var item = document.createElement("li");
			item.appendChild(document.createTextNode(templateKeys[i]));
			menu.appendChild(item);
			item.template = templates[templateKeys[i]];
			item.addEventListener("click", function(e)
			{
				target.value = target.value + this.template;
				container.classList.remove("show");
				target.focus();
			});
		}

		target.parentNode.insertBefore(frag, e.target);
	}

	function insertTopMenuButtons()
	{
		var container = document.querySelector('#opsbar-opsbar-transitions').parentNode;

		if(container.querySelector(".headcrab"))
			return;

		var ul = document.createElement('ul');
		ul.className = 'toolbar-group pluggable-ops headcrab';
		ul.style.marginLeft = '30px';


		// CODE REVIEW REQUEST
		ul.appendChild(getTopMenuButton('Code Review Req', function()
		{
			var info = getPageInfo();
			window.open
			(
				'mailto:?subject=' + encodeURIComponent('Code Review Request: ' + info.key + ' ' + info.title) +
				'&body=' + encodeURIComponent(
					'Please code review the following ticket:\n\n' +
					'http://jira/browse/' + info.key + '\n\n' +
					'Thanks\n\n\n' +
					'Title: ' + info.title + '\n' +
					'Type: ' + info.issueType + '\n' +
					'Status: ' + info.status + '\n' +
					'Sprint: ' + info.sprint + '\n' +
					'Priority: ' + info.priority + '\n\n' +
					info.description),
			'_blank');
		}));

		// EMAIL
		ul.appendChild(getTopMenuButton('Email', function()
		{
			var info = getPageInfo();
			window.open
			(
				'mailto:?subject=' + encodeURIComponent(info.key + ': ' + info.title) +
				'&body=' + encodeURIComponent(
					'\n\n\n' +
					'http://jira/browse/' + info.key + '\n\n' +
					'Title: ' + info.title + '\n' +
					'Type: ' + info.issueType + '\n' +
					'Status: ' + info.status + '\n' +
					'Sprint: ' + info.sprint + '\n' +
					'Priority: ' + info.priority + '\n\n' +
					info.description),
			'_blank');
		}));

		container.appendChild(ul);
	}

	function getPageInfo()
	{
		var key = document.querySelector('meta[name=ajs-issue-key]');
		var title = document.querySelector('h1#summary-val');
		var status = document.querySelector('#status-val span');
		var sprint = document.querySelector('div.type-gh-sprint');
		var priority = document.querySelector('#priority-val img');
		var issueType = document.querySelector('#build-status-panel');
		var description = document.querySelector('#descriptionmodule #description-val .user-content-block');
		
		return {
			key: (key) ? key.getAttribute('content') : '',
			title: (title) ? title.textContent.trim() : '',
			labels: getLabelHashtags(),
			status: (status) ? status.textContent.trim() : '',
			sprint: (sprint) ? sprint.textContent.trim() : '',
			priority: (priority) ? priority.getAttribute('alt') : '',
			issueType: (issueType) ? issueType.getAttribute('data-issue-type') : '',
			description: (description) ? description.textContent.trim() : ''
		};
	}

	function getGitBranchInfo()
	{
		var branch = window.prompt('Branch Name:');
		return '\n\n\\\\\n{panel:borderStyle=dashed|bgColor=#F0F3F7}\n' +
			'[' + branch + '|https://github.com/mercent/mercent-main/tree/' + branch + ']\n' +
			'Compare with [Dev|https://github.com/mercent/mercent-main/compare/dev...' + branch + '] / ' +
			'[Release/Next|https://github.com/mercent/mercent-main/compare/release/next...' + branch + '] / ' +
			'[Master|https://github.com/mercent/mercent-main/compare/master...' + branch + ']\n' +
			'{panel}';
	}

	function insertStoryPointsPopUpUI(e)
	{
		var target = e.target;

		if(target.nextElementSibling && target.nextElementSibling.classList.contains("headcrab"))
			return;

		var container = document.createElement('div');
		container.style.display = 'inline-block';

		var getOnClick = function(value)
		{
			return function(e) { target.value = value; };
		};

		container.appendChild(getButton('XL', getOnClick(32), 'first'));
		container.appendChild(getButton('L', getOnClick(16), 'middle'));
		container.appendChild(getButton('M', getOnClick(8), 'middle'));
		container.appendChild(getButton('S', getOnClick(4), 'middle'));
		container.appendChild(getButton('XS', getOnClick(2), 'last'));

		target.parentNode.insertBefore(container, e.target.nextElementSibling);
		target.style.maxWidth = "100px";
	}

	function insertStoryPointsInlineUI(e)
	{
		var target = document.querySelector('div#customfield_10000-val .save-options');
		var input = document.querySelector('div#customfield_10000-val input#customfield_10000');

		if(!target || !input || target.firstChild.classList.contains("headcrab"))
			return;

		var container = document.createElement('div');
		container.style.display = 'inline-block';
		container.style.marginRight = '10px';

		var getOnClick = function(value)
		{
			return function(e) { input.value = value; };
		};

		container.appendChild(getButton('XL', getOnClick(32), 'first', true));
		container.appendChild(getButton('L', getOnClick(16), 'middle', true));
		container.appendChild(getButton('M', getOnClick(8), 'middle', true));
		container.appendChild(getButton('S', getOnClick(4), 'middle', true));
		container.appendChild(getButton('XS', getOnClick(2), 'last', true));

		target.insertBefore(container, target.firstChild);
	}

	function getLabelHashtags()
	{
		var elements = document.querySelectorAll('.labels-wrap .labels li');
		var labels = '';

		for(var i=0, len=elements.length; i < len-1; i++)
			labels += ', #' + elements[i].querySelector('span').textContent;

		return labels;
	}

	function getButton(label, onClick, position, asButton)
	{
		var button = document.createElement(asButton ? 'button' : 'a');
		button.className = "aui-button headcrab";
		button.style.minWidth = '25px';

		if(position != 'first') button.style.marginLeft = '-1px';
		if(position == 'middle') button.style.borderRadius = '0px 0px 0px 0px';
		if(position == 'last') button.style.borderRadius = '0px 3px 3px 0px';
		if(onClick) button.addEventListener("click", onClick);

		var span = document.createElement("span");
		span.appendChild(document.createTextNode(label));
		button.appendChild(span);

		return button;
	}

	function getTopMenuButton(label, onClick)
	{
		var li = document.createElement('li');
		li.className = 'toolbar-item';
		if(onClick) li.addEventListener('click', onClick);

		var a = document.createElement('a');
		a.className = 'toolbar-trigger';
		li.appendChild(a);

		var span = document.createElement('span');
		span.className = 'trigger-label';
		span.appendChild(document.createTextNode(label));
		a.appendChild(span);

		return li;
	}

	function copyText(text)
	{
		var textarea = document.createElement('textarea');
		textarea.style.position = 'absolute';
		textarea.style.top = '500px';
		document.body.appendChild(textarea);

		textarea.value = text;
		textarea.focus();
		textarea.select();
		document.execCommand("copy", false, null);

		document.body.removeChild(textarea);
	}

})();
