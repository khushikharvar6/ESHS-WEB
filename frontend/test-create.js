async function run() {
  const payload = {
    patient: "John Doe",
    phone: "1234567890",
    email: "john@example.com",
    doctor: "Dr. Anand Gadhvi",
    service: "Cardiology",
    date: "2026-07-09",
    time: "10:00 AM",
    type: "New",
    status: "Scheduled"
  };

  const res = await fetch("http://localhost:3001/api/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  console.log("Response:", res.status, text.substring(0, 500));
}

run().catch(console.error);
