import React, { useState } from "react";
import image1 from "./../assets/img1.jpg";
import image2 from "./../assets/img2.jpg";
import image3 from "./../assets/img3.jpg";
import image4 from "./../assets/img4.jpg";
import image5 from "./../assets/img5.jpg";
import image6 from "./../assets/img6.jpg";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articles = [
    {
      category: "Category 1",
      title: "Article 1",
      content: "This is a brief summary of Article 1 in Category 1.",
      detailedDescription:
        "This is the detailed description of Article 1 in Category 1. It provides in-depth insights into the topic, highlighting key points and solutions.",
      imageUrl: image1,
    },
    {
      category: "Category 1",
      title: "Article 2",
      content: "This is a brief summary of Article 2 in Category 1.",
      detailedDescription:
        "This is the detailed description of Article 2 in Category 1. It explores challenges and opportunities in the field.",
      imageUrl: image2,
    },
    {
      category: "Category 1",
      title: "Article 3",
      content: "This is a brief summary of Article 3 in Category 1.",
      detailedDescription:
        "This is the detailed description of Article 3 in Category 1. It includes a case study and expert commentary.",
      imageUrl: image3,
    },
    {
      category: "Category 2",
      title: "Article 1",
      content: "This is a brief summary of Article 1 in Category 2.",
      detailedDescription:
        "This is the detailed description of Article 1 in Category 2. It focuses on recent advancements in the topic.",
      imageUrl: image4,
    },
    {
      category: "Category 2",
      title: "Article 2",
      content: "This is a brief summary of Article 2 in Category 2.",
      detailedDescription:
        "This is the detailed description of Article 2 in Category 2. It provides actionable strategies for implementation.",
      imageUrl: image5,
    },
    {
      category: "Category 2",
      title: "Article 3",
      content: "This is a brief summary of Article 3 in Category 2.",
      detailedDescription:
        "This is the detailed description of Article 3 in Category 2. It includes research findings and their implications.",
      imageUrl: image6,
    },
  ];

  const filteredArticles =
    activeCategory === "All Articles"
      ? articles
      : articles.filter((article) => article.category === activeCategory);

  const handleReadMore = (article) => {
    setSelectedArticle(article);
  };

  const handleBack = () => {
    setSelectedArticle(null);
  };

  return (
    <div className="bg-black text-yellow-500 min-h-screen pb-24">
      {selectedArticle ? (
        <div className="p-6 bg-black text-yellow-500">
          <header className="text-center py-6">
            <h1 className="text-5xl font-bold">Blog</h1>
          </header>
          <div className="flex justify-center mb-6">
            <img
              src={selectedArticle.imageUrl}
              alt={selectedArticle.title}
              className="rounded-lg max-h-64 max-w-full object-contain"
            />
          </div>
          <h3 className="text-4xl mb-4 text-center">{selectedArticle.title}</h3>
          <p className="mt-2 text-lg">{selectedArticle.detailedDescription}</p>
          <button onClick={handleBack} className="underline mt-4">
            &larr; Back
          </button>
        </div>
      ) : (
        <>
          <header className="text-center py-12">
            <h1 className="text-5xl font-bold">Blog</h1>
            <p className="mt-4 max-w-2xl mx-auto">
              Stay updated with the latest articles and insights.
            </p>
          </header>
          <div className="flex justify-center space-x-6 mb-6">
            <button
              onClick={() => setActiveCategory("All Articles")}
              className={`hover:underline ${
                activeCategory === "All Articles" ? "underline font-bold" : ""
              }`}
            >
              All Articles
            </button>
            <button
              onClick={() => setActiveCategory("Category 1")}
              className={`hover:underline ${
                activeCategory === "Category 1" ? "underline font-bold" : ""
              }`}
            >
              Category 1
            </button>
            <button
              onClick={() => setActiveCategory("Category 2")}
              className={`hover:underline ${
                activeCategory === "Category 2" ? "underline font-bold" : ""
              }`}
            >
              Category 2
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
            {filteredArticles.map((article, index) => (
              <div
                key={index}
                className="relative bg-cover bg-center rounded-lg"
                style={{
                  backgroundImage: `url(${article.imageUrl})`,
                  minHeight: "200px",
                }}
              >
                <div className="bg-black bg-opacity-50 p-4 rounded-lg h-full flex flex-col justify-end">
                  <h3 className="text-2xl mb-4">{article.title}</h3>
                  <p className="mt-2">{article.content.substring(0, 100)}...</p>
                  <button
                    onClick={() => handleReadMore(article)}
                    className="text-yellow-500 underline mt-4 inline-block self-end"
                  >
                    Read more &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Blog;
