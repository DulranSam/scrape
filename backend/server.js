const express = require('express');
const request = require('request-promise');
const cheerio = require('cheerio'); // Adding Cheerio for web scraping
require("dotenv").config();
const PORT = process.env.PORT 
const app = express();

app.use(express.json());

// Function to return the scraper API URL
const returnScraperApiUrl = (apiKey) => `http://api.scraperapi.com?api_key=${apiKey}&autoparse=true`;

// Welcome route
app.get('/', async (req, res) => {
    res.send('Welcome to SaaS Products Scraper API!');
});

// Get SaaS product details and descriptions
app.get('/saas/:productName', async (req, res) => {
    const { productName } = req.params;

    try {
        // Constructing the Google search URL
        const searchUrl = `https://www.google.com/search?q=${productName} SaaS`;

        // Scraping Google search results using Scraper API
        const response = await request(returnScraperApiUrl(api_key) + `&url=${searchUrl}`);

        // Using Cheerio to parse the HTML response
        const $ = cheerio.load(response);

        // Extracting search result titles and descriptions
        const saasProducts = [];
        $('div.g').each((index, element) => {
            const title = $(element).find('h3').text();
            const description = $(element).find('span.st').text();
            saasProducts.push({ title, description });
        });

        res.json(saasProducts);
    } catch (error) {
        res.json(error);
    }
});

app.listen(PORT, () => console.log(`Server Running on Port: ${PORT}`));
