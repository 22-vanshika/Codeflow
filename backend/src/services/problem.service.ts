import axios from 'axios';

export interface ProblemData {
    id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topicTags: string[];
    starterCode: {
        cpp: string;
    };
    source: 'LeetCode' | 'Custom';
    url?: string;
}

export class ProblemService {
    // LeetCode's public GraphQL endpoint
    private readonly LEETCODE_API = 'https://leetcode.com/graphql';

    /**
     * Extracts the problem slug from a LeetCode URL
     * e.g., https://leetcode.com/problems/two-sum/ -> 'two-sum'
     */
    private extractSlug(url: string): string {
        try {
            const urlObj = new URL(url);
            // Paths look like /problems/slug/
            const parts = urlObj.pathname.split('/').filter(Boolean);
            if (parts[0] === 'problems' && parts.length >= 2) {
                return parts[1];
            }
            throw new Error('Invalid LeetCode problem URL format');
        } catch (error) {
            throw new Error('Invalid URL provided');
        }
    }

    /**
     * Fetches problem details from LeetCode using GraphQL
     */
    public async fetchFromLeetCode(url: string): Promise<ProblemData> {
        const slug = this.extractSlug(url);

        const query = `
            query questionData($titleSlug: String!) {
                question(titleSlug: $titleSlug) {
                    questionId
                    title
                    content
                    difficulty
                    topicTags {
                        name
                    }
                    codeSnippets {
                        lang
                        langSlug
                        code
                    }
                }
            }
        `;

        try {
            const response = await axios.post(
                this.LEETCODE_API,
                {
                    query: query,
                    variables: { titleSlug: slug }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // Minimal headers to mimic a browser, though LC's public GQL is usually open for this specific query
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                    }
                }
            );

            const question = response.data?.data?.question;

            if (!question) {
                throw new Error('Problem not found on LeetCode');
            }

            // Find C++ starter code
            const cppSnippet = question.codeSnippets?.find((s: any) => s.langSlug === 'cpp');

            return {
                id: question.questionId,
                title: question.title,
                description: question.content || 'Description not available.',
                difficulty: question.difficulty as 'Easy' | 'Medium' | 'Hard',
                topicTags: question.topicTags?.map((t: any) => t.name) || [],
                starterCode: {
                    cpp: cppSnippet?.code || '// Write your C++ code here\n',
                },
                source: 'LeetCode',
                url: url
            };

        } catch (error: any) {
            console.error('LeetCode Fetch Error:', error.message);
            throw new Error(`Failed to fetch from LeetCode: ${error.message}`);
        }
    }
}
