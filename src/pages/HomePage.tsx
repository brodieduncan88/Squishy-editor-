import Header from '../home/Header';
import Hero from '../home/Hero';
import { SkyDecor } from '../home/Decor';
import {
  HowItWorks,
  Gallery,
  DesignPacksSection,
  GiftSection,
  TrustSection,
  Footer,
} from '../home/Sections';
import '../home/home.css';

export default function HomePage() {
  return (
    <div className="home">
      <div className="home__sky">
        <SkyDecor />
        <Header />
        <Hero />
      </div>
      <HowItWorks />
      <Gallery />
      <DesignPacksSection />
      <GiftSection />
      <TrustSection />
      <Footer />
    </div>
  );
}
