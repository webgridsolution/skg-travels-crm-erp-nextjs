import "./site.css";
import { Poppins } from "next/font/google";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import { Intro, Fleet, Articles, Benefits, Testimonials, AppDownload, Why, Cta } from "@/components/Sections";

const font = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata = {
  title: "SKG Travels – Best Car Rental in India",
  description: "Outstation taxi from Mumbai starting at Rs.11/KM.",
};

export default function Home() {
  return (
    <div className={`skg ${font.className}`}>
      <Header />
      <main>
        <Hero /><Intro /><Fleet /><Articles /><Benefits />
        <Testimonials /><AppDownload /><Why /><Cta /><Faq />
      </main>
      <Footer />
    </div>
  );
}