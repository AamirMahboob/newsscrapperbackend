const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
 
const app = express();
const PORT = 5000;
 
// Enable CORS for all routes
app.use(cors());
 
// Define the URL to scrape
const url = "https://www.aljazeera.com/sports/";
 
async function scrapeArticleHeadlines() {
  const articles = [];
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
 
    $(".featured-articles-list__item").each((_, element) => {
      const title = $(element).find(".gc__title a span").text().trim();
      const summary = $(element).find(".gc__excerpt p").text().trim();
      const link = "https://www.aljazeera.com" + $(element).find(".gc__title a").attr("href");
      const datePublished = $(element).find(".gc__date__date .date-simple span[aria-hidden='true']").text().trim();
     
      // Find the image URL
      const image = $(element).find(".gc__image-wrap img.gc__image").attr("src");
      const imageUrl = image ? "https://www.aljazeera.com" + image : null; // Complete URL if relative
 
      if (title) {
        articles.push({
          title,
          summary,
          link,
          datePublished,
          image: imageUrl
        });
      }
    });
  } catch (error) {
    console.error("Error scraping data:", error);
  }
  return articles;
}
 
// Define an API endpoint to serve scraped articles
app.get("/api/articles", async (req, res) => {
  const articles = await scrapeArticleHeadlines();
  res.json(articles);
  console.log(articles)
});
 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


//filterd
// const express = require("express");
// const axios = require("axios");
// const cheerio = require("cheerio");
// const cors = require("cors");

// const app = express();
// const PORT = 5000;

// // Enable CORS for all routes
// app.use(cors());

// // Define the URL to scrape
// const url = "https://www.aljazeera.com/sports/";

// async function scrapeArticleHeadlines() {
//   const articles = [];
//   try {
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);

//     $(".featured-articles-list__item").each((_, element) => {
//       const title = $(element).find(".gc__title a span").text().trim();
//       const summary = $(element).find(".gc__excerpt p").text().trim();
//       const link = "https://www.aljazeera.com" + $(element).find(".gc__title a").attr("href");
//       const datePublished = $(element).find(".gc__date__date .date-simple span[aria-hidden='true']").text().trim();

//       // Find the image URL
//       const image = $(element).find(".gc__image-wrap img.gc__image").attr("src");
//       const imageUrl = image ? "https://www.aljazeera.com" + image : null;

//       // Filter articles that contain "cricket" in the title or summary
//       if (title && (title.toLowerCase().includes("cricket") || summary.toLowerCase().includes("cricket"))) {
//         articles.push({
//           title,
//           summary,
//           link,
//           datePublished,
//           image: imageUrl
//         });
//       }
//     });
//   } catch (error) {
//     console.error("Error scraping data:", error);
//   }
//   return articles;
// }

// // Define an API endpoint to serve scraped articles
// app.get("/api/articles", async (req, res) => {
//   const articles = await scrapeArticleHeadlines();
//   res.json(articles);
//   console.log(articles)
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
