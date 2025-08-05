/*
  Warnings:

  - Added the required column `description` to the `RecurringPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `RecurringPayment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `RecurringPayment` ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `paymentMethod` VARCHAR(191) NOT NULL;
