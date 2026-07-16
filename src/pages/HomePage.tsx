import Header from '../home/Header';
import Hero from '../home/Hero';
import { SkyDecor } from '../home/Decor';
import Atmosphere from '../components/Atmosphere';
import Marquee from '../components/Marquee';
import {
  HowItWorks,
  Gallery,
  DesignPacksSection,
  GiftSection,
  TrustSection,
  Footer,
} from '../home/Sections';
import '../home/home.css';

const MARQUEE_WORDS = [
  'Pick', 'Customise', 'Wrap', 'Share', 'Squish', 'Play', 'Gift', 'Create',
];

export default function HomePage() {
  return (
    <div className="home">
      <Atmosphere />
      <div className="home__content">
        <div className="home__sky">
          <SkyDecor />
          <Header />
          <Hero />
        </div>
        <HowItWorks />
        <Marquee items={MARQUEE_WORDS} />
        <Gallery />
        <DesignPacksSection />
        <GiftSection />
        <TrustSection />
        <Footer />
      </div>
    </div>
  );
}
