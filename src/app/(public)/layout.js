import Navbar from "@/components/navbar";

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="mt-20">
        {children}
      </div>
    </div>
  );
}
