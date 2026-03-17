// FrameBook Pro - Sample Data Initialization Script
// Run this in MongoDB shell: mongosh < sample_data.js
// Or copy sections and run manually

// Switch to database
use framebook_pro_db;

print("=== Starting Sample Data Import ===");

// 1. Create Super Admin User
// Password: admin123 (hashed with bcrypt)
const superAdminPassword = "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.VQ6Jvp1fQ5Z8K6.";

db.users.deleteMany({ email: "admin@framebookpro.com" });
db.users.insertOne({
  user_id: "super-admin-001",
  email: "admin@framebookpro.com",
  password: superAdminPassword,
  role: "super_admin",
  client_id: null,
  full_name: "Platform Administrator",
  created_at: new Date().toISOString()
});
print("✓ Super Admin created: admin@framebookpro.com / admin123");

// 2. Create Demo Client
const demoClientId = "demo-client-001";
db.clients.deleteMany({ client_id: demoClientId });
db.clients.insertOne({
  client_id: demoClientId,
  business_name: "Stellar Photography",
  email: "demo@stellar.com",
  phone: "+1234567890",
  domain: "stellar-photo",
  subscription_plan: "premium",
  enabled_languages: ["en", "hi"],
  theme: "light",
  enabled_modules: ["about", "services", "gallery", "booking", "products", "offers", "contact"],
  primary_color: "#2563eb",
  logo_url: null,
  max_gallery_images: 50,
  max_products: 100,
  status: "active",
  created_at: new Date().toISOString()
});
print("✓ Demo client created: Stellar Photography");

// 3. Create Demo Admin User
// Password: demo123
const demoAdminPassword = "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.VQ6Jvp1fQ5Z8K6.";

db.users.deleteMany({ email: "demo@stellar.com" });
db.users.insertOne({
  user_id: "demo-admin-001",
  email: "demo@stellar.com",
  password: demoAdminPassword,
  role: "admin",
  client_id: demoClientId,
  full_name: "Demo Admin",
  created_at: new Date().toISOString()
});
print("✓ Demo Admin created: demo@stellar.com / demo123");

// 4. Create Sample Services
db.services.deleteMany({ client_id: demoClientId });
const services = [
  {
    service_id: "service-001",
    client_id: demoClientId,
    name: { en: "Wedding Photography", hi: "शादी की फोटोग्राफी" },
    description: { en: "Complete wedding coverage with candid and traditional shots", hi: "कैंडिड और पारंपरिक शॉट्स के साथ संपूर्ण शादी कवरेज" },
    price: 75000,
    image_url: null,
    is_active: true,
    display_order: 0,
    created_at: new Date().toISOString()
  },
  {
    service_id: "service-002",
    client_id: demoClientId,
    name: { en: "Pre-Wedding Shoot", hi: "प्री-वेडिंग शूट" },
    description: { en: "Romantic pre-wedding photoshoot at exotic locations", hi: "विदेशी स्थानों पर रोमांटिक प्री-वेडिंग फोटोशूट" },
    price: 35000,
    image_url: null,
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString()
  },
  {
    service_id: "service-003",
    client_id: demoClientId,
    name: { en: "Portrait Photography", hi: "पोर्ट्रेट फोटोग्राफी" },
    description: { en: "Professional portrait sessions for individuals and families", hi: "व्यक्तियों और परिवारों के लिए पेशेवर पोर्ट्रेट सत्र" },
    price: 15000,
    image_url: null,
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString()
  },
  {
    service_id: "service-004",
    client_id: demoClientId,
    name: { en: "Corporate Events", hi: "कॉर्पोरेट इवेंट्स" },
    description: { en: "Professional coverage for corporate events and conferences", hi: "कॉर्पोरेट इवेंट्स और कॉन्फ्रेंस के लिए पेशेवर कवरेज" },
    price: 25000,
    image_url: null,
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString()
  }
];
db.services.insertMany(services);
print("✓ 4 sample services created");

// 5. Create Sample Product Categories
db.product_categories.deleteMany({ client_id: demoClientId });
const categories = [
  {
    category_id: "cat-001",
    client_id: demoClientId,
    name: { en: "Photo Albums", hi: "फोटो एल्बम" },
    display_order: 0,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    category_id: "cat-002",
    client_id: demoClientId,
    name: { en: "Frames", hi: "फ्रेम" },
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    category_id: "cat-003",
    client_id: demoClientId,
    name: { en: "Prints", hi: "प्रिंट्स" },
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString()
  }
];
db.product_categories.insertMany(categories);
print("✓ 3 product categories created");

