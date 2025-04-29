import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
    users:defineTable({
        // Convex autogenerate uniqueID and created time so no need to create seperate columns for that.
        name:v.string(),
        email:v.string(),
        credits:v.number(),
        subscriptionId:v.optional(v.string())
    }),

    DiscussionRoom: defineTable({
        coachingOption: v.string(),
        topic: v.string(),
        expertName: v.string(),
        conversation: v.optional(v.any())
    })
})