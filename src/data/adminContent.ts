// Central mock data for the admin panel.
// All values are seeded from the actual public website content.
// When the serverless API is wired up, these will be replaced by API calls.

export interface HeroSlide {
  id: string;
  image: string;
  headline: string;
  subtext: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    image: "/assets/hero_2.jpeg",
    headline: "Protect Crops with Certified Bio-Pesticides",
    subtext: "Organic control against sucking pests, thrips, and mites.",
  },
  {
    id: "slide-2",
    image: "/assets/hero_1.jpeg",
    headline: "Get Free Parichay Combo Direct From Factory",
    subtext: "Save up to 70% middleman commission on certified bio-inputs.",
  },
  {
    id: "slide-3",
    image: "/assets/hero_3.jpeg",
    headline: "NABL Lab-Tested Scientific Formulations",
    subtext: "Synthesized in central chemical units under strict double-seal guarantees.",
  },
  {
    id: "slide-4",
    image: "/assets/product_3.jpeg",
    headline: "Premium Organic Soil Conditioners & Nutrients",
    subtext: "Scientific formulations to boost root health and overall crop yield.",
  },
];

export interface CategoryItem {
  id: string;
  name: string;
  count: number;
  desc: string;
  image: string;
  order?: number;
  isComingSoon?: boolean;
}

export const CATEGORY_ITEMS: CategoryItem[] = [
  { id: "cat-fertilizers", name: "Fertilizers", count: 18, desc: "Organic, NPK Solubles, Micronutrients & Biofertilizers", image: "/assets/hero_2.jpeg", order: 1, isComingSoon: false },
  { id: "cat-pesticides", name: "Pesticides", count: 0, desc: "Chemical Insecticides, Organic Pest Repellers & Bio-Viricides", image: "/assets/product_2.jpeg", order: 2, isComingSoon: true },
  { id: "cat-herbicides", name: "Herbicides", count: 0, desc: "Selective and Non-selective Weed Killers", image: "/assets/product_4.jpeg", order: 3, isComingSoon: true },
  { id: "cat-fungicides", name: "Fungicides", count: 0, desc: "Systemic, Contact and Bio-Fungicides for crop safety", image: "/assets/product_3.jpeg", order: 4, isComingSoon: true },
  { id: "cat-combos", name: "Combos", count: 8, desc: "Super Saver Crop Solutions and stage-specific sprays", image: "/assets/hero_1.jpeg", order: 5, isComingSoon: false },
];

export interface FertilizerSchedule {
  id: string;
  productId: string;
  productName: string;
  startDay: number;
  endDay: number;
  quantity: string;
  unit: string;
  remark?: string;
}

export interface CropItem {
  id: string;
  name: string;
  desc: string;
  image: string;
  schedule?: string;
  fertilizerSchedules?: FertilizerSchedule[];
}

export const CROP_ITEMS: CropItem[] = [
  { id: "crop-tomato", name: "Tomato", desc: "Early Blight, Powdery Mildew, Fruit Borer", image: "/assets/hero_1.jpeg" },
  { id: "crop-cotton", name: "Cotton", desc: "Cutworm, Pink Bollworm, Wilt Protection", image: "/assets/hero_2.jpeg" },
  { id: "crop-paddy", name: "Paddy", desc: "Stem Borer, Blast Fungus, Leaf Folder", image: "/assets/hero_3.jpeg" },
  { id: "crop-chilli", name: "Chilli", desc: "Mites, Whitefly, Leaf Curl Virus", image: "/assets/hero_2.jpeg" },
  { id: "crop-sugarcane", name: "Sugarcane", desc: "Internode Borer, Red Rot prevention", image: "/assets/product_2.jpeg" },
  { id: "crop-wheat", name: "Wheat", desc: "Rust Disease, Termite control, Grain Weight", image: "/assets/product_3.jpeg" },
  { id: "crop-brinjal", name: "Brinjal", desc: "Fruit & Shoot Borer, Jassids", image: "/assets/product_4.jpeg" },
  { id: "crop-mango", name: "Mango", desc: "Powdery Mildew, Fruit Drop, Anthracnose", image: "/assets/hero_1.jpeg" },
];

export interface BlogItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  desc: string;
  category: string;
  image: string;
  metaTitle?: string;
  metaDescription?: string;
}

