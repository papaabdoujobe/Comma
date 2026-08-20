import { Check } from "lucide-react";

export default function BillingPage() {
  const tiers = [
    {
      name: "Basic",
      price: "$49",
      description: "Perfect for freelancers and small teams.",
      features: [
        "1 Website",
        "100 AI Optimization Credits",
        "Google Search Console Integration",
        "Standard Support",
      ],
      priceId: "price_basic_mock",
    },
    {
      name: "Pro",
      price: "$99",
      description: "Ideal for growing agencies.",
      features: [
        "5 Websites",
        "500 AI Optimization Credits",
        "White-label Reports",
        "Priority Support",
      ],
      priceId: "price_pro_mock",
      popular: true,
    },
    {
      name: "Agency",
      price: "$199",
      description: "For high-volume agency operations.",
      features: [
        "Unlimited Websites",
        "Unlimited AI Optimization Credits",
        "Custom Domain",
        "Dedicated Account Manager",
      ],
      priceId: "price_agency_mock",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Simple, transparent pricing</h1>
        <p className="mt-4 text-xl text-gray-500">
          Upgrade your plan to unlock white-label reporting and AI credits.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-2xl bg-white border ${
              tier.popular ? "border-primary shadow-xl scale-105 relative" : "border-gray-200 shadow-sm"
            } p-8 flex flex-col`}
          >
            {tier.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                Most Popular
              </span>
            )}
            <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
            <p className="mt-2 text-gray-500">{tier.description}</p>
            <div className="mt-6 mb-8 flex items-baseline text-5xl font-extrabold text-gray-900">
              {tier.price}
              <span className="ml-2 text-xl font-medium text-gray-500">/mo</span>
            </div>
            
            <ul className="flex-1 space-y-4 mb-8">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="h-6 w-6 text-green-500 shrink-0" />
                  <span className="ml-3 text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <form action="/api/checkout" method="POST">
              <input type="hidden" name="priceId" value={tier.priceId} />
              <button
                type="submit"
                className={`w-full py-3 px-6 rounded-lg font-semibold text-center transition-colors ${
                  tier.popular
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                }`}
              >
                Upgrade to {tier.name}
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
