<script>
	import { encrypt, decrypt } from '$lib/supabase/crypto';

	let encryptMessage = '';
	let encryptPassword = '';
	let encryptOutput = '';

	let decryptMessage = '';
	let decryptPassword = '';
	let decryptOutput = '';

	async function handleEncrypt() {
		if (!encryptMessage || !encryptPassword) {
			alert('Enter both message and password');
			return;
		}

		try {
			encryptOutput = await encrypt(encryptMessage, encryptPassword);
		} catch {
			encryptOutput = '❌ Encryption failed';
		}
	}

	async function handleDecrypt() {
		if (!decryptMessage || !decryptPassword) {
			alert('Enter both encrypted string and password');
			return;
		}

		try {
			decryptOutput = await decrypt(decryptMessage, decryptPassword);
		} catch {
			decryptOutput =
				'❌ Decryption failed: wrong password or corrupted data';
		}
	}

	function copyToClipboard(value) {
		if (!value) return;

		navigator.clipboard
			.writeText(value)
			.catch(() => alert('Copy failed'));
	}
</script>

<h1>Encrypt / Decrypt Debugger</h1>

<!-- ENCRYPT -->
<div style="margin-bottom:2rem; padding:1rem; border:1px solid #ccc;">
	<h2>Encrypt</h2>

	<div>
		<label>String to encrypt:</label>
		<input
			type="text"
			bind:value={encryptMessage}
			style="width:100%;"
			placeholder="Enter text"
		/>
	</div>

	<div>
		<label>Password:</label>
		<input
			type="password"
			bind:value={encryptPassword}
			style="width:100%;"
			placeholder="Enter password"
		/>
	</div>

	<button on:click={handleEncrypt}>Encrypt</button>

	<div>
		<strong>Encrypted (click to copy):</strong>
		<textarea
			readonly
			bind:value={encryptOutput}
			on:click={() => copyToClipboard(encryptOutput)}
			style="width:100%; height:3rem; background:#f0f0f0; cursor:pointer;"
		/>
	</div>
</div>

<!-- DECRYPT -->
<div style="padding:1rem; border:1px solid #ccc;">
	<h2>Decrypt</h2>

	<div>
		<label>Encrypted string:</label>
		<input
			type="text"
			bind:value={decryptMessage}
			style="width:100%;"
			placeholder="Paste encrypted string"
		/>
	</div>

	<div>
		<label>Password:</label>
		<input
			type="password"
			bind:value={decryptPassword}
			style="width:100%;"
			placeholder="Enter password"
		/>
	</div>

	<button on:click={handleDecrypt}>Decrypt</button>

	<div>
		<strong>Decrypted (click to copy):</strong>
		<textarea
			readonly
			bind:value={decryptOutput}
			on:click={() => copyToClipboard(decryptOutput)}
			style="width:100%; height:3rem; background:#f0f0f0; cursor:pointer;"
		/>
	</div>
</div>
