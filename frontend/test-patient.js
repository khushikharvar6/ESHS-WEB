async function testSave() {
  const patientData = {
    salutation: "Mr.",
    firstName: "John",
    middleName: "A.",
    lastName: "Doe",
    age: 30,
    gender: "Male",
    mobileNo: "9876543210",
    emailAddress: "test@example.com",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pincode: "400001",
    emergencyContactName: "Jane Doe",
    emergencyRelationship: "Sibling",
    emergencyPhoneNumber: "9876543211",
    careType: "OPD",
    patientCategory: "Walk-in"
  };

  try {
    const res = await fetch("http://localhost:3001/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientData)
    });
    
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to save: ${res.status} - ${text.substring(0, 500)}`);
    }

    const data = await res.json();
    console.log("SUCCESS! API returned:", data);
  } catch (error) {
    console.error("API Test Failed:", error.message);
  }
}

testSave();
