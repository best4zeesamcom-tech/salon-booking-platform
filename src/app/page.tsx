
const services = [
  {
    name: "Classic Haircut",
    description: "A precision haircut tailored to your face shape and personal style.",
    price: "PKR 1,000",
    duration: "30 min",
    image:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Beard Styling",
    description: "Professional beard trimming, shaping and clean finishing.",
    price: "PKR 700",
    duration: "25 min",
    image:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Haircut & Beard",
    description: "The complete grooming experience with a fresh cut and beard finish.",
    price: "PKR 1,500",
    duration: "50 min",
    image:
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=85",
  },
];

const team = [
  {
    name: "Ahmed Khan",
    role: "Master Barber",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85",
  },
  {
    name: "Usman Ali",
    role: "Grooming Specialist",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=85",
  },
];

const features = [
  ["01", "Expert Barbers"],
  ["02", "Precision Cuts"],
  ["03", "Easy Online Booking"],
  ["04", "Premium Experience"],
];

const clientPhotos = [
  "photo-1500648767791-00dcc994a43e",
  "photo-1506794778202-cad84cf45f1d",
  "photo-1507003211169-0a1dd7228f2d",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f2ec] text-[#242722]">

      {/* Announcement */}
      <div className="bg-[#202820] px-4 py-2.5 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-[#e8e4d9] sm:text-xs">
        Premium Men's Grooming · Lahore, Pakistan
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#dedbd1] bg-[#f5f2ec]/95 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          <a href="#home" className="text-2xl font-bold tracking-tight">
            GENT<span className="text-[#a18b57]">.</span>
            <span className="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.35em] text-[#73766d]">
              Grooming House
            </span>
          </a>

          <div className="hidden items-center gap-9 text-sm font-medium md:flex">
            <a href="#home" className="transition hover:text-[#a18b57]">Home</a>
            <a href="#services" className="transition hover:text-[#a18b57]">Services</a>
            <a href="#team" className="transition hover:text-[#a18b57]">Our Barbers</a>
            <a href="#contact" className="transition hover:text-[#a18b57]">Contact</a>
          </div>

          <a
            href="/book"
            className="rounded-full bg-[#263126] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#465342] sm:px-6 sm:text-sm"
          >
            Book a Visit ↗
          </a>

        </nav>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 md:grid-cols-2 md:py-20 lg:gap-20 lg:px-8"
      >
        <div className="max-w-xl">

          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-[#a18b57]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8d7748] sm:text-xs">
              The art of men's grooming
            </p>
          </div>

          <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Look sharp.
            <br />
            <span className="font-serif font-normal italic text-[#8d7748]">
              Stay timeless.
            </span>
          </h1>

          <p className="mt-7 max-w-md text-sm leading-7 text-[#696c63] sm:text-base">
            Expert cuts, precise beard styling and a relaxed atmosphere.
            Discover professional grooming designed around your style.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="/book"
              className="rounded-full bg-[#263126] px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-[#263126]/10 transition hover:-translate-y-1 hover:bg-[#465342]"
            >
              Reserve Your Chair ↗
            </a>

            <a
              href="#services"
              className="rounded-full border border-[#c9c7ba] px-7 py-4 text-sm font-medium transition hover:bg-white"
            >
              Explore Services
            </a>
          </div>

          <div className="mt-12 flex items-center gap-4 border-t border-[#dedbd1] pt-7">
            <div className="flex -space-x-3">
              {clientPhotos.map((photo) => (
                <img
                  key={photo}
                  src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=100&q=80`}
                  alt="Male grooming client"
                  className="h-11 w-11 rounded-full border-[3px] border-[#f5f2ec] object-cover"
                />
              ))}
            </div>

            <div>
              <p className="text-sm font-semibold">Your style, your choice</p>
              <p className="mt-1 text-xs text-[#73766d]">
                A better grooming experience
              </p>
            </div>
          </div>

        </div>

        {/* Hero Image */}
        <div className="relative mx-auto w-full max-w-lg">

          <div className="absolute -right-4 -top-5 h-36 w-36 rounded-full bg-[#ded9c8] sm:h-48 sm:w-48" />

          <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full border border-[#a18b57]/40" />

          <img
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=90"
            alt="Modern professional men's barbershop interior"
            className="relative h-[400px] w-full rounded-t-[190px] object-cover shadow-2xl sm:h-[550px] sm:rounded-t-[250px]"
          />

          <div className="absolute -bottom-5 left-3 max-w-[230px] rounded-2xl border border-[#e2ded3] bg-white p-5 shadow-xl sm:-left-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8d7748]">
              Your chair is waiting
            </p>
            <p className="mt-2 text-sm font-semibold">
              Make time for yourself.
            </p>
            <a
              href="/book"
              className="mt-3 inline-block text-xs font-semibold underline underline-offset-4"
            >
              Book your appointment →
            </a>
          </div>

          <div className="absolute right-3 top-8 rounded-xl bg-[#202820] px-4 py-3 text-white shadow-xl sm:right-[-15px]">
            <p className="text-[9px] uppercase tracking-widest text-[#cbb783]">
              Grooming
            </p>
            <p className="mt-1 text-sm font-semibold">Redefined.</p>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="border-y border-[#dedbd1] bg-[#eae7dd]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-7 px-5 py-9 text-center sm:grid-cols-4 lg:px-8">
          {features.map(([number, label]) => (
            <div key={number}>
              <p className="text-xs tracking-widest text-[#8d7748]">{number}</p>
              <p className="mt-2 text-sm font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24"
      >

        <div className="mb-11 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-9 bg-[#a18b57]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8d7748] sm:text-xs">
                Our grooming menu
              </p>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              The essentials.
              <span className="font-serif font-normal italic text-[#8d7748]">
                {" "}Done right.
              </span>
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-6 text-[#73766d]">
              From a fresh haircut to a perfectly shaped beard, find the
              service that suits your style.
            </p>
          </div>

          <a
            href="/services"
            className="text-sm font-semibold underline underline-offset-4"
          >
            View all services →
          </a>

        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

          {services.map((service, index) => (
            <article
              key={service.name}
              className="group overflow-hidden rounded-2xl border border-[#e5e0d5] bg-white transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="relative overflow-hidden bg-[#eae7dd]">

                <img
                  src={service.image}
                  alt={service.name}
                  className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <span className="absolute left-4 top-4 rounded-full bg-[#202820]/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-white">
                  0{index + 1}
                </span>

              </div>

              <div className="p-6">

                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold">{service.name}</h3>

                  <span className="whitespace-nowrap text-sm font-bold text-[#8d7748]">
                    {service.price}
                  </span>
                </div>

                <p className="mt-3 min-h-[48px] text-sm leading-6 text-[#73766d]">
                  {service.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-[#eae7dd] pt-5">

                  <span className="text-xs font-medium text-[#73766d]">
                    {service.duration}
                  </span>

                  <a
                    href="/book"
                    className="text-sm font-bold transition hover:text-[#8d7748]"
                  >
                    Book now ↗
                  </a>

                </div>

              </div>
            </article>
          ))}

        </div>
      </section>

      {/* Barbers */}
      <section id="team" className="bg-[#eae7dd]">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">

          <div className="mx-auto mb-12 max-w-xl text-center">

            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-9 bg-[#a18b57]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8d7748] sm:text-xs">
                Meet the professionals
              </p>
              <span className="h-px w-9 bg-[#a18b57]" />
            </div>

            <h2 className="text-3xl font-semibold sm:text-5xl">
              Skilled hands.
              <span className="font-serif font-normal italic text-[#8d7748]">
                {" "}Sharp results.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#696c63]">
              Meet our experienced barbers, dedicated to precision,
              personal style and the details that matter.
            </p>

          </div>

          <div className="mx-auto grid max-w-3xl gap-7 sm:grid-cols-2">

            {team.map((member) => (
              <article
                key={member.name}
                className="group overflow-hidden rounded-2xl border border-[#dedbd1] bg-white shadow-sm"
              >
                <div className="overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-[340px] w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="mt-2 text-sm text-[#73766d]">
                    {member.role}
                  </p>
                </div>
              </article>
            ))}

          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">

        <div className="relative overflow-hidden rounded-3xl bg-[#202820] px-6 py-16 text-center text-white sm:px-12 sm:py-20">

          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full border border-white/10" />

          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#cbb783] sm:text-xs">
              Your chair is waiting
            </p>

            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold sm:text-5xl">
              Good grooming.
              <span className="font-serif font-normal italic text-[#cbb783]">
                {" "}No compromises.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#d0d5ca]">
              Choose your service, select your preferred time and
              let our professionals take care of the rest.
            </p>

            <a
              href="/book"
              className="mt-9 inline-block rounded-full bg-[#e9e3d3] px-8 py-4 text-sm font-bold text-[#202820] transition hover:-translate-y-1 hover:bg-white"
            >
              Book Your Appointment ↗
            </a>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-[#dedbd1] bg-[#eae7dd]">

        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">

          <div>
            <p className="text-3xl font-bold">
              GENT<span className="text-[#8d7748]">.</span>
            </p>

            <p className="mt-4 max-w-xs text-sm leading-7 text-[#696c63]">
              A modern men's grooming house where good style begins.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold">Explore</h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-[#696c63]">
              <a href="#home" className="hover:text-[#8d7748]">Home</a>
              <a href="/services" className="hover:text-[#8d7748]">Services & Prices</a>
              <a href="/book" className="hover:text-[#8d7748]">Book Appointment</a>
              <a href="/contact" className="hover:text-[#8d7748]">Contact</a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold">Visit us</h3>
            <p className="mt-5 text-sm leading-7 text-[#696c63]">
              Lahore, Punjab, Pakistan
              <br />
              Monday – Saturday
              <br />
              10:00 AM – 8:00 PM
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold">Get in touch</h3>
            <p className="mt-5 text-sm leading-7 text-[#696c63]">
              Demo contact details
              <br />
              Replace with configured business information.
            </p>
            <a
              href="/contact"
              className="mt-3 inline-block text-sm font-semibold underline underline-offset-4"
            >
              Contact us →
            </a>
          </div>

        </div>

        <div className="border-t border-[#dedbd1] px-5 py-6 text-center text-xs text-[#73766d]">
        © 2026 GENT Grooming House. All rights reserved.
          <span className="mx-2">·</span>
          Demonstration website
        </div>

      </footer>

    </main>
  );
}
