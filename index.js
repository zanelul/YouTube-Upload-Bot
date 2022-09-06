const Uploader = require("./YT Uploader/uploader.js");

async function Main() {
    const emailAddress = "REPLACE_ME";
    const password = "REPLACE_ME";

    const videoFile = "REPLACE_ME";
    const youtubeTitle = "REPLACE_ME";
    const youtubeDesc = "REPLACE_ME";
    const uploadLimit = 1;

    await Uploader.Login(emailAddress, password);
    console.log("[YT-Uploader] Logged in.");

    // Keep Uploading the video till limit is hit
    for (let i = 0; i < uploadLimit; i++) {
        try {
            await Uploader.UploadVideo(videoFile, youtubeTitle, youtubeDesc);
            console.log(
                `[YT-Uploader] Uploaded video ${i + 1} ${
                    i < 1 ? "time" : "times"
                }`
            );
        } catch (err) {
            console.log(err);
        }
    }

    console.log("[YT-Uploader] Finished uploading.");
    await Uploader.CloseBrowser();
}

await Main();