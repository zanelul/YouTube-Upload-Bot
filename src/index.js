const Uploader = require('./uploader.js');
const getConfig = require('./helpers/getConfig');

async function Main() {
	const { account, botSettings, videoSettings } = getConfig();

	try {
		// Sign in
		await Uploader.Login(account.email, account.password);
		console.log('[YT-Uploader] Logged in.');

		// Keep Uploading the video till limit is hit
		for (let i = 0; i < botSettings.uploadLimit; i++) {
			await Uploader.UploadVideo(
				botSettings.videoFile,
				videoSettings.title,
				videoSettings.description,
				videoSettings.privacy,
			);
			console.log(
				`[YT-Uploader] Uploaded video ${i + 1}/${botSettings.uploadLimit}`,
			);
		}

		console.log('[YT-Uploader] Finished uploading.');
		await Uploader.CloseBrowser();
	} catch (err) {
		console.log(err);
	}
}

Main();
