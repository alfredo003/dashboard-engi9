import { Outlet } from "react-router-dom";
import ModernHeader from "./components/Header";

export default function App() {
  return (
    <div>
     <ModernHeader/>
      <Outlet />
    </div>
  );
}
