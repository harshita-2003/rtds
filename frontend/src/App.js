import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import ValueProposition from './components/ValueProposition';
import Footer from './components/Footer';
import Test from './Test';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
           
              <HowItWorksSection />
              <ValueProposition />
              <Footer />
            </>
          }
        />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
};

export default App;
