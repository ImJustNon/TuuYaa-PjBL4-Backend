/*
  Warnings:

  - You are about to drop the column `user_verified` on the `GoogleUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `GoogleUser` DROP COLUMN `user_verified`,
    ADD COLUMN `user_email_verified` BOOLEAN NOT NULL DEFAULT false;
