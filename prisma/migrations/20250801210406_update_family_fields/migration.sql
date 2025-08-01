/*
  Warnings:

  - You are about to drop the column `familyId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `familyId` on the `RecurringPayment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_familyId_fkey`;

-- DropForeignKey
ALTER TABLE `RecurringPayment` DROP FOREIGN KEY `RecurringPayment_familyId_fkey`;

-- AlterTable
ALTER TABLE `Payment` DROP COLUMN `familyId`;

-- AlterTable
ALTER TABLE `RecurringPayment` DROP COLUMN `familyId`;
