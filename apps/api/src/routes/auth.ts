import { Router } from "express";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import db from "../db";
import { user, account } from "../db/schema";
import bcrypt from "bcryptjs";

const authRouter = Router();

// Schema for checking email availability
const checkEmailSchema = z.object({
  email: z.string().email(),
});

// Schema for checking OAuth account availability
const checkOAuthAccountSchema = z.object({
  provider: z.string(),
  userId: z.string(),
});

// Schema for account upgrade
const upgradeAccountSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  userId: z.string(),
});

// Schema for OAuth upgrade
const oauthUpgradeSchema = z.object({
  provider: z.string(),
  anonymousUserId: z.string(),
  oauthAccountId: z.string(),
  oauthEmail: z.string().email().optional(),
});

// Schema for checking OAuth user without login
const checkOAuthUserSchema = z.object({
  provider: z.string(),
  userId: z.string(),
  action: z.string().optional(),
});

// Check if email is already registered
authRouter.post("/check-email", async (req, res) => {
  try {
    const validatedData = checkEmailSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const { email } = validatedData.data;

    // Check if email exists in user table (for non-anonymous users)
    const existingUser = await db
      .select()
      .from(user)
      .where(
        and(
          eq(user.email, email),
          eq(user.isAnonymous, false) // Only check non-anonymous users
        )
      )
      .limit(1);

    return res.json({ exists: existingUser.length > 0 });
  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).json({ error: "Failed to check email" });
  }
});

// Check if OAuth account is already registered to a non-anonymous user (for upgrade callback)
const checkOAuthAccountCallbackSchema = z.object({
  provider: z.string(),
  oauthUserId: z.string(),
  oauthEmail: z.string().email().optional(),
  anonymousUserId: z.string().optional(),
});

authRouter.post("/check-oauth-account-callback", async (req, res) => {
  try {
    const validatedData = checkOAuthAccountCallbackSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const { provider, oauthUserId } = validatedData.data;

    // Get the OAuth account ID from the session or request body
    const oauthAccountId = await db
      .select({ accountId: account.accountId })
      .from(account)
      .where(
        and(eq(account.providerId, provider), eq(account.userId, oauthUserId))
      )
      .limit(1);

    console.log("OAuth Account ID:", oauthAccountId);

    if (oauthAccountId.length) {
      // Check if this OAuth account is already registered to a non-anonymous user
      const existingAccount = await db
        .select({
          userId: account.userId,
          accountId: account.accountId,
        })
        .from(account)
        .where(
          and(
            eq(account.providerId, provider),
            eq(account.accountId, oauthAccountId[0].accountId)
          )
        )
        .limit(1);

      if (existingAccount.length > 0) {
        return res.json({
          accountExists: true,
        });
      }
    }
    return res.json({ accountExists: false });
  } catch (error) {
    console.error("Error checking OAuth account (callback):", error);
    return res
      .status(500)
      .json({ error: "Failed to check OAuth account (callback)" });
  }
});

// Check if OAuth account is already registered
authRouter.post("/check-oauth-account", async (req, res) => {
  try {
    const validatedData = checkOAuthAccountSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const { provider, userId } = validatedData.data;

    // Check if this OAuth provider is already linked to a non-anonymous user
    const existingAccount = await db
      .select({
        userId: account.userId,
        accountId: account.accountId,
        userEmail: user.email,
        isAnonymous: user.isAnonymous,
      })
      .from(account)
      .innerJoin(user, eq(account.userId, user.id))
      .where(
        and(
          eq(account.providerId, provider),
          eq(user.isAnonymous, false) // Only check non-anonymous users
        )
      )
      .limit(1);

    if (existingAccount.length > 0) {
      return res.json({
        exists: true,
        accountInfo: {
          email: existingAccount[0].userEmail,
          provider: provider,
        },
      });
    }

    return res.json({ exists: false });
  } catch (error) {
    console.error("Error checking OAuth account:", error);
    return res.status(500).json({ error: "Failed to check OAuth account" });
  }
});

