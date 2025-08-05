/*
  Warnings:

  - Added the required column `categoryId` to the `RecurringPayment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `RecurringPayment` ADD COLUMN `categoryId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `RecurringPayment` ADD CONSTRAINT `RecurringPayment_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
