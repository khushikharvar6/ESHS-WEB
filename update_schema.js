const fs = require('fs');

const schemas = ['frontend/prisma/schema.prisma', 'backend/prisma/schema.prisma'];

const newModels = `
model FeedbackHomeHealthcare {
  id         String   @id @default(uuid())
  uhid       String?
  feedbackId String
  feedback   Feedback @relation(fields: [feedbackId], references: [id], onDelete: Cascade)
  question   String
  rating     Int
  @@map("feedback_home_healthcare")
}

model FeedbackDoctorConsultation {
  id         String   @id @default(uuid())
  uhid       String?
  feedbackId String
  feedback   Feedback @relation(fields: [feedbackId], references: [id], onDelete: Cascade)
  question   String
  rating     Int
  @@map("feedback_doctor_consultation")
}

model FeedbackPathology {
  id         String   @id @default(uuid())
  uhid       String?
  feedbackId String
  feedback   Feedback @relation(fields: [feedbackId], references: [id], onDelete: Cascade)
  question   String
  rating     Int
  @@map("feedback_pathology")
}

model FeedbackRadiology {
  id         String   @id @default(uuid())
  uhid       String?
  feedbackId String
  feedback   Feedback @relation(fields: [feedbackId], references: [id], onDelete: Cascade)
  question   String
  rating     Int
  @@map("feedback_radiology")
}

model FeedbackCardiology {
  id         String   @id @default(uuid())
  uhid       String?
  feedbackId String
  feedback   Feedback @relation(fields: [feedbackId], references: [id], onDelete: Cascade)
  question   String
  rating     Int
  @@map("feedback_cardiology")
}

model FeedbackPulmonology {
  id         String   @id @default(uuid())
  uhid       String?
  feedbackId String
  feedback   Feedback @relation(fields: [feedbackId], references: [id], onDelete: Cascade)
  question   String
  rating     Int
  @@map("feedback_pulmonology")
}

model FeedbackOphthalmology {
  id         String   @id @default(uuid())
  uhid       String?
  feedbackId String
  feedback   Feedback @relation(fields: [feedbackId], references: [id], onDelete: Cascade)
  question   String
  rating     Int
  @@map("feedback_ophthalmology")
}

model FeedbackPhysiotherapy {
  id         String   @id @default(uuid())
  uhid       String?
  feedbackId String
  feedback   Feedback @relation(fields: [feedbackId], references: [id], onDelete: Cascade)
  question   String
  rating     Int
  @@map("feedback_physiotherapy")
}

model FeedbackPharmacy {
  id         String   @id @default(uuid())
  uhid       String?
  feedbackId String
  feedback   Feedback @relation(fields: [feedbackId], references: [id], onDelete: Cascade)
  question   String
  rating     Int
  @@map("feedback_pharmacy")
}

model FeedbackPackage {
  id         String   @id @default(uuid())
  uhid       String?
  feedbackId String
  feedback   Feedback @relation(fields: [feedbackId], references: [id], onDelete: Cascade)
  question   String
  rating     Int
  @@map("feedback_package")
}

model FeedbackDayCare {
  id         String   @id @default(uuid())
  uhid       String?
  feedbackId String
  feedback   Feedback @relation(fields: [feedbackId], references: [id], onDelete: Cascade)
  question   String
  rating     Int
  @@map("feedback_daycare")
}

model FeedbackIPD {
  id         String   @id @default(uuid())
  uhid       String?
  feedbackId String
  feedback   Feedback @relation(fields: [feedbackId], references: [id], onDelete: Cascade)
  question   String
  rating     Int
  @@map("feedback_ipd")
}

model FeedbackGeneral {
  id         String   @id @default(uuid())
  uhid       String?
  feedbackId String
  feedback   Feedback @relation(fields: [feedbackId], references: [id], onDelete: Cascade)
  question   String
  rating     Int
  @@map("feedback_general")
}
`;

const newRelations = `  homeHealthcareRatings     FeedbackHomeHealthcare[]
  doctorConsultationRatings FeedbackDoctorConsultation[]
  pathologyRatings          FeedbackPathology[]
  radiologyRatings          FeedbackRadiology[]
  cardiologyRatings         FeedbackCardiology[]
  pulmonologyRatings        FeedbackPulmonology[]
  ophthalmologyRatings      FeedbackOphthalmology[]
  physiotherapyRatings      FeedbackPhysiotherapy[]
  pharmacyRatings           FeedbackPharmacy[]
  packageRatings            FeedbackPackage[]
  dayCareRatings            FeedbackDayCare[]
  ipdRatings                FeedbackIPD[]
  generalRatings            FeedbackGeneral[]`;

schemas.forEach(schemaPath => {
  let content = fs.readFileSync(schemaPath, 'utf8');

  // Replace ratings in Feedback model
  content = content.replace(/ratings\s+FeedbackRating\[\]/, newRelations);

  // Replace FeedbackRating model with new models
  content = content.replace(/model FeedbackRating \{[\s\S]*?@@map\("feedback_ratings"\)\s*\}/, newModels);

  fs.writeFileSync(schemaPath, content);
});
console.log('Schemas updated.');
