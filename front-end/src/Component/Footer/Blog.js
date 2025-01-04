import React, { useState } from "react";
import Navbar from "../Navbar";

const BlogPage = () => {
  // Define state to manage selected article and category
  const [selectedCategory, setSelectedCategory] = useState("All articles");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categories = ["All articles", "Category 1", "Category 2", "Category 3"];

  const articles = [
    {
      id: 1,
      category: "Category 1",
      title: "Article 1",
      description: "Article name - headline for an article",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris, vel tincidunt nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec vel ligula eu turpis cursus tempor.",
      imageUrl: "https://source.unsplash.com/random/800x600/?nature",
    },
    {
      id: 2,
      category: "Category 1",
      title: "Article 2",
      description: "Article name - headline for an article",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris, vel tincidunt nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec vel ligula eu turpis cursus tempor.",
      imageUrl: "https://source.unsplash.com/random/800x600/?city",
    },
    {
      id: 3,
      category: "Category 2",
      title: "Article 3",
      description: "Article name - headline for an article",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris, vel tincidunt nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec vel ligula eu turpis cursus tempor.",
      imageUrl: "https://source.unsplash.com/random/800x600/?technology",
    },
    {
      id: 4,
      category: "Category 2",
      title: "Article 4",
      description: "Article name - headline for an article",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris, vel tincidunt nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec vel ligula eu turpis cursus tempor.",
      imageUrl: "https://source.unsplash.com/random/800x600/?animals",
    },
    {
      id: 5,
      category: "Category 3",
      title: "Article 5",
      description: "Article name - headline for an article",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris, vel tincidunt nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec vel ligula eu turpis cursus tempor.",
      imageUrl: "https://source.unsplash.com/random/800x600/?sports",
    },
    {
      id: 6,
      category: "Category 3",
      title: "Article 6",
      description: "Article name - headline for an article",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris, vel tincidunt nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec vel ligula eu turpis cursus tempor.",
      imageUrl: "https://source.unsplash.com/random/800x600/?food",
    },
  ];

  const filteredArticles =
    selectedCategory === "All articles"
      ? articles
      : articles.filter((article) => article.category === selectedCategory);

  return (
    <div className="relative z-10 bg-black text-yellow-500 min-h-screen p-8">
      <Navbar />
      <div className="mb-8 ">
        <h1 className="text-4xl font-bold mb-9 pl-24">Blog</h1>
        {selectedArticle ? (
          <div>
            <h2 className="text-3xl font-bold mb-4">{selectedArticle.title}</h2>
            <div
              className="bg-cover bg-center h-40 mb-4"
              style={{ backgroundImage: `url(${selectedArticle.imageUrl})` }}
            ></div>
            <p className="mb-4">{selectedArticle.content}</p>
            <a
              href="#"
              className="text-yellow-300 hover:underline inline-flex items-center"
              onClick={(e) => {
                e.preventDefault();
                setSelectedArticle(null); // Go back to the article list
              }}
            >
              &#8592; Back
            </a>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-4">{selectedCategory}</h2>
            <p className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
              nec iaculis mauris.
            </p>
          </>
        )}
      </div>
      {!selectedArticle && (
        <div className="mb-8">
          <div className="flex space-x-4 mb-4">
            {categories.map((category) => (
              <a
                key={category}
                href="#"
                className={`hover:text-yellow-300 ${
                  selectedCategory === category ? "font-bold" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory(category);
                }}
              >
                {category}
              </a>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-gray-800 p-4 rounded-lg h-80 flex flex-col justify-between"
              >
                <div className="flex-grow">
                  <div
                    className="bg-cover bg-center h-40 mb-4"
                    style={{ backgroundImage: `url(${article.imageUrl})` }}
                  ></div>
                  <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                  <p className="mb-4">{article.description}</p>
                </div>
                <div className="mt-auto text-right">
                  <a
                    href="#"
                    className="text-yellow-300 hover:underline inline-flex items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedArticle(article); // Display the selected article
                    }}
                  >
                    Read more &#8594;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
