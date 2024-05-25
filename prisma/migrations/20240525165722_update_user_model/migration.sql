/*
  Warnings:

  - You are about to drop the column `is_disabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_google` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_display_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_password_hash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_token` on the `User` table. All the data in the column will be lost.
  - Made the column `user_google_id` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `User_user_email_key` ON `User`;

-- DropIndex
DROP INDEX `User_user_name_key` ON `User`;

-- DropIndex
DROP INDEX `User_user_token_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `is_disabled`,
    DROP COLUMN `is_google`,
    DROP COLUMN `user_display_name`,
    DROP COLUMN `user_password_hash`,
    DROP COLUMN `user_role`,
    DROP COLUMN `user_token`,
    ADD COLUMN `is_disable` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `user_google_id` VARCHAR(191) NOT NULL;
