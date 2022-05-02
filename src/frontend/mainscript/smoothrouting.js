const getAnchorParent = (element) => {
	while (element.parentNode &&
				 element.parentNode.nodeName.toLowerCase() !== 'body') {
		if (element.nodeName.toLowerCase() === 'a') return element;
		element = element.parentNode;
	}
	return false;
};

// Anchor hijacking for smooth routing in forward direction
document.addEventListener('click', async (e) => {
	// If the clicked target is an anchor or child of an anchor,
	// get this anchor element or return
	const anchorParent = getAnchorParent(e.target);
	if (!anchorParent) return;

	// Only do smoothrouting if anchor points to same host but different path
	// (Same path could be in-document-anchor and can be used to completely
	// reload document from server)
	if (anchorParent.hostname !== window.location.hostname ||
		  anchorParent.pathname === window.location.pathname) return;
	e.preventDefault();

	// Get the new body contents
	const response = await fetch(anchorParent.href);
	if (!response.ok) return;

	// Parse the new document and inject its head and body in the current dom
	const newdoc = new DOMParser()
		.parseFromString(await response.text(), 'text/html');
	document.getElementsByTagName('body')[0].innerHTML = newdoc
		.getElementsByTagName('body')[0].innerHTML;
	document.getElementsByTagName('head')[0].innerHTML = newdoc
		.getElementsByTagName('head')[0].innerHTML;

	// Finally, push the current url
	window.history.pushState({}, '', anchorParent.href);
});

// Smooth routing in backward direction (aka. history-back button in browser UI)
window.addEventListener('popstate', async (e) => {
	e.preventDefault();
	// Hard reload the requested page
	window.location = e.explicitOriginalTarget.location;
});
