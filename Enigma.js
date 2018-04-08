class Plugboard {
	constructor (pairArray) {
		var alphabet = '', cipher = '';
		pairArray.forEach((pair) =>  {
			alphabet += pair[0];
			cipher += pair[1]
			alphabet += pair[1];
			cipher += pair[0]
		});
		this.alphabet = alphabet;
		this.cipher = cipher;
	}

	encode (c) {
		return Enigma.encode(c, this.alphabet, this.cipher, true);
	}
}

class Rotor {
	constructor (rotorType, position) {
		this.alphabet = Enigma.alphabet;
		this.rotor = Enigma.availableRotors[rotorType];
		this.cipher = this.rotor.cipher;
		this.position = position;
	}

	isAtNotch () {
		return this.rotor.notch.indexOf(this.alphabet[this.position]) !== -1;
	}

	step () {
		this.position++;
		if (this.position >= this.rotor.cipher.length) {
			this.position = 0;
		}
	}

	encode (c) {
		return this.cipher[(this.alphabet.indexOf(c) + this.position) % this.alphabet.length];
	}

	decode (c) {
		return this.alphabet[(this.cipher.indexOf(c) - this.position + this.alphabet.length) % this.alphabet.length];
	}
}

class Reflector {
	constructor (reflectorType) {
		this.alphabet = Enigma.alphabet;
		this.cipher = Enigma.availableReflectors[reflectorType];
	}

	encode (c) {
		return Enigma.encode(c, this.alphabet, this.cipher);
	}
}

class Enigma {
	constructor (rotors, reflector, plugboard) {
		this.rotors = rotors;
		this.reflector = reflector;
		this.plugboard = plugboard;
	}

	encode (c) {
		/*
		 *  enigma encoding process:
		 *	plugboard, rotors, reflector, reverse rotors, plubgoard again
		 */
		this.step();
		c = this.plugboard.encode(c);
		this.rotors.map((rotor) => c = rotor.encode(c));
		c = this.reflector.encode(c);
		this.rotors.reverse().slice().map((rotor) => c = rotor.decode(c));
		c = this.plugboard.encode(c);
		return c;
	}

	step () {
		// only first three rotors step
		this.rotors[0].step();
		if (this.rotors[0].isAtNotch() || this.rotors[1].isAtNotch()) {
			this.rotors[1].step();
		}
		if (this.rotors[1].isAtNotch()) {
			this.rotors[2].step();
		}
	}

	// pirated from https://github.com/amirbawab/Enigma-machine-simulator
	// and https://github.com/mikaoj/EnigmaKit/blob/master/Sources/EnigmaKit
	static get availableRotors() {
		return {
			//   first wheel:  ABCDEFGHIJKLMNOPQRSTUVWXYZ
			'I':	{ cipher: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q' },
			'II':	{ cipher: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E' },
			'III':	{ cipher: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V' },
			'IV':	{ cipher: 'ESOVPZJAYQUIRHXLNFTGKDCMWB', notch: 'J' },
			'V':	{ cipher: 'VZBRGITYUPSDNHLXAWMJQOFECK', notch: 'Z' },
			
			// naval rotors; two notches
			'VI':   { cipher: 'JPGVOUMFYQBENHZRDKASXLICTW', notch: 'ZM'},
			'VII':  { cipher: 'NZJHGRCXMYSWBOUFAIVLPEKQDT', notch: 'ZM'},
			'VIII': { cipher: 'FKQHTLXOCBJSPDZRAMEWNIUYGV', notch: 'ZM'}
		}
	}

	// pirated from https://github.com/amirbawab/Enigma-machine-simulator
	static get availableReflectors () {
		return {
			//           ABCDEFGHIJKLMNOPQRSTUVWXYZ
			'A':        'EJMZALYXVBWFCRQUONTSPIKHGD',
			'B (wide)': 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
			'C (wide)': 'FVPJIAOYEDRZXWGCTKUQSBNMHL',
			'B (thin)': 'ENKQAUYWJICOPBLMDXZVFTHRGS',
			'C (thin)': 'RDOBJNTKVEHMLFCWZAXGYIPSUQ'
		}
	}

	static get alphabet () {
		return "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	}

	static encode (c, alphabet, cipher, bypassAlphabetCheck) {
		if (alphabet.indexOf(c) === -1) {
			if (bypassAlphabetCheck) {
				return c;
			} else {
				throw 'Character ' + c + ' isnt avaiable in alphabet ' + alphabet;
			}
		} else {
			return cipher[alphabet.indexOf(c)];
		}
	}
}


/*
	Reading
	-------

	https://github.com/mikaoj/EnigmaKit
	https://github.com/emedvedev/enigma (more links available there)
	http://kerryb.github.io/enigma/ exhaustive overview
	https://enigma.hoerenberg.com/index.php?cat=Welcome
	http://users.telenet.be/d.rijmenants/en/enigmasim.htm
	http://www.cryptomuseum.com/crypto/enigma/hist.htm
	http://www.cryptomuseum.com/crypto/enigma/index.htm#is
 */