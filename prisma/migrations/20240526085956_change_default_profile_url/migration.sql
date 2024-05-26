-- AlterTable
ALTER TABLE `User` MODIFY `user_profile_url` VARCHAR(191) NULL DEFAULT 'https://upload-api-v2.vercel.app/api/v1/call/8053699086234779621734449',
    ALTER COLUMN `user_role` DROP DEFAULT;
