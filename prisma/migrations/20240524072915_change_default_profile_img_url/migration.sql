/*
  Warnings:

  - A unique constraint covering the columns `[user_token]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `user_profile_url` VARCHAR(191) NULL DEFAULT 'https://upload-api-v2.vercel.app/api/v1/call/4039521653727833905836658';

-- CreateIndex
CREATE UNIQUE INDEX `User_user_token_key` ON `User`(`user_token`);