// 6. Create Sample Products
db.products.deleteMany({ client_id: demoClientId });
const products = [
  {
    product_id: "prod-001",
    client_id: demoClientId,
    name: { en: "Premium Leather Album", hi: "प्रीमियम लेदर एल्बम" },
    description: { en: "Handcrafted leather album with 40 pages", hi: "40 पृष्ठों के साथ हस्तनिर्मित चमड़े का एल्बम" },
    images: [],
    base_price: 8000,
    discount_percentage: 10,
    final_price: 7200,
    category: "cat-001",
    is_active: true,
    display_order: 0,
    created_at: new Date().toISOString()
  },
  {
    product_id: "prod-002",
    client_id: demoClientId,
    name: { en: "Classic Photo Album", hi: "क्लासिक फोटो एल्बम" },
    description: { en: "Traditional style album with 30 pages", hi: "30 पृष्ठों के साथ पारंपरिक शैली का एल्बम" },
    images: [],
    base_price: 5000,
    discount_percentage: 0,
    final_price: 5000,
    category: "cat-001",
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString()
  },
  {
    product_id: "prod-003",
    client_id: demoClientId,
    name: { en: "Wooden Photo Frame", hi: "लकड़ी का फोटो फ्रेम" },
    description: { en: "Elegant wooden frame - 8x10 inches", hi: "सुरुचिपूर्ण लकड़ी का फ्रेम - 8x10 इंच" },
    images: [],
    base_price: 1500,
    discount_percentage: 15,
    final_price: 1275,
    category: "cat-002",
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString()
  },
  {
    product_id: "prod-004",
    client_id: demoClientId,
    name: { en: "Canvas Print", hi: "कैनवस प्रिंट" },
    description: { en: "Gallery-quality canvas print - 16x20 inches", hi: "गैलरी-क्वालिटी कैनवस प्रिंट - 16x20 इंच" },
    images: [],
    base_price: 3500,
    discount_percentage: 0,
    final_price: 3500,
    category: "cat-003",
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString()
  }
];
db.products.insertMany(products);
print("✓ 4 sample products created");

// 7. Create Sample Packages
db.packages.deleteMany({ client_id: demoClientId });
const packages = [
  {
    package_id: "pkg-001",
    client_id: demoClientId,
    name: "Basic Wedding Package",
    base_price: 50000,
    description: "4 hours coverage, 200 edited photos, Online gallery",
    included_services: ["Photography", "Basic Editing", "Digital Delivery"],
    default_discount: 0,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    package_id: "pkg-002",
    client_id: demoClientId,
    name: "Premium Wedding Package",
    base_price: 100000,
    description: "Full day coverage, 500 edited photos, Album included",
    included_services: ["Photography", "Videography", "Drone", "Premium Editing", "Photo Album", "Digital Delivery"],
    default_discount: 5,
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    package_id: "pkg-003",
    client_id: demoClientId,
    name: "Portrait Session",
    base_price: 15000,
    description: "2 hours session, 50 edited photos",
    included_services: ["Photography", "Editing", "Digital Delivery"],
    default_discount: 0,
    is_active: true,
    created_at: new Date().toISOString()
  }
];
db.packages.insertMany(packages);
print("✓ 3 sample packages created");

// 8. Create Sample Add-ons
db.addons.deleteMany({ client_id: demoClientId });
const addons = [
  {
    addon_id: "addon-001",
    client_id: demoClientId,
    name: "Extra Hour Coverage",
    price: 5000,
    description: "Additional hour of photography coverage",
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    addon_id: "addon-002",
    client_id: demoClientId,
    name: "Drone Photography",
    price: 10000,
    description: "Aerial shots with professional drone",
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    addon_id: "addon-003",
    client_id: demoClientId,
    name: "Same Day Edit Video",
    price: 15000,
    description: "Short highlight video delivered same day",
    is_active: true,
    created_at: new Date().toISOString()
  }
];
db.addons.insertMany(addons);
print("✓ 3 sample add-ons created");

// 9. Create Sample Leads
db.leads.deleteMany({ client_id: demoClientId });
const leads = [
  {
    lead_id: "lead-001",
    client_id: demoClientId,
    name: "Rahul Sharma",
    phone: "+91 9876543210",
    email: "rahul@example.com",
    event_date: "2025-03-15",
    event_type: "Wedding",
    source: "website",
    status: "new",
    notes: "Interested in premium package",
    created_at: new Date().toISOString()
  },
  {
    lead_id: "lead-002",
    client_id: demoClientId,
    name: "Priya Patel",
    phone: "+91 8765432109",
    email: "priya@example.com",
    event_date: "2025-04-20",
    event_type: "Pre-Wedding",
    source: "instagram",
    status: "contacted",
    notes: "Wants outdoor location shoot",
    created_at: new Date().toISOString()
  },
  {
    lead_id: "lead-003",
    client_id: demoClientId,
    name: "Amit Kumar",
    phone: "+91 7654321098",
    email: "amit@example.com",
    event_date: "2025-02-28",
    event_type: "Corporate Event",
    source: "referral",
    status: "quotation_sent",
    notes: "Annual day event for 500 people",
    created_at: new Date().toISOString()
  }
];
db.leads.insertMany(leads);
print("✓ 3 sample leads created");

