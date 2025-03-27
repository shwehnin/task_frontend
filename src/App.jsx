import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="p-5 sm:pt-28 md:pt-28 lg:pt-28 font-body">
        <Outlet />
      </div>
    </>
  );
}
