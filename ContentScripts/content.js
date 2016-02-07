(function()
{
	// IF website has jira in url
	if(window.location.href.includes('jira'))
	{
		insertTopMenuButtons();

		document.addEventListener('animationstart', function(e)
		{
			switch(e.animationName)
			{
				case 'ext-headcrab-comment':
					insertTemplateUI(e, ["Ready for review", "Code review", "Patched to dev", "Merged to dev", "Merged to release/next"]);
					break;
				case 'ext-headcrab-description':
					insertTemplateUI(e, ["Epic", "Story", "Issue", "Bug", "Task", "Support"]);
					insertGitLinkUI(e);
					break;
				case 'ext-headcrab-ticket-top':
					insertTopMenuButtons();
					break;
				case 'ext-headcrab-points-dialog':
					insertStoryPointsPopUpUI(e);
					break;
				case 'ext-headcrab-points':
					insertStoryPointsInlineUI(e);
					break;
			}
		});
	}

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
			"h3. {color:#357FC7}Suggested Fix{color}\n" + "- \n",
		"CommitMessage":
			'{{key}} {{title}} \n\n' +
			'- \n\n' +
			'----------------------------------------------------------------------\n' +
			'/ #{{key}}, #{{issueType}}{{labels}}',
		"CodeReviewRequestSubject":
			'Code Review Request: {{key}} {{title}}',
		"CodeReviewRequestBody":
			'Please code review the following ticket:\n\n' +
			'{{ticketLink}}\n\n' +
			'Thanks\n\n\n' +
			'Title: {{title}}\n' +
			'Type: {{issueType}}\n' +
			'Status: {{status}}\n' +
			'Sprint: {{sprint}}' +
			'Priority: {{priority}}\n\n' +
			'{{description}}',
		"TicketEmailSubject":
			'{{key}}: {{title}}',
		"TicketEmailBody":
			'\n\n\n' +
			'{{ticketLink}}\n\n' +
			'Title: {{title}}\n' +
			'Type: {{issueType}}\n' +
			'Status: {{status}}\n' +
			'Sprint: {{sprint}}\n' +
			'Priority: {{priority}}\n\n' +
			'{{description}}'
	};

	function insertGitLinkUI(e)
	{
		var target = e.target;

		// IF we already inserted stuff don't do it again
		if(!target || (target.previousElementSibling && target.previousElementSibling.classList.contains("ext-headcrab-insert-git")))
			return;

		var container = document.createElement("div");
		container.className = "ext-headcrab-insert-git";
		container.appendChild(getJiraLinkButton("Insert Branch", null, function(e)
		{
			target.value = target.value + getGitBranchInfo();
		}));

		target.parentNode.insertBefore(container, e.target);
	}

	function insertTemplateUI(e, templateKeys)
	{
		var target = e.target;

		// IF we already inserted stuff don't do it again
		if(!target || (target.previousElementSibling && target.previousElementSibling.classList.contains("ext-headcrab-insert-template")))
			return;

		var container = document.createElement("div");
		container.className = "ext-headcrab-insert-template";

		var button = getJiraLinkButton("Insert Template", null, function(e)
		{
			container.classList.toggle("show");
		});
		container.appendChild(button);

		var icon = document.createElement("span");
		icon.className = "icon drop-menu";
		button.appendChild(icon);

		var menu = document.createElement("ul");
		menu.className = "ajs-layer box-shadow";
		container.appendChild(menu);

		// Add template items to menu
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

		target.parentNode.insertBefore(container, e.target);
	}

	function insertTopMenuButtons()
	{
		var container = document.querySelector('#opsbar-opsbar-transitions').parentNode;

		// IF we already inserted stuff don't do it again
		if(!container || container.querySelector(".ext-headcrab-ticket-top"))
			return;

		var ul = document.createElement('ul');
		ul.className = 'toolbar-group pluggable-ops ext-headcrab-ticket-top';
		ul.style.marginLeft = '30px';

		// COPY COMMIT MESSAGE
		ul.appendChild(getTopMenuButton('Commit Msg', function(e)
		{
			var info = getPageInfo();
			var message = templates.CommitMessage;
			message = message.replace(/\{\{key\}\}/g, info.key);
			message = message.replace(/\{\{title\}\}/g, info.title);
			message = message.replace(/\{\{issueType\}\}/g, info.issueType);
			message = message.replace(/\{\{labels\}\}/g, info.labels);
			copyText(message);

			this.firstChild.style.width = this.firstChild.offsetWidth + 'px';
			var span = this.querySelector('span');
			span.textContent = 'Copied!';
			span.style.color = 'green';
			setTimeout(function(){ span.textContent = 'Commit Msg'; span.style.color = ''; }, 600);
		}));

		// CODE REVIEW REQUEST
		ul.appendChild(getTopMenuButton('Code Review Req', function()
		{
			var info = getPageInfo();
			var subject = templates.CodeReviewRequestSubject;
			subject = subject.replace(/\{\{key\}\}/g, info.key);
			subject = subject.replace(/\{\{title\}\}/g, info.title);
			var body = templates.CodeReviewRequestBody;
			body = body.replace(/\{\{title\}\}/g, info.title);
			body = body.replace(/\{\{issueType\}\}/g, info.issueType);
			body = body.replace(/\{\{status\}\}/g, info.status);
			body = body.replace(/\{\{sprint\}\}/g, info.sprint);
			body = body.replace(/\{\{priority\}\}/g, info.priority);
			body = body.replace(/\{\{description\}\}/g, info.description);
			body = body.replace(/\{\{ticketLink\}\}/g, window.location.origin + window.location.pathname);
			window.location.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
		}));

		// EMAIL
		ul.appendChild(getTopMenuButton('Email', function()
		{
			var info = getPageInfo();
			var subject = templates.TicketEmailSubject;
			subject = subject.replace(/\{\{key\}\}/g, info.key);
			subject = subject.replace(/\{\{title\}\}/g, info.title);
			var body = templates.TicketEmailBody;
			body = body.replace(/\{\{title\}\}/g, info.title);
			body = body.replace(/\{\{issueType\}\}/g, info.issueType);
			body = body.replace(/\{\{status\}\}/g, info.status);
			body = body.replace(/\{\{sprint\}\}/g, info.sprint);
			body = body.replace(/\{\{priority\}\}/g, info.priority);
			body = body.replace(/\{\{description\}\}/g, info.description);
			body = body.replace(/\{\{ticketLink\}\}/g, window.location.origin + window.location.pathname);
			window.location.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
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

		if(!target || (target.nextElementSibling && target.nextElementSibling.classList.contains("ext-headcrab-button")))
			return;

		var container = document.createElement('div');
		container.style.display = 'inline-block';

		var getOnClick = function(value)
		{
			return function(e) { target.value = value; };
		};

		container.appendChild(getPointsButton('XL', getOnClick(32), 'first'));
		container.appendChild(getPointsButton('L', getOnClick(16), 'middle'));
		container.appendChild(getPointsButton('M', getOnClick(8), 'middle'));
		container.appendChild(getPointsButton('S', getOnClick(4), 'middle'));
		container.appendChild(getPointsButton('XS', getOnClick(2), 'last'));

		target.parentNode.insertBefore(container, e.target.nextElementSibling);
		target.style.maxWidth = "100px";
	}

	function insertStoryPointsInlineUI(e)
	{
		var target = document.querySelector('div#customfield_10000-val .save-options');
		var input = document.querySelector('div#customfield_10000-val input#customfield_10000');

		if(!target || !input || target.firstChild.classList.contains("ext-headcrab-button"))
			return;

		var container = document.createElement('div');
		container.style.display = 'inline-block';
		container.style.marginRight = '10px';

		var getOnClick = function(value)
		{
			return function(e) { input.value = value; };
		};

		container.appendChild(getPointsButton('XL', getOnClick(32), 'first', true));
		container.appendChild(getPointsButton('L', getOnClick(16), 'middle', true));
		container.appendChild(getPointsButton('M', getOnClick(8), 'middle', true));
		container.appendChild(getPointsButton('S', getOnClick(4), 'middle', true));
		container.appendChild(getPointsButton('XS', getOnClick(2), 'last', true));

		target.insertBefore(container, target.firstChild);
	}

	function getLabelHashtags()
	{
		var elements = document.querySelectorAll('.labels-wrap .labels li');
		var labels = '';

		if(!elements) return labels;

		for(var i=0, len=elements.length; i < len-1; i++)
		{
			var span = elements[i].querySelector('span');
			if(span) labels += ', #' + span.textContent;
		}

		return labels;
	}

	function getPointsButton(label, onClick, position, asButton)
	{
		var button = document.createElement(asButton ? 'button' : 'a');
		button.className = "aui-button ext-headcrab-button";
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

	function getJiraLinkButton(label, className, click, href, icon)
	{
		var a = document.createElement("a");
		a.className = "aui-button " + className;
		if(click) a.addEventListener("click", click);
		if(href) a.href = href;

		var span = document.createElement("span");
		span.appendChild(document.createTextNode(label));
		a.appendChild(span);

		return a;
	}

})();
