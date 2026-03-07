const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { getApiKey, getBaseUrl } = require('./config');

async function pullPrompt(identifier) {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error('Error: API Key not found. Run `forge login` or set in config.');
        return;
    }

    const baseUrl = getBaseUrl();
    try {
        console.log(`Pulling ${identifier}...`);
        const response = await axios.get(`${baseUrl}/api/v1/registry/pull`, {
            params: { identifier },
            headers: { 'x-api-key': apiKey }
        });

        const { data } = response.data;
        const promptDir = path.join(process.cwd(), 'prompts', identifier.split('/')[0]);
        if (!fs.existsSync(promptDir)) {
            fs.mkdirSync(promptDir, { recursive: true });
        }

        const filePath = path.join(promptDir, `${identifier.split('/')[1]}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        console.log(`Successfully pulled to ${path.relative(process.cwd(), filePath)}`);
    } catch (error) {
        console.error('Error pulling prompt:', error.response?.data?.error || error.message);
    }
}

async function pushPrompt(filePath) {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error('Error: API Key not found.');
        return;
    }

    const baseUrl = getBaseUrl();
    try {
        if (!fs.existsSync(filePath)) {
            console.error(`Error: File not found at ${filePath}`);
            return;
        }

        const promptData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`Pushing ${promptData.slug}...`);

        const response = await axios.post(`${baseUrl}/api/v1/registry/push`, {
            name: promptData.name,
            slug: promptData.slug,
            description: promptData.description,
            system_prompt: promptData.version?.system_prompt || promptData.systemPrompt,
            template: promptData.version?.template || promptData.template,
            version_tag: promptData.version?.tag || 'v1'
        }, {
            headers: { 'x-api-key': apiKey }
        });

        console.log(`Successfully pushed: ${response.data.message}`);
    } catch (error) {
        console.error('Error pushing prompt:', error.response?.data?.error || error.message);
    }
}

async function searchRegistry(query) {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error('Error: API Key not found.');
        return;
    }

    const baseUrl = getBaseUrl();
    try {
        const response = await axios.get(`${baseUrl}/api/v1/registry/search`, {
            params: { q: query },
            headers: { 'x-api-key': apiKey }
        });

        const { results } = response.data;
        if (results.length === 0) {
            console.log('No prompts found matching your query.');
            return;
        }

        console.log('\n--- Registry Search Results ---');
        results.forEach(p => {
            console.log(`\n📦 ${p.identifier}`);
            console.log(`   Name: ${p.name}`);
            if (p.description) console.log(`   Desc: ${p.description}`);
        });
        console.log('\nUse `forge pull <identifier>` to download.\n');
    } catch (error) {
        console.error('Error searching registry:', error.response?.data?.error || error.message);
    }
}

module.exports = {
    pullPrompt,
    pushPrompt,
    searchRegistry
};
