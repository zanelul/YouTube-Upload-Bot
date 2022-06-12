const Puppeteer = require("puppeteer-extra")
const UserAgentPlugin = require("puppeteer-extra-plugin-anonymize-ua")
const StealthPlugin = require("puppeteer-extra-plugin-stealth")
const Delay = require("delay")
const FS = require("fs")
const FSExtra = require("fs-extra")
Puppeteer.use(StealthPlugin())
Puppeteer.use(UserAgentPlugin({ makeWindows: true }))

let Browser, MainPage, RootDir

// For opening the chromium browser
async function OpenBrowser(Directory) {
    return await Puppeteer.launch({
        headless: false,
        defaultViewport: null,
        userDataDir: Directory,
        ignoreDefaultArgs: ["--disable-extensions"]
    })
}

// For close the browser at the end
module.exports.CloseBrowser = async function () {
    await MainPage.close()
    await Browser.close()
    await FSExtra.removeSync(RootDir)
}

// For logging you into youtube studio
module.exports.Login = async function (Email, Password) {
    RootDir = __dirname + "/browser"
    await FSExtra.removeSync(RootDir)
    Browser = await OpenBrowser(RootDir)
    MainPage = await Browser.newPage()
    await MainPage.goto("https://studio.youtube.com/")
    await MainPage.type("input[type=\"email\"]", Email)
    await MainPage.keyboard.press("Enter")
    await Delay(1000)
    await MainPage.type("input[type=\"password\"]", Password)
    await MainPage.keyboard.press("Enter")
}

// For uploading your video
module.exports.UploadVideo = async function (Video, Title, Description = "") {
    if (!Video || !(FS.existsSync(Video))) {
        throw "Video file does not exist or string is empty!"
    }

    // Wait for upload button to be visible
    await MainPage.waitForSelector("a[test-id=\"upload-icon-url\"]")

    // Get upload button and click it
    const UploadBtn = await MainPage.$("a[test-id=\"upload-icon-url\"]")
    await UploadBtn.click()

    // Upload video
    await MainPage.waitForSelector("#content > input[type=file]")
    const SubmitFile = await MainPage.$("#content > input[type=file]")
    await SubmitFile.uploadFile(Video)

    // Import title
    await MainPage.waitForSelector("#textbox")
    const TitleBox = await MainPage.$("#textbox")
    await TitleBox.click()
    await Delay(500)
    await MainPage.evaluate(() => document.execCommand("selectall", false, null))
    await Delay(1000)
    await MainPage.keyboard.type(Title.substr(0, 100), { delay: 10 })
    await Delay(1000)

    // Import description
    const DescBox = await MainPage.$("ytcp-social-suggestions-textbox[id=\"description-textarea\"]")
    await DescBox.click()
    await Delay(500)
    await MainPage.evaluate(() => document.execCommand("selectall", false, null))
    await Delay(1000)
    await MainPage.keyboard.type(Description.substr(0, 100), { delay: 10 })
    await Delay(1000)

    // Make it not for kids
    const AgeRestriction = await MainPage.$("tp-yt-paper-radio-button[name=\"VIDEO_MADE_FOR_KIDS_NOT_MFK\"]")
    await AgeRestriction.click()
    await Delay(1000)

    // Keep clicking next till the end
    const NextBtn = await MainPage.$("ytcp-button[id=\"next-button\"]")
    let PrivacyText = await MainPage.$("tp-yt-paper-radio-button[name=\"PUBLIC\"]")
    while (!PrivacyText) {
        await NextBtn.click()
        await Delay(1000)
        PrivacyText = await MainPage.$("tp-yt-paper-radio-button[name=\"PUBLIC\"]")
    }

    // Make video public
    const PrivacyBtn = await MainPage.$("tp-yt-paper-radio-button[name=\"PUBLIC\"]")
    await PrivacyBtn.click()
    await Delay(2000)

    // Publish video
    const PublishBtn = await MainPage.$("ytcp-button[id=\"done-button\"]")
    await PublishBtn.click()
    
    // Close popup
    await MainPage.waitForSelector("ytcp-button[id=\"close-button\"]")
    const CloseBtn = await MainPage.$("ytcp-button[id=\"close-button\"]")
    await CloseBtn.click()
}
