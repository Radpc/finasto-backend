-- CreateTable
CREATE TABLE `_RecurringPaymentToTag` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_RecurringPaymentToTag_AB_unique`(`A`, `B`),
    INDEX `_RecurringPaymentToTag_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_RecurringPaymentToTag` ADD CONSTRAINT `_RecurringPaymentToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `RecurringPayment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RecurringPaymentToTag` ADD CONSTRAINT `_RecurringPaymentToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
