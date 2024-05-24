-- AlterTable
ALTER TABLE `GoogleUser` MODIFY `user_google_id` VARCHAR(191) NULL,
    MODIFY `user_uuid` VARCHAR(191) NULL,
    MODIFY `user_token` VARCHAR(191) NULL,
    MODIFY `user_name` VARCHAR(191) NULL,
    MODIFY `user_email` VARCHAR(191) NULL,
    MODIFY `create_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `update_at` DATETIME(3) NULL,
    MODIFY `is_disabled` BOOLEAN NULL DEFAULT false,
    MODIFY `user_email_verified` BOOLEAN NULL DEFAULT false;
