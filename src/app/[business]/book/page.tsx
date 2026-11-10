export const instant = false;
type Props = {
  params: Promise<{ business: string }>;
};

export default async function BookingPage({ params }: Props) {
  const { business } = await params;

  const businessName =
    business.toLowerCase() === "gent"
      ? "GENT Grooming House"
      : business.toLowerCase() === "glow"
        ? "GLOW Beauty Salon"
        : null;

  if (!businessName) {
    return <h1>Business not found</h1>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold">
        Book Your Appointment
      </h1>

      <p className="mt-4">{businessName}</p>

      <p className="mt-4 text-gray-500">
        Appointment booking functionality is being implemented.
      </p>
    </main>
  );
}
