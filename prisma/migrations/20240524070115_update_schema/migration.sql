/*
  Warnings:

  - The primary key for the `AlertData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `alert_id` on the `AlertData` table. All the data in the column will be lost.
  - You are about to drop the column `alert_key` on the `AlertData` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `AlertData` table. All the data in the column will be lost.
  - The primary key for the `Box` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `box_id` on the `Box` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `BoxData` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[alert_uuid]` on the table `AlertData` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[box_uuid]` on the table `Box` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[box_key]` on the table `Box` will be added. If there are existing duplicate values, this will fail.
  - The required column `alert_uuid` was added to the `AlertData` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `box_uuid` to the `AlertData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `AlertData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_uuid` to the `AlertData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `box_key` to the `Box` table without a default value. This is not possible if the table is not empty.
  - The required column `box_uuid` was added to the `Box` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `id` to the `Box` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `AlertData_alert_key_key` ON `AlertData`;

-- AlterTable
ALTER TABLE `AlertData` DROP PRIMARY KEY,
    DROP COLUMN `alert_id`,
    DROP COLUMN `alert_key`,
    DROP COLUMN `user_id`,
    ADD COLUMN `alert_uuid` VARCHAR(191) NOT NULL,
    ADD COLUMN `box_uuid` VARCHAR(191) NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `user_uuid` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Box` DROP PRIMARY KEY,
    DROP COLUMN `box_id`,
    ADD COLUMN `box_key` VARCHAR(191) NOT NULL,
    ADD COLUMN `box_uuid` VARCHAR(191) NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `box_slot_count` INTEGER NOT NULL DEFAULT 6,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `user_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `BoxData`;

-- CreateTable
CREATE TABLE `RegisteredBox` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `box_uuid` VARCHAR(191) NOT NULL,
    `box_name` VARCHAR(191) NOT NULL,
    `user_uuid` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,
    `is_disabled` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `RegisteredBox_box_uuid_key`(`box_uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `AlertData_alert_uuid_key` ON `AlertData`(`alert_uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `Box_box_uuid_key` ON `Box`(`box_uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `Box_box_key_key` ON `Box`(`box_key`);
