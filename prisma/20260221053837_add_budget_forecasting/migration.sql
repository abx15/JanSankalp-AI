/*
  Warnings:

  - A unique constraint covering the columns `[receiptId]` on the table `Complaint` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'STATE_ADMIN';
ALTER TYPE "Role" ADD VALUE 'DISTRICT_ADMIN';
ALTER TYPE "Role" ADD VALUE 'CITY_ADMIN';

-- AlterTable
ALTER TABLE "Complaint" ADD COLUMN     "aiAnalysis" JSONB,
ADD COLUMN     "cityId" TEXT,
ADD COLUMN     "districtId" TEXT,
ADD COLUMN     "isDuplicate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "receiptId" TEXT,
ADD COLUMN     "resolutionVerified" BOOLEAN,
ADD COLUMN     "spamScore" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "stateId" TEXT,
ADD COLUMN     "verificationLog" TEXT,
ADD COLUMN     "wardId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cityId" TEXT,
ADD COLUMN     "districtId" TEXT,
ADD COLUMN     "stateId" TEXT,
ADD COLUMN     "wardId" TEXT;

-- CreateTable
CREATE TABLE "State" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "District" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ward" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,

    CONSTRAINT "Ward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetForecast" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "periodType" TEXT NOT NULL,
    "departmentId" TEXT,
    "stateId" TEXT,
    "districtId" TEXT,
    "predictedAmount" DOUBLE PRECISION NOT NULL,
    "actualAmount" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "personnelCost" DOUBLE PRECISION,
    "infrastructureCost" DOUBLE PRECISION,
    "operationalCost" DOUBLE PRECISION,
    "emergencyFund" DOUBLE PRECISION,
    "forecastDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "insights" JSONB,
    "riskFactors" JSONB,
    "recommendations" JSONB,

    CONSTRAINT "BudgetForecast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetActual" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "periodType" TEXT NOT NULL,
    "departmentId" TEXT,
    "stateId" TEXT,
    "districtId" TEXT,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "personnelCost" DOUBLE PRECISION,
    "infrastructureCost" DOUBLE PRECISION,
    "operationalCost" DOUBLE PRECISION,
    "emergencySpent" DOUBLE PRECISION,
    "complaintCount" INTEGER,
    "resolvedCount" INTEGER,
    "emergencyEvents" INTEGER,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedBy" TEXT,
    "notes" TEXT,

    CONSTRAINT "BudgetActual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostOptimization" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "potentialSavings" DOUBLE PRECISION NOT NULL,
    "implementationCost" DOUBLE PRECISION NOT NULL,
    "roi" DOUBLE PRECISION NOT NULL,
    "timeframe" TEXT NOT NULL,
    "departmentId" TEXT,
    "stateId" TEXT,
    "districtId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PROPOSED',
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "implementedBy" TEXT,
    "implementedAt" TIMESTAMP(3),
    "aiConfidence" DOUBLE PRECISION,
    "aiReasoning" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CostOptimization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemandSurge" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "predictedStart" TIMESTAMP(3) NOT NULL,
    "predictedEnd" TIMESTAMP(3) NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "departmentId" TEXT,
    "stateId" TEXT,
    "districtId" TEXT,
    "estimatedComplaints" INTEGER,
    "estimatedCost" DOUBLE PRECISION,
    "affectedAreas" JSONB,
    "factors" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PREDICTED',
    "actualStart" TIMESTAMP(3),
    "actualEnd" TIMESTAMP(3),
    "actualImpact" JSONB,
    "modelVersion" TEXT NOT NULL,
    "aiInsights" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemandSurge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "State_name_key" ON "State"("name");

-- CreateIndex
CREATE UNIQUE INDEX "District_name_stateId_key" ON "District"("name", "stateId");

-- CreateIndex
CREATE UNIQUE INDEX "City_name_districtId_key" ON "City"("name", "districtId");

-- CreateIndex
CREATE UNIQUE INDEX "Ward_name_cityId_key" ON "Ward"("name", "cityId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_email_token_key" ON "PasswordResetToken"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "BudgetForecast_period_periodType_departmentId_stateId_distr_key" ON "BudgetForecast"("period", "periodType", "departmentId", "stateId", "districtId");

-- CreateIndex
CREATE UNIQUE INDEX "Complaint_receiptId_key" ON "Complaint"("receiptId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ward" ADD CONSTRAINT "Ward_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetForecast" ADD CONSTRAINT "BudgetForecast_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetForecast" ADD CONSTRAINT "BudgetForecast_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetForecast" ADD CONSTRAINT "BudgetForecast_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetActual" ADD CONSTRAINT "BudgetActual_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetActual" ADD CONSTRAINT "BudgetActual_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetActual" ADD CONSTRAINT "BudgetActual_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostOptimization" ADD CONSTRAINT "CostOptimization_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostOptimization" ADD CONSTRAINT "CostOptimization_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostOptimization" ADD CONSTRAINT "CostOptimization_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandSurge" ADD CONSTRAINT "DemandSurge_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandSurge" ADD CONSTRAINT "DemandSurge_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandSurge" ADD CONSTRAINT "DemandSurge_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE SET NULL ON UPDATE CASCADE;
