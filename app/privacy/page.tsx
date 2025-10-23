export default function PrivacyPage() {
  return (
    <main className="px-4 py-10 sm:px-6 md:px-10 lg:px-16">
      <section className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-6">
          We respect your privacy. This page outlines how we collect, use, and protect your data.
        </p>
        <div className="space-y-4">
          <p>
            - We only collect information necessary to provide our travel planning services.
          </p>
          <p>
            - You can request deletion of your account data at any time by contacting support.
          </p>
          <p>
            - We do not sell your personal data. Third-party APIs are used strictly for itinerary content and maps/photos.
          </p>
        </div>
      </section>
    </main>
  )
}


