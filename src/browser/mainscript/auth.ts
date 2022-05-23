interface PasswordPolicy {
	match: (value: string) => boolean;

	// Gets set internally after match function is called on policy
	matches?: boolean;

	// Name of the policy
	name: string;

	// Percent of points granted or lost as a reward/penalty when passing/failing
	// the policy
	passingReward?: number;
	failingPenalty?: number;

	// If this policy is recommended. When false, it does not get returned
	// in 'failingPolicies' if it does not match
	recommended: boolean;
}

const route = location.pathname.replaceAll(/(?=\/$)\//g, '');
/**
 *
 * @param {string} value
 * @param {integer} maxScore
 * @return {object}
 */
const calculatePasswordScore = (value: string, maxScore: number = 1) => {
	let scorePercent = 0;

	const passwordPolicies: PasswordPolicy[] = [
		{
			match: (value: string): boolean => value.length > 12,
			name: 'MINIMUM_LENGTH',
			passingReward: 15,
			recommended: true,
		},
		{
			match: (value: string): boolean => new Blob([value]).size < 72,
			name: 'MAXIMUM_LENGTH',
			failingPenalty: 50,
			recommended: true,
		},
		{
			match: (value: string): boolean => /[a-z]/.test(value),
			name: 'LOWERCASE_LETTER',
			passingReward: 10,
			recommended: true,
		},
		{
			match: (value: string): boolean => /[A-Z]/.test(value),
			name: 'CAPITAL_LETTERS',
			passingReward: 10,
			recommended: true,
		},
		{
			match: (value: string): boolean => /[0-9]/.test(value),
			name: 'ALPHANUMERICAL',
			passingReward: 15,
			recommended: true,
		},
		{
			match: (value: string): boolean => /[^A-Za-z0-9]/.test(value),
			name: 'SPECIAL_CHARS',
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
	const password1Input = document.getElementById('userPassword');
	const passwordStrength = document.getElementById('pwStrengthWrapper');

	password1Input.addEventListener('input', (ev) => {
		const passwordInput = ev.target as HTMLInputElement;
		if (passwordInput.value.length == 0) {
			passwordStrength.classList.remove('scale-y-100');
			passwordStrength.classList.add('scale-y-0');
		} else {
			passwordStrength.classList.remove('scale-y-0');
			passwordStrength.classList.add('scale-y-100');
		}

		const strengthChildren = [...passwordStrength.children];
		if ((strengthChildren[0] as HTMLElement).dataset.wrapperinit) {
			strengthChildren.shift();
		}
		const maxScore = strengthChildren.length;
		const score = calculatePasswordScore(passwordInput.value, maxScore);
		console.dir(score);
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