export const BLOG_ITEMS: BlogItem[] = [
  {
    id: "blog-1",
    slug: "no-middlemen-no-overpricing-direct-to-farm-revolution",
    title: "No Middlemen, No Overpricing – Direct to Farm Revolution",
    date: "June 16, 2026",
    desc: "Indian farmers are the backbone of our country - but they often face high costs and low-quality products. Read how Greengrow Fertilizer changes this.",
    category: "D2C Agriculture",
    image: "/assets/hero_3.jpeg",
    metaTitle: "Direct to Farm Revolution - Stop Overpricing",
    metaDescription: "Learn how Greengrow Fertilizer is changing the Indian agriculture scene with our direct to farm revolution, cutting out middlemen."
  },
  {
    id: "blog-2",
    slug: "best-soybean-varieties-for-high-yield-2026",
    title: "Best Soybean Varieties for High Yield in 2026",
    date: "May 22, 2026",
    desc: "Success in soybean farming depends heavily on variety selection. Discover the top high-yield soybean varieties designed for this season.",
    category: "Crop Yield Tips",
    image: "/assets/hero_1.jpeg",
    metaTitle: "Best High Yield Soybean Varieties in 2026",
    metaDescription: "Discover the top high-yield soybean varieties for the 2026 season. Increase your crop yield with expert tips."
  },
  {
    id: "blog-3",
    slug: "eliminating-summer-sucking-pests-with-1-single-bio-spray",
    title: "Eliminating Summer Sucking Pests with 1 Single Bio-Spray",
    date: "May 06, 2026",
    desc: "As temperatures soar, whiteflies, thrips, and mites damage major crops. Here is our scientific prevention schedule.",
    category: "Pest Management",
    image: "/assets/product_2.jpeg",
    metaTitle: "Eliminate Summer Sucking Pests with 1 Bio-Spray",
    metaDescription: "Protect your crops from whiteflies, thrips, and mites this summer with our single scientific bio-spray solution."
  },
];

export interface D2CSection {
  badge: string;
  heading: string;
  description: string;
  bullets: string[];
  image: string;
  ctaText: string;
}

export const D2C_SECTION: D2CSection = {
  badge: "Direct to Farm",
  heading: "India's Premier Factory-to-Farm Agricultural Brand",
  description:
    "We operate a complete laboratory to synthesis cycle. Bypassing stockists, transport agents, and retail dealer grids saves farmers up to 70% while guaranteeing authentic fresh formulation batches.",
  bullets: ["Direct Prices", "Free Delivery", "Expert Helpline"],
  image: "/assets/hero_2.jpeg",
  ctaText: "Explore Our Journey",
};

export interface ContactDetails {
  brandName: string;
  brandTagline: string;
  brandDescription: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  officeHours: string;
  cin: string;
  gstin: string;
  companyName: string;
  whatsapp: string;
  socials: { facebook: string; instagram: string; twitter: string };
  directors: { name: string; role: string; phone?: string }[];
}

export const CONTACT_DETAILS: ContactDetails = {
  brandName: "GREENGROW FERTILIZER",
  brandTagline: "",
  brandDescription:
    "India's direct-to-farm crop protectant and bio-stimulant synthesis brand. Delivering certified, lab-tested batches straight from the factory door to your field.",
  logo: "",
  address:
    "608 Clifton Corporate, Indore",
  phone: "+91 8269108808",
  email: "greengrowfertilizer25@gmail.com",
  officeHours: "Monday - Saturday: 9:00 AM - 6:00 PM (Closed on Sundays & Holidays)",
  cin: "U20129MP2025PTC080802",
  gstin: "23AAMCG6217C1ZX",
  companyName: "GREENGROW FERTILIZER PRIVATE LIMITED",
  whatsapp: "918269108808",
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
  },
  directors: [
    { name: "Mr. Sonu Agrawal", role: "Director", phone: "+91 9993108808" },
    { name: "Mr. Mahesh Chandra", role: "Director" },
  ],
};

export interface DealerApplication {
  id: string;
  fullName: string;
  storeName: string;
  mobileNumber: string;
  emailAddress: string;
  gstin: string;
  cityState: string;
  distributionArea: string;
  annualTurnover: string;
  message: string;
  date: string;
  status: "New" | "Reviewed" | "Approved" | "Rejected";
}

