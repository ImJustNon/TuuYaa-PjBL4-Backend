/*
  Warnings:

  - You are about to drop the column `is_delete` on the `AlertData` table. All the data in the column will be lost.
  - You are about to drop the column `is_delete` on the `Box` table. All the data in the column will be lost.
  - You are about to drop the column `is_delete` on the `BoxData` table. All the data in the column will be lost.
  - You are about to drop the column `is_delete` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_delete` on the `VerifyCode` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_uuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `user_uuid` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Made the column `user_display_name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `User_user_token_key` ON `User`;

-- AlterTable
ALTER TABLE `AlertData` DROP COLUMN `is_delete`,
    ADD COLUMN `is_disabled` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Box` DROP COLUMN `is_delete`,
    ADD COLUMN `is_disabled` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `BoxData` DROP COLUMN `is_delete`,
    ADD COLUMN `is_disabled` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `is_delete`,
    DROP COLUMN `user_token`,
    ADD COLUMN `is_disabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `user_uuid` VARCHAR(191) NOT NULL,
    MODIFY `user_profile_url` VARCHAR(191) NULL DEFAULT 'default',
    MODIFY `user_display_name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `VerifyCode` DROP COLUMN `is_delete`,
    ADD COLUMN `is_disabled` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `User_user_uuid_key` ON `User`(`user_uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `User_user_name_key` ON `User`(`user_name`);
