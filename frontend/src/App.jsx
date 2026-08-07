import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import Explore from "./pages/Explore";
import Categories from "./pages/Categories";
import PersonalStylist from "./pages/PersonalStylist";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/results" element={<SearchResults />} />
      <Route path="/stylist" element={<PersonalStylist />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/categories" element={<Categories />} />
      <Route
  path="/wishlist"
  element={<Wishlist />}
/>
<Route path="/account" element={<Profile />} />
    </Routes>
  );
}

export default App;