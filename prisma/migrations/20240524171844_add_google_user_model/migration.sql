-- CreateTable
CREATE TABLE `GoogleUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_google_id` VARCHAR(191) NOT NULL,
    `user_uuid` VARCHAR(191) NOT NULL,
    `user_verified` BOOLEAN NOT NULL DEFAULT false,
    `user_token` VARCHAR(255) NOT NULL,
    `user_profile_url` VARCHAR(191) NULL,
    `user_name` VARCHAR(191) NOT NULL,
    `user_display_name` VARCHAR(191) NULL,
    `user_email` VARCHAR(191) NOT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,
    `is_disabled` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `GoogleUser_user_google_id_key`(`user_google_id`),
    UNIQUE INDEX `GoogleUser_user_uuid_key`(`user_uuid`),
    UNIQUE INDEX `GoogleUser_user_token_key`(`user_token`),
    UNIQUE INDEX `GoogleUser_user_email_key`(`user_email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
