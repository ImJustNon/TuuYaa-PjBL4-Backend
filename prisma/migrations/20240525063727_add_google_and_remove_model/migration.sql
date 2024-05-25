/*
  Warnings:

  - You are about to drop the `GoogleUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `is_google` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `user_google_id` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `GoogleUser`;