// Upgrade anonymous account to registered account
authRouter.post("/upgrade-account", async (req, res) => {
  try {
    const validatedData = upgradeAccountSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
      });
    }

    const { email, password, userId } = validatedData.data;

    // First verify the user exists and is anonymous
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!existingUser[0].isAnonymous) {
      return res.status(400).json({
        success: false,
        message: "User is not anonymous",
      });
    }

    // Double-check email availability (extra safety)
    const emailExists = await db
      .select()
      .from(user)
      .where(and(eq(user.email, email), eq(user.isAnonymous, false)))
      .limit(1);

    if (emailExists.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the user record
    await db
      .update(user)
      .set({
        email: email,
        isAnonymous: false,
        emailVerified: false, // Will need email verification
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));

    // Create account record for email/password authentication
    await db.insert(account).values({
      id: `${userId}_credential`,
      userId: userId,
      accountId: email,
      providerId: "credential",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.json({
      success: true,
      message: "Account upgraded successfully",
    });
  } catch (error) {
    console.error("Error upgrading account:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upgrade account",
    });
  }
});

// Complete OAuth upgrade (called from OAuth callback)
authRouter.post("/complete-oauth-upgrade", async (req, res) => {
  try {
    const validatedData = oauthUpgradeSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
      });
    }

    const { provider, anonymousUserId, oauthAccountId, oauthEmail } =
      validatedData.data;

    // Verify the anonymous user exists
    const anonymousUser = await db
      .select()
      .from(user)
      .where(and(eq(user.id, anonymousUserId), eq(user.isAnonymous, true)))
      .limit(1);

    if (anonymousUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Anonymous user not found",
      });
    }

    // Check if this OAuth account is already registered
    const existingOAuthAccount = await db
      .select()
      .from(account)
      .innerJoin(user, eq(account.userId, user.id))
      .where(
        and(
          eq(account.providerId, provider),
          eq(account.accountId, oauthAccountId),
          eq(user.isAnonymous, false)
        )
      )
      .limit(1);

    if (existingOAuthAccount.length > 0) {
      return res.status(409).json({
        success: false,
        message: `This ${provider} account is already registered`,
      });
    }

    // Update the anonymous user to be a regular user
    await db
      .update(user)
      .set({
        email: oauthEmail || `${oauthAccountId}@${provider}.oauth`,
        isAnonymous: false,
        emailVerified: true, // OAuth accounts are pre-verified
        updatedAt: new Date(),
      })
      .where(eq(user.id, anonymousUserId));

    // Create or update the OAuth account record
    await db.insert(account).values({
      id: `${anonymousUserId}_${provider}`,
      userId: anonymousUserId,
      accountId: oauthAccountId,
      providerId: provider,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.json({
      success: true,
      message: "Account upgraded successfully with OAuth",
    });
  } catch (error) {
    console.error("Error completing OAuth upgrade:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to complete OAuth upgrade",
    });
  }
});

// Check OAuth user info without logging in
authRouter.post("/check-oauth-user", async (req, res) => {
  try {
    const validatedData = checkOAuthUserSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const { provider, userId, action } = validatedData.data;

    // This endpoint requires a more complex approach since we need to check
    // OAuth account existence without actually logging the user in.
    // For now, we'll return a simulated check - in a real implementation,
    // you'd need to use the OAuth provider's API to validate the user

    // For Google, you could use their tokeninfo endpoint, but that requires
    // the user to go through OAuth first. Instead, we'll modify our approach:

    // We can't reliably check OAuth account existence without the user going
    // through OAuth flow first. The better approach is to:
    // 1. Let them proceed with OAuth
    // 2. In the OAuth callback, check if account exists
    // 3. If it exists, don't complete the login and return to upgrade dialog with error

    return res.json({
      exists: false, // We'll handle the real check in the OAuth callback
      message: "OAuth check will be performed during authentication flow",
    });
  } catch (error) {
    console.error("Error checking OAuth user:", error);
    return res.status(500).json({ error: "Failed to check OAuth user" });
  }
});

export default authRouter;
