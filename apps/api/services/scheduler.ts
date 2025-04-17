// import cron from 'node-cron';
// import axios from 'axios';
// import { getAdminToken } from '../utils/auth';
// import db from '../src/db';
// import { user } from '../src/db/schema';
// import { eq } from 'drizzle-orm';

// // Function to generate daily quests for all users
// async function generateDailyQuestsForAllUsers() {
//   try {
//     // Get admin token for internal API calls
//     const adminToken = await getAdminToken();

//     // Get all active users
//     const users = await db.select().from(user);

//     // Generate quest instances for each user
//     const results = await Promise.allSettled(
//       users.map(async (user) => {
//         try {
//           // Make internal API call to generate quests for this user
//           await axios.post(
//             `${process.env.API_URL}/quests/generate-daily-instances`,
//             {},
//             {
//               headers: {
//                 Authorization: `Bearer ${adminToken}`,
//                 'X-User-Id': user.id
//               }
//             }
//           );
//           return user.id;
//         } catch (error) {
//           console.error(`Failed to generate quests for user ${user.id}:`, error);
//           throw error;
//         }
//       })
//     );

//     console.log(`Daily quests generated for ${results.filter(r => r.status === 'fulfilled').length} users`);
//   } catch (error) {
//     console.error('Error in daily quest generation job:', error);
//   }
// }

// // Schedule the job to run at midnight every day
// export function initializeScheduler() {
//   // Run every day at midnight
//   cron.schedule('0 0 * * *', generateDailyQuestsForAllUsers);

//   console.log('Quest scheduler initialized');
// }
