import {route} from './commonvars';

interface PasswordPolicy {
	match: (value: string) => boolean;

	// Gets set internally after match function is called on policy
	matches?: boolean;

	// Descriptive text on the policy
	name: string;
	passText: string;
	failText: string;

	// Percent of points granted or lost as a reward/penalty when passing/failing
	// the policy
	passingReward?: number;
	failingPenalty?: number;

	// If this policy is recommended. When false, it does not get returned
	// in 'failingPolicies' if it does not match
	recommended: boolean;
}

interface PasswordScore {
	score: number;
	passingPolicies: PasswordPolicy[];
	failingPolicies: PasswordPolicy[];
}

/**
 *
 * @param {string} value
 * @param {integer} maxScore
 * @return {object}
 */
const calculatePasswordScore = (value: string,
	maxScore = 1): PasswordScore => {
	let scorePercent = 0;

	const passwordPolicies: PasswordPolicy[] = [
		{
			match: (value: string): boolean => value.length > 12,
			name: 'MINIMUM_LENGTH',
			passText: '✓ Das Passwort besteht aus mehr als 12 Zeichen',
			failText: 'Ein gutes Passwort besteht aus mindestens 12 Zeichen',
			passingReward: 15,
			recommended: true,
		},
		{
			match: (value: string): boolean => new Blob([value]).size < 72,
			name: 'MAXIMUM_LENGTH',
			passText: '✓ Das Passwort ist nicht zu lang',
			failText: 'Das Passwort ist größer als 72 Bytes (bcrypt Limit)',
			failingPenalty: 50,
			recommended: true,
		},
		{
			match: (value: string): boolean => /[a-z]/.test(value),
			name: 'LOWERCASE_LETTERS',
			passText: '✓ Das Passwort beinhaltet Kleinbuchstaben',
			failText: 'Ein gutes Passwort beinhaltet Kleinbuchstaben',
			passingReward: 10,
			recommended: true,
		},
		{
			match: (value: string): boolean => /[A-Z]/.test(value),
			name: 'CAPITAL_LETTERS',
			passText: '✓ Das Passwort beinhaltet Großbuchstaben',
			failText: 'Ein gutes Passwort beinhaltet Großbuchstaben',
			passingReward: 10,
			recommended: true,
		},
		{
			match: (value: string): boolean => /[0-9]/.test(value),
			name: 'ALPHANUMERICALS',
			passText: '✓ Das Passwort beinhaltet Zahlen',
			failText: 'Ein gutes Passwort beinhaltet Zahlen',
			passingReward: 15,
			recommended: true,
		},
		{
			match: (value: string): boolean => /[^A-Za-z0-9]/.test(value),
			name: 'SPECIAL_CHARS',
			passText: '✓ Das Passwort beinhaltet Sonderzeichen',
			failText: 'Ein gutes Passwort beinhaltet Sonderzeichen',
			passingReward: 20,
			recommended: true,
		},
		{
			match: (value: string): boolean => {
				// eslint-disable-next-line max-len
				const emojiChars = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;
				return emojiChars.test(value);
			},
			name: 'EMOJI_CHARS',
			passText: '✓ Easteregg: Dein Passwort enthält ein Emoji! Krass!',
			failText: 'Findest du das Easteregg?',
			passingReward: 40,
			recommended: false,
		},
	];

	const passingPolicies: PasswordPolicy[] = [];
	const failingPolicies: PasswordPolicy[] = [];

	passwordPolicies.forEach((policy: PasswordPolicy) => {
		policy.matches = policy.match(value);
		if (!policy.matches && policy.recommended) failingPolicies.push(policy);
		if (!policy.matches) scorePercent -= policy.failingPenalty ?? 0;
		if (policy.matches) passingPolicies.push(policy);
		if (policy.matches) scorePercent += policy.passingReward ?? 0;
	});

	scorePercent += Math.min((value.length * 1.5));

	return {
		score: Math.round(maxScore*(scorePercent/100)*100)/100,
		passingPolicies,
		failingPolicies,
	};
};

if (route == '/register') {
	const password1Input = document.getElementById(
		'userPassword') as HTMLInputElement;
	const passwordStrength = document.getElementById(
		'pwStrengthWrapper') as HTMLDivElement;


	let strengthInfoContainer: HTMLDivElement = undefined;
	let strengthInfoIcon: HTMLDivElement = undefined;

	const strengthChildren = [...passwordStrength.children] as HTMLDivElement[];
	if ((strengthChildren[0] as HTMLElement).dataset.wrapperinit) {
		strengthChildren.shift();
	}
	if ((strengthChildren[strengthChildren.length-1])
		    .dataset.infowrapper) {
		strengthInfoContainer = strengthChildren.pop();
	}
	if ((strengthChildren[strengthChildren.length-1])
		    .dataset.infoicon) {
		strengthInfoIcon = strengthChildren.pop();
	}
	const maxScore = strengthChildren.length;

	password1Input.addEventListener('focusin', (ev) => {
		passwordStrength.classList.remove('scale-y-0');
		passwordStrength.classList.add('scale-y-100');
	});

	password1Input.addEventListener('focusout', (ev) => {
		passwordStrength.classList.remove('scale-y-100');
		passwordStrength.classList.add('scale-y-0');
	});


	const renderTips = (score: PasswordScore,
	    strengthInfoContainer: HTMLDivElement) => {
		strengthInfoContainer.innerHTML = '';
		score.passingPolicies.forEach((policy: PasswordPolicy) => {
			const elem = document.createElement('p');
			elem.innerHTML = policy.passText;
			strengthInfoContainer.appendChild(elem);
		});
		score.failingPolicies.forEach((policy: PasswordPolicy) => {
			const elem = document.createElement('p');
			elem.classList.add('text-orange-700', 'dark:text-orange-500/70');
			elem.innerHTML = policy.failText;
			strengthInfoContainer.appendChild(elem);
		});
	};

	const dismissClickEvent = (ev: MouseEvent) => {
		if (!strengthInfoContainer.contains(ev.target as Node) &&
			    !(ev.target as Node).contains(password1Input)) {
			window.removeEventListener('mousedown', dismissClickEvent);
			strengthInfoContainer.classList.toggle('invisible');
			strengthInfoIcon.classList.toggle('invisible');
		}
	};

	const score = calculatePasswordScore(password1Input.value, maxScore);
	renderTips(score, strengthInfoContainer);

	password1Input.addEventListener('input', (ev) => {
		const score = calculatePasswordScore(password1Input.value, maxScore);
		strengthChildren.forEach((el, index) => {
			if (score.score >= index + 1) {
				el.classList.add('scale-x-100');
				el.classList.remove('scale-x-0');
				return;
			}
			el.classList.remove('scale-x-100');
			el.classList.add('scale-x-0');
		});
		renderTips(score, strengthInfoContainer);
	});

	strengthInfoIcon.addEventListener('mousedown', (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		window.addEventListener('mousedown', dismissClickEvent);

		strengthInfoContainer.classList.toggle('invisible');
		strengthInfoIcon.classList.toggle('invisible');
		password1Input.focus();
	});
}
