route = location.pathname.replaceAll(/(?=\/$)\//g, '');

const calculatePwScore = (value, maxScore) => {
	if (!maxScore) maxScore = 1;
	let scorePercent = 0;

	const smallAscii = /[a-z]/;
	const bigAscii = /[A-Z]/;
	const alphaNumerical = /[0-9]/;
	const specialChars = /[^A-Za-z0-9]/;
	const emojiChars = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]| \ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;

	let lengthPass; let smallAsciiPass = false;
	let bigAsciiPass = false; let alphaNumericalPass = false;
	let specialCharsPass = false; let emojiCharsPass = false;

	if (value.length > 12) lengthPass = true;
	if (smallAscii.test(value)) smallAsciiPass = true;
	if (bigAscii.test(value)) bigAsciiPass = true;
	if (alphaNumerical.test(value)) alphaNumericalPass = true;
	if (specialChars.test(value)) specialCharsPass = true;
	if (emojiChars.test(value)) emojiCharsPass = true;

	scorePercent += Math.min((value.length * 1.5));

	// This block must add to at least 100 scorePercent
	if (smallAsciiPass) scorePercent += 10;
	if (bigAsciiPass) scorePercent += 10;
	if (alphaNumericalPass) scorePercent += 15;
	if (specialCharsPass) scorePercent += 20;
	if (lengthPass) scorePercent += 15; // This actually would be 34.5

	// This block adds easterEgg score
	if (emojiCharsPass) scorePercent += 40;

	return {
		score: Math.round(maxScore*(scorePercent/100)*100)/100,
		passingChecks: [],
		failingChecks: [],
	};
};

if (route == '/register') {
	const password1Input = document.getElementById('userPassword');
	const passwordStrength = document.getElementById('pwStrengthWrapper');

	password1Input.addEventListener('input', (ev) => {
		if (password1Input.value.length == 0) {
			passwordStrength.classList.remove('scale-y-100');
			passwordStrength.classList.add('scale-y-0');
		} else {
			passwordStrength.classList.remove('scale-y-0');
			passwordStrength.classList.add('scale-y-100');
		}

		const strengthChildren = [...passwordStrength.children];
		if ((strengthChildren[0]).dataset.wrapperinit) strengthChildren.shift();
		const maxScore = strengthChildren.length;
		const score = calculatePwScore(ev.target.value, maxScore);
		strengthChildren.forEach((el, index) => {
			if (score.score >= index + 1) {
				el.classList.add('scale-x-100');
				el.classList.remove('scale-x-0');
				return;
			}
			el.classList.remove('scale-x-100');
			el.classList.add('scale-x-0');
		});
	});
}
