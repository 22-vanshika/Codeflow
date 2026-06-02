import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Visualization } from '../models/Visualization';

export class DashboardController {
    public static async getDashboardStats(req: AuthRequest, res: Response): Promise<void> {
        try {
            const firebaseUid = req.firebaseUid;
            const user = await User.findOne({ firebaseUid });

            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            // Count saved visualizations
            const savedTracesCount = await Visualization.countDocuments({ userId: firebaseUid });

            // Count total solved problems
            let solvedCount = 0;
            if (user.progress) {
                const progressMap = user.progress as Map<string, boolean>;
                solvedCount = Array.from(progressMap.values()).filter(v => v === true).length;
            }

            // Auto-calculate daily streak
            const now = new Date();
            const lastActive = user.lastActiveDate;
            
            let shouldSaveUser = false;
            if (!lastActive) {
                user.streak = 1;
                user.lastActiveDate = now;
                shouldSaveUser = true;
            } else {
                const lastDate = new Date(lastActive);
                const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const compareDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
                
                const diffTime = todayDate.getTime() - compareDate.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    // Consecutive day!
                    user.streak += 1;
                    user.lastActiveDate = now;
                    user.activityLogs.unshift({
                        title: `Kept up the streak! Day ${user.streak} 🚀`,
                        type: 'streak_keep',
                        createdAt: now
                    });
                    shouldSaveUser = true;
                } else if (diffDays > 1) {
                    // Streak broken!
                    user.streak = 1;
                    user.lastActiveDate = now;
                    user.activityLogs.unshift({
                        title: 'Started a new learning streak! 🚀',
                        type: 'streak_start',
                        createdAt: now
                    });
                    shouldSaveUser = true;
                }
            }

            if (shouldSaveUser) {
                if (user.activityLogs.length > 20) {
                    user.activityLogs = user.activityLogs.slice(0, 20);
                }
                await user.save();
            }

            // Aggregate category-wise counts
            const categoryMapping: Record<string, string[]> = {
                'arrays': ['two_sum', 'best_time_to_buy_and_sell_stock', 'contains_duplicate', 'product_of_array_except_self', 'maximum_subarray', 'maximum_product_subarray', 'find_minimum_in_rotated_sorted_array', 'search_in_rotated_sorted_array', '3sum', 'container_with_most_water'],
                'strings': ['valid_anagram', 'valid_parentheses', 'valid_palindrome', 'longest_substring_without_repeating_characters', 'longest_repeating_character_replacement', 'minimum_window_substring', 'group_anagrams'],
                'sorting': ['bubble_sort', 'selection_sort', 'insertion_sort', 'merge_sort', 'quick_sort', 'heap_sort'],
                'linkedlists': ['reverse_linked_list', 'linked_list_cycle', 'merge_two_sorted_lists', 'merge_k_sorted_lists', 'remove_nth_node_from_end_of_list', 'reorder_list'],
                'trees': ['invert_binary_tree', 'maximum_depth_of_binary_tree', 'same_tree', 'subtree_of_another_tree', 'lowest_common_ancestor_of_a_binary_search_tree', 'binary_tree_level_order_traversal'],
                'graphs': ['clone_graph', 'course_schedule', 'number_of_islands', 'pacific_atlantic_water_flow', 'number_of_connected_components_in_an_undirected_graph']
            };

            const progressMapObj = Object.fromEntries(user.progress || new Map());
            const learningStats = Object.keys(categoryMapping).map(catKey => {
                const problemIds = categoryMapping[catKey];
                const solvedInCat = problemIds.filter(id => progressMapObj[id] === true).length;
                const pct = problemIds.length > 0 ? Math.round((solvedInCat / problemIds.length) * 100) : 0;
                return {
                    id: catKey,
                    completed: pct
                };
            });

            res.json({
                stats: {
                    solvedCount,
                    savedTracesCount,
                    streak: user.streak,
                    lastActiveDate: user.lastActiveDate
                },
                activityLogs: user.activityLogs || [],
                learningStats
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}
