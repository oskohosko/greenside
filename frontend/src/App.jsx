import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <div data-theme={"light"}>
      <Navbar />
      <HomePage />
    </div>
  )
}
