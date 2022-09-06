const Puppeteer = require("puppeteer-extra");
const UserAgentPlugin = require("puppeteer-extra-plugin-anonymize-ua");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const Delay = require("delay");
const FS = require("fs");
const FSExtra = require("fs-extra");
Puppeteer.use(StealthPlugin());
Puppeteer.use(UserAgentPlugin({ makeWindows: true }));

const rootDir = `${__dirname}/browser`;

let Browser, MainPage;

// For opening the chromium browser
const OpenBrowser = async Directory => {
	try {
		return await Puppeteer.launch({
			headless: false,
			defaultViewport: null,
			userDataDir: Directory,
			ignoreDefaultArgs: ["--disable-extensions"],
		});
	} catch (err) {
		console.log(err);
	}
};

// For close the browser at the end
const CloseBrowser = async () => {
	try {
		await MainPage.close();
		await Browser.close();
		FSExtra.removeSync(rootDir);
	} catch (err) {
		console.log(err); // Handle properly later
	}
};

// For logging you into youtube studio
const Login = async (Email, Password) => {
	try {
		Browser = await OpenBrowser(rootDir);
		MainPage = await Browser.newPage();
		FSExtra.removeSync(rootDir);
		await MainPage.goto("https://studio.youtube.com/");
		await MainPage.type('input[type="email"]', Email);
		await MainPage.keyboard.press("Enter");
		await Delay(1000);
		await MainPage.type('input[type="password"]', Password);
		await MainPage.keyboard.press("Enter");
	} catch (err) {
		console.log(err); // Handle properly later (lul)
	}
};

// For uploading your video
const UploadVideo = async (Video, Title, Description = "") => {
	// guard clauses
	if (!Video.length) {
		throw new Error("Video source cannot be empty.");
	} else if (!FS.existsSync(Video)) {
		throw new Error(`Cannot find video at: ${Video}`);
	}

	try {
		// Wait for upload button to be visible
		await MainPage.waitForSelector('a[test-id="upload-icon-url"]');

		// Get upload button and click it
		const UploadBtn = await MainPage.$('a[test-id="upload-icon-url"]');
		await UploadBtn.click();

		// Upload video
		await MainPage.waitForSelector("#content > input[type=file]");
		const SubmitFile = await MainPage.$("#content > input[type=file]");
		await SubmitFile.uploadFile(Video);

		// Import title
		await MainPage.waitForSelector("#textbox");
		const TitleBox = await MainPage.$("#textbox");
		await TitleBox.click();
		await Delay(500);
		await MainPage.evaluate(() =>
			document.execCommand("selectall", false, null)
		);
		await Delay(1000);
		await MainPage.keyboard.type(Title.substr(0, 100), { delay: 10 });
		await Delay(1000);

		// Import description
		const DescBox = await MainPage.$(
			'ytcp-social-suggestions-textbox[id="description-textarea"]'
		);
		await DescBox.click();
		await Delay(500);
		await MainPage.evaluate(() =>
			document.execCommand("selectall", false, null)
		);
		await Delay(1000);
		await MainPage.keyboard.type(Description.substr(0, 100), { delay: 10 });
		await Delay(1000);

		// Make it not for kids
		const AgeRestriction = await MainPage.$(
			'tp-yt-paper-radio-button[name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]'
		);
		await AgeRestriction.click();
		await Delay(1000);

		// Keep clicking next till the end
		const NextBtn = await MainPage.$('ytcp-button[id="next-button"]');
		let PrivacyText = await MainPage.$(
			'tp-yt-paper-radio-button[name="PUBLIC"]'
		);
		while (!PrivacyText) {
			await NextBtn.click();
			await Delay(1000);
			PrivacyText = await MainPage.$(
				'tp-yt-paper-radio-button[name="PUBLIC"]'
			);
		}

		// Make video public
		const PrivacyBtn = await MainPage.$(
			'tp-yt-paper-radio-button[name="PUBLIC"]'
		);
		await PrivacyBtn.click();
		await Delay(2000);

		// Publish video
		const PublishBtn = await MainPage.$('ytcp-button[id="done-button"]');
		await PublishBtn.click();

		// Close popup
		await MainPage.waitForSelector('ytcp-button[id="close-button"]');
		const CloseBtn = await MainPage.$('ytcp-button[id="close-button"]');
		await CloseBtn.click();
	} catch (err) {
		return console.log(err);
	}
};

module.exports = {
	OpenBrowser,
	CloseBrowser,
	Login,
	UploadVideo,
};