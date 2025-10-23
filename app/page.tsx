import Hero from "./_components/Hero";
import VideoSection from "./_components/VideoSection";
import { PopularCityList } from "./_components/PopularCityList";
import Footer from "./_components/Footer";

export default function Home() {

  return (
    <main className="flex flex-col items-center w-full min-h-screen overflow-x-hidden">
      <Hero />

      <section className="w-full max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Plan Smarter, Travel Better</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-xl mb-2">AI-Powered Planning</h3>
            <p className="text-gray-600">Personalized itineraries created in minutes based on your preferences</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-xl mb-2">Smart Pricing</h3>
            <p className="text-gray-600">Get the best deals with our dynamic pricing algorithm</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-xl mb-2">Local Experiences</h3>
            <p className="text-gray-600">Discover authentic activities recommended by locals</p>
          </div>
        </div>
      </section>

      <VideoSection />

      <section className="w-full max-w-9xl mx-auto px-2 sm:px-4 lg:px-4 mt-6">
        <PopularCityList />
      </section>

      <footer className="w-full mt-20">
        <Footer />
      </footer>
    </main>
  );
}
