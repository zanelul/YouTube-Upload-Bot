# YouTube Upload Bot

YouTube Upload Bot is a program that will automatically upload a video for you at any number of times. Great for cheating the YouTube algorithm.

## Installation

1. Make sure to have [Node.js](https://nodejs.org) installed (Node.js version must be higher than v14)
2. Clone or download the repository
3. (Windows Users) Open up either `PowerShell` or `Command Prompt`
4. Type `cd` (Make sure you add the space after the `cd`)
5. Now copy the path of the bot. (Should contain `package-lock.json` & `package.json`)
6. Press the enter key
7. Type `npm install`, press enter

## Run

1. Go to `src/json/config.json` and open the file in a text editor
2. Configure these items in the file

   ```json
    "account": {
		"email": "REPLACE_ME",
		"password": "REPLACE_ME"
	},
	"botSettings": {
		"uploadLimit": 1,
		"videoFile": "REPLACE_ME"
	},
	"videoSettings": {
		"title": "REPLACE_ME",
		"description": "REPLACE_ME",
		"privacy": "PUBLIC"
	}
   ```

3. (Windows Users) Open up either `PowerShell` or `Command Prompt`.
4. Type `cd` (Make sure you add the space after the cd)
5. Now copy the path of the bot. (Should contain `package-lock.json` & `package.json`)
6. Press the enter key
7. Type `node src/index.js`

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
