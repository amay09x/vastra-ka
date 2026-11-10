import { Routes, Route } from "react-router-dom";

import Chat from "./pages/Chat";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import Explore from "./pages/Explore";
import Categories from "./pages/Categories";
import PersonalStylist from "./pages/PersonalStylist";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import StylistTool from "./pages/StylistTool";

import ProductDetails from "./components/product/ProductDetails";

import ScrollToTop from "./components/common/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<SearchResults />} />
        <Route path="/stylist" element={<PersonalStylist />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/chat" element={<Chat />} />
        <Route
          path="/product/:productId"
          element={<ProductDetails />}
        />
        <Route path="/stylist/tool/:tool" element={<StylistTool />} />
      </Routes>
    </>
  );
}

export default App;