// 10. Create Site Content
db.site_content.deleteMany({ client_id: demoClientId });
db.site_content.insertOne({
  content_id: "content-001",
  client_id: demoClientId,
  hero: {
    background_image: null,
    logo_url: null,
    headline: { en: "Capture Your Perfect Moments", hi: "अपने खास पलों को कैद करें" },
    sub_headline: { en: "Professional Photography Services", hi: "पेशेवर फोटोग्राफी सेवाएं" },
    cta_text: { en: "Book Now", hi: "अभी बुक करें" },
    cta_link: "/booking"
  },
  about: {
    title: { en: "About Stellar Photography", hi: "स्टेलर फोटोग्राफी के बारे में" },
    description: { en: "With over 10 years of experience, we specialize in capturing life's precious moments. From weddings to corporate events, our team of professional photographers ensures every frame tells a story.", hi: "10 से अधिक वर्षों के अनुभव के साथ, हम जीवन के अनमोल पलों को कैद करने में विशेषज्ञ हैं।" },
    image_url: null,
    stats: [
      { label: "Years Experience", value: "10+" },
      { label: "Happy Clients", value: "500+" },
      { label: "Events Covered", value: "1000+" }
    ]
  },
  services_section: {
    title: { en: "Our Services", hi: "हमारी सेवाएं" },
    subtitle: { en: "Professional photography for every occasion", hi: "हर अवसर के लिए पेशेवर फोटोग्राफी" }
  },
  gallery_section: {
    title: { en: "Our Portfolio", hi: "हमारा पोर्टफोलियो" },
    subtitle: { en: "See our recent work", hi: "हमारे हाल के काम देखें" }
  },
  products_section: {
    title: { en: "Our Products", hi: "हमारे उत्पाद" },
    subtitle: { en: "Quality prints and albums", hi: "गुणवत्तापूर्ण प्रिंट और एल्बम" }
  },
  booking_section: {
    title: { en: "Book Your Session", hi: "अपना सेशन बुक करें" },
    subtitle: { en: "Let's create something beautiful together", hi: "आइए साथ मिलकर कुछ सुंदर बनाएं" }
  },
  contact: {
    title: { en: "Contact Us", hi: "संपर्क करें" },
    subtitle: { en: "Get in touch with us", hi: "हमसे संपर्क करें" },
    address: { en: "123 Photography Lane, Mumbai 400001", hi: "123 फोटोग्राफी लेन, मुंबई 400001" },
    map_embed_url: null
  },
  footer: {
    copyright_text: { en: "© 2025 Stellar Photography. All rights reserved.", hi: "© 2025 स्टेलर फोटोग्राफी। सर्वाधिकार सुरक्षित।" },
    social_links: {
      facebook: "https://facebook.com/stellarphoto",
      instagram: "https://instagram.com/stellarphoto",
      youtube: "https://youtube.com/stellarphoto"
    }
  },
  updated_at: new Date().toISOString()
});
print("✓ Site content created");

// 11. Create Welcome Notifications
db.notifications.deleteMany({ client_id: demoClientId });
db.notifications.insertMany([
  {
    notification_id: "notif-001",
    client_id: demoClientId,
    title: "Welcome to FrameBook Pro!",
    message: "Your business is now set up. Start by customizing your website.",
    notification_type: "success",
    link: "/admin/site-content",
    is_read: false,
    created_at: new Date().toISOString()
  },
  {
    notification_id: "notif-002",
    client_id: demoClientId,
    title: "New Lead: Rahul Sharma",
    message: "New wedding inquiry received for March 15",
    notification_type: "lead",
    link: "/admin/leads",
    is_read: false,
    created_at: new Date().toISOString()
  }
]);
print("✓ 2 sample notifications created");

// 12. Create indexes
print("\n=== Creating Indexes ===");
db.users.createIndex({ user_id: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
db.clients.createIndex({ client_id: 1 }, { unique: true });
db.clients.createIndex({ domain: 1 }, { unique: true });
db.services.createIndex({ service_id: 1 }, { unique: true });
db.services.createIndex({ client_id: 1 });
db.gallery.createIndex({ image_id: 1 }, { unique: true });
db.gallery.createIndex({ client_id: 1 });
db.products.createIndex({ product_id: 1 }, { unique: true });
db.products.createIndex({ client_id: 1 });
db.leads.createIndex({ lead_id: 1 }, { unique: true });
db.leads.createIndex({ client_id: 1 });
db.notifications.createIndex({ notification_id: 1 }, { unique: true });
db.notifications.createIndex({ client_id: 1 });
print("✓ Indexes created");

print("\n=== Sample Data Import Complete ===");
print("\nLogin Credentials:");
print("─────────────────────────────────────");
print("Super Admin:  admin@framebookpro.com / admin123");
print("Demo Client:  demo@stellar.com / demo123");
print("─────────────────────────────────────");
print("\nPublic Website URL: /stellar-photo");
