require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/database");

const userModel = require("../models/user.model");
const subscriptionPlanModel = require("../models/subscriptionPlan.model");
const systemSettingModel = require("../models/systemSetting.model");
const auditLogModel = require("../models/auditLog.model");

async function seedAdmin() {
    try {
        console.log("Connecting to database...");
        await connectDB();

        // 1. Seed or Update Super Admin
        const superAdminEmail = process.env.ADMIN_INITIAL_EMAIL || "admin@interviewprepai.com";
        const superAdminPassword = process.env.ADMIN_INITIAL_PASSWORD || "Admin@PrepAI2026!";

        let adminUser = await userModel.findOne({ email: superAdminEmail.toLowerCase() });

        const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

        if (!adminUser) {
            adminUser = await userModel.create({
                username: "superadmin",
                email: superAdminEmail.toLowerCase(),
                password: hashedPassword,
                fullName: "Platform Super Admin",
                role: "super_admin",
                status: "active",
                plan: "premium",
                adminPermissions: ["*"],
                lastLoginAt: new Date()
            });
            console.log(`✅ Super Admin created: ${superAdminEmail}`);
        } else {
            adminUser.role = "super_admin";
            adminUser.status = "active";
            adminUser.adminPermissions = ["*"];
            adminUser.password = hashedPassword;
            await adminUser.save();
            console.log(`✅ Super Admin updated and verified: ${superAdminEmail}`);
        }

        // 2. Seed Default Subscription Plans
        const defaultPlans = [
            {
                name: "Free",
                code: "free",
                description: "Essential interview preparation toolkit for job seekers starting out.",
                price: 0,
                billingInterval: "monthly",
                limits: {
                    interviewGenerationsPerMonth: 5,
                    mockInterviewsPerMonth: 3,
                    resumeOptimizationsPerMonth: 2,
                    aiAssistantQueriesPerDay: 15
                },
                features: [
                    "5 AI Interview Prep Reports / mo",
                    "3 Interactive Mock Interviews / mo",
                    "2 ATS Resume Optimizations / mo",
                    "Standard Gemini 1.5 Flash Speed",
                    "Basic Skill Gap Analysis",
                    "Community Support"
                ],
                isActive: true
            },
            {
                name: "Pro",
                code: "pro",
                description: "Accelerated interview coaching and in-depth analytics for active job hunters.",
                price: 19,
                billingInterval: "monthly",
                limits: {
                    interviewGenerationsPerMonth: 30,
                    mockInterviewsPerMonth: 25,
                    resumeOptimizationsPerMonth: 15,
                    aiAssistantQueriesPerDay: 80
                },
                features: [
                    "30 AI Interview Prep Reports / mo",
                    "25 Adaptive Mock Interviews / mo",
                    "15 ATS Resume Optimizations / mo",
                    "Real-time Voice STT & Feedback",
                    "Advanced Coding Practice Sandbox",
                    "PDF Q&A Study Guide Downloads",
                    "Priority Generation Speed"
                ],
                isActive: true
            },
            {
                name: "Premium",
                code: "premium",
                description: "Unlimited enterprise-level preparation with comprehensive tracking and coaching.",
                price: 49,
                billingInterval: "monthly",
                limits: {
                    interviewGenerationsPerMonth: -1, // unlimited
                    mockInterviewsPerMonth: -1,
                    resumeOptimizationsPerMonth: -1,
                    aiAssistantQueriesPerDay: -1
                },
                features: [
                    "Unlimited AI Interview Preparation",
                    "Unlimited Mock Interviews with Video/Voice",
                    "Unlimited Professional Resume Exports",
                    "Ultra-Low Latency Gemini Pro Engine",
                    "Executive & System Design Templates",
                    "Dedicated 24/7 Priority Support",
                    "Comprehensive Performance Analytics"
                ],
                isActive: true
            }
        ];

        for (const planData of defaultPlans) {
            await subscriptionPlanModel.findOneAndUpdate(
                { code: planData.code },
                { $set: planData },
                { upsert: true, new: true }
            );
        }
        console.log("✅ Subscription Plans initialized: Free, Pro, Premium");

        // 3. Seed Default System Settings
        await systemSettingModel.findOneAndUpdate(
            { key: "platform_config" },
            {
                $setOnInsert: {
                    platformName: "Interview Prep AI",
                    supportEmail: "support@interviewprepai.com",
                    maintenanceMode: false,
                    allowNewRegistrations: true,
                    defaultUserPlan: "free",
                    aiSettings: {
                        activeModel: "gemini-1.5-flash",
                        maxRequestsPerUserDaily: 50,
                        generationTimeoutMs: 30000,
                        retryAttempts: 2,
                        temperature: 0.7
                    },
                    securitySettings: {
                        maxLoginAttempts: 5,
                        sessionTimeoutMinutes: 1440,
                        enforceStrongPasswords: true
                    },
                    lastUpdatedBy: "seed_script"
                }
            },
            { upsert: true, new: true }
        );
        console.log("✅ System Settings initialized.");

        // 4. Initial Audit Log
        await auditLogModel.create({
            adminEmail: superAdminEmail,
            adminRole: "super_admin",
            action: "SYSTEM_SEEDED",
            target: "Platform Initialization",
            targetModel: "System",
            details: { message: "Initial Super Admin and Platform Settings successfully seeded." },
            ipAddress: "127.0.0.1",
            status: "success"
        });
        console.log("✅ Initial Audit Log recorded.");

        console.log("\n=======================================================");
        console.log("🎉 SUPER ADMIN SEED COMPLETE");
        console.log(`Email:    ${superAdminEmail}`);
        console.log(`Password: ${superAdminPassword}`);
        console.log("=======================================================\n");

        process.exit(0);
    } catch (err) {
        console.error("❌ Seed failed:", err);
        process.exit(1);
    }
}

seedAdmin();
