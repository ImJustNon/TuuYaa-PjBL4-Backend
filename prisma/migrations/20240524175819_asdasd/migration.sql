/*
  Warnings:

  - Made the column `user_google_id` on table `GoogleUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_uuid` on table `GoogleUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_token` on table `GoogleUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_name` on table `GoogleUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_email` on table `GoogleUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `create_at` on table `GoogleUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `update_at` on table `GoogleUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_disabled` on table `GoogleUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_email_verified` on table `GoogleUser` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `GoogleUser` MODIFY `user_google_id` VARCHAR(191) NOT NULL,
    MODIFY `user_uuid` VARCHAR(191) NOT NULL,
    MODIFY `user_token` VARCHAR(191) NOT NULL,
    MODIFY `user_name` VARCHAR(191) NOT NULL,
    MODIFY `user_email` VARCHAR(191) NOT NULL,
    MODIFY `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `update_at` DATETIME(3) NOT NULL,
    MODIFY `is_disabled` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `user_email_verified` BOOLEAN NOT NULL DEFAULT false;
