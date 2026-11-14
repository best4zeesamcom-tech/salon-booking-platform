  export type Service = {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    category: string;
    gender?: "male" | "female" | "unisex";
  };

  export type Staff = {
    id: string;
    name: string;
    role: string;
    image: string;
    gender?: "male" | "female";
  };

  export type BusinessConfig = {
    slug: string;
    name: string;
    tagline: string;
    description: string;
    businessType: "barbershop" | "beauty-clinic";
    logo: string;
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
    };
    contact: {
      phone: string;
      whatsapp: string;
      email: string;
      address: string;
    };
    openingHours: {
      [day: string]: {
        open: string;
        close: string;
        closed?: boolean;
      };
    };
    services: Service[];
    staff: Staff[];
    seo: {
      title: string;
      description: string;
      keywords: string[];
    };
  };

  export const businesses: Record<string, BusinessConfig> = {
    gent: {
      slug: "gent",
      name: "GENT Grooming House",
      tagline: "Sharp Looks. Timeless Confidence.",
      description:
        "Premium men's grooming, haircuts and beard styling in a modern barbershop.",
      businessType: "barbershop",

      logo: "GENT",

      colors: {
        primary: "#B88A56",
        secondary: "#25221F",
        background: "#F7F4EF",
        text: "#25221F",
      },

      contact: {
        phone: "+923160522774",
        whatsapp: "+923160522774",
        email: "hello@gentdemo.com",
        address: "Commercial Market, Rawalpindi, Pakistan",
      },

      openingHours: {
        monday: { open: "10:00", close: "21:00" },
        tuesday: { open: "10:00", close: "21:00" },
        wednesday: { open: "10:00", close: "21:00" },
        thursday: { open: "10:00", close: "21:00" },
        friday: { open: "14:00", close: "22:00" },
        saturday: { open: "10:00", close: "22:00" },
        sunday: { open: "12:00", close: "20:00" },
      },

      services: [
        {
          id: "gent-haircut",
          name: "Classic Haircut",
          description: "A professional haircut tailored to your style.",
          duration: 30,
          price: 1200,
          category: "Hair",
          gender: "male",
        },
        {
          id: "gent-beard",
          name: "Beard Styling",
          description: "Beard trimming, shaping and finishing.",
          duration: 20,
          price: 800,
          category: "Beard",
          gender: "male",
        },
        {
          id: "gent-combo",
          name: "Haircut & Beard",
          description: "Complete haircut and beard grooming experience.",
          duration: 45,
          price: 1800,
          category: "Packages",
          gender: "male",
        },
        {
          id: "gent-facial",
          name: "Men's Facial",
          description: "A refreshing facial treatment for men.",
          duration: 45,
          price: 2200,
          category: "Skincare",
          gender: "male",
        },
      ],

      staff: [
        {
          id: "gent-ali",
          name: "Ali Khan",
          role: "Senior Barber",
          image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
          gender: "male",
        },
        {
          id: "gent-usman",
          name: "Usman Ahmed",
          role: "Hair Stylist",
          image:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
          gender: "male",
        },
      ],

      seo: {
        title: "GENT Grooming House | Men's Salon in Rawalpindi",
        description:
          "Book premium men's haircuts, beard styling and grooming services at GENT Grooming House.",
        keywords: [
          "men's salon Rawalpindi",
          "barbershop Rawalpindi",
          "men's haircut",
          "beard styling",
        ],
      },
    },

    glow: {
      slug: "glow",
      name: "Glow Beauty & Skin Clinic",
      tagline: "Feel Beautiful. Feel Confident.",
      description:
        "Professional beauty and skincare treatments in a welcoming environment.",
      businessType: "beauty-clinic",

      logo: "GLOW",

      colors: {
        primary: "#C47D91",
        secondary: "#4B303A",
        background: "#FFF7F8",
        text: "#35252B",
      },

      contact: {
        phone: "+923160522774",
        whatsapp: "+923160522774",
        email: "hello@glowdemo.com",
        address: "Bahria Town, Rawalpindi, Pakistan",
      },

      openingHours: {
        monday: { open: "10:00", close: "20:00" },
        tuesday: { open: "10:00", close: "20:00" },
        wednesday: { open: "10:00", close: "20:00" },
        thursday: { open: "10:00", close: "20:00" },
        friday: { open: "14:00", close: "20:00" },
        saturday: { open: "10:00", close: "21:00" },
        sunday: { open: "12:00", close: "18:00" },
      },

      services: [
        {
          id: "glow-facial",
          name: "Hydrating Facial",
          description: "A refreshing facial for hydrated, glowing skin.",
          duration: 45,
          price: 2500,
          category: "Facials",
          gender: "female",
        },
        {
          id: "glow-cleanup",
          name: "Deep Skin Cleanup",
          description: "A cleansing treatment for refreshed skin.",
          duration: 40,
          price: 1800,
          category: "Skincare",
          gender: "female",
        },
        {
          id: "glow-makeup",
          name: "Party Makeup",
          description: "Professional makeup for special occasions.",
          duration: 60,
          price: 4000,
          category: "Makeup",
          gender: "female",
        },
        {
          id: "glow-hair",
          name: "Hair Styling",
          description: "Professional styling for your desired look.",
          duration: 45,
          price: 2000,
          category: "Hair",
          gender: "female",
        },
      ],

      staff: [
        {
          id: "glow-aisha",
          name: "Aisha Malik",
          role: "Skincare Specialist",
          image:
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400",
          gender: "female",
        },
        {
          id: "glow-sara",
          name: "Sara Ahmed",
          role: "Beauty Specialist",
          image:
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
          gender: "female",
        },
      ],

      seo: {
        title: "Glow Beauty & Skin Clinic | Rawalpindi",
        description:
          "Book professional facials, skincare and beauty treatments at Glow Beauty & Skin Clinic.",
        keywords: [
          "beauty salon Rawalpindi",
          "skin clinic Rawalpindi",
          "facial treatments",
          "beauty services",
        ],
      },
    },
  };