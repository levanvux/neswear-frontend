import WelcomeDialog from "@/components/WelcomeDialog";
import HeroSlider from "@/components/HeroSlider";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function Home() {
  return (
    <main>
      <WelcomeDialog />
      <HeroSlider />
      <FeaturedProducts />
    </main>
  );
}
