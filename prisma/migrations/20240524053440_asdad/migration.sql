/*
  Warnings:

  - You are about to alter the column `user_token` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `user_token` VARCHAR(191) NOT NULL;
