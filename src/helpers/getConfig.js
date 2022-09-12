const fs = require('fs');
const path = require('path');

const getConfig = () => {
	const configPath = path.join(__dirname, '..', '/json/config.json');
	const data = fs.readFileSync(configPath, 'utf-8');

	const config = JSON.parse(data);
	return config;
};

module.exports = getConfig;
