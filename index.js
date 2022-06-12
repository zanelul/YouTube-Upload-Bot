const Uploader = require("./YT Uploader/uploader.js")

async function Main() {
    await Uploader.Login("<EMAIL>", "<PASSWORD>")
    console.log("[YT-Uploader] Logged in.");

    // Comment this if you want to upload more than 1 video
    await Uploader.UploadVideo("<VIDEO FILE>", "<YOUTUBE TITLE>")
    console.log("[YT-Uploader] Uploaded video.");
    
    // Uncomment this to upload more than 1 video
    /*for (let i = 0; i < 10; i++) {
        await Uploader.UploadVideo("<VIDEO FILE>", "<YOUTUBE TITLE>")
        console.log(`[YT-Uploader] Uploaded video ${i + 1} time/times.`);
    }*/

    console.log("[YT-Uploader] Finished uploading.");
    await Uploader.CloseBrowser()
}
Main()
