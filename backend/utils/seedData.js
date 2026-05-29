const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config({ path: require('path').resolve(__dirname, '../.env') });


const User    = require("../models/User");
const Stylist = require("../models/Stylist");
const Booking = require("../models/Booking");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/tutoria");
  console.log("MongoDB connected for seeding...");
};

const stylists = [
  // FEMALE STYLISTS 
  {
    name: "Aria Sharma",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
    gender: "female",
    days: [0, 1, 2, 4, 5],
    workStart: 9,
    workEnd: 18,
    specialization: "Hair Styling & Colour",
    bio: "Aria brings 8 years of salon expertise with a flair for transformative cuts and bold colour techniques. Trained in Mumbai and certified in L'Oréal Colour Studio, she specialises in balayage, ombre and creative colouring that turns heads.",
    experience: 8,
    expertise: ["f1", "f2", "f3", "c1","f5"],
    rating: 4.9,
    clientsServed: 1240,
  },
  {
    name: "Priya Mehta",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    gender: "female",
    days: [1, 2, 3, 4, 6],
    workStart: 10,
    workEnd: 19,
    specialization: "Bridal Makeup & Skincare",
    bio: "Priya is Tutoria's bridal and makeup specialist with over 6 years of experience styling brides across Maharashtra. She has a keen eye for skin tones and blends traditional Indian aesthetics with modern glam for flawless bridal looks.",
    experience: 6,
    expertise: ["f4", "f5", "c1","c2"],
    rating: 4.3,
    clientsServed: 890,
  },
  {
    name: "Sofia Nair",
    photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
    gender: "female",
    days: [0, 2, 3, 5, 6],
    workStart: 9,
    workEnd: 17,
    specialization: "Skincare, Nail Art & Spa",
    bio: "Sofia is a certified aesthetician with 5 years of expertise in advanced skincare and intricate nail art. Her facials are deeply relaxing while her nail designs range from minimalist chic to elaborate festival art — she tailors every session to your mood.",
    experience: 5,
    expertise: ["f4", "c2", "c3", "f5"],
    rating: 4.2,
    clientsServed: 760,
  },
  {
    name: "Neha Kapoor",
    photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80",
    gender: "female",
    days: [1, 3, 4, 5, 6],
    workStart: 10,
    workEnd: 18,
    specialization: "Keratin & Hair Treatments",
    bio: "Neha is a hair-health expert with 7 years focused on restorative treatments. She has helped hundreds of clients reclaim smooth, frizz-free hair through her signature keratin and deep-conditioning protocols, customised for every hair type.",
    experience: 7,
    expertise: ["f1", "f2", "f3", "c1"],
    rating: 4.8,
    clientsServed: 1020,
  },
  {
    name: "Ankita Mishra",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    gender: "female",
    days: [1, 2, 4, 5, 6],
    workStart: 9,
    workEnd: 17,
    specialization: "Skincare, Nail Art & Spa",
    bio: "Ankita is a certified aesthetician with 4 years of expertise in advanced skincare and sophisticated nail art. Her facials are deeply relaxing while her nail designs range from minimalist chic to elaborate festival art — she tailors every session to your mood.",
    experience: 4,
    expertise: ["f2","f4", "c2", "c3"],
    rating: 4.3,
    clientsServed: 561,
  },
  {
    name: "Nikhita Chauhan",
    photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80",
    gender: "female",
    days: [0,1, 2, 3, 5],
    workStart: 9,
    workEnd: 18,
    specialization: "Hair Styling & Colour",
    bio: "Nikhita brings 6 years of salon expertise with a flair for transformative cuts and bold colour techniques. Trained in Mumbai and certified in L'Oréal Colour Studio, she specialises in balayage, ombre and creative colouring that turns heads.",
    experience: 6,
    expertise: ["f1", "f2", "f3", "c1","f5"],
    rating: 4.9,
    clientsServed: 944,
  },
  {
    name: "Anjali kapoor",
    photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
    gender: "female",
    days: [1, 2, 3, 4, 6],
    workStart: 10,
    workEnd: 19,
    specialization: "Bridal Makeup & Skincare",
    bio: "Anjali is Tutoria's bridal and makeup specialist with over 6 years of experience styling brides across Maharashtra. She has a keen eye for skin tones and blends traditional Indian aesthetics with modern glam for flawless bridal looks.",
    experience: 6,
    expertise: ["f4", "f5", "c1", "f3"],
    rating: 4.8,
    clientsServed: 760,
  },
  {
    name: "Prachi Desai",
    photo: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=400&q=80",
    gender: "female",
    days: [0, 2, 3, 5, 6],
    workStart: 9,
    workEnd: 17,
    specialization: "Skincare, Nail Art & Spa",
    bio: "Prachi is a certified aesthetician with 5 years of expertise in advanced skincare and intricate nail art. Her facials are deeply relaxing while her nail designs range from minimalist chic to elaborate festival art — she tailors every session to your mood.",
    experience: 5,
    expertise: ["f4", "c2", "c3","f3"],
    rating: 4.4,
    clientsServed: 856,
  },
  {
    name: "Trishala pattel",
    photo: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&q=80",
    gender: "female",
    days: [1, 3, 4, 5, 6],
    workStart: 10,
    workEnd: 18,
    specialization: "Keratin & Hair Treatments",
    bio: "Trishala is a hair-health expert with 5 years focused on restorative treatments. She has helped hundreds of clients reclaim smooth, frizz-free hair through her signature keratin and deep-conditioning protocols, customised for every hair type.",
    experience: 5,
    expertise: ["f1", "f2", "f3", "c1","c2"],
    rating: 4.1,
    clientsServed: 510,
  },
  {
    name: "Komal bhat",
    photo: "https://images.unsplash.com/photo-1614204424926-196a80bf0be8?auto=format&fit=crop&w=400&q=80",
    gender: "female",
    days: [1, 2, 4, 5, 6],
    workStart: 9,
    workEnd: 17,
    specialization: "Skincare, Nail Art & Spa",
    bio: "Komal is a certified aesthetician with 4 years of expertise in advanced skincare and sophisticated nail art. Her facials are deeply relaxing while her nail designs range from minimalist chic to elaborate festival art — she tailors every session to your mood.",
    experience: 4,
    expertise: ["f1","f4", "c2", "c3", "f5"],
    rating: 4.3,
    clientsServed: 861,
  },

  // ── MALE STYLISTS ──────────────────────────────────────────────────────
  {
    name: "Rohan Verma",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    gender: "male",
    days: [1, 2, 3, 4, 5],
    workStart: 9,
    workEnd: 18,
    specialization: "Men's Cut & Beard Grooming",
    bio: "Rohan is a precision-cut specialist with 6 years of experience crafting sharp fades, modern undercuts and textured crops. His beard sculpting skills are unmatched — from classic clean shaves to well-defined designer stubble, he always delivers a refined finish.",
    experience: 6,
    expertise: ["m1", "m2", "m3", "c1"],
    rating: 4.8,
    clientsServed: 980,
  },
  {
    name: "Karan Singh",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    gender: "male",
    days: [0, 2, 4, 5, 6],
    workStart: 10,
    workEnd: 19,
    specialization: "Hair Colour & D-Tan",
    bio: "Karan specialises in men's hair colour and skin treatments with 5 years of hands-on experience. Whether it is a subtle highlight, full hair colour or a refreshing D-Tan cleanup, he uses premium products to ensure vibrant, long-lasting results with zero damage.",
    experience: 5,
    expertise: ["m1", "m3", "m4", "c1", "c2", "c3"],
    rating: 4.6,
    clientsServed: 640,
  },
  {
    name: "Anurag Sawant",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    gender: "male",
    days: [0, 2, 4, 5, 6],
    workStart: 10,
    workEnd: 19,
    specialization: "Hair Colour & Skin Treatments",
    bio: "Anurag specialises in men's hair colour and advanced skin treatments with 5 years of hands-on experience. Whether it is a subtle highlight, full hair colour or a refreshing D-Tan cleanup, he uses premium products to ensure vibrant, long-lasting results with zero damage.",
    experience: 5,
    expertise: ["m1", "m3", "m4", "c1", "c2", "c3"],
    rating: 4.6,
    clientsServed: 640,
  },
  {
    name: "Yogesh Mishra",
    photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=400&q=80",
    gender: "male",
    days: [0, 1, 3, 4],
    workStart: 9,
    workEnd: 18,
    specialization: "Men's Cut & Beard Grooming",
    bio: "Yogesh is a precision-cut specialist with 2 years of experience crafting sharp fades, modern undercuts and textured crops. His beard sculpting skills are unmatched — from classic clean shaves to well-defined designer stubble, he always delivers a refined finish.",
    experience: 2,
    expertise: ["m1", "m2", "m3", "c1","c2"],
    rating: 4.4,
    clientsServed: 180,
  },
  {
    name: "Vinit Mehta",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    gender: "male",
    days: [0, 2, 3, 5, 6],
    workStart: 10,
    workEnd: 19,
    specialization: "Hair Colour & D-Tan",
    bio: "Vinit specialises in men's hair colour and skin treatments with 7 years of hands-on experience. Whether it is a subtle highlight, full hair colour or a refreshing D-Tan cleanup, he uses premium products to ensure vibrant, long-lasting results with zero damage.",
    experience: 7,
    expertise: ["m1", "m3", "m4", "c1", "c2", "c3"],
    rating: 4.6,
    clientsServed: 961,
  },
  {
    name: "Rohit Kumar",
    photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80",
    gender: "male",
    days: [1, 3, 4, 5],
    workStart: 10,
    workEnd: 19,
    specialization: "Skin Treatments & Hair Colour",
    bio: "Rohit specialises in men's hair colour and advanced skin treatments with 3 years of hands-on experience. Whether it is a subtle highlight, full hair colour, he uses premium products to ensure vibrant, long-lasting results with zero damage.",
    experience: 3,
    expertise: ["m1", "m4", "c1", "c2", "c3"],
    rating: 4.6,
    clientsServed: 330,
  },

];

const seedDB = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Stylist.deleteMany({});
  await Booking.deleteMany({});
  console.log("Cleared existing data");

  // Create admin user
  const admin = await User.create({
    name: "Admin",
    email: "admin@tutoria.in",
    password: "admin123",
    phone: "9876543210",
    isAdmin: true,
  });
  console.log(`Admin created: ${admin.email} / admin123`);

  // Create demo user
  const demoUser = await User.create({
    name: "Meera Sharma",
    email: "meera@email.com",
    password: "password123",
    phone: "9876500001",
  });
  console.log(`Demo user: meera@email.com / password123`);

  // Create stylists
  const createdStylists = await Stylist.insertMany(stylists);
  console.log(` ${createdStylists.length} stylists seeded`);

  console.log("0 sample bookings — all slots start as free (green)");

  console.log("\n Seed complete! Run: npm run dev");
  process.exit(0);
};

seedDB().catch((err) => {
  console.error(err);
  process.exit(1);
});
