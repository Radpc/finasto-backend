-- AlterTable
ALTER TABLE `User` ADD COLUMN `auth0Sub` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_auth0Sub_key` ON `User`(`auth0Sub`);
