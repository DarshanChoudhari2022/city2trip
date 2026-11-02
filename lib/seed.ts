import type { ContentItem, Settings } from "./validation";
const base = {
  duration: "Flexible itinerary",
  price: "",
  priceUnit: "per vehicle",
  itinerary: "",
  inclusions: "Chauffeur-driven vehicle\nPickup and drop as agreed",
  exclusions: "Parking, tolls and other charges as confirmed in your quote",
  season: "All year",
  startDate: "",
  endDate: "",
  featured: true,
  published: true,
  sample: false,
};
export const seedItems: ContentItem[] = [
  {
    ...base,
    id: "hire-driver",
    kind: "service",
    slug: "hire-a-driver-for-your-car",
    title: "Hire a driver for your car",
    summary:
      "Your car. Our driver. Arrange a chauffeur for local trips, business travel or an outstation journey.",
    description:
      "Already have a car? Hire a driver to take you where you need to go in your own vehicle. Share your pickup point, route, travel dates, vehicle model and whether it is manual or automatic. Driver availability, hours and charges are confirmed before the booking. This is a driver-only service; a rental vehicle is not included.",
    category: "Driver hire",
    image: "/images/interior.webp",
    duration: "As agreed for your journey",
    priceUnit: "per driver",
    itinerary:
      "Local errands & appointments\nOffice and business travel\nFamily outings & outstation trips",
    inclusions:
      "Driver service for your own car\nRoute and working hours as agreed in your quote",
    exclusions:
      "Vehicle hire is not included. You provide the car. Fuel, tolls, parking and any outstation allowances are confirmed separately.",
  },
  {
    ...base,
    id: "city",
    kind: "service",
    slug: "city-and-business-travel",
    title: "Business & city travel",
    summary:
      "From your first meeting to your flight home. A ride that fits your day.",
    description:
      "Arrange airport transfers, office commutes, business meetings and everyday city travel with a driver. Share your route and timing for a personalised quote.",
    category: "City travel",
    image: "/images/city.jpg",
    itinerary:
      "Airport pickup & drop\nOffice and business travel\nEveryday city errands",
  },
  {
    ...base,
    id: "outstation",
    kind: "service",
    slug: "family-and-outstation",
    title: "Family & outstation",
    summary: "More time together. Less time worrying about the road.",
    description:
      "Plan a family holiday, weekend outing or a longer outstation journey at your own pace. Tell us your destinations, preferred stops and group size so we can help you plan.",
    category: "Outstation",
    image: "/images/hills.jpg",
    itinerary: "Weekend getaways\nFamily holidays\nOne-way and return journeys",
  },
  {
    ...base,
    id: "group",
    kind: "service",
    slug: "group-and-occasions",
    title: "Groups & occasions",
    summary:
      "Big celebrations. Shared adventures. Everyone along for the ride.",
    description:
      "Coordinate travel for family functions, weddings, company outings and group trips. Vehicle options and arrangements are confirmed with your personalised quote.",
    category: "Group travel",
    image: "/images/group.jpg",
    itinerary:
      "Wedding guest transfers\nCorporate team outings\nFamily functions & celebrations",
  },
  {
    ...base,
    id: "spiritual",
    kind: "service",
    slug: "spiritual-journeys",
    title: "Spiritual journeys",
    summary: "Visit the places that bring you a little closer to peace.",
    description:
      "Plan temple visits and pilgrimages with time for the stops that matter to you. Share your preferred destinations and any accessibility requirements before travel.",
    category: "Spiritual",
    image: "/images/temple.jpg",
    itinerary:
      "Temple circuits\nPilgrimage visits\nCustom spiritual itineraries",
  },
  {
    ...base,
    id: "hospital",
    kind: "service",
    slug: "hospital-pickup-drop",
    title: "Hospital pickup & drop",
    summary: "A thoughtfully planned ride for appointments and visits.",
    description:
      "Arrange ordinary passenger transport for hospital appointments and family visits. Please describe any access or mobility requirements when enquiring. This is not an ambulance or medical transport service.",
    category: "City travel",
    image: "/images/city.jpg",
    featured: false,
  },
  {
    ...base,
    id: "airport",
    kind: "service",
    slug: "airport-transfers",
    title: "Airport transfers",
    summary: "Start and end your journey with a pre-arranged ride.",
    description:
      "Share your airport, flight timing, luggage and passenger count. We will confirm pickup arrangements and your quote before you travel.",
    category: "City travel",
    image: "/images/city.jpg",
    featured: false,
  },
  {
    ...base,
    id: "mountain",
    kind: "package",
    slug: "hills-and-happy-memories",
    title: "Hills & happy memories",
    summary: "Fresh mountain air, scenic stops and a slower kind of weekend.",
    description:
      "An illustrative hill-country itinerary for families and friends. Choose your departure city and destination with our team; the final route and inclusions are confirmed in your quote.",
    category: "Family",
    image: "/images/hills.jpg",
    duration: "3 days · 2 nights",
    season: "Weekend escape",
    sample: true,
    itinerary:
      "Day 1 · A scenic drive and time to settle in\nDay 2 · Local sights and unhurried exploring\nDay 3 · A relaxed return with stops along the way",
  },
  {
    ...base,
    id: "pilgrimage",
    kind: "package",
    slug: "a-journey-within",
    title: "A journey within",
    summary: "Meaningful temple visits, quiet moments and comfortable travel.",
    description:
      "An illustrative spiritual circuit, customised around your preferred temples and travel dates. Destinations, visit timings and inclusions will be agreed before confirmation.",
    category: "Spiritual",
    image: "/images/temple.jpg",
    duration: "2 days · 1 night",
    season: "Spiritual getaway",
    sample: true,
    itinerary:
      "Day 1 · Depart and visit your selected spiritual destination\nDay 2 · A morning visit and return journey",
  },
  {
    ...base,
    id: "coast",
    kind: "package",
    slug: "a-little-coastal-escape",
    title: "A little coastal escape",
    summary: "Sea breezes, golden sunsets and a change of scenery.",
    description:
      "An illustrative coastal getaway for your family or group. Tell us your departure city and preferred beach destination, and we will tailor the journey.",
    category: "Family",
    image: "/images/coast.jpg",
    duration: "3 days · 2 nights",
    season: "Coastal break",
    sample: true,
    itinerary:
      "Day 1 · Drive to the coast\nDay 2 · Beaches, local sights and free time\nDay 3 · Breakfast and the journey home",
  },
];
export const defaultSettings: Settings = {
  fleet: [
    {
      name: "Sedan",
      description: "For city rides & smaller groups",
      capacity: "",
    },
    {
      name: "SUV / MUV",
      description: "For family trips & extra space",
      capacity: "",
    },
    {
      name: "Group vehicle",
      description: "For outings & shared occasions",
      capacity: "",
    },
  ],
  phone: "",
  email: "",
  address: "",
  cities: "",
  domain: "",
  announcement: "Your plans. Your people. Your kind of journey.",
  about:
    "GosaviOn Group brings everyday rides and memorable journeys together. From an airport transfer to a family getaway, share your plans and we will help you arrange the right ride.",
  faqs: [
    {
      question: "How do I book a ride with GosaviOn Group?",
      answer:
        "Share your route, travel date and passenger count through our enquiry form once online enquiries are enabled. Our team will discuss availability and provide a quote. Your trip is booked only after confirmation.",
    },
    {
      question: "Can I customise a tour package?",
      answer:
        "Yes. Tour ideas are a starting point. You can request different stops, travel dates and durations when you enquire.",
    },
    {
      question: "Are these chauffeur-driven rides?",
      answer:
        "Yes. GosaviOn Group is designed around travel with a driver, including city transfers, outstation journeys and group trips.",
    },
    {
      question: "What does the quoted price include?",
      answer:
        "Your quote will explain the vehicle, travel allowance and any applicable driver charges, tolls, parking or other extras. Please review it before confirming.",
    },
  ],
};