export const DEALER_APPLICATIONS: DealerApplication[] = [
  {
    id: "DA-2041",
    fullName: "Rajesh Verma",
    storeName: "Verma Krishi Kendra",
    mobileNumber: "+91 98260 11234",
    emailAddress: "rajesh@vermaagri.com",
    gstin: "23ABCDE1234F1Z5",
    cityState: "Bhopal, MP",
    distributionArea: "Berasia Tehsil",
    annualTurnover: "5 Lakhs - 20 Lakhs",
    message: "Dealing in agro inputs since 2015. 400 sq ft shop near main mandi.",
    date: "28 Jul 2026",
    status: "New",
  },
  {
    id: "DA-2040",
    fullName: "Lakshmi Traders",
    storeName: "Lakshmi Agro Centre",
    mobileNumber: "+91 94250 88910",
    emailAddress: "lakshmi.agro@email.com",
    gstin: "23XYZW5678K1Z2",
    cityState: "Indore, MP",
    distributionArea: "Indore West",
    annualTurnover: "20 Lakhs - 50 Lakhs",
    message: "Existing dealer for 3 national brands. Looking for premium bio-input range.",
    date: "26 Jul 2026",
    status: "Reviewed",
  },
  {
    id: "DA-2039",
    fullName: "Suresh Patil",
    storeName: "Shree Fertilizer Mart",
    mobileNumber: "+91 99770 44521",
    emailAddress: "suresh.patil@email.com",
    gstin: "27PATIL9012L1Z9",
    cityState: "Nashik, Maharashtra",
    distributionArea: "Nashik Rural",
    annualTurnover: "Above 50 Lakhs",
    message: "Wholesale distributor with cold storage facility.",
    date: "24 Jul 2026",
    status: "Approved",
  },
];

export interface ContactEnquiry {
  id: string;
  fullName: string;
  farmName: string;
  mobileNumber: string;
  emailAddress: string;
  cityState: string;
  enquiryType: string;
  message: string;
  date: string;
  status: "New" | "Read" | "Resolved";
}

export const CONTACT_ENQUIRIES: ContactEnquiry[] = [
  {
    id: "EN-3102",
    fullName: "Manoj Kumar",
    farmName: "Green Valley Farms",
    mobileNumber: "+91 93000 12345",
    emailAddress: "manoj@greenvalley.in",
    cityState: "Sehore, MP",
    enquiryType: "Bulk Farm Procurement",
    message: "Need 200L seaweed extract for 50 acre soybean field. Best price?",
    date: "28 Jul 2026",
    status: "New",
  },
  {
    id: "EN-3101",
    fullName: "Priya Sharma",
    farmName: "",
    mobileNumber: "+91 98930 55678",
    emailAddress: "priya.s@email.com",
    cityState: "Jabalpur, MP",
    enquiryType: "Product Dosage Request",
    message: "What is the correct dosage of Chakraveer for cotton at flowering stage?",
    date: "27 Jul 2026",
    status: "Read",
  },
  {
    id: "EN-3100",
    fullName: "Anil Mehta",
    farmName: "Mehta Agro",
    mobileNumber: "+91 94250 77889",
    emailAddress: "anil@mehtaagro.com",
    cityState: "Ujjain, MP",
    enquiryType: "Dealer Partnership",
    message: "Interested in dealership for Ujjain district.",
    date: "25 Jul 2026",
    status: "Resolved",
  },
];

export interface AboutCompany {
  vision: string;
  mission: string;
  directors: { name: string; photo: string; description: string }[];
}

export const ABOUT_COMPANY: AboutCompany = {
  vision: "[Vision Statement placeholder: The client will provide the exact content to be inserted here.]",
  mission: "[Mission Statement placeholder: The client will provide the exact content to be inserted here.]",
  directors: [
    {
      name: "[Director 1 Name]",
      photo: "",
      description: "[Placeholder for Director 1 detail. This will be a 15-20 line description provided by the client. It will detail their experience, vision for the company, and background in agriculture or business. The client will send this content and the photograph soon. For now, this is a placeholder text to demonstrate the layout. The text will go on and on, explaining their contributions and leadership approach. This space allows for a comprehensive profile. Once the content is received, it will be updated here.]"
    },
    {
      name: "[Director 2 Name]",
      photo: "",
      description: "[Placeholder for Director 2 detail. This will be a 15-20 line description provided by the client. It will detail their experience, vision for the company, and background in agriculture or business. The client will send this content and the photograph soon. For now, this is a placeholder text to demonstrate the layout. The text will go on and on, explaining their contributions and leadership approach. This space allows for a comprehensive profile. Once the content is received, it will be updated here.]"
    }
  ]
};
