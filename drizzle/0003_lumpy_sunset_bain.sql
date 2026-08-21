CREATE TABLE `activityProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`childProfileId` int NOT NULL,
	`subject` enum('Math','Reading','Science','Art','Music','alphabet-phonics','numbers-counting','math-adventures','reading-stories','science-explorer','arts-creativity','music-rhythm','puzzles-brain-games','english-vocabulary','filipino-language','social-emotional-learning','life-skills','geography-world','nature-environment','fun-games') NOT NULL,
	`activityId` varchar(64) NOT NULL,
	`unlockedLevel` int NOT NULL DEFAULT 1,
	`completedLevels` int NOT NULL DEFAULT 0,
	`totalStars` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `activityProgress_id` PRIMARY KEY(`id`),
	CONSTRAINT `activityProgress_child_subject_activity_unique` UNIQUE(`childProfileId`,`subject`,`activityId`)
);
--> statement-breakpoint
ALTER TABLE `activityCompletions` ADD `activityId` varchar(64) DEFAULT 'legacy-activity' NOT NULL;--> statement-breakpoint
ALTER TABLE `activityProgress` ADD CONSTRAINT `activityProgress_childProfileId_childProfiles_id_fk` FOREIGN KEY (`childProfileId`) REFERENCES `childProfiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `activityProgress_child_idx` ON `activityProgress` (`childProfileId`);