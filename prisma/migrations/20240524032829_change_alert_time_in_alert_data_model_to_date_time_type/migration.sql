/*
  Warnings:

  - You are about to alter the column `alert_time` on the `AlertData` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `AlertData` MODIFY `alert_time` DATETIME(3) NOT NULL;
