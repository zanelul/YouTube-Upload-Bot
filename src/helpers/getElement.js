const getElement = async (query, mainPage, needToWait = false) => {
	let button;
	try {
		if (needToWait) {
			await mainPage.waitForSelector(query);
			button = await mainPage.$(query);
		} else {
			button = await mainPage.$(query);
		}
	} catch (err) {
		console.log(err);
	}

	return button;
};

module.exports = getElement;