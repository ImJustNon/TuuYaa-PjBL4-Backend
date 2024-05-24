-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_token` VARCHAR(191) NOT NULL,
    `user_profile_url` VARCHAR(191) NULL,
    `user_name` VARCHAR(191) NOT NULL,
    `user_email` VARCHAR(191) NOT NULL,
    `user_password_hash` VARCHAR(255) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,
    `is_delete` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `User_user_token_key`(`user_token`),
    UNIQUE INDEX `User_user_email_key`(`user_email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BoxData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `box_id` INTEGER NOT NULL,
    `box_name` VARCHAR(191) NOT NULL,
    `box_key` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,
    `is_delete` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `BoxData_box_key_key`(`box_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Box` (
    `box_id` INTEGER NOT NULL AUTO_INCREMENT,
    `box_slot_count` INTEGER NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,
    `is_delete` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`box_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AlertData` (
    `alert_id` INTEGER NOT NULL AUTO_INCREMENT,
    `alert_name` VARCHAR(191) NOT NULL,
    `alert_key` VARCHAR(191) NOT NULL,
    `alert_time` VARCHAR(191) NOT NULL,
    `alert_slot` JSON NULL,
    `user_id` INTEGER NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,
    `is_delete` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `AlertData_alert_key_key`(`alert_key`),
    PRIMARY KEY (`alert_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerifyCode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `verify_code` VARCHAR(191) NOT NULL,
    `user_email` VARCHAR(191) NOT NULL,
    `reference_code` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,
    `is_delete` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
