CREATE TABLE `activityCompletions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childProfileId` int NOT NULL,
	`subject` enum('Math','Reading','Science','Art','Music') NOT NULL,
	`levelNumber` int NOT NULL,
	`interactionType` enum('multiple-choice','drag-and-drop','drawing') NOT NULL,
	`stars` int NOT NULL,
	`durationSeconds` int NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activityCompletions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `childBadges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childProfileId` int NOT NULL,
	`badgeId` varchar(64) NOT NULL,
	`subject` enum('Math','Reading','Science','Art','Music') NOT NULL,
	`earnedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `childBadges_id` PRIMARY KEY(`id`),
	CONSTRAINT `childBadges_profile_badge_unique` UNIQUE(`childProfileId`,`badgeId`)
);
--> statement-breakpoint
CREATE TABLE `childProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(80) NOT NULL,
	`avatar` varchar(48) NOT NULL,
	`ageGroup` enum('3–5','6–8','9–10') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `childProfiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `learningSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childProfileId` int NOT NULL,
	`subject` enum('Math','Reading','Science','Art','Music') NOT NULL,
	`durationSeconds` int NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `learningSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `parentControls` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`pinHash` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `parentControls_id` PRIMARY KEY(`id`),
	CONSTRAINT `parentControls_user_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `subjectProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childProfileId` int NOT NULL,
	`subject` enum('Math','Reading','Science','Art','Music') NOT NULL,
	`unlockedLevel` int NOT NULL DEFAULT 1,
	`completedLevels` int NOT NULL DEFAULT 0,
	`totalStars` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subjectProgress_id` PRIMARY KEY(`id`),
	CONSTRAINT `subjectProgress_child_subject_unique` UNIQUE(`childProfileId`,`subject`)
);
--> statement-breakpoint
ALTER TABLE `activityCompletions` ADD CONSTRAINT `activityCompletions_childProfileId_childProfiles_id_fk` FOREIGN KEY (`childProfileId`) REFERENCES `childProfiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `childBadges` ADD CONSTRAINT `childBadges_childProfileId_childProfiles_id_fk` FOREIGN KEY (`childProfileId`) REFERENCES `childProfiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `childProfiles` ADD CONSTRAINT `childProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `learningSessions` ADD CONSTRAINT `learningSessions_childProfileId_childProfiles_id_fk` FOREIGN KEY (`childProfileId`) REFERENCES `childProfiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `parentControls` ADD CONSTRAINT `parentControls_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subjectProgress` ADD CONSTRAINT `subjectProgress_childProfileId_childProfiles_id_fk` FOREIGN KEY (`childProfileId`) REFERENCES `childProfiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `activityCompletions_child_idx` ON `activityCompletions` (`childProfileId`);--> statement-breakpoint
CREATE INDEX `activityCompletions_child_subject_idx` ON `activityCompletions` (`childProfileId`,`subject`);--> statement-breakpoint
CREATE INDEX `childBadges_child_idx` ON `childBadges` (`childProfileId`);--> statement-breakpoint
CREATE INDEX `childProfiles_user_idx` ON `childProfiles` (`userId`);--> statement-breakpoint
CREATE INDEX `learningSessions_child_idx` ON `learningSessions` (`childProfileId`);--> statement-breakpoint
CREATE INDEX `subjectProgress_child_idx` ON `subjectProgress` (`childProfileId`);