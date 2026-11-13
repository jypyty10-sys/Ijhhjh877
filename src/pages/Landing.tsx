import { useContent } from '../lib/content';
import { useSeo } from '../lib/seo';
import { Nav } from '../components/Nav';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Showcase } from '../components/Showcase';
import { Specs } from '../components/Specs';
import { Applications } from '../components/Applications';
import { Filaments } from '../components/Filaments';
import { Benefits } from '../components/Benefits';
import { WhyChoose } from '../components/WhyChoose';
import { Gallery } from '../components/Gallery';
import { Faq } from '../components/Faq';
import { FinalCta } from '../components/FinalCta';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { ToTop } from '../components/ToTop';

export function Landing() {
  const { content } = useContent();
  useSeo(content);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <Showcase />
        <Specs />
        <Applications />
        <Filaments />
        <Benefits />
        <WhyChoose />
        <Gallery />
        <Faq />
        <FinalCta />
        <Contact />
      </main>
      <Footer />
      <ToTop />
    </>
  );
}
