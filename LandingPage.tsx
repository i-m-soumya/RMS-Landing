import { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import LandingNav from './components/LandingNav';
import HeroSection from './sections/HeroSection';
import { siteContent } from './src/content/siteContent';
import { faqs } from './sections/faqData';

const TrustSection = lazy(() => import('./sections/TrustSection'));
const FeaturesSection = lazy(() => import('./sections/FeaturesSection'));
const HowItWorksRestaurant = lazy(() => import('./sections/HowItWorksRestaurant'));
const HowItWorksCustomer = lazy(() => import('./sections/HowItWorksCustomer'));
const SetupSection = lazy(() => import('./sections/SetupSection'));
const ContactSection = lazy(() => import('./sections/ContactSection'));
const FAQSection = lazy(() => import('./sections/FAQSection'));
const FooterSection = lazy(() => import('./sections/FooterSection'));

const appName = siteContent.seo.siteName;

export default function LandingPage() {
  const title = siteContent.seo.title;
  const description = siteContent.seo.description;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: appName,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        applicationSuite: 'Restaurant SaaS',
        description,
        keywords:
          'QR code menu for restaurants, digital menu ordering system, restaurant table ordering software, contactless QR menu India, WhatsApp ordering for restaurants',
        offers: {
          '@type': 'Offer',
          price: '499',
          priceCurrency: 'INR',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '499',
            priceCurrency: 'INR',
            billingDuration: 'P1M',
          },
          availability: 'https://schema.org/InStock',
        },
        audience: {
          '@type': 'Audience',
          audienceType: 'Restaurant owners and operators in India',
        },
        areaServed: 'IN',
        url: 'https://www.restro360.com/',
        logo: 'https://www.restro360.com/og-image.svg',
        category: 'Restaurant software',
      },
      {
        '@type': 'Organization',
        name: appName,
        url: 'https://www.restro360.com/',
        logo: 'https://www.restro360.com/og-image.svg',
        description,
        areaServed: 'India',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IN',
        },
        sameAs: ['https://www.restro360.com/'],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="landing-body">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content="QR code menu for restaurants, digital menu ordering system, restaurant table ordering software, contactless QR menu India, restaurant SaaS software India, WhatsApp ordering for restaurants"
        />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="theme-color" content="#f7f1e8" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={appName} />
        <meta property="og:url" content="https://www.restro360.com/" />
        <meta property="og:image" content="https://www.restro360.com/og-image.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://www.restro360.com/og-image.svg" />
        <link rel="canonical" href="https://www.restro360.com/" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <LandingNav />
      <main aria-label="Restro360 product overview">
        <HeroSection />

        <Suspense fallback={<div aria-hidden="true" className="h-40" />}>
          <TrustSection />
          <FeaturesSection />
          <HowItWorksRestaurant />
          <HowItWorksCustomer />
          <SetupSection />
          <ContactSection />
          <FAQSection />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <FooterSection />
      </Suspense>
    </div>
  );
}
