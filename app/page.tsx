import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Courses from './components/Courses';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Features />
      <Testimonials />
      <Courses />
      <Footer />
    </main>
  );
}
