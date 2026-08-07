import ResultCard from "./ResultCard";

const products = [
  {
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600",
    brand: "ZARA",
    name: "Black Oversized Linen Shirt",
    price: "2199",
    originalPrice: "3499",
    discount: "37",
    rating: "4.6",
    reviews: "11.2k",
    aiMatch: "96",
    aiReason:
      "Perfect for your minimalist wardrobe and fits your ₹3000 budget.",
    source: "Myntra",
  },
];

function ResultsGrid() {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {products.map((product, index) => (
        <ResultCard key={index} {...product} />
      ))}
    </div>
  );
}

export default ResultsGrid;