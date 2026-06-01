import { IUser } from '../models/User';

/**
 * Dynamically updates the user's daily learning streak and activity history.
 * A streak increases on consecutive calendar days, resets on missed days, 
 * and stays unchanged if the activity occurs on the same calendar day.
 */
export async function recordUserActivity(user: IUser): Promise<void> {
    const now = new Date();
    const lastActive = user.lastActiveDate;

    if (!lastActive) {
        // First activity ever
        user.streak = 1;
        user.lastActiveDate = now;
        user.activityLogs.unshift({
            title: 'Started a new learning streak! 🚀',
            type: 'streak_start',
            createdAt: now
        });
    } else {
        const lastDate = new Date(lastActive);
        
        // Strip hours, minutes, seconds to compare calendar dates accurately
        const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const compareDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());

        const diffTime = todayDate.getTime() - compareDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive calendar day!
            user.streak += 1;
            user.lastActiveDate = now;
            user.activityLogs.unshift({
                title: `Kept up the streak! Day ${user.streak} 🚀`,
                type: 'streak_keep',
                createdAt: now
            });
        } else if (diffDays > 1) {
            // Missed one or more days, streak reset
            user.streak = 1;
            user.lastActiveDate = now;
            user.activityLogs.unshift({
                title: 'Started a new learning streak! 🚀',
                type: 'streak_start',
                createdAt: now
            });
        } else {
            // Same calendar day activity: keep the streak but update the timestamp
            user.lastActiveDate = now;
        }
    }

    // Retain only the most recent 20 activities to optimize DB storage
    if (user.activityLogs.length > 20) {
        user.activityLogs = user.activityLogs.slice(0, 20);
    }

    await user.save();
    console.log(`[recordUserActivity] Synced user ${user.email} (Streak: ${user.streak})`);
}
