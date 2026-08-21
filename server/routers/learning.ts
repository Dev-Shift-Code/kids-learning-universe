import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { CATEGORY_IDS } from "../../shared/curriculumConfig";
import { AGE_GROUPS } from "../../shared/learningConfig";
import {
  completeLearningActivity,
  confirmParentPin,
  createChildProfile,
  getChildSnapshot,
  getFamilySnapshot,
  listChildProfiles,
  parentPinStatus,
  setParentPin,
} from "../learningDb";
import { protectedProcedure, router } from "../_core/trpc";

const ageGroupSchema = z.enum(AGE_GROUPS);
const categorySchema = z.enum(CATEGORY_IDS);

export const learningRouter = router({
  profiles: protectedProcedure.query(({ ctx }) => listChildProfiles(ctx.user.id)),
  profileSummaries: protectedProcedure.query(({ ctx }) => getFamilySnapshot(ctx.user.id)),
  familySnapshot: protectedProcedure.input(z.object({ pin: z.string().regex(/^\d{4,6}$/) })).mutation(async ({ ctx, input }) => {
    const verification = await confirmParentPin(ctx.user.id, input.pin);
    if (!verification.verified) throw new TRPCError({ code: "FORBIDDEN", message: "A valid parent PIN is required." });
    return getFamilySnapshot(ctx.user.id);
  }),
  childSnapshot: protectedProcedure.input(z.object({ profileId: z.number().int().positive() })).query(({ ctx, input }) =>
    getChildSnapshot(ctx.user.id, input.profileId),
  ),
  createProfile: protectedProcedure.input(z.object({
    name: z.string().trim().min(1).max(80),
    avatar: z.string().trim().min(1).max(48),
    ageGroup: ageGroupSchema,
  })).mutation(({ ctx, input }) => createChildProfile({ ...input, userId: ctx.user.id })),
  parentPinStatus: protectedProcedure.query(({ ctx }) => parentPinStatus(ctx.user.id)),
  configureParentPin: protectedProcedure.input(z.object({ pin: z.string().regex(/^\d{4,6}$/) })).mutation(({ ctx, input }) =>
    setParentPin(ctx.user.id, input.pin),
  ),
  verifyParentPin: protectedProcedure.input(z.object({ pin: z.string().regex(/^\d{4,6}$/) })).mutation(({ ctx, input }) =>
    confirmParentPin(ctx.user.id, input.pin),
  ),
  completeActivity: protectedProcedure.input(z.object({
    childProfileId: z.number().int().positive(),
    category: categorySchema,
    activityId: z.string().trim().min(1).max(64),
    levelNumber: z.number().int().min(1).max(12),
    interactionType: z.enum(["multiple-choice", "drag-and-drop", "drawing"]),
    stars: z.number().int().min(0).max(3),
    durationSeconds: z.number().int().min(0).max(3600),
  })).mutation(({ ctx, input }) => completeLearningActivity({ ...input, userId: ctx.user.id })),
});
