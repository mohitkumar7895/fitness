export const SITE_CONFIG = {
  name: 'FitLife Wellness',
  shortName: 'FitLife',
  tagline: 'Healthier Today, Brighter Tomorrow',
  logo: '/logo.png',
  description:
    'Experience international-caliber fitness training, world-class personal coaching, scientifically tailored nutrition, and luxury wellness facilities designed for high achievers.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  address: 'Skyline Boulevard, Penthouse Level, Sector 5, Downtown Metro',
  phone: '+91 98765 43210',
  whatsapp: '+919876543210',
  email: 'info@fitlifewellness.com',
  workingHours: 'Monday – Sunday: 05:00 AM – 11:00 PM',
  social: {
    instagram: 'https://instagram.com/fitlifewellness',
    youtube: 'https://youtube.com/@fitlifewellness',
    facebook: 'https://facebook.com/fitlifewellness',
    twitter: 'https://twitter.com/fitlifewellness',
  },
  colors: {
    primary: '#080808',
    secondary: '#151515',
    card: '#1A1A1A',
    accentOrange: '#FF5A1F',
    accentLime: '#C6FF3B',
    text: '#FFFFFF',
    mutedText: '#A1A1AA',
    border: '#27272A',
  },
};

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  {
    label: 'Programs',
    href: '/programs',
    children: [
      { label: 'All Signature Blueprints', href: '/programs' },
      { label: 'Weight Loss & Shred', href: '/weight-loss' },
      { label: 'Muscle Building Elite', href: '/muscle-building' },
      { label: 'Body Recomposition', href: '/body-transformation' },
      { label: 'VIP Personal Coaching', href: '/personal-training' },
      { label: 'Group Conditioning', href: '/group-fitness' },
      { label: 'Strength & Power', href: '/strength-training' },
      { label: 'Mobility & Longevity', href: '/yoga-flexibility' },
    ],
  },
  { label: 'Nutrition', href: '/nutrition' },
  { label: 'Coach', href: '/trainers' },
  { label: 'Membership', href: '/membership' },
  { label: 'Transformations', href: '/transformations' },
  { label: 'About', href: '/about' },
  {
    label: 'More',
    href: '#',
    children: [
      { label: 'Workout Gallery', href: '/gallery' },
      { label: 'Latest Blog & Science', href: '/blog' },
      { label: 'Contact Sanctuary', href: '/contact' },
      { label: 'Frequently Asked Questions', href: '/faq' },
    ],
  },
];

export const MOBILE_NAV_LINKS = [
  { label: 'Home', href: '/' },
  {
    label: 'Programs',
    href: '/programs',
    children: [
      { label: 'All Programs', href: '/programs' },
      { label: 'Weight Loss & Shred', href: '/weight-loss' },
      { label: 'Muscle Building', href: '/muscle-building' },
      { label: 'Body Transformation', href: '/body-transformation' },
      { label: 'Personal Training', href: '/personal-training' },
      { label: 'Group Fitness', href: '/group-fitness' },
      { label: 'Strength & Conditioning', href: '/strength-training' },
      { label: 'Yoga & Flexibility', href: '/yoga-flexibility' },
    ],
  },
  { label: 'Nutrition', href: '/nutrition' },
  { label: 'Coach', href: '/trainers' },
  { label: 'Membership', href: '/membership' },
  { label: 'Transformations', href: '/transformations' },
  { label: 'About Us', href: '/about' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog & Articles', href: '/blog' },
  { label: 'Contact Us', href: '/contact' },
];

export const FOOTER_LINKS = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Head Coach', href: '/trainers' },
    { label: 'Membership Plans', href: '/membership' },
    { label: 'Transformations', href: '/transformations' },
    { label: 'Fitness Gallery', href: '/gallery' },
    { label: 'Blog & Articles', href: '/blog' },
  ],
  programs: [
    { label: 'Weight Loss Program', href: '/weight-loss' },
    { label: 'Muscle Building Elite', href: '/muscle-building' },
    { label: 'Body Recomposition', href: '/body-transformation' },
    { label: 'Personal VIP Training', href: '/personal-training' },
    { label: 'Strength & Power', href: '/strength-training' },
    { label: 'Holistic Nutrition', href: '/nutrition' },
  ],
  support: [
    { label: 'Contact & Concierge', href: '/contact' },
    { label: 'Frequently Asked Questions', href: '/faq' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'WhatsApp Concierge', href: `https://wa.me/919876543210?text=Hi%20FitLife%2C%20I%20want%20to%20know%20more%20about%20memberships` },
  ],
};

