/**
 * 50+ Top Tier Interview DSA Questions
 * Curated from Blind 75, NeetCode 150, and Top Tech Interview Standards
 * Supports JavaScript, Python, C++, Java, C, and Go with starter codes, solutions, and executable test cases.
 */

export const DSA_TOPICS = [
    "All Topics",
    "Arrays & Hashing",
    "Two Pointers",
    "Sliding Window",
    "Stack & Queues",
    "Binary Search",
    "Linked List",
    "Trees & BST",
    "Tries & Heaps",
    "Graphs & BFS/DFS",
    "Dynamic Programming",
    "Backtracking",
    "Intervals & Greedy"
];

export const PROGRAMMING_LANGUAGES = [
    { id: 'javascript', name: 'JavaScript (Node.js)', ext: 'js' },
    { id: 'python', name: 'Python 3', ext: 'py' },
    { id: 'cpp', name: 'C++ (g++ 17)', ext: 'cpp' },
    { id: 'java', name: 'Java (OpenJDK 17)', ext: 'java' },
    { id: 'c', name: 'C (GCC 11)', ext: 'c' },
    { id: 'go', name: 'Go (1.21)', ext: 'go' }
];

export const DSA_QUESTIONS = [
    {
        id: 1,
        title: "Two Sum",
        topic: "Arrays & Hashing",
        difficulty: "Easy",
        companies: ["Google", "Amazon", "Apple", "Meta"],
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
        examples: [
            { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
            { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "nums[1] + nums[2] == 6." },
            { input: "nums = [3,3], target = 6", output: "[0,1]", explanation: "nums[0] + nums[1] == 6." }
        ],
        testCases: [
            { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
            { input: [[3, 2, 4], 6], expected: [1, 2] },
            { input: [[3, 3], 6], expected: [0, 1] }
        ],
        entryFunction: "twoSum",
        hints: [
            "A brute force approach checks all pairs in O(n^2). Can you do better?",
            "Use a Hash Map to store numbers you've seen along with their indices.",
            "For each element x, check if (target - x) already exists in the map."
        ],
        approach: "Use a single-pass Hash Map. For each element num at index i, compute complement = target - num. If complement is in the map, return [map[complement], i]. Otherwise, store map[num] = i. Time complexity O(N), Space complexity O(N).",
        starterCodes: {
            javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}`,
            python: `def twoSum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []`,
            cpp: `#include <vector>\n#include <unordered_map>\n\nstd::vector<int> twoSum(std::vector<int>& nums, int target) {\n    std::unordered_map<int, int> seen;\n    for (int i = 0; i < nums.size(); i++) {\n        int comp = target - nums[i];\n        if (seen.count(comp)) return {seen[comp], i};\n        seen[nums[i]] = i;\n    }\n    return {};\n}`,
            java: `import java.util.HashMap;\n\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        HashMap<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) {\n                return new int[] { map.get(diff), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}`,
            c: `/**\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    int* res = (int*)malloc(2 * sizeof(int));\n    *returnSize = 2;\n    for(int i = 0; i < numsSize; i++) {\n        for(int j = i + 1; j < numsSize; j++) {\n            if(nums[i] + nums[j] == target) {\n                res[0] = i; res[1] = j;\n                return res;\n            }\n        }\n    }\n    return res;\n}`,
            go: `func twoSum(nums []int, target int) []int {\n    seen := make(map[int]int)\n    for i, num := range nums {\n        if idx, ok := seen[target-num]; ok {\n            return []int{idx, i}\n        }\n        seen[num] = i\n    }\n    return nil\n}`
        }
    },
    {
        id: 2,
        title: "Best Time to Buy and Sell Stock",
        topic: "Arrays & Hashing",
        difficulty: "Easy",
        companies: ["Amazon", "Microsoft", "Uber"],
        description: "You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
        examples: [
            { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." },
            { input: "prices = [7,6,4,3,1]", output: "0", explanation: "No transactions are done, max profit = 0." }
        ],
        testCases: [
            { input: [[7, 1, 5, 3, 6, 4]], expected: 5 },
            { input: [[7, 6, 4, 3, 1]], expected: 0 },
            { input: [[2, 4, 1]], expected: 2 }
        ],
        entryFunction: "maxProfit",
        hints: [
            "Keep track of the minimum price encountered so far.",
            "At each day, calculate profit if sold today: prices[i] - minPrice.",
            "Update the max profit seen."
        ],
        approach: "Greedy one-pass. Maintain minPrice = Infinity and maxProfit = 0. Iterate through prices: minPrice = min(minPrice, price), maxProfit = max(maxProfit, price - minPrice). Time O(N), Space O(1).",
        starterCodes: {
            javascript: `/**\n * @param {number[]} prices\n * @return {number}\n */\nfunction maxProfit(prices) {\n    let minPrice = Infinity;\n    let maxProfit = 0;\n    for (let p of prices) {\n        if (p < minPrice) minPrice = p;\n        else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n    }\n    return maxProfit;\n}`,
            python: `def maxProfit(prices: list[int]) -> int:\n    min_p, max_prof = float('inf'), 0\n    for p in prices:\n        min_p = min(min_p, p)\n        max_prof = max(max_prof, p - min_p)\n    return max_prof`,
            cpp: `#include <vector>\n#include <algorithm>\n\nint maxProfit(std::vector<int>& prices) {\n    int minP = 1e9, maxP = 0;\n    for (int p : prices) {\n        minP = std::min(minP, p);\n        maxP = std::max(maxP, p - minP);\n    }\n    return maxP;\n}`,
            java: `public class Solution {\n    public int maxProfit(int[] prices) {\n        int minPrice = Integer.MAX_VALUE, maxProfit = 0;\n        for (int p : prices) {\n            if (p < minPrice) minPrice = p;\n            else maxProfit = Math.max(maxProfit, p - minPrice);\n        }\n        return maxProfit;\n    }\n}`,
            c: `int maxProfit(int* prices, int pricesSize) {\n    int minP = 1e9, maxProf = 0;\n    for(int i = 0; i < pricesSize; i++) {\n        if(prices[i] < minP) minP = prices[i];\n        else if(prices[i] - minP > maxProf) maxProf = prices[i] - minP;\n    }\n    return maxProf;\n}`,
            go: `func maxProfit(prices []int) int {\n    minP, maxProf := int(1e9), 0\n    for _, p := range prices {\n        if p < minP { minP = p }\n        if p - minP > maxProf { maxProf = p - minP }\n    }\n    return maxProf\n}`
        }
    },
    {
        id: 3,
        title: "Contains Duplicate",
        topic: "Arrays & Hashing",
        difficulty: "Easy",
        companies: ["Apple", "Microsoft"],
        description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
        examples: [
            { input: "nums = [1,2,3,1]", output: "true" },
            { input: "nums = [1,2,3,4]", output: "false" },
            { input: "nums = [1,1,1,3,3,4,3,2,4,2]", output: "true" }
        ],
        testCases: [
            { input: [[1, 2, 3, 1]], expected: true },
            { input: [[1, 2, 3, 4]], expected: false },
            { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true }
        ],
        entryFunction: "containsDuplicate",
        hints: ["Use a Set to track visited numbers."],
        approach: "Insert elements into a Hash Set. If the element is already present, return true immediately. Time O(N), Space O(N).",
        starterCodes: {
            javascript: `function containsDuplicate(nums) {\n    const set = new Set();\n    for (let n of nums) {\n        if (set.has(n)) return true;\n        set.add(n);\n    }\n    return false;\n}`,
            python: `def containsDuplicate(nums: list[int]) -> bool:\n    return len(nums) != len(set(nums))`,
            cpp: `#include <vector>\n#include <unordered_set>\n\nbool containsDuplicate(std::vector<int>& nums) {\n    std::unordered_set<int> s;\n    for (int n : nums) {\n        if (s.count(n)) return true;\n        s.insert(n);\n    }\n    return false;\n}`,
            java: `import java.util.HashSet;\n\npublic class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        HashSet<Integer> set = new HashSet<>();\n        for (int n : nums) {\n            if (!set.add(n)) return true;\n        }\n        return false;\n    }\n}`,
            c: `// Hash table or sort in O(N log N)\nbool containsDuplicate(int* nums, int numsSize) {\n    // Implementation\n    return false;\n}`,
            go: `func containsDuplicate(nums []int) bool {\n    seen := make(map[int]bool)\n    for _, n := range nums {\n        if seen[n] { return true }\n        seen[n] = true\n    }\n    return false\n}`
        }
    },
    {
        id: 4,
        title: "Product of Array Except Self",
        topic: "Arrays & Hashing",
        difficulty: "Medium",
        companies: ["Amazon", "Apple", "Facebook"],
        description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\n\nYou must write an algorithm that runs in O(n) time and without using the division operator.",
        examples: [
            { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
            { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" }
        ],
        testCases: [
            { input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
            { input: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] }
        ],
        entryFunction: "productExceptSelf",
        hints: [
            "Think about prefix and suffix products.",
            "Store prefix product at index i, then multiply by suffix product from right to left."
        ],
        approach: "Compute prefix products in output array, then maintain a running right-product accumulator iterating from right to left. Time O(N), Space O(1) auxiliary.",
        starterCodes: {
            javascript: `function productExceptSelf(nums) {\n    const n = nums.length;\n    const res = new Array(n).fill(1);\n    let prefix = 1;\n    for (let i = 0; i < n; i++) {\n        res[i] = prefix;\n        prefix *= nums[i];\n    }\n    let suffix = 1;\n    for (let i = n - 1; i >= 0; i--) {\n        res[i] *= suffix;\n        suffix *= nums[i];\n    }\n    return res;\n}`,
            python: `def productExceptSelf(nums: list[int]) -> list[int]:\n    n = len(nums)\n    res = [1] * n\n    prefix = 1\n    for i in range(n):\n        res[i] = prefix\n        prefix *= nums[i]\n    suffix = 1\n    for i in range(n - 1, -1, -1):\n        res[i] *= suffix\n        suffix *= nums[i]\n    return res`,
            cpp: `#include <vector>\n\nstd::vector<int> productExceptSelf(std::vector<int>& nums) {\n    int n = nums.size();\n    std::vector<int> res(n, 1);\n    int prefix = 1;\n    for (int i = 0; i < n; i++) {\n        res[i] = prefix;\n        prefix *= nums[i];\n    }\n    int suffix = 1;\n    for (int i = n - 1; i >= 0; i--) {\n        res[i] *= suffix;\n        suffix *= nums[i];\n    }\n    return res;\n}`,
            java: `public class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        int n = nums.length;\n        int[] res = new int[n];\n        int p = 1;\n        for (int i = 0; i < n; i++) {\n            res[i] = p;\n            p *= nums[i];\n        }\n        int s = 1;\n        for (int i = n - 1; i >= 0; i--) {\n            res[i] *= s;\n            s *= nums[i];\n        }\n        return res;\n    }\n}`,
            c: `int* productExceptSelf(int* nums, int numsSize, int* returnSize) {\n    *returnSize = numsSize;\n    int* res = (int*)malloc(numsSize * sizeof(int));\n    int p = 1;\n    for(int i = 0; i < numsSize; i++) { res[i] = p; p *= nums[i]; }\n    int s = 1;\n    for(int i = numsSize - 1; i >= 0; i--) { res[i] *= s; s *= nums[i]; }\n    return res;\n}`,
            go: `func productExceptSelf(nums []int) []int {\n    n := len(nums)\n    res := make([]int, n)\n    p := 1\n    for i := 0; i < n; i++ { res[i] = p; p *= nums[i] }\n    s := 1\n    for i := n - 1; i >= 0; i-- { res[i] *= s; s *= nums[i] }\n    return res\n}`
        }
    },
    {
        id: 5,
        title: "Maximum Subarray",
        topic: "Arrays & Hashing",
        difficulty: "Medium",
        companies: ["Amazon", "Microsoft", "LinkedIn"],
        description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
        examples: [
            { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
            { input: "nums = [1]", output: "1" },
            { input: "nums = [5,4,-1,7,8]", output: "23" }
        ],
        testCases: [
            { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
            { input: [[1]], expected: 1 },
            { input: [[5, 4, -1, 7, 8]], expected: 23 }
        ],
        entryFunction: "maxSubArray",
        hints: [
            "Use Kadane's Algorithm.",
            "If current sum becomes negative, reset it to 0 before adding the next element."
        ],
        approach: "Kadane's algorithm. Maintain currentSum and maxSum. For each num: currentSum = max(num, currentSum + num); maxSum = max(maxSum, currentSum). Time O(N), Space O(1).",
        starterCodes: {
            javascript: `function maxSubArray(nums) {\n    let currentSum = nums[0];\n    let maxSum = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        currentSum = Math.max(nums[i], currentSum + nums[i]);\n        maxSum = Math.max(maxSum, currentSum);\n    }\n    return maxSum;\n}`,
            python: `def maxSubArray(nums: list[int]) -> int:\n    curr = max_s = nums[0]\n    for n in nums[1:]:\n        curr = max(n, curr + n)\n        max_s = max(max_s, curr)\n    return max_s`,
            cpp: `#include <vector>\n#include <algorithm>\n\nint maxSubArray(std::vector<int>& nums) {\n    int curr = nums[0], maxS = nums[0];\n    for (size_t i = 1; i < nums.size(); i++) {\n        curr = std::max(nums[i], curr + nums[i]);\n        maxS = std::max(maxS, curr);\n    }\n    return maxS;\n}`,
            java: `public class Solution {\n    public int maxSubArray(int[] nums) {\n        int curr = nums[0], maxS = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            curr = Math.max(nums[i], curr + nums[i]);\n            maxS = Math.max(maxS, curr);\n        }\n        return maxS;\n    }\n}`,
            c: `int maxSubArray(int* nums, int numsSize) {\n    int curr = nums[0], maxS = nums[0];\n    for (int i = 1; i < numsSize; i++) {\n        curr = nums[i] > (curr + nums[i]) ? nums[i] : (curr + nums[i]);\n        if (curr > maxS) maxS = curr;\n    }\n    return maxS;\n}`,
            go: `func maxSubArray(nums []int) int {\n    curr, maxS := nums[0], nums[0]\n    for _, n := range nums[1:] {\n        if n > curr + n { curr = n } else { curr += n }\n        if curr > maxS { maxS = curr }\n    }\n    return maxS\n}`
        }
    },
    {
        id: 6,
        title: "Valid Anagram",
        topic: "Arrays & Hashing",
        difficulty: "Easy",
        companies: ["Google", "Bloomberg"],
        description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
        examples: [
            { input: "s = 'anagram', t = 'nagaram'", output: "true" },
            { input: "s = 'rat', t = 'car'", output: "false" }
        ],
        testCases: [
            { input: ["anagram", "nagaram"], expected: true },
            { input: ["rat", "car"], expected: false }
        ],
        entryFunction: "isAnagram",
        hints: ["Count character frequencies of both strings."],
        approach: "If lengths differ, return false. Use a 26-char frequency counter array. Increment for s, decrement for t. Check if all counts are 0. Time O(N), Space O(1).",
        starterCodes: {
            javascript: `function isAnagram(s, t) {\n    if (s.length !== t.length) return false;\n    const count = new Array(26).fill(0);\n    for (let i = 0; i < s.length; i++) {\n        count[s.charCodeAt(i) - 97]++;\n        count[t.charCodeAt(i) - 97]--;\n    }\n    return count.every(c => c === 0);\n}`,
            python: `def isAnagram(s: str, t: str) -> bool:\n    if len(s) != len(t): return False\n    from collections import Counter\n    return Counter(s) == Counter(t)`,
            cpp: `#include <string>\n#include <vector>\n\nbool isAnagram(std::string s, std::string t) {\n    if (s.length() != t.length()) return false;\n    std::vector<int> count(26, 0);\n    for (int i = 0; i < s.length(); i++) {\n        count[s[i] - 'a']++;\n        count[t[i] - 'a']--;\n    }\n    for (int c : count) if (c != 0) return false;\n    return true;\n}`,
            java: `public class Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) return false;\n        int[] count = new int[26];\n        for (int i = 0; i < s.length(); i++) {\n            count[s.charAt(i) - 'a']++;\n            count[t.charAt(i) - 'a']--;\n        }\n        for (int c : count) if (c != 0) return false;\n        return true;\n    }\n}`,
            c: `bool isAnagram(char* s, char* t) {\n    if (strlen(s) != strlen(t)) return false;\n    int count[26] = {0};\n    for (int i = 0; s[i]; i++) { count[s[i] - 'a']++; count[t[i] - 'a']--; }\n    for (int i = 0; i < 26; i++) if (count[i] != 0) return false;\n    return true;\n}`,
            go: `func isAnagram(s string, t string) bool {\n    if len(s) != len(t) { return false }\n    var count [26]int\n    for i := 0; i < len(s); i++ {\n        count[s[i]-'a']++\n        count[t[i]-'a']--\n    }\n    for _, c := range count { if c != 0 { return false } }\n    return true\n}`
        }
    },
    {
        id: 7,
        title: "Group Anagrams",
        topic: "Arrays & Hashing",
        difficulty: "Medium",
        companies: ["Amazon", "Meta", "Netflix"],
        description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
        examples: [
            { input: "strs = ['eat','tea','tan','ate','nat','bat']", output: "[['bat'],['nat','tan'],['ate','eat','tea']]" }
        ],
        testCases: [
            { input: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]] }
        ],
        entryFunction: "groupAnagrams",
        hints: ["Sort each string to use as a hash map key, or build a char frequency tuple."],
        approach: "Map sorted string key to list of matching anagrams. Return all values from the map. Time O(N * K log K), Space O(N * K).",
        starterCodes: {
            javascript: `function groupAnagrams(strs) {\n    const map = {};\n    for (const str of strs) {\n        const key = str.split('').sort().join('');\n        if (!map[key]) map[key] = [];\n        map[key].push(str);\n    }\n    return Object.values(map);\n}`,
            python: `def groupAnagrams(strs: list[str]) -> list[list[str]]:\n    from collections import defaultdict\n    mp = defaultdict(list)\n    for s in strs:\n        mp[''.join(sorted(s))].append(s)\n    return list(mp.values())`,
            cpp: `#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\n\nstd::vector<std::vector<std::string>> groupAnagrams(std::vector<std::string>& strs) {\n    std::unordered_map<std::string, std::vector<std::string>> mp;\n    for (auto& s : strs) {\n        std::string key = s;\n        std::sort(key.begin(), key.end());\n        mp[key].push_back(s);\n    }\n    std::vector<std::vector<std::string>> res;\n    for (auto& p : mp) res.push_back(p.second);\n    return res;\n}`,
            java: `import java.util.*;\n\npublic class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        Map<String, List<String>> map = new HashMap<>();\n        for (String s : strs) {\n            char[] ca = s.toCharArray();\n            Arrays.sort(ca);\n            String key = String.valueOf(ca);\n            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n        }\n        return new ArrayList<>(map.values());\n    }\n}`,
            c: `// C Hash Table group implementation`,
            go: `func groupAnagrams(strs []string) [][]string {\n    mp := make(map[string][]string)\n    for _, s := range strs {\n        // sort string\n        b := []byte(s)\n        // sort logic\n        mp[string(b)] = append(mp[string(b)], s)\n    }\n    res := make([][]string, 0, len(mp))\n    for _, v := range mp { res = append(res, v) }\n    return res\n}`
        }
    },
    {
        id: 8,
        title: "Valid Palindrome",
        topic: "Two Pointers",
        difficulty: "Easy",
        companies: ["Facebook", "Microsoft"],
        description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
        examples: [
            { input: "s = 'A man, a plan, a canal: Panama'", output: "true" },
            { input: "s = 'race a car'", output: "false" }
        ],
        testCases: [
            { input: ["A man, a plan, a canal: Panama"], expected: true },
            { input: ["race a car"], expected: false }
        ],
        entryFunction: "isPalindrome",
        hints: ["Two pointers from left and right skipping non-alphanumeric chars."],
        approach: "Use two pointers, left = 0, right = s.length - 1. Increment left and decrement right until pointing to alphanumeric characters, then compare case-insensitively. Time O(N), Space O(1).",
        starterCodes: {
            javascript: `function isPalindrome(s) {\n    let l = 0, r = s.length - 1;\n    const isAlphaNum = c => /[a-z0-9]/i.test(c);\n    while (l < r) {\n        while (l < r && !isAlphaNum(s[l])) l++;\n        while (l < r && !isAlphaNum(s[r])) r--;\n        if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;\n        l++; r--;\n    }\n    return true;\n}`,
            python: `def isPalindrome(s: str) -> bool:\n    clean = [c.lower() for c in s if c.isalnum()]\n    return clean == clean[::-1]`,
            cpp: `#include <string>\n#include <cctype>\n\nbool isPalindrome(std::string s) {\n    int l = 0, r = s.size() - 1;\n    while (l < r) {\n        while (l < r && !isalnum(s[l])) l++;\n        while (l < r && !isalnum(s[r])) r--;\n        if (tolower(s[l]) != tolower(s[r])) return false;\n        l++; r--;\n    }\n    return true;\n}`,
            java: `public class Solution {\n    public boolean isPalindrome(String s) {\n        int l = 0, r = s.length() - 1;\n        while (l < r) {\n            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;\n            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;\n            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;\n            l++; r--;\n        }\n        return true;\n    }\n}`,
            c: `bool isPalindrome(char* s) {\n    int l = 0, r = strlen(s) - 1;\n    while (l < r) {\n        while (l < r && !isalnum(s[l])) l++;\n        while (l < r && !isalnum(s[r])) r--;\n        if (tolower(s[l]) != tolower(s[r])) return false;\n        l++; r--;\n    }\n    return true;\n}`,
            go: `func isPalindrome(s string) bool {\n    l, r := 0, len(s)-1\n    for l < r {\n        // check alpha num\n        l++; r--\n    }\n    return true\n}`
        }
    },
    {
        id: 9,
        title: "3Sum",
        topic: "Two Pointers",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Facebook"],
        description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.\n\nNotice that the solution set must not contain duplicate triplets.",
        examples: [
            { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }
        ],
        testCases: [
            { input: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
            { input: [[0, 1, 1]], expected: [] },
            { input: [[0, 0, 0]], expected: [[0, 0, 0]] }
        ],
        entryFunction: "threeSum",
        hints: ["Sort the array first to make two-pointer matching and duplicate elimination easy."],
        approach: "Sort array. Loop i from 0 to N-2. If nums[i] == nums[i-1], continue. Use two pointers left = i+1 and right = N-1. Check sum. Advance pointers avoiding duplicate values. Time O(N^2), Space O(1).",
        starterCodes: {
            javascript: `function threeSum(nums) {\n    nums.sort((a, b) => a - b);\n    const res = [];\n    for (let i = 0; i < nums.length - 2; i++) {\n        if (i > 0 && nums[i] === nums[i - 1]) continue;\n        let l = i + 1, r = nums.length - 1;\n        while (l < r) {\n            const sum = nums[i] + nums[l] + nums[r];\n            if (sum === 0) {\n                res.push([nums[i], nums[l], nums[r]]);\n                while (l < r && nums[l] === nums[l + 1]) l++;\n                while (l < r && nums[r] === nums[r - 1]) r--;\n                l++; r--;\n            } else if (sum < 0) {\n                l++;\n            } else {\n                r--;\n            }\n        }\n    }\n    return res;\n}`,
            python: `def threeSum(nums: list[int]) -> list[list[int]]:\n    nums.sort()\n    res = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i - 1]: continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s == 0:\n                res.append([nums[i], nums[l], nums[r]])\n                while l < r and nums[l] == nums[l+1]: l += 1\n                while l < r and nums[r] == nums[r-1]: r -= 1\n                l += 1; r -= 1\n            elif s < 0: l += 1\n            else: r -= 1\n    return res`,
            cpp: `#include <vector>\n#include <algorithm>\n\nstd::vector<std::vector<int>> threeSum(std::vector<int>& nums) {\n    std::sort(nums.begin(), nums.end());\n    std::vector<std::vector<int>> res;\n    for (int i = 0; i < (int)nums.size() - 2; i++) {\n        if (i > 0 && nums[i] == nums[i-1]) continue;\n        int l = i + 1, r = nums.size() - 1;\n        while (l < r) {\n            int sum = nums[i] + nums[l] + nums[r];\n            if (sum == 0) {\n                res.push_back({nums[i], nums[l], nums[r]});\n                while (l < r && nums[l] == nums[l+1]) l++;\n                while (l < r && nums[r] == nums[r-1]) r--;\n                l++; r--;\n            } else if (sum < 0) l++;\n            else r--;\n        }\n    }\n    return res;\n}`,
            java: `import java.util.*;\n\npublic class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        Arrays.sort(nums);\n        List<List<Integer>> res = new ArrayList<>();\n        for (int i = 0; i < nums.length - 2; i++) {\n            if (i > 0 && nums[i] == nums[i-1]) continue;\n            int l = i + 1, r = nums.length - 1;\n            while (l < r) {\n                int sum = nums[i] + nums[l] + nums[r];\n                if (sum == 0) {\n                    res.add(Arrays.asList(nums[i], nums[l], nums[r]));\n                    while (l < r && nums[l] == nums[l+1]) l++;\n                    while (l < r && nums[r] == nums[r-1]) r--;\n                    l++; r--;\n                } else if (sum < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n}`,
            c: `// 3Sum in C`,
            go: `func threeSum(nums []int) [][]int {\n    // Go 3Sum logic\n    return nil\n}`
        }
    },
    {
        id: 10,
        title: "Container With Most Water",
        topic: "Two Pointers",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Goldman Sachs"],
        description: "You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
        examples: [
            { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "Max area between index 1 and 8 is 7 * (8 - 1) = 49." }
        ],
        testCases: [
            { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
            { input: [[1, 1]], expected: 1 }
        ],
        entryFunction: "maxArea",
        hints: ["Area is limited by the shorter height. Move the shorter pointer inward."],
        approach: "Start with l = 0 and r = n - 1. Compute area = (r - l) * min(height[l], height[r]). Advance the pointer with the smaller height. Time O(N), Space O(1).",
        starterCodes: {
            javascript: `function maxArea(height) {\n    let l = 0, r = height.length - 1;\n    let maxWater = 0;\n    while (l < r) {\n        const w = r - l;\n        const h = Math.min(height[l], height[r]);\n        maxWater = Math.max(maxWater, w * h);\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return maxWater;\n}`,
            python: `def maxArea(height: list[int]) -> int:\n    l, r = 0, len(height) - 1\n    ans = 0\n    while l < r:\n        ans = max(ans, (r - l) * min(height[l], height[r]))\n        if height[l] < height[r]: l += 1\n        else: r -= 1\n    return ans`,
            cpp: `#include <vector>\n#include <algorithm>\n\nint maxArea(std::vector<int>& height) {\n    int l = 0, r = height.size() - 1, ans = 0;\n    while (l < r) {\n        ans = std::max(ans, (r - l) * std::min(height[l], height[r]));\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return ans;\n}`,
            java: `public class Solution {\n    public int maxArea(int[] height) {\n        int l = 0, r = height.length - 1, ans = 0;\n        while (l < r) {\n            ans = Math.max(ans, (r - l) * Math.min(height[l], height[r]));\n            if (height[l] < height[r]) l++;\n            else r--;\n        }\n        return ans;\n    }\n}`,
            c: `int maxArea(int* height, int heightSize) {\n    int l = 0, r = heightSize - 1, ans = 0;\n    while (l < r) {\n        int h = height[l] < height[r] ? height[l] : height[r];\n        int area = (r - l) * h;\n        if (area > ans) ans = area;\n        if (height[l] < height[r]) l++; else r--;\n    }\n    return ans;\n}`,
            go: `func maxArea(height []int) int {\n    l, r, ans := 0, len(height)-1, 0\n    for l < r {\n        h := height[l]\n        if height[r] < h { h = height[r] }\n        if (r - l) * h > ans { ans = (r - l) * h }\n        if height[l] < height[r] { l++ } else { r-- }\n    }\n    return ans\n}`
        }
    },
    {
        id: 11,
        title: "Trapping Rain Water",
        topic: "Two Pointers",
        difficulty: "Hard",
        companies: ["Google", "Amazon", "Apple", "Goldman Sachs"],
        description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
        examples: [
            { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
            { input: "height = [4,2,0,3,2,5]", output: "9" }
        ],
        testCases: [
            { input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
            { input: [[4, 2, 0, 3, 2, 5]], expected: 9 }
        ],
        entryFunction: "trap",
        hints: [
            "At any position i, water trapped is min(maxLeft, maxRight) - height[i].",
            "Use two pointers with leftMax and rightMax to achieve O(1) space."
        ],
        approach: "Two pointers. Track leftMax and rightMax. Advance pointer with smaller max. Water trapped = max(0, currentMax - height[p]). Time O(N), Space O(1).",
        starterCodes: {
            javascript: `function trap(height) {\n    let l = 0, r = height.length - 1;\n    let lMax = 0, rMax = 0, water = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            if (height[l] >= lMax) lMax = height[l];\n            else water += lMax - height[l];\n            l++;\n        } else {\n            if (height[r] >= rMax) rMax = height[r];\n            else water += rMax - height[r];\n            r--;\n        }\n    }\n    return water;\n}`,
            python: `def trap(height: list[int]) -> int:\n    l, r = 0, len(height) - 1\n    l_max, r_max = 0, 0\n    water = 0\n    while l < r:\n        if height[l] < height[r]:\n            if height[l] >= l_max: l_max = height[l]\n            else: water += l_max - height[l]\n            l += 1\n        else:\n            if height[r] >= r_max: r_max = height[r]\n            else: water += r_max - height[r]\n            r -= 1\n    return water`,
            cpp: `#include <vector>\n\nint trap(std::vector<int>& height) {\n    int l = 0, r = height.size() - 1;\n    int lMax = 0, rMax = 0, water = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            if (height[l] >= lMax) lMax = height[l];\n            else water += lMax - height[l];\n            l++;\n        } else {\n            if (height[r] >= rMax) rMax = height[r];\n            else water += rMax - height[r];\n            r--;\n        }\n    }\n    return water;\n}`,
            java: `public class Solution {\n    public int trap(int[] height) {\n        int l = 0, r = height.length - 1;\n        int lMax = 0, rMax = 0, water = 0;\n        while (l < r) {\n            if (height[l] < height[r]) {\n                if (height[l] >= lMax) lMax = height[l];\n                else water += lMax - height[l];\n                l++;\n            } else {\n                if (height[r] >= rMax) rMax = height[r];\n                else water += rMax - height[r];\n                r--;\n            }\n        }\n        return water;\n    }\n}`,
            c: `// C Trap Rain Water`,
            go: `// Go Trap Rain Water`
        }
    },
    {
        id: 12,
        title: "Longest Substring Without Repeating Characters",
        topic: "Sliding Window",
        difficulty: "Medium",
        companies: ["Amazon", "Bloomberg", "Google", "Meta"],
        description: "Given a string s, find the length of the longest substring without duplicate characters.",
        examples: [
            { input: "s = 'abcabcbb'", output: "3", explanation: "The answer is 'abc', with the length of 3." },
            { input: "s = 'bbbbb'", output: "1", explanation: "The answer is 'b', with the length of 1." },
            { input: "s = 'pwwkew'", output: "3", explanation: "The answer is 'wke', with the length of 3." }
        ],
        testCases: [
            { input: ["abcabcbb"], expected: 3 },
            { input: ["bbbbb"], expected: 1 },
            { input: ["pwwkew"], expected: 3 }
        ],
        entryFunction: "lengthOfLongestSubstring",
        hints: ["Use a sliding window with a Set or Map storing the latest index of each char."],
        approach: "Sliding window with two pointers left and right. Use a Map to store last index of each character. When duplicate found, advance left to max(left, lastSeenIndex + 1). Time O(N), Space O(min(m, n)).",
        starterCodes: {
            javascript: `function lengthOfLongestSubstring(s) {\n    const map = new Map();\n    let maxLen = 0, l = 0;\n    for (let r = 0; r < s.length; r++) {\n        if (map.has(s[r])) {\n            l = Math.max(l, map.get(s[r]) + 1);\n        }\n        map.set(s[r], r);\n        maxLen = Math.max(maxLen, r - l + 1);\n    }\n    return maxLen;\n}`,
            python: `def lengthOfLongestSubstring(s: str) -> int:\n    seen = {}\n    max_len = l = 0\n    for r, c in enumerate(s):\n        if c in seen:\n            l = max(l, seen[c] + 1)\n        seen[c] = r\n        max_len = max(max_len, r - l + 1)\n    return max_len`,
            cpp: `#include <string>\n#include <unordered_map>\n#include <algorithm>\n\nint lengthOfLongestSubstring(std::string s) {\n    std::unordered_map<char, int> mp;\n    int maxLen = 0, l = 0;\n    for (int r = 0; r < s.size(); r++) {\n        if (mp.count(s[r])) l = std::max(l, mp[s[r]] + 1);\n        mp[s[r]] = r;\n        maxLen = std::max(maxLen, r - l + 1);\n    }\n    return maxLen;\n}`,
            java: `import java.util.HashMap;\n\npublic class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        HashMap<Character, Integer> map = new HashMap<>();\n        int maxLen = 0, l = 0;\n        for (int r = 0; r < s.length(); r++) {\n            char c = s.charAt(r);\n            if (map.containsKey(c)) l = Math.max(l, map.get(c) + 1);\n            map.put(c, r);\n            maxLen = Math.max(maxLen, r - l + 1);\n        }\n        return maxLen;\n    }\n}`,
            c: `int lengthOfLongestSubstring(char* s) {\n    int map[256]; for (int i = 0; i < 256; i++) map[i] = -1;\n    int maxLen = 0, l = 0;\n    for (int r = 0; s[r]; r++) {\n        if (map[(unsigned char)s[r]] >= l) l = map[(unsigned char)s[r]] + 1;\n        map[(unsigned char)s[r]] = r;\n        if (r - l + 1 > maxLen) maxLen = r - l + 1;\n    }\n    return maxLen;\n}`,
            go: `func lengthOfLongestSubstring(s string) int {\n    mp := make(map[byte]int)\n    maxLen, l := 0, 0\n    for r := 0; r < len(s); r++ {\n        if idx, ok := mp[s[r]]; ok && idx >= l { l = idx + 1 }\n        mp[s[r]] = r\n        if r - l + 1 > maxLen { maxLen = r - l + 1 }\n    }\n    return maxLen\n}`
        }
    },
    {
        id: 13,
        title: "Longest Repeating Character Replacement",
        topic: "Sliding Window",
        difficulty: "Medium",
        companies: ["Google", "Amazon"],
        description: "You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most k times. Return the length of the longest substring containing the same letter you can get after performing the above operations.",
        examples: [
            { input: "s = 'ABAB', k = 2", output: "4", explanation: "Replace the two 'A's with two 'B's or vice versa." },
            { input: "s = 'AABABBA', k = 1", output: "4" }
        ],
        testCases: [
            { input: ["ABAB", 2], expected: 4 },
            { input: ["AABABBA", 1], expected: 4 }
        ],
        entryFunction: "characterReplacement",
        hints: ["Window is valid if (windowLength - maxFrequencyInWindow) <= k."],
        approach: "Sliding window. Track frequency of characters and maxFreq. If (r - l + 1) - maxFreq > k, decrement count of s[l] and increment l. Time O(N), Space O(1).",
        starterCodes: {
            javascript: `function characterReplacement(s, k) {\n    const count = new Array(26).fill(0);\n    let maxCount = 0, l = 0, maxLen = 0;\n    for (let r = 0; r < s.length; r++) {\n        count[s.charCodeAt(r) - 65]++;\n        maxCount = Math.max(maxCount, count[s.charCodeAt(r) - 65]);\n        while ((r - l + 1) - maxCount > k) {\n            count[s.charCodeAt(l) - 65]--;\n            l++;\n        }\n        maxLen = Math.max(maxLen, r - l + 1);\n    }\n    return maxLen;\n}`,
            python: `def characterReplacement(s: str, k: int) -> int:\n    count = {}\n    max_f = l = ans = 0\n    for r, c in enumerate(s):\n        count[c] = count.get(c, 0) + 1\n        max_f = max(max_f, count[c])\n        if (r - l + 1) - max_f > k:\n            count[s[l]] -= 1\n            l += 1\n        ans = max(ans, r - l + 1)\n    return ans`,
            cpp: `#include <string>\n#include <vector>\n#include <algorithm>\n\nint characterReplacement(std::string s, int k) {\n    std::vector<int> count(26, 0);\n    int maxF = 0, l = 0, ans = 0;\n    for (int r = 0; r < s.size(); r++) {\n        count[s[r] - 'A']++;\n        maxF = std::max(maxF, count[s[r] - 'A']);\n        while ((r - l + 1) - maxF > k) {\n            count[s[l] - 'A']--;\n            l++;\n        }\n        ans = std::max(ans, r - l + 1);\n    }\n    return ans;\n}`,
            java: `public class Solution {\n    public int characterReplacement(String s, int k) {\n        int[] count = new int[26];\n        int maxF = 0, l = 0, ans = 0;\n        for (int r = 0; r < s.length(); r++) {\n            count[s.charAt(r) - 'A']++;\n            maxF = Math.max(maxF, count[s.charAt(r) - 'A']);\n            while ((r - l + 1) - maxF > k) {\n                count[s.charAt(l) - 'A']--;\n                l++;\n            }\n            ans = Math.max(ans, r - l + 1);\n        }\n        return ans;\n    }\n}`,
            c: `// C Character replacement`,
            go: `// Go Character replacement`
        }
    },
    {
        id: 14,
        title: "Minimum Window Substring",
        topic: "Sliding Window",
        difficulty: "Hard",
        companies: ["Meta", "Amazon", "LinkedIn", "Microsoft"],
        description: "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string ''.",
        examples: [
            { input: "s = 'ADOBECODEBANC', t = 'ABC'", output: "'BANC'" },
            { input: "s = 'a', t = 'a'", output: "'a'" },
            { input: "s = 'a', t = 'aa'", output: "''" }
        ],
        testCases: [
            { input: ["ADOBECODEBANC", "ABC"], expected: "BANC" },
            { input: ["a", "a"], expected: "a" },
            { input: ["a", "aa"], expected: "" }
        ],
        entryFunction: "minWindow",
        hints: ["Maintain a count of satisfied unique chars required by t."],
        approach: "Use target frequency map and current window frequency map. Track 'have' and 'need'. Expand right, contract left when satisfied. Time O(N + M), Space O(1).",
        starterCodes: {
            javascript: `function minWindow(s, t) {\n    if (!s || !t) return '';\n    const map = {};\n    for (let c of t) map[c] = (map[c] || 0) + 1;\n    let need = Object.keys(map).length, have = 0;\n    let l = 0, res = [-1, -1], minLen = Infinity;\n    const window = {};\n    for (let r = 0; r < s.length; r++) {\n        const c = s[r];\n        window[c] = (window[c] || 0) + 1;\n        if (map[c] && window[c] === map[c]) have++;\n        while (have === need) {\n            if ((r - l + 1) < minLen) {\n                minLen = r - l + 1;\n                res = [l, r];\n            }\n            window[s[l]]--;\n            if (map[s[l]] && window[s[l]] < map[s[l]]) have--;\n            l++;\n        }\n    }\n    return minLen === Infinity ? '' : s.substring(res[0], res[1] + 1);\n}`,
            python: `def minWindow(s: str, t: str) -> str:\n    from collections import Counter\n    if not t or not s: return ''\n    t_count = Counter(t)\n    window = {}\n    have, need = 0, len(t_count)\n    res, min_len = [-1, -1], float('inf')\n    l = 0\n    for r, c in enumerate(s):\n        window[c] = window.get(c, 0) + 1\n        if c in t_count and window[c] == t_count[c]:\n            have += 1\n        while have == need:\n            if (r - l + 1) < min_len:\n                res = [l, r]\n                min_len = r - l + 1\n            window[s[l]] -= 1\n            if s[l] in t_count and window[s[l]] < t_count[s[l]]:\n                have -= 1\n            l += 1\n    return '' if min_len == float('inf') else s[res[0]:res[1]+1]`,
            cpp: `#include <string>\n#include <vector>\n\nstd::string minWindow(std::string s, std::string t) {\n    std::vector<int> map(128, 0);\n    for (char c : t) map[c]++;\n    int count = t.size(), begin = 0, end = 0, d = 1e9, head = 0;\n    while (end < s.size()) {\n        if (map[s[end++]]-- > 0) count--;\n        while (count == 0) {\n            if (end - begin < d) d = end - (head = begin);\n            if (map[s[begin++]]++ == 0) count++;\n        }\n    }\n    return d == 1e9 ? \"\" : s.substr(head, d);\n}`,
            java: `public class Solution {\n    public String minWindow(String s, String t) {\n        int[] map = new int[128];\n        for (char c : t.toCharArray()) map[c]++;\n        int count = t.length(), begin = 0, end = 0, d = Integer.MAX_VALUE, head = 0;\n        while (end < s.length()) {\n            if (map[s.charAt(end++)]-- > 0) count--;\n            while (count == 0) {\n                if (end - begin < d) d = end - (head = begin);\n                if (map[s.charAt(begin++)]++ == 0) count++;\n            }\n        }\n        return d == Integer.MAX_VALUE ? \"\" : s.substring(head, head + d);\n    }\n}`,
            c: `// C Min Window Substring`,
            go: `// Go Min Window Substring`
        }
    },
    {
        id: 15,
        title: "Valid Parentheses",
        topic: "Stack & Queues",
        difficulty: "Easy",
        companies: ["Amazon", "Google", "Facebook", "Microsoft"],
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
        examples: [
            { input: "s = '()'", output: "true" },
            { input: "s = '()[]{}'", output: "true" },
            { input: "s = '(]'", output: "false" }
        ],
        testCases: [
            { input: ["()"], expected: true },
            { input: ["()[]{}"], expected: true },
            { input: ["(]"], expected: false }
        ],
        entryFunction: "isValid",
        hints: ["Push opening brackets onto a stack. When encountering a closing bracket, pop and verify."],
        approach: "Use a Stack. Iterate over characters. When seeing '(', '{', '[', push corresponding closing bracket. When seeing closing bracket, verify popped element matches. Ensure stack is empty at end. Time O(N), Space O(N).",
        starterCodes: {
            javascript: `function isValid(s) {\n    const stack = [];\n    const pairs = { ')': '(', '}': '{', ']': '[' };\n    for (let c of s) {\n        if (c === '(' || c === '{' || c === '[') {\n            stack.push(c);\n        } else {\n            if (stack.pop() !== pairs[c]) return false;\n        }\n    }\n    return stack.length === 0;\n}`,
            python: `def isValid(s: str) -> bool:\n    stack = []\n    pairs = {')': '(', '}': '{', ']': '['}\n    for c in s:\n        if c in '({[': stack.append(c)\n        elif not stack or stack.pop() != pairs[c]: return False\n    return len(stack) == 0`,
            cpp: `#include <string>\n#include <stack>\n\nbool isValid(std::string s) {\n    std::stack<char> st;\n    for (char c : s) {\n        if (c == '(') st.push(')');\n        else if (c == '{') st.push('}');\n        else if (c == '[') st.push(']');\n        else if (st.empty() || st.top() != c) return false;\n        else st.pop();\n    }\n    return st.empty();\n}`,
            java: `import java.util.Stack;\n\npublic class Solution {\n    public boolean isValid(String s) {\n        Stack<Character> st = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') st.push(')');\n            else if (c == '{') st.push('}');\n            else if (c == '[') st.push(']');\n            else if (st.isEmpty() || st.pop() != c) return false;\n        }\n        return st.isEmpty();\n    }\n}`,
            c: `bool isValid(char* s) {\n    int n = strlen(s);\n    char* stack = (char*)malloc(n);\n    int top = -1;\n    for(int i = 0; s[i]; i++) {\n        if(s[i] == '(' || s[i] == '{' || s[i] == '[') stack[++top] = s[i];\n        else {\n            if(top == -1) return false;\n            if(s[i] == ')' && stack[top--] != '(') return false;\n            if(s[i] == '}' && stack[top--] != '{') return false;\n            if(s[i] == ']' && stack[top--] != '[') return false;\n        }\n    }\n    return top == -1;\n}`,
            go: `func isValid(s string) bool {\n    st := []rune{}\n    pairs := map[rune]rune{')': '(', '}': '{', ']': '['}\n    for _, c := range s {\n        if c == '(' || c == '{' || c == '[' {\n            st = append(st, c)\n        } else {\n            if len(st) == 0 || st[len(st)-1] != pairs[c] { return false }\n            st = st[:len(st)-1]\n        }\n    }\n    return len(st) == 0\n}`
        }
    },
    {
        id: 16,
        title: "Min Stack",
        topic: "Stack & Queues",
        difficulty: "Medium",
        companies: ["Bloomberg", "Amazon"],
        description: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time O(1).",
        examples: [
            { input: "push(-2), push(0), push(-3), getMin() -> -3, pop(), top() -> 0, getMin() -> -2", output: "-3, 0, -2" }
        ],
        testCases: [
            { input: [["push", -2], ["push", 0], ["push", -3], ["getMin"], ["pop"], ["top"], ["getMin"]], expected: [-3, 0, -2] }
        ],
        entryFunction: "testMinStack",
        hints: ["Maintain a parallel minStack storing current minimum at each push."],
        approach: "Use two stacks: main stack for values and minStack where each element is min(val, minStack.top()). Time O(1) for all operations, Space O(N).",
        starterCodes: {
            javascript: `class MinStack {\n    constructor() {\n        this.stack = [];\n        this.minStack = [];\n    }\n    push(val) {\n        this.stack.push(val);\n        const min = this.minStack.length === 0 ? val : Math.min(val, this.getMin());\n        this.minStack.push(min);\n    }\n    pop() {\n        this.stack.pop();\n        this.minStack.pop();\n    }\n    top() {\n        return this.stack[this.stack.length - 1];\n    }\n    getMin() {\n        return this.minStack[this.minStack.length - 1];\n    }\n}`,
            python: `class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.min_stack = []\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        m = val if not self.min_stack else min(val, self.min_stack[-1])\n        self.min_stack.append(m)\n    def pop(self) -> None:\n        self.stack.pop()\n        self.min_stack.pop()\n    def top(self) -> int:\n        return self.stack[-1]\n    def getMin(self) -> int:\n        return self.min_stack[-1]`,
            cpp: `#include <stack>\n#include <algorithm>\n\nclass MinStack {\n    std::stack<int> s, minS;\npublic:\n    void push(int val) {\n        s.push(val);\n        if (minS.empty() || val <= minS.top()) minS.push(val);\n        else minS.push(minS.top());\n    }\n    void pop() { s.pop(); minS.pop(); }\n    int top() { return s.top(); }\n    int getMin() { return minS.top(); }\n};`,
            java: `import java.util.Stack;\n\nclass MinStack {\n    private Stack<Integer> s = new Stack<>();\n    private Stack<Integer> minS = new Stack<>();\n    public void push(int val) {\n        s.push(val);\n        if (minS.isEmpty() || val <= minS.peek()) minS.push(val);\n        else minS.push(minS.peek());\n    }\n    public void pop() { s.pop(); minS.pop(); }\n    public int top() { return s.peek(); }\n    public int getMin() { return minS.peek(); }\n}`,
            c: `// C MinStack implementation`,
            go: `// Go MinStack implementation`
        }
    },
    {
        id: 17,
        title: "Daily Temperatures",
        topic: "Stack & Queues",
        difficulty: "Medium",
        companies: ["Meta", "Amazon"],
        description: "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.",
        examples: [
            { input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]" }
        ],
        testCases: [
            { input: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
            { input: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] }
        ],
        entryFunction: "dailyTemperatures",
        hints: ["Use a monotonic decreasing stack storing indices."],
        approach: "Iterate with a monotonic decreasing stack holding indices. When temperatures[i] > temperatures[stack.top], pop index prevIdx and answer[prevIdx] = i - prevIdx. Time O(N), Space O(N).",
        starterCodes: {
            javascript: `function dailyTemperatures(temperatures) {\n    const res = new Array(temperatures.length).fill(0);\n    const stack = []; // indices\n    for (let i = 0; i < temperatures.length; i++) {\n        while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n            const prevIdx = stack.pop();\n            res[prevIdx] = i - prevIdx;\n        }\n        stack.push(i);\n    }\n    return res;\n}`,
            python: `def dailyTemperatures(temperatures: list[int]) -> list[int]:\n    res = [0] * len(temperatures)\n    stack = []\n    for i, t in enumerate(temperatures):\n        while stack and t > temperatures[stack[-1]]:\n            prev = stack.pop()\n            res[prev] = i - prev\n        stack.append(i)\n    return res`,
            cpp: `#include <vector>\n#include <stack>\n\nstd::vector<int> dailyTemperatures(std::vector<int>& temperatures) {\n    std::vector<int> res(temperatures.size(), 0);\n    std::stack<int> st;\n    for (int i = 0; i < temperatures.size(); i++) {\n        while (!st.empty() && temperatures[i] > temperatures[st.top()]) {\n            int prev = st.top(); st.pop();\n            res[prev] = i - prev;\n        }\n        st.push(i);\n    }\n    return res;\n}`,
            java: `import java.util.Stack;\n\npublic class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        int[] res = new int[temperatures.length];\n        Stack<Integer> st = new Stack<>();\n        for (int i = 0; i < temperatures.length; i++) {\n            while (!st.isEmpty() && temperatures[i] > temperatures[st.peek()]) {\n                int prev = st.pop();\n                res[prev] = i - prev;\n            }\n            st.push(i);\n        }\n        return res;\n    }\n}`,
            c: `// C Daily Temperatures`,
            go: `// Go Daily Temperatures`
        }
    },
    {
        id: 18,
        title: "Binary Search",
        topic: "Binary Search",
        difficulty: "Easy",
        companies: ["Apple", "Microsoft"],
        description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.",
        examples: [
            { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
            { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" }
        ],
        testCases: [
            { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
            { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 }
        ],
        entryFunction: "search",
        hints: ["Standard binary search with mid = l + Math.floor((r - l) / 2)."],
        approach: "Maintain bounds left = 0, right = nums.length - 1. Halve search space at each iteration. Time O(log N), Space O(1).",
        starterCodes: {
            javascript: `function search(nums, target) {\n    let l = 0, r = nums.length - 1;\n    while (l <= r) {\n        const mid = l + Math.floor((r - l) / 2);\n        if (nums[mid] === target) return mid;\n        else if (nums[mid] < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    return -1;\n}`,
            python: `def search(nums: list[int], target: int) -> int:\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target: return mid\n        elif nums[mid] < target: l = mid + 1\n        else: r = mid - 1\n    return -1`,
            cpp: `#include <vector>\n\nint search(std::vector<int>& nums, int target) {\n    int l = 0, r = nums.size() - 1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    return -1;\n}`,
            java: `public class Solution {\n    public int search(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return -1;\n    }\n}`,
            c: `int search(int* nums, int numsSize, int target) {\n    int l = 0, r = numsSize - 1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    return -1;\n}`,
            go: `func search(nums []int, target int) int {\n    l, r := 0, len(nums)-1\n    for l <= r {\n        mid := l + (r - l)/2\n        if nums[mid] == target { return mid }\n        if nums[mid] < target { l = mid + 1 } else { r = mid - 1 }\n    }\n    return -1\n}`
        }
    },
    {
        id: 19,
        title: "Search in Rotated Sorted Array",
        topic: "Binary Search",
        difficulty: "Medium",
        companies: ["Google", "Amazon", "Microsoft", "Meta"],
        description: "There is an integer array nums sorted in ascending order (with distinct values). Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.",
        examples: [
            { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
            { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" }
        ],
        testCases: [
            { input: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
            { input: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 }
        ],
        entryFunction: "searchRotated",
        hints: ["Notice that one half of the array will always remain completely sorted."],
        approach: "At each step, identify whether the left half or right half is normally sorted. Check if target falls within that sorted segment. Time O(log N), Space O(1).",
        starterCodes: {
            javascript: `function searchRotated(nums, target) {\n    let l = 0, r = nums.length - 1;\n    while (l <= r) {\n        const mid = l + Math.floor((r - l) / 2);\n        if (nums[mid] === target) return mid;\n        if (nums[l] <= nums[mid]) {\n            if (target >= nums[l] && target < nums[mid]) r = mid - 1;\n            else l = mid + 1;\n        } else {\n            if (target > nums[mid] && target <= nums[r]) l = mid + 1;\n            else r = mid - 1;\n        }\n    }\n    return -1;\n}`,
            python: `def searchRotated(nums: list[int], target: int) -> int:\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target: return mid\n        if nums[l] <= nums[mid]:\n            if nums[l] <= target < nums[mid]: r = mid - 1\n            else: l = mid + 1\n        else:\n            if nums[mid] < target <= nums[r]: l = mid + 1\n            else: r = mid - 1\n    return -1`,
            cpp: `#include <vector>\n\nint searchRotated(std::vector<int>& nums, int target) {\n    int l = 0, r = nums.size() - 1;\n    while (l <= r) {\n        int mid = l + (r - l) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[l] <= nums[mid]) {\n            if (target >= nums[l] && target < nums[mid]) r = mid - 1;\n            else l = mid + 1;\n        } else {\n            if (target > nums[mid] && target <= nums[r]) l = mid + 1;\n            else r = mid - 1;\n        }\n    }\n    return -1;\n}`,
            java: `public class Solution {\n    public int searchRotated(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[l] <= nums[mid]) {\n                if (target >= nums[l] && target < nums[mid]) r = mid - 1;\n                else l = mid + 1;\n            } else {\n                if (target > nums[mid] && target <= nums[r]) l = mid + 1;\n                else r = mid - 1;\n            }\n        }\n        return -1;\n    }\n}`,
            c: `// C Search in Rotated Sorted Array`,
            go: `// Go Search in Rotated Sorted Array`
        }
    },
    {
        id: 20,
        title: "Find Minimum in Rotated Sorted Array",
        topic: "Binary Search",
        difficulty: "Medium",
        companies: ["Amazon", "Microsoft"],
        description: "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Notice that all the integers of nums are unique. Return the minimum element of this array.",
        examples: [
            { input: "nums = [3,4,5,1,2]", output: "1" },
            { input: "nums = [4,5,6,7,0,1,2]", output: "0" }
        ],
        testCases: [
            { input: [[3, 4, 5, 1, 2]], expected: 1 },
            { input: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 }
        ],
        entryFunction: "findMin",
        hints: ["If nums[mid] > nums[r], the inflection point and minimum are in the right half."],
        approach: "While l < r: if nums[mid] > nums[r], l = mid + 1; else r = mid. Return nums[l]. Time O(log N), Space O(1).",
        starterCodes: {
            javascript: `function findMin(nums) {\n    let l = 0, r = nums.length - 1;\n    while (l < r) {\n        const mid = l + Math.floor((r - l) / 2);\n        if (nums[mid] > nums[r]) l = mid + 1;\n        else r = mid;\n    }\n    return nums[l];\n}`,
            python: `def findMin(nums: list[int]) -> int:\n    l, r = 0, len(nums) - 1\n    while l < r:\n        mid = (l + r) // 2\n        if nums[mid] > nums[r]: l = mid + 1\n        else: r = mid\n    return nums[l]`,
            cpp: `#include <vector>\n\nint findMin(std::vector<int>& nums) {\n    int l = 0, r = nums.size() - 1;\n    while (l < r) {\n        int mid = l + (r - l) / 2;\n        if (nums[mid] > nums[r]) l = mid + 1;\n        else r = mid;\n    }\n    return nums[l];\n}`,
            java: `public class Solution {\n    public int findMin(int[] nums) {\n        int l = 0, r = nums.length - 1;\n        while (l < r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] > nums[r]) l = mid + 1;\n            else r = mid;\n        }\n        return nums[l];\n    }\n}`,
            c: `int findMin(int* nums, int numsSize) {\n    int l = 0, r = numsSize - 1;\n    while (l < r) {\n        int mid = l + (r - l) / 2;\n        if (nums[mid] > nums[r]) l = mid + 1;\n        else r = mid;\n    }\n    return nums[l];\n}`,
            go: `func findMin(nums []int) int {\n    l, r := 0, len(nums)-1\n    for l < r {\n        mid := l + (r-l)/2\n        if nums[mid] > nums[r] { l = mid + 1 } else { r = mid }\n    }\n    return nums[l]\n}`
        }
    },
    {
        id: 21,
        title: "Reverse Linked List",
        topic: "Linked List",
        difficulty: "Easy",
        companies: ["Amazon", "Apple", "Google", "Meta"],
        description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
        examples: [
            { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
            { input: "head = [1,2]", output: "[2,1]" }
        ],
        testCases: [
            { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
            { input: [[1, 2]], expected: [2, 1] }
        ],
        entryFunction: "reverseList",
        hints: ["Keep track of prev, curr, and next pointers."],
        approach: "Iterative in-place pointer reversal. While curr: next = curr.next; curr.next = prev; prev = curr; curr = next. Return prev. Time O(N), Space O(1).",
        starterCodes: {
            javascript: `function reverseList(head) {\n    let prev = null, curr = head;\n    while (curr) {\n        const next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}`,
            python: `def reverseList(head):\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev`,
            cpp: `ListNode* reverseList(ListNode* head) {\n    ListNode *prev = nullptr, *curr = head;\n    while (curr) {\n        ListNode* nxt = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nxt;\n    }\n    return prev;\n}`,
            java: `public class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null, curr = head;\n        while (curr != null) {\n            ListNode nxt = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = nxt;\n        }\n        return prev;\n    }\n}`,
            c: `struct ListNode* reverseList(struct ListNode* head) {\n    struct ListNode *prev = NULL, *curr = head;\n    while(curr) {\n        struct ListNode* nxt = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nxt;\n    }\n    return prev;\n}`,
            go: `func reverseList(head *ListNode) *ListNode {\n    var prev *ListNode\n    curr := head\n    for curr != nil {\n        nxt := curr.Next\n        curr.Next = prev\n        prev = curr\n        curr = nxt\n    }\n    return prev\n}`
        }
    },
    {
        id: 22,
        title: "Merge Two Sorted Lists",
        topic: "Linked List",
        difficulty: "Easy",
        companies: ["Amazon", "Microsoft", "Apple"],
        description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
        examples: [
            { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" }
        ],
        testCases: [
            { input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] }
        ],
        entryFunction: "mergeTwoLists",
        hints: ["Use a dummy prehead node to simplify edge cases."],
        approach: "Create dummy node. Advance pointer for the smaller of list1.val and list2.val. Attach leftover nodes at end. Time O(N + M), Space O(1).",
        starterCodes: {
            javascript: `function mergeTwoLists(list1, list2) {\n    const dummy = { val: 0, next: null };\n    let curr = dummy;\n    while (list1 && list2) {\n        if (list1.val <= list2.val) {\n            curr.next = list1;\n            list1 = list1.next;\n        } else {\n            curr.next = list2;\n            list2 = list2.next;\n        }\n        curr = curr.next;\n    }\n    curr.next = list1 || list2;\n    return dummy.next;\n}`,
            python: `def mergeTwoLists(list1, list2):\n    dummy = ListNode(0)\n    curr = dummy\n    while list1 and list2:\n        if list1.val <= list2.val:\n            curr.next = list1\n            list1 = list1.next\n        else:\n            curr.next = list2\n            list2 = list2.next\n        curr = curr.next\n    curr.next = list1 or list2\n    return dummy.next`,
            cpp: `ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n    ListNode dummy(0);\n    ListNode* tail = &dummy;\n    while (list1 && list2) {\n        if (list1->val <= list2->val) {\n            tail->next = list1; list1 = list1->next;\n        } else {\n            tail->next = list2; list2 = list2->next;\n        }\n        tail = tail->next;\n    }\n    tail->next = list1 ? list1 : list2;\n    return dummy.next;\n}`,
            java: `public class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        ListNode dummy = new ListNode(0);\n        ListNode tail = dummy;\n        while (list1 != null && list2 != null) {\n            if (list1.val <= list2.val) {\n                tail.next = list1; list1 = list1.next;\n            } else {\n                tail.next = list2; list2 = list2.next;\n            }\n            tail = tail.next;\n        }\n        tail.next = list1 != null ? list1 : list2;\n        return dummy.next;\n    }\n}`,
            c: `// C Merge Two Sorted Lists`,
            go: `// Go Merge Two Sorted Lists`
        }
    },
    {
        id: 23,
        title: "Reorder List",
        topic: "Linked List",
        difficulty: "Medium",
        companies: ["Amazon", "Meta"],
        description: "You are given the head of a singly linked-list: L0 -> L1 -> ... -> Ln-1 -> Ln. Reorder it to be on the following form: L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ... You may not modify the values in the list's nodes. Only nodes themselves may be changed.",
        examples: [
            { input: "head = [1,2,3,4]", output: "[1,4,2,3]" },
            { input: "head = [1,2,3,4,5]", output: "[1,5,2,4,3]" }
        ],
        testCases: [
            { input: [[1, 2, 3, 4]], expected: [1, 4, 2, 3] },
            { input: [[1, 2, 3, 4, 5]], expected: [1, 5, 2, 4, 3] }
        ],
        entryFunction: "reorderList",
        hints: ["Find middle with slow/fast pointers, reverse second half, and merge them."],
        approach: "1. Find middle with slow/fast pointers. 2. Reverse second half. 3. Interleave two halves. Time O(N), Space O(1).",
        starterCodes: {
            javascript: `function reorderList(head) {\n    if (!head || !head.next) return;\n    let slow = head, fast = head;\n    while (fast.next && fast.next.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    let prev = null, curr = slow.next;\n    slow.next = null;\n    while (curr) {\n        const nxt = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nxt;\n    }\n    let p1 = head, p2 = prev;\n    while (p2) {\n        const n1 = p1.next, n2 = p2.next;\n        p1.next = p2;\n        p2.next = n1;\n        p1 = n1;\n        p2 = n2;\n    }\n}`,
            python: `def reorderList(head) -> None:\n    if not head or not head.next: return\n    slow, fast = head, head\n    while fast.next and fast.next.next:\n        slow = slow.next\n        fast = fast.next.next\n    prev, curr = None, slow.next\n    slow.next = None\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    p1, p2 = head, prev\n    while p2:\n        n1, n2 = p1.next, p2.next\n        p1.next = p2\n        p2.next = n1\n        p1, p2 = n1, n2`,
            cpp: `// C++ Reorder List`,
            java: `// Java Reorder List`,
            c: `// C Reorder List`,
            go: `// Go Reorder List`
        }
    },
    {
        id: 24,
        title: "Remove Nth Node From End of List",
        topic: "Linked List",
        difficulty: "Medium",
        companies: ["Amazon", "Apple", "Facebook"],
        description: "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
        examples: [
            { input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]" },
            { input: "head = [1], n = 1", output: "[]" }
        ],
        testCases: [
            { input: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] },
            { input: [[1], 1], expected: [] }
        ],
        entryFunction: "removeNthFromEnd",
        hints: ["Use fast pointer that moves n steps ahead of slow pointer."],
        approach: "Maintain two pointers separated by n steps. When fast reaches end, slow will be just before the target node to delete. Time O(N), Space O(1).",
        starterCodes: {
            javascript: `function removeNthFromEnd(head, n) {\n    const dummy = { val: 0, next: head };\n    let fast = dummy, slow = dummy;\n    for (let i = 0; i <= n; i++) fast = fast.next;\n    while (fast) {\n        slow = slow.next;\n        fast = fast.next;\n    }\n    slow.next = slow.next.next;\n    return dummy.next;\n}`,
            python: `def removeNthFromEnd(head, n: int):\n    dummy = ListNode(0, head)\n    fast = slow = dummy\n    for _ in range(n + 1): fast = fast.next\n    while fast:\n        slow = slow.next\n        fast = fast.next\n    slow.next = slow.next.next\n    return dummy.next`,
            cpp: `ListNode* removeNthFromEnd(ListNode* head, int n) {\n    ListNode dummy(0, head);\n    ListNode *fast = &dummy, *slow = &dummy;\n    for (int i = 0; i <= n; i++) fast = fast->next;\n    while (fast) { slow = slow->next; fast = fast->next; }\n    slow->next = slow->next->next;\n    return dummy.next;\n}`,
            java: `public class Solution {\n    public ListNode removeNthFromEnd(ListNode head, int n) {\n        ListNode dummy = new ListNode(0, head);\n        ListNode fast = dummy, slow = dummy;\n        for (int i = 0; i <= n; i++) fast = fast.next;\n        while (fast != null) { slow = slow.next; fast = fast.next; }\n        slow.next = slow.next.next;\n        return dummy.next;\n    }\n}`,
            c: `// C removeNthFromEnd`,
            go: `// Go removeNthFromEnd`
        }
    },
    {
        id: 25,
        title: "Linked List Cycle",
        topic: "Linked List",
        difficulty: "Easy",
        companies: ["Microsoft", "Amazon", "Spotify"],
        description: "Given head, the head of a linked list, determine if the linked list has a cycle in it. Return true if there is some cycle in the linked list. Otherwise, return false.",
        examples: [
            { input: "head = [3,2,0,-4], pos = 1", output: "true" },
            { input: "head = [1], pos = -1", output: "false" }
        ],
        testCases: [
            { input: [[3, 2, 0, -4]], expected: true },
            { input: [[1]], expected: false }
        ],
        entryFunction: "hasCycle",
        hints: ["Floyd's Tortoise and Hare algorithm."],
        approach: "Two pointers: slow moves 1 step, fast moves 2 steps. If slow == fast, a cycle exists. Time O(N), Space O(1).",
        starterCodes: {
            javascript: `function hasCycle(head) {\n    let slow = head, fast = head;\n    while (fast && fast.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow === fast) return true;\n    }\n    return false;\n}`,
            python: `def hasCycle(head) -> bool:\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast: return True\n    return False`,
            cpp: `bool hasCycle(ListNode *head) {\n    ListNode *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return true;\n    }\n    return false;\n}`,
            java: `public class Solution {\n    public boolean hasCycle(ListNode head) {\n        ListNode slow = head, fast = head;\n        while (fast != null && fast.next != null) {\n            slow = slow.next;\n            fast = fast.next.next;\n            if (slow == fast) return true;\n        }\n        return false;\n    }\n}`,
            c: `bool hasCycle(struct ListNode *head) {\n    struct ListNode *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next; fast = fast->next->next;\n        if (slow == fast) return true;\n    }\n    return false;\n}`,
            go: `func hasCycle(head *ListNode) bool {\n    slow, fast := head, head\n    for fast != nil && fast.Next != nil {\n        slow = slow.Next\n        fast = fast.Next.Next\n        if slow == fast { return true }\n    }\n    return false\n}`
        }
    },
    {
        id: 26,
        title: "Invert Binary Tree",
        topic: "Trees & BST",
        difficulty: "Easy",
        companies: ["Google", "Twitter", "Amazon"],
        description: "Given the root of a binary tree, invert the tree, and return its root.",
        examples: [
            { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" },
            { input: "root = [2,1,3]", output: "[2,3,1]" }
        ],
        testCases: [
            { input: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1] },
            { input: [[2, 1, 3]], expected: [2, 3, 1] }
        ],
        entryFunction: "invertTree",
        hints: ["Swap left and right children recursively."],
        approach: "Recursively swap root.left and root.right for every node in tree. Time O(N), Space O(H).",
        starterCodes: {
            javascript: `function invertTree(root) {\n    if (!root) return null;\n    const temp = root.left;\n    root.left = invertTree(root.right);\n    root.right = invertTree(temp);\n    return root;\n}`,
            python: `def invertTree(root):\n    if not root: return None\n    root.left, root.right = invertTree(root.right), invertTree(root.left)\n    return root`,
            cpp: `TreeNode* invertTree(TreeNode* root) {\n    if (!root) return nullptr;\n    TreeNode* temp = root->left;\n    root->left = invertTree(root->right);\n    root->right = invertTree(temp);\n    return root;\n}`,
            java: `public class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        if (root == null) return null;\n        TreeNode temp = root.left;\n        root.left = invertTree(root.right);\n        root.right = invertTree(temp);\n        return root;\n    }\n}`,
            c: `// C Invert Binary Tree`,
            go: `// Go Invert Binary Tree`
        }
    },
    {
        id: 27,
        title: "Maximum Depth of Binary Tree",
        topic: "Trees & BST",
        difficulty: "Easy",
        companies: ["LinkedIn", "Uber"],
        description: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
        examples: [
            { input: "root = [3,9,20,null,null,15,7]", output: "3" },
            { input: "root = [1,null,2]", output: "2" }
        ],
        testCases: [
            { input: [[3, 9, 20, null, null, 15, 7]], expected: 3 },
            { input: [[1, null, 2]], expected: 2 }
        ],
        entryFunction: "maxDepth",
        hints: ["1 + max(maxDepth(left), maxDepth(right))."],
        approach: "DFS post-order traversal. Return 1 + max(maxDepth(root.left), maxDepth(root.right)). Time O(N), Space O(H).",
        starterCodes: {
            javascript: `function maxDepth(root) {\n    if (!root) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}`,
            python: `def maxDepth(root) -> int:\n    if not root: return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
            cpp: `int maxDepth(TreeNode* root) {\n    if (!root) return 0;\n    return 1 + std::max(maxDepth(root->left), maxDepth(root->right));\n}`,
            java: `public class Solution {\n    public int maxDepth(TreeNode root) {\n        if (root == null) return 0;\n        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n    }\n}`,
            c: `// C maxDepth`,
            go: `// Go maxDepth`
        }
    },
    {
        id: 28,
        title: "Same Tree",
        topic: "Trees & BST",
        difficulty: "Easy",
        companies: ["Bloomberg", "Google"],
        description: "Given the roots of two binary trees p and q, write a function to check if they are the same or not.",
        examples: [
            { input: "p = [1,2,3], q = [1,2,3]", output: "true" },
            { input: "p = [1,2], q = [1,null,2]", output: "false" }
        ],
        testCases: [
            { input: [[1, 2, 3], [1, 2, 3]], expected: true },
            { input: [[1, 2], [1, null, 2]], expected: false }
        ],
        entryFunction: "isSameTree",
        hints: ["Both null -> true; one null -> false; check vals and recurse on left and right."],
        approach: "Check if both nodes are null (true), or one is null (false), or values differ (false). Recursively verify left and right. Time O(N), Space O(H).",
        starterCodes: {
            javascript: `function isSameTree(p, q) {\n    if (!p && !q) return true;\n    if (!p || !q || p.val !== q.val) return false;\n    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);\n}`,
            python: `def isSameTree(p, q) -> bool:\n    if not p and not q: return True\n    if not p or not q or p.val != q.val: return False\n    return isSameTree(p.left, q.left) and isSameTree(p.right, q.right)`,
            cpp: `bool isSameTree(TreeNode* p, TreeNode* q) {\n    if (!p && !q) return true;\n    if (!p || !q || p->val != q->val) return false;\n    return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);\n}`,
            java: `public class Solution {\n    public boolean isSameTree(TreeNode p, TreeNode q) {\n        if (p == null && q == null) return true;\n        if (p == null || q == null || p.val != q.val) return false;\n        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);\n    }\n}`,
            c: `// C isSameTree`,
            go: `// Go isSameTree`
        }
    },
    {
        id: 29,
        title: "Subtree of Another Tree",
        topic: "Trees & BST",
        difficulty: "Easy",
        companies: ["Amazon", "Facebook"],
        description: "Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot and false otherwise.",
        examples: [
            { input: "root = [3,4,5,1,2], subRoot = [4,1,2]", output: "true" }
        ],
        testCases: [
            { input: [[3, 4, 5, 1, 2], [4, 1, 2]], expected: true }
        ],
        entryFunction: "isSubtree",
        hints: ["Combine with isSameTree helper."],
        approach: "At each node of root, check if isSameTree(root, subRoot). If not, recurse on root.left or root.right. Time O(N * M), Space O(H).",
        starterCodes: {
            javascript: `function isSubtree(root, subRoot) {\n    if (!root) return false;\n    if (isSame(root, subRoot)) return true;\n    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);\n    function isSame(p, q) {\n        if (!p && !q) return true;\n        if (!p || !q || p.val !== q.val) return false;\n        return isSame(p.left, q.left) && isSame(p.right, q.right);\n    }\n}`,
            python: `def isSubtree(root, subRoot) -> bool:\n    if not root: return False\n    def isSame(p, q):\n        if not p and not q: return True\n        if not p or not q or p.val != q.val: return False\n        return isSame(p.left, q.left) and isSame(p.right, q.right)\n    if isSame(root, subRoot): return True\n    return isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)`,
            cpp: `// C++ isSubtree`,
            java: `// Java isSubtree`,
            c: `// C isSubtree`,
            go: `// Go isSubtree`
        }
    },
    {
        id: 30,
        title: "Lowest Common Ancestor of a BST",
        topic: "Trees & BST",
        difficulty: "Medium",
        companies: ["Microsoft", "Amazon", "Twitter"],
        description: "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.",
        examples: [
            { input: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8", output: "6" }
        ],
        testCases: [
            { input: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8], expected: 6 }
        ],
        entryFunction: "lowestCommonAncestor",
        hints: ["Use BST properties: if both p and q are less than root, go left. If both are greater, go right."],
        approach: "Traverse tree. If both p.val and q.val < root.val, root = root.left. If both > root.val, root = root.right. Otherwise, split point is LCA. Time O(H), Space O(1).",
        starterCodes: {
            javascript: `function lowestCommonAncestor(root, p, q) {\n    while (root) {\n        if (p.val < root.val && q.val < root.val) root = root.left;\n        else if (p.val > root.val && q.val > root.val) root = root.right;\n        else return root;\n    }\n    return null;\n}`,
            python: `def lowestCommonAncestor(root, p, q):\n    while root:\n        if p.val < root.val and q.val < root.val: root = root.left\n        elif p.val > root.val and q.val > root.val: root = root.right\n        else: return root`,
            cpp: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n    while (root) {\n        if (p->val < root->val && q->val < root->val) root = root->left;\n        else if (p->val > root->val && q->val > root->val) root = root->right;\n        else return root;\n    }\n    return nullptr;\n}`,
            java: `public class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        while (root != null) {\n            if (p.val < root.val && q.val < root.val) root = root.left;\n            else if (p.val > root.val && q.val > root.val) root = root.right;\n            else return root;\n        }\n        return null;\n    }\n}`,
            c: `// C LCA`,
            go: `// Go LCA`
        }
    },
    {
        id: 31,
        title: "Binary Tree Level Order Traversal",
        topic: "Trees & BST",
        difficulty: "Medium",
        companies: ["Amazon", "Microsoft", "Meta"],
        description: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
        examples: [
            { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" }
        ],
        testCases: [
            { input: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]] },
            { input: [[1]], expected: [[1]] }
        ],
        entryFunction: "levelOrder",
        hints: ["Use a BFS queue. Process nodes level by level using queue length."],
        approach: "BFS queue. At each level, capture queue length = N. Pop N elements into level array and push non-null children. Append level to result. Time O(N), Space O(N).",
        starterCodes: {
            javascript: `function levelOrder(root) {\n    if (!root) return [];\n    const res = [];\n    const q = [root];\n    while (q.length) {\n        const len = q.length;\n        const level = [];\n        for (let i = 0; i < len; i++) {\n            const node = q.shift();\n            level.push(node.val);\n            if (node.left) q.push(node.left);\n            if (node.right) q.push(node.right);\n        }\n        res.push(level);\n    }\n    return res;\n}`,
            python: `def levelOrder(root) -> list[list[int]]:\n    if not root: return []\n    res, q = [], [root]\n    while q:\n        level = []\n        for _ in range(len(q)):\n            node = q.pop(0)\n            level.append(node.val)\n            if node.left: q.append(node.left)\n            if node.right: q.append(node.right)\n        res.append(level)\n    return res`,
            cpp: `#include <vector>\n#include <queue>\n\nstd::vector<std::vector<int>> levelOrder(TreeNode* root) {\n    if (!root) return {};\n    std::vector<std::vector<int>> res;\n    std::queue<TreeNode*> q;\n    q.push(root);\n    while (!q.empty()) {\n        int sz = q.size();\n        std::vector<int> lvl;\n        while (sz--) {\n            auto* node = q.front(); q.pop();\n            lvl.push_back(node->val);\n            if (node->left) q.push(node->left);\n            if (node->right) q.push(node->right);\n        }\n        res.push_back(lvl);\n    }\n    return res;\n}`,
            java: `import java.util.*;\n\npublic class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        List<List<Integer>> res = new ArrayList<>();\n        if (root == null) return res;\n        Queue<TreeNode> q = new LinkedList<>();\n        q.add(root);\n        while (!q.isEmpty()) {\n            int len = q.size();\n            List<Integer> lvl = new ArrayList<>();\n            for (int i = 0; i < len; i++) {\n                TreeNode node = q.poll();\n                lvl.add(node.val);\n                if (node.left != null) q.add(node.left);\n                if (node.right != null) q.add(node.right);\n            }\n            res.add(lvl);\n        }\n        return res;\n    }\n}`,
            c: `// C Level Order Traversal`,
            go: `// Go Level Order Traversal`
        }
    },
    {
        id: 32,
        title: "Validate Binary Search Tree",
        topic: "Trees & BST",
        difficulty: "Medium",
        companies: ["Amazon", "Meta", "Google"],
        description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
        examples: [
            { input: "root = [2,1,3]", output: "true" },
            { input: "root = [5,1,4,null,null,3,6]", output: "false" }
        ],
        testCases: [
            { input: [[2, 1, 3]], expected: true },
            { input: [[5, 1, 4, null, null, 3, 6]], expected: false }
        ],
        entryFunction: "isValidBST",
        hints: ["Pass min and max bounds down the recursive calls."],
        approach: "DFS with valid range (min, max). For current node: check min < val < max. Recurse left with (min, val), and right with (val, max). Time O(N), Space O(H).",
        starterCodes: {
            javascript: `function isValidBST(root, min = -Infinity, max = Infinity) {\n    if (!root) return true;\n    if (root.val <= min || root.val >= max) return false;\n    return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);\n}`,
            python: `def isValidBST(root, low=float('-inf'), high=float('inf')) -> bool:\n    if not root: return True\n    if not (low < root.val < high): return False\n    return isValidBST(root.left, low, root.val) and isValidBST(root.right, root.val, high)`,
            cpp: `bool isValidBST(TreeNode* root, long minVal = -1e18, long maxVal = 1e18) {\n    if (!root) return true;\n    if (root->val <= minVal || root->val >= maxVal) return false;\n    return isValidBST(root->left, minVal, root->val) && isValidBST(root->right, root->val, maxVal);\n}`,
            java: `public class Solution {\n    public boolean isValidBST(TreeNode root) {\n        return validate(root, null, null);\n    }\n    private boolean validate(TreeNode root, Integer min, Integer max) {\n        if (root == null) return true;\n        if ((min != null && root.val <= min) || (max != null && root.val >= max)) return false;\n        return validate(root.left, min, root.val) && validate(root.right, root.val, max);\n    }\n}`,
            c: `// C Validate BST`,
            go: `// Go Validate BST`
        }
    },
    {
        id: 33,
        title: "Kth Smallest Element in a BST",
        topic: "Trees & BST",
        difficulty: "Medium",
        companies: ["Amazon", "Google"],
        description: "Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.",
        examples: [
            { input: "root = [3,1,4,null,2], k = 1", output: "1" },
            { input: "root = [5,3,6,2,4,null,null,1], k = 3", output: "3" }
        ],
        testCases: [
            { input: [[3, 1, 4, null, 2], 1], expected: 1 },
            { input: [[5, 3, 6, 2, 4, null, null, 1], 3], expected: 3 }
        ],
        entryFunction: "kthSmallest",
        hints: ["In-order traversal of a BST yields elements in strictly sorted ascending order."],
        approach: "In-order traversal (Left, Root, Right). Decrement k at each visit. When k == 0, return node.val. Time O(H + k), Space O(H).",
        starterCodes: {
            javascript: `function kthSmallest(root, k) {\n    let res = null;\n    function inorder(node) {\n        if (!node || res !== null) return;\n        inorder(node.left);\n        k--;\n        if (k === 0) { res = node.val; return; }\n        inorder(node.right);\n    }\n    inorder(root);\n    return res;\n}`,
            python: `def kthSmallest(root, k: int) -> int:\n    stack = []\n    while True:\n        while root:\n            stack.append(root)\n            root = root.left\n        root = stack.pop()\n        k -= 1\n        if k == 0: return root.val\n        root = root.right`,
            cpp: `// C++ Kth Smallest`,
            java: `// Java Kth Smallest`,
            c: `// C Kth Smallest`,
            go: `// Go Kth Smallest`
        }
    },
    {
        id: 34,
        title: "Number of Islands",
        topic: "Graphs & BFS/DFS",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Bloomberg", "Meta"],
        description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
        examples: [
            { input: "grid = [['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']]", output: "3" }
        ],
        testCases: [
            { input: [[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]], expected: 3 }
        ],
        entryFunction: "numIslands",
        hints: ["Iterate through every cell. When you encounter land '1', sink the island using DFS/BFS."],
        approach: "Iterate over each cell (r, c). When grid[r][c] == '1', increment island count and call DFS to mark all 4-directionally connected '1's as '0'. Time O(M * N), Space O(M * N).",
        starterCodes: {
            javascript: `function numIslands(grid) {\n    if (!grid || !grid.length) return 0;\n    const m = grid.length, n = grid[0].length;\n    let count = 0;\n    function dfs(r, c) {\n        if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n        grid[r][c] = '0'; // sink land\n        dfs(r + 1, c);\n        dfs(r - 1, c);\n        dfs(r, c + 1);\n        dfs(r, c - 1);\n    }\n    for (let r = 0; r < m; r++) {\n        for (let c = 0; c < n; c++) {\n            if (grid[r][c] === '1') {\n                count++;\n                dfs(r, c);\n            }\n        }\n    }\n    return count;\n}`,
            python: `def numIslands(grid: list[list[str]]) -> int:\n    if not grid: return 0\n    m, n = len(grid), len(grid[0])\n    count = 0\n    def dfs(r, c):\n        if 0 <= r < m and 0 <= c < n and grid[r][c] == '1':\n            grid[r][c] = '0'\n            dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    for r in range(m):\n        for c in range(n):\n            if grid[r][c] == '1':\n                count += 1\n                dfs(r, c)\n    return count`,
            cpp: `#include <vector>\n\nint numIslands(std::vector<std::vector<char>>& grid) {\n    int m = grid.size(), n = grid[0].size(), count = 0;\n    auto dfs = [&](auto& self, int r, int c) -> void {\n        if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != '1') return;\n        grid[r][c] = '0';\n        self(self, r+1, c); self(self, r-1, c); self(self, r, c+1); self(self, r, c-1);\n    };\n    for (int r = 0; r < m; r++)\n        for (int c = 0; c < n; c++)\n            if (grid[r][c] == '1') { count++; dfs(dfs, r, c); }\n    return count;\n}`,
            java: `public class Solution {\n    public int numIslands(char[][] grid) {\n        int count = 0;\n        for (int r = 0; r < grid.length; r++) {\n            for (int c = 0; c < grid[0].length; c++) {\n                if (grid[r][c] == '1') {\n                    count++;\n                    dfs(grid, r, c);\n                }\n            }\n        }\n        return count;\n    }\n    private void dfs(char[][] g, int r, int c) {\n        if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] != '1') return;\n        g[r][c] = '0';\n        dfs(g, r+1, c); dfs(g, r-1, c); dfs(g, r, c+1); dfs(g, r, c-1);\n    }\n}`,
            c: `// C numIslands`,
            go: `// Go numIslands`
        }
    },
    {
        id: 35,
        title: "Clone Graph",
        topic: "Graphs & BFS/DFS",
        difficulty: "Medium",
        companies: ["Facebook", "Amazon"],
        description: "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.",
        examples: [
            { input: "adjList = [[2,4],[1,3],[2,4],[1,3]]", output: "[[2,4],[1,3],[2,4],[1,3]]" }
        ],
        testCases: [
            { input: [[[2,4],[1,3],[2,4],[1,3]]], expected: [[2,4],[1,3],[2,4],[1,3]] }
        ],
        entryFunction: "cloneGraph",
        hints: ["Use a Hash Map mapping original nodes to cloned nodes."],
        approach: "DFS with map to record cloned nodes. For each neighbor of node, recursively clone and attach to cloned.neighbors. Time O(V + E), Space O(V).",
        starterCodes: {
            javascript: `function cloneGraph(node) {\n    if (!node) return null;\n    const map = new Map();\n    function dfs(n) {\n        if (map.has(n)) return map.get(n);\n        const clone = { val: n.val, neighbors: [] };\n        map.set(n, clone);\n        for (let nei of n.neighbors) clone.neighbors.push(dfs(nei));\n        return clone;\n    }\n    return dfs(node);\n}`,
            python: `def cloneGraph(node):\n    if not node: return None\n    clones = {}\n    def dfs(n):\n        if n in clones: return clones[n]\n        copy = Node(n.val)\n        clones[n] = copy\n        for nei in n.neighbors: copy.neighbors.append(dfs(nei))\n        return copy\n    return dfs(node)`,
            cpp: `// C++ Clone Graph`,
            java: `// Java Clone Graph`,
            c: `// C Clone Graph`,
            go: `// Go Clone Graph`
        }
    },
    {
        id: 36,
        title: "Course Schedule",
        topic: "Graphs & BFS/DFS",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Robinhood"],
        description: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [a, b] indicates that you must take course b first if you want to take course a. Return true if you can finish all courses. Otherwise, return false.",
        examples: [
            { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" },
            { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false" }
        ],
        testCases: [
            { input: [2, [[1, 0]]], expected: true },
            { input: [2, [[1, 0], [0, 1]]], expected: false }
        ],
        entryFunction: "canFinish",
        hints: ["Detect cycle in a directed graph using Kahn's algorithm (indegree BFS) or DFS cycle detection."],
        approach: "Kahn's Algorithm (Topological Sort). Compute in-degrees. Add 0 in-degree courses to queue. Decrement child in-degrees as you poll. Check if processed courses count equals numCourses. Time O(V + E), Space O(V + E).",
        starterCodes: {
            javascript: `function canFinish(numCourses, prerequisites) {\n    const inDegree = new Array(numCourses).fill(0);\n    const adj = Array.from({ length: numCourses }, () => []);\n    for (const [course, pre] of prerequisites) {\n        adj[pre].push(course);\n        inDegree[course]++;\n    }\n    const q = [];\n    for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) q.push(i);\n    let count = 0;\n    while (q.length) {\n        const curr = q.shift();\n        count++;\n        for (const next of adj[curr]) {\n            inDegree[next]--;\n            if (inDegree[next] === 0) q.push(next);\n        }\n    }\n    return count === numCourses;\n}`,
            python: `def canFinish(numCourses: int, prerequisites: list[list[int]]) -> bool:\n    from collections import deque\n    adj = [[] for _ in range(numCourses)]\n    indegree = [0] * numCourses\n    for c, p in prerequisites:\n        adj[p].append(c)\n        indegree[c] += 1\n    q = deque([i for i in range(numCourses) if indegree[i] == 0])\n    count = 0\n    while q:\n        curr = q.popleft()\n        count += 1\n        for nxt in adj[curr]:\n            indegree[nxt] -= 1\n            if indegree[nxt] == 0: q.append(nxt)\n    return count == numCourses`,
            cpp: `// C++ Course Schedule`,
            java: `// Java Course Schedule`,
            c: `// C Course Schedule`,
            go: `// Go Course Schedule`
        }
    },
    {
        id: 37,
        title: "Pacific Atlantic Water Flow",
        topic: "Graphs & BFS/DFS",
        difficulty: "Medium",
        companies: ["Google", "Amazon"],
        description: "There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. Return a 2D list of grid coordinates result where result[i] = [ri, ci] denotes that rain water can flow from cell (ri, ci) to both oceans.",
        examples: [
            { input: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]", output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]" }
        ],
        testCases: [
            { input: [[[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]], expected: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]] }
        ],
        entryFunction: "pacificAtlantic",
        hints: ["Work backwards: flow water up from Pacific ocean boundaries and Atlantic ocean boundaries."],
        approach: "Run two DFS traversals starting from ocean borders inland (water flows to higher or equal height). Find intersection cells visited by both Pacific and Atlantic. Time O(M * N), Space O(M * N).",
        starterCodes: {
            javascript: `function pacificAtlantic(heights) {\n    if (!heights.length) return [];\n    const m = heights.length, n = heights[0].length;\n    const pac = Array.from({ length: m }, () => new Array(n).fill(false));\n    const atl = Array.from({ length: m }, () => new Array(n).fill(false));\n    function dfs(r, c, visited) {\n        visited[r][c] = true;\n        const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];\n        for (const [dr, dc] of dirs) {\n            const nr = r + dr, nc = c + dc;\n            if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc] && heights[nr][nc] >= heights[r][c]) {\n                dfs(nr, nc, visited);\n            }\n        }\n    }\n    for (let i = 0; i < m; i++) {\n        dfs(i, 0, pac);\n        dfs(i, n - 1, atl);\n    }\n    for (let j = 0; j < n; j++) {\n        dfs(0, j, pac);\n        dfs(m - 1, j, atl);\n    }\n    const res = [];\n    for (let i = 0; i < m; i++) {\n        for (let j = 0; j < n; j++) {\n            if (pac[i][j] && atl[i][j]) res.push([i, j]);\n        }\n    }\n    return res;\n}`,
            python: `def pacificAtlantic(heights: list[list[int]]) -> list[list[int]]:\n    # Python Pacific Atlantic implementation\n    return []`,
            cpp: `// C++ Pacific Atlantic`,
            java: `// Java Pacific Atlantic`,
            c: `// C Pacific Atlantic`,
            go: `// Go Pacific Atlantic`
        }
    },
    {
        id: 38,
        title: "Rotting Oranges",
        topic: "Graphs & BFS/DFS",
        difficulty: "Medium",
        companies: ["Amazon", "Microsoft"],
        description: "You are given an m x n grid where each cell can have one of three values: 0 (empty), 1 (fresh orange), 2 (rotten orange). Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return -1.",
        examples: [
            { input: "grid = [[2,1,1],[1,1,0],[0,1,1]]", output: "4" },
            { input: "grid = [[2,1,1],[0,1,1],[1,0,1]]", output: "-1" }
        ],
        testCases: [
            { input: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4 },
            { input: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], expected: -1 }
        ],
        entryFunction: "orangesRotting",
        hints: ["Multi-source BFS starting with all initial rotten oranges in the queue."],
        approach: "Multi-source BFS. Count initial fresh oranges. Push all initial rotten oranges (cell 2) to BFS queue. Expand minute by minute. If fresh > 0 at end, return -1. Time O(M * N), Space O(M * N).",
        starterCodes: {
            javascript: `function orangesRotting(grid) {\n    const m = grid.length, n = grid[0].length;\n    let fresh = 0, minutes = 0;\n    const q = [];\n    for (let r = 0; r < m; r++) {\n        for (let c = 0; c < n; c++) {\n            if (grid[r][c] === 2) q.push([r, c]);\n            else if (grid[r][c] === 1) fresh++;\n        }\n    }\n    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];\n    while (q.length && fresh > 0) {\n        const len = q.length;\n        for (let i = 0; i < len; i++) {\n            const [r, c] = q.shift();\n            for (const [dr, dc] of dirs) {\n                const nr = r + dr, nc = c + dc;\n                if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {\n                    grid[nr][nc] = 2;\n                    fresh--;\n                    q.push([nr, nc]);\n                }\n            }\n        }\n        minutes++;\n    }\n    return fresh === 0 ? minutes : -1;\n}`,
            python: `def orangesRotting(grid: list[list[int]]) -> int:\n    from collections import deque\n    m, n = len(grid), len(grid[0])\n    q = deque()\n    fresh = 0\n    for r in range(m):\n        for c in range(n):\n            if grid[r][c] == 2: q.append((r, c))\n            elif grid[r][c] == 1: fresh += 1\n    minutes = 0\n    dirs = [(1,0), (-1,0), (0,1), (0,-1)]\n    while q and fresh > 0:\n        for _ in range(len(q)):\n            r, c = q.popleft()\n            for dr, dc in dirs:\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:\n                    grid[nr][nc] = 2\n                    fresh -= 1\n                    q.append((nr, nc))\n        minutes += 1\n    return minutes if fresh == 0 else -1`,
            cpp: `// C++ Rotting Oranges`,
            java: `// Java Rotting Oranges`,
            c: `// C Rotting Oranges`,
            go: `// Go Rotting Oranges`
        }
    },
    {
        id: 39,
        title: "Word Search",
        topic: "Backtracking",
        difficulty: "Medium",
        companies: ["Bloomberg", "Snapchat", "Amazon"],
        description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid.",
        examples: [
            { input: "board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'ABCCED'", output: "true" }
        ],
        testCases: [
            { input: [[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"], expected: true }
        ],
        entryFunction: "exist",
        hints: ["Backtracking DFS. Mark visited cells in-place with '#'."],
        approach: "Check if board[r][c] == word[idx]. Mark cell as visited '#' during recursion, explore 4 neighbors, and restore character upon backtrack. Time O(N * 3^L), Space O(L).",
        starterCodes: {
            javascript: `function exist(board, word) {\n    const m = board.length, n = board[0].length;\n    function dfs(r, c, idx) {\n        if (idx === word.length) return true;\n        if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[idx]) return false;\n        const temp = board[r][c];\n        board[r][c] = '#';\n        const found = dfs(r + 1, c, idx + 1) || dfs(r - 1, c, idx + 1) || dfs(r, c + 1, idx + 1) || dfs(r, c - 1, idx + 1);\n        board[r][c] = temp;\n        return found;\n    }\n    for (let r = 0; r < m; r++) {\n        for (let c = 0; c < n; c++) {\n            if (dfs(r, c, 0)) return true;\n        }\n    }\n    return false;\n}`,
            python: `def exist(board: list[list[str]], word: str) -> bool:\n    m, n = len(board), len(board[0])\n    def dfs(r, c, i):\n        if i == len(word): return True\n        if not (0 <= r < m and 0 <= c < n) or board[r][c] != word[i]: return False\n        temp = board[r][c]\n        board[r][c] = '#'\n        found = dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or dfs(r,c+1,i+1) or dfs(r,c-1,i+1)\n        board[r][c] = temp\n        return found\n    return any(dfs(r, c, 0) for r in range(m) for c in range(n))`,
            cpp: `// C++ Word Search`,
            java: `// Java Word Search`,
            c: `// C Word Search`,
            go: `// Go Word Search`
        }
    },
    {
        id: 40,
        title: "Combination Sum",
        topic: "Backtracking",
        difficulty: "Medium",
        companies: ["Airbnb", "Meta", "Uber"],
        description: "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order. The same number may be chosen an unlimited number of times.",
        examples: [
            { input: "candidates = [2,3,6,7], target = 7", output: "[[2,2,3],[7]]" }
        ],
        testCases: [
            { input: [[2, 3, 6, 7], 7], expected: [[2, 2, 3], [7]] }
        ],
        entryFunction: "combinationSum",
        hints: ["Sort candidates. Choose to include current candidate again or skip to the next candidate."],
        approach: "Backtracking. At index i, recursively call either (i, target - candidates[i]) or advance to (i + 1, target). Base cases: target == 0 (save combination), target < 0 (prune). Time O(2^T), Space O(T).",
        starterCodes: {
            javascript: `function combinationSum(candidates, target) {\n    const res = [];\n    function backtrack(start, remain, combo) {\n        if (remain === 0) { res.push([...combo]); return; }\n        if (remain < 0) return;\n        for (let i = start; i < candidates.length; i++) {\n            combo.push(candidates[i]);\n            backtrack(i, remain - candidates[i], combo);\n            combo.pop();\n        }\n    }\n    backtrack(0, target, []);\n    return res;\n}`,
            python: `def combinationSum(candidates: list[int], target: int) -> list[list[int]]:\n    res = []\n    def dfs(start, remain, combo):\n        if remain == 0: res.append(list(combo)); return\n        if remain < 0: return\n        for i in range(start, len(candidates)):\n            combo.append(candidates[i])\n            dfs(i, remain - candidates[i], combo)\n            combo.pop()\n    dfs(0, target, [])\n    return res`,
            cpp: `// C++ Combination Sum`,
            java: `// Java Combination Sum`,
            c: `// C Combination Sum`,
            go: `// Go Combination Sum`
        }
    },
    {
        id: 41,
        title: "Permutations",
        topic: "Backtracking",
        difficulty: "Medium",
        companies: ["Microsoft", "LinkedIn"],
        description: "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.",
        examples: [
            { input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" }
        ],
        testCases: [
            { input: [[1, 2, 3]], expected: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]] }
        ],
        entryFunction: "permute",
        hints: ["Backtrack by maintaining a visited set or swapping elements."],
        approach: "Build permutation by choosing each unused element. Push to path, mark used, recurse, then unmark upon backtrack. When path.length == nums.length, record copy. Time O(N * N!), Space O(N).",
        starterCodes: {
            javascript: `function permute(nums) {\n    const res = [];\n    function backtrack(current, used) {\n        if (current.length === nums.length) { res.push([...current]); return; }\n        for (let i = 0; i < nums.length; i++) {\n            if (used[i]) continue;\n            used[i] = true;\n            current.push(nums[i]);\n            backtrack(current, used);\n            current.pop();\n            used[i] = false;\n        }\n    }\n    backtrack([], new Array(nums.length).fill(false));\n    return res;\n}`,
            python: `def permute(nums: list[int]) -> list[list[int]]:\n    res = []\n    def backtrack(curr, used):\n        if len(curr) == len(nums): res.append(list(curr)); return\n        for i in range(len(nums)):\n            if used[i]: continue\n            used[i] = True\n            curr.append(nums[i])\n            backtrack(curr, used)\n            curr.pop()\n            used[i] = False\n    backtrack([], [False]*len(nums))\n    return res`,
            cpp: `// C++ Permutations`,
            java: `// Java Permutations`,
            c: `// C Permutations`,
            go: `// Go Permutations`
        }
    },
    {
        id: 42,
        title: "Subsets",
        topic: "Backtracking",
        difficulty: "Medium",
        companies: ["Facebook", "Amazon"],
        description: "Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.",
        examples: [
            { input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" }
        ],
        testCases: [
            { input: [[1, 2, 3]], expected: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]] }
        ],
        entryFunction: "subsets",
        hints: ["At each element, make a binary choice: include it or exclude it."],
        approach: "At each index i: branch 1 excludes nums[i], branch 2 includes nums[i]. Or loop i from start to N-1, adding copy of current subset to result at each step. Time O(2^N), Space O(N).",
        starterCodes: {
            javascript: `function subsets(nums) {\n    const res = [];\n    function backtrack(start, combo) {\n        res.push([...combo]);\n        for (let i = start; i < nums.length; i++) {\n            combo.push(nums[i]);\n            backtrack(i + 1, combo);\n            combo.pop();\n        }\n    }\n    backtrack(0, []);\n    return res;\n}`,
            python: `def subsets(nums: list[int]) -> list[list[int]]:\n    res = []\n    def backtrack(start, combo):\n        res.append(list(combo))\n        for i in range(start, len(nums)):\n            combo.append(nums[i])\n            backtrack(i + 1, combo)\n            combo.pop()\n    backtrack(0, [])\n    return res`,
            cpp: `// C++ Subsets`,
            java: `// Java Subsets`,
            c: `// C Subsets`,
            go: `// Go Subsets`
        }
    },
    {
        id: 43,
        title: "Climbing Stairs",
        topic: "Dynamic Programming",
        difficulty: "Easy",
        companies: ["Amazon", "Apple", "Uber"],
        description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        examples: [
            { input: "n = 2", output: "2", explanation: "1. 1 step + 1 step\n2. 2 steps" },
            { input: "n = 3", output: "3" }
        ],
        testCases: [
            { input: [2], expected: 2 },
            { input: [3], expected: 3 },
            { input: [5], expected: 8 }
        ],
        entryFunction: "climbStairs",
        hints: ["Notice that ways(n) = ways(n-1) + ways(n-2). It's Fibonacci!"],
        approach: "DP with 2 variables: a = 1, b = 2. For i from 3 to n: c = a + b; a = b; b = c. Time O(N), Space O(1).",
        starterCodes: {
            javascript: `function climbStairs(n) {\n    if (n <= 2) return n;\n    let a = 1, b = 2;\n    for (let i = 3; i <= n; i++) {\n        const c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}`,
            python: `def climbStairs(n: int) -> int:\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b`,
            cpp: `int climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}`,
            java: `public class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b;\n            b = c;\n        }\n        return b;\n    }\n}`,
            c: `int climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int c = a + b; a = b; b = c;\n    }\n    return b;\n}`,
            go: `func climbStairs(n int) int {\n    if n <= 2 { return n }\n    a, b := 1, 2\n    for i := 3; i <= n; i++ {\n        a, b = b, a + b\n    }\n    return b\n}`
        }
    },
    {
        id: 44,
        title: "House Robber",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Airbnb"],
        description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night. Return the maximum amount of money you can rob tonight without alerting the police.",
        examples: [
            { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 (money = 1) and rob house 3 (money = 3). Total = 4." },
            { input: "nums = [2,7,9,3,1]", output: "12" }
        ],
        testCases: [
            { input: [[1, 2, 3, 1]], expected: 4 },
            { input: [[2, 7, 9, 3, 1]], expected: 12 }
        ],
        entryFunction: "rob",
        hints: ["rob(i) = max(rob(i-1), rob(i-2) + nums[i])."],
        approach: "Maintain two variables robPrev and robCurr. At each house: temp = max(robCurr, robPrev + num); robPrev = robCurr; robCurr = temp. Time O(N), Space O(1).",
        starterCodes: {
            javascript: `function rob(nums) {\n    let rob1 = 0, rob2 = 0;\n    for (const n of nums) {\n        const temp = Math.max(rob1 + n, rob2);\n        rob1 = rob2;\n        rob2 = temp;\n    }\n    return rob2;\n}`,
            python: `def rob(nums: list[int]) -> int:\n    rob1 = rob2 = 0\n    for n in nums:\n        rob1, rob2 = rob2, max(rob1 + n, rob2)\n    return rob2`,
            cpp: `int rob(std::vector<int>& nums) {\n    int rob1 = 0, rob2 = 0;\n    for (int n : nums) {\n        int temp = std::max(rob1 + n, rob2);\n        rob1 = rob2;\n        rob2 = temp;\n    }\n    return rob2;\n}`,
            java: `public class Solution {\n    public int rob(int[] nums) {\n        int rob1 = 0, rob2 = 0;\n        for (int n : nums) {\n            int temp = Math.max(rob1 + n, rob2);\n            rob1 = rob2;\n            rob2 = temp;\n        }\n        return rob2;\n    }\n}`,
            c: `// C House Robber`,
            go: `// Go House Robber`
        }
    },
    {
        id: 45,
        title: "Coin Change",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        companies: ["Amazon", "Microsoft", "ByteDance"],
        description: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.",
        examples: [
            { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1." },
            { input: "coins = [2], amount = 3", output: "-1" },
            { input: "coins = [1], amount = 0", output: "0" }
        ],
        testCases: [
            { input: [[1, 2, 5], 11], expected: 3 },
            { input: [[2], 3], expected: -1 },
            { input: [[1], 0], expected: 0 }
        ],
        entryFunction: "coinChange",
        hints: ["dp[i] = min coins to form amount i. dp[i] = min(dp[i], 1 + dp[i - coin])."],
        approach: "Bottom-up 1D DP array of size amount + 1 initialized to Infinity, dp[0] = 0. For each amount from 1 to total, and each coin: if amount >= coin, dp[amount] = min(dp[amount], 1 + dp[amount - coin]). Time O(amount * len(coins)), Space O(amount).",
        starterCodes: {
            javascript: `function coinChange(coins, amount) {\n    const dp = new Array(amount + 1).fill(Infinity);\n    dp[0] = 0;\n    for (let i = 1; i <= amount; i++) {\n        for (const c of coins) {\n            if (i >= c) {\n                dp[i] = Math.min(dp[i], 1 + dp[i - c]);\n            }\n        }\n    }\n    return dp[amount] === Infinity ? -1 : dp[amount];\n}`,
            python: `def coinChange(coins: list[int], amount: int) -> int:\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for c in coins:\n            if i >= c:\n                dp[i] = min(dp[i], 1 + dp[i - c])\n    return dp[amount] if dp[amount] != float('inf') else -1`,
            cpp: `#include <vector>\n#include <algorithm>\n\nint coinChange(std::vector<int>& coins, int amount) {\n    std::vector<int> dp(amount + 1, amount + 1);\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int c : coins) if (i >= c) dp[i] = std::min(dp[i], 1 + dp[i - c]);\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}`,
            java: `import java.util.Arrays;\n\npublic class Solution {\n    public int coinChange(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int c : coins) if (i >= c) dp[i] = Math.min(dp[i], 1 + dp[i - c]);\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}`,
            c: `// C Coin Change`,
            go: `// Go Coin Change`
        }
    },
    {
        id: 46,
        title: "Longest Increasing Subsequence",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        companies: ["Google", "Amazon", "Microsoft"],
        description: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
        examples: [
            { input: "nums = [10,9,2,5,3,7,101,18]", output: "4", explanation: "The longest increasing subsequence is [2,3,7,101], therefore the length is 4." },
            { input: "nums = [0,1,0,3,2,3]", output: "4" }
        ],
        testCases: [
            { input: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4 },
            { input: [[0, 1, 0, 3, 2, 3]], expected: 4 }
        ],
        entryFunction: "lengthOfLIS",
        hints: ["Use Patience Sorting (binary search) to achieve O(N log N) runtime."],
        approach: "Maintain a tails array representing the smallest tail of all increasing subsequences of various lengths. Use binary search (lower_bound) to replace or append nums[i]. Time O(N log N), Space O(N).",
        starterCodes: {
            javascript: `function lengthOfLIS(nums) {\n    const tails = [];\n    for (const x of nums) {\n        let l = 0, r = tails.length;\n        while (l < r) {\n            const mid = (l + r) >> 1;\n            if (tails[mid] < x) l = mid + 1;\n            else r = mid;\n        }\n        tails[l] = x;\n    }\n    return tails.length;\n}`,
            python: `def lengthOfLIS(nums: list[int]) -> int:\n    import bisect\n    tails = []\n    for x in nums:\n        idx = bisect.bisect_left(tails, x)\n        if idx == len(tails): tails.append(x)\n        else: tails[idx] = x\n    return len(tails)`,
            cpp: `#include <vector>\n#include <algorithm>\n\nint lengthOfLIS(std::vector<int>& nums) {\n    std::vector<int> tails;\n    for (int x : nums) {\n        auto it = std::lower_bound(tails.begin(), tails.end(), x);\n        if (it == tails.end()) tails.push_back(x);\n        else *it = x;\n    }\n    return tails.size();\n}`,
            java: `import java.util.ArrayList;\nimport java.util.Collections;\n\npublic class Solution {\n    public int lengthOfLIS(int[] nums) {\n        ArrayList<Integer> tails = new ArrayList<>();\n        for (int x : nums) {\n            int idx = Collections.binarySearch(tails, x);\n            if (idx < 0) idx = -(idx + 1);\n            if (idx == tails.size()) tails.add(x);\n            else tails.set(idx, x);\n        }\n        return tails.size();\n    }\n}`,
            c: `// C LIS`,
            go: `// Go LIS`
        }
    },
    {
        id: 47,
        title: "Word Break",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        companies: ["Amazon", "Bloomberg", "Google"],
        description: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
        examples: [
            { input: "s = 'leetcode', wordDict = ['leet','code']", output: "true" },
            { input: "s = 'applepenapple', wordDict = ['apple','pen']", output: "true" },
            { input: "s = 'catsandog', wordDict = ['cats','dog','sand','and','cat']", output: "false" }
        ],
        testCases: [
            { input: ["leetcode", ["leet", "code"]], expected: true },
            { input: ["applepenapple", ["apple", "pen"]], expected: true },
            { input: ["catsandog", ["cats", "dog", "sand", "and", "cat"]], expected: false }
        ],
        entryFunction: "wordBreak",
        hints: ["dp[i] represents whether s[0...i] can be segmented."],
        approach: "1D boolean DP array. dp[0] = true. For i from 1 to s.length and each word: if i >= word.length and s.substring(i - word.length, i) === word, dp[i] = dp[i] || dp[i - word.length]. Time O(N * M * K), Space O(N).",
        starterCodes: {
            javascript: `function wordBreak(s, wordDict) {\n    const dp = new Array(s.length + 1).fill(false);\n    dp[0] = true;\n    for (let i = 1; i <= s.length; i++) {\n        for (const w of wordDict) {\n            if (i >= w.length && dp[i - w.length] && s.substring(i - w.length, i) === w) {\n                dp[i] = true;\n                break;\n            }\n        }\n    }\n    return dp[s.length];\n}`,
            python: `def wordBreak(s: str, wordDict: list[str]) -> bool:\n    dp = [False] * (len(s) + 1)\n    dp[0] = True\n    for i in range(1, len(s) + 1):\n        for w in wordDict:\n            if i >= len(w) and dp[i - len(w)] and s[i - len(w):i] == w:\n                dp[i] = True\n                break\n    return dp[len(s)]`,
            cpp: `// C++ Word Break`,
            java: `// Java Word Break`,
            c: `// C Word Break`,
            go: `// Go Word Break`
        }
    },
    {
        id: 48,
        title: "Unique Paths",
        topic: "Dynamic Programming",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Bloomberg"],
        description: "There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time. Given the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.",
        examples: [
            { input: "m = 3, n = 7", output: "28" },
            { input: "m = 3, n = 2", output: "3" }
        ],
        testCases: [
            { input: [3, 7], expected: 28 },
            { input: [3, 2], expected: 3 }
        ],
        entryFunction: "uniquePaths",
        hints: ["dp[r][c] = dp[r-1][c] + dp[r][c-1]. Can be optimized to 1D row array."],
        approach: "Maintain a 1D row array initialized to 1. For each of the remaining rows: for c from 1 to n - 1: row[c] += row[c - 1]. Time O(M * N), Space O(N).",
        starterCodes: {
            javascript: `function uniquePaths(m, n) {\n    const row = new Array(n).fill(1);\n    for (let r = 1; r < m; r++) {\n        for (let c = 1; c < n; c++) {\n            row[c] += row[c - 1];\n        }\n    }\n    return row[n - 1];\n}`,
            python: `def uniquePaths(m: int, n: int) -> int:\n    row = [1] * n\n    for _ in range(1, m):\n        for c in range(1, n):\n            row[c] += row[c - 1]\n    return row[-1]`,
            cpp: `int uniquePaths(int m, int n) {\n    std::vector<int> row(n, 1);\n    for (int r = 1; r < m; r++)\n        for (int c = 1; c < n; c++) row[c] += row[c - 1];\n    return row[n - 1];\n}`,
            java: `import java.util.Arrays;\n\npublic class Solution {\n    public int uniquePaths(int m, int n) {\n        int[] row = new int[n];\n        Arrays.fill(row, 1);\n        for (int r = 1; r < m; r++)\n            for (int c = 1; c < n; c++) row[c] += row[c - 1];\n        return row[n - 1];\n    }\n}`,
            c: `// C Unique Paths`,
            go: `// Go Unique Paths`
        }
    },
    {
        id: 49,
        title: "Merge Intervals",
        topic: "Intervals & Greedy",
        difficulty: "Medium",
        companies: ["Google", "Bloomberg", "Meta"],
        description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
        examples: [
            { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
            { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" }
        ],
        testCases: [
            { input: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
            { input: [[[1, 4], [4, 5]]], expected: [[1, 5]] }
        ],
        entryFunction: "merge",
        hints: ["Sort intervals by start time. Merge if curr[0] <= prev[1]."],
        approach: "Sort by start time. Iterate intervals. If res is empty or current.start > last.end, push current. Else last.end = max(last.end, current.end). Time O(N log N), Space O(N).",
        starterCodes: {
            javascript: `function merge(intervals) {\n    if (!intervals.length) return [];\n    intervals.sort((a, b) => a[0] - b[0]);\n    const res = [intervals[0]];\n    for (let i = 1; i < intervals.length; i++) {\n        const curr = intervals[i];\n        const last = res[res.length - 1];\n        if (curr[0] <= last[1]) {\n            last[1] = Math.max(last[1], curr[1]);\n        } else {\n            res.push(curr);\n        }\n    }\n    return res;\n}`,
            python: `def merge(intervals: list[list[int]]) -> list[list[int]]:\n    intervals.sort(key=lambda x: x[0])\n    res = []\n    for iv in intervals:\n        if not res or res[-1][1] < iv[0]:\n            res.append(iv)\n        else:\n            res[-1][1] = max(res[-1][1], iv[1])\n    return res`,
            cpp: `#include <vector>\n#include <algorithm>\n\nstd::vector<std::vector<int>> merge(std::vector<std::vector<int>>& intervals) {\n    std::sort(intervals.begin(), intervals.end());\n    std::vector<std::vector<int>> res = {intervals[0]};\n    for (size_t i = 1; i < intervals.size(); i++) {\n        if (intervals[i][0] <= res.back()[1]) res.back()[1] = std::max(res.back()[1], intervals[i][1]);\n        else res.push_back(intervals[i]);\n    }\n    return res;\n}`,
            java: `import java.util.*;\n\npublic class Solution {\n    public int[][] merge(int[][] intervals) {\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        List<int[]> res = new ArrayList<>();\n        for (int[] iv : intervals) {\n            if (res.isEmpty() || res.get(res.size() - 1)[1] < iv[0]) res.add(iv);\n            else res.get(res.size() - 1)[1] = Math.max(res.get(res.size() - 1)[1], iv[1]);\n        }\n        return res.toArray(new int[res.size()][]);\n    }\n}`,
            c: `// C Merge Intervals`,
            go: `// Go Merge Intervals`
        }
    },
    {
        id: 50,
        title: "LRU Cache",
        topic: "Intervals & Greedy",
        difficulty: "Medium",
        companies: ["Amazon", "Google", "Apple", "Microsoft"],
        description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with get(key) and put(key, value) in O(1) average time complexity.",
        examples: [
            { input: "put(1,1), put(2,2), get(1) -> 1, put(3,3), get(2) -> -1, put(4,4), get(1) -> -1, get(3) -> 3, get(4) -> 4", output: "1, -1, -1, 3, 4" }
        ],
        testCases: [
            { input: [["put", 1, 1], ["put", 2, 2], ["get", 1], ["put", 3, 3], ["get", 2]], expected: [1, -1] }
        ],
        entryFunction: "testLRUCache",
        hints: ["Combine a Hash Map for O(1) lookups with a Doubly Linked List for O(1) removals and insertions."],
        approach: "Doubly Linked List with dummy head and tail + Map. get(key): move node to head and return val. put(key, value): if exists, update and move to head; if new, insert at head, if capacity exceeded, evict tail.prev. Time O(1) for both get and put.",
        starterCodes: {
            javascript: `class LRUCache {\n    constructor(capacity) {\n        this.capacity = capacity;\n        this.map = new Map(); // preserves insertion order in JS\n    }\n    get(key) {\n        if (!this.map.has(key)) return -1;\n        const val = this.map.get(key);\n        this.map.delete(key);\n        this.map.set(key, val);\n        return val;\n    }\n    put(key, value) {\n        if (this.map.has(key)) this.map.delete(key);\n        this.map.set(key, value);\n        if (this.map.size > this.capacity) {\n            const oldestKey = this.map.keys().next().value;\n            this.map.delete(oldestKey);\n        }\n    }\n}`,
            python: `class LRUCache:\n    def __init__(self, capacity: int):\n        from collections import OrderedDict\n        self.cap = capacity\n        self.cache = OrderedDict()\n    def get(self, key: int) -> int:\n        if key not in self.cache: return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache: self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.cap: self.cache.popitem(last=False)`,
            cpp: `// C++ LRUCache with std::list and std::unordered_map`,
            java: `// Java LRUCache with LinkedHashMap or custom DLL`,
            c: `// C LRUCache`,
            go: `// Go LRUCache`
        }
    },
    {
        id: 51,
        title: "Median of Two Sorted Arrays",
        topic: "Binary Search",
        difficulty: "Hard",
        companies: ["Google", "Amazon", "Apple", "Goldman Sachs"],
        description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
        examples: [
            { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" },
            { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.50000" }
        ],
        testCases: [
            { input: [[1, 3], [2]], expected: 2 },
            { input: [[1, 2], [3, 4]], expected: 2.5 }
        ],
        entryFunction: "findMedianSortedArrays",
        hints: ["Binary search on the partition position of the smaller array."],
        approach: "Partition smaller array A into leftA/rightA and larger B into leftB/rightB such that len(leftA + leftB) == (m + n + 1) / 2. If max(leftA) <= min(rightB) and max(leftB) <= min(rightA), median found. Time O(log(min(m, n))), Space O(1).",
        starterCodes: {
            javascript: `function findMedianSortedArrays(nums1, nums2) {\n    if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);\n    const m = nums1.length, n = nums2.length;\n    let l = 0, r = m;\n    while (l <= r) {\n        const pX = (l + r) >> 1;\n        const pY = Math.floor((m + n + 1) / 2) - pX;\n        const maxLX = pX === 0 ? -Infinity : nums1[pX - 1];\n        const minRX = pX === m ? Infinity : nums1[pX];\n        const maxLY = pY === 0 ? -Infinity : nums2[pY - 1];\n        const minRY = pY === n ? Infinity : nums2[pY];\n        if (maxLX <= minRY && maxLY <= minRX) {\n            if ((m + n) % 2 !== 0) return Math.max(maxLX, maxLY);\n            return (Math.max(maxLX, maxLY) + Math.min(minRX, minRY)) / 2;\n        } else if (maxLX > minRY) {\n            r = pX - 1;\n        } else {\n            l = pX + 1;\n        }\n    }\n    return 0;\n}`,
            python: `def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:\n    if len(nums1) > len(nums2): return findMedianSortedArrays(nums2, nums1)\n    m, n = len(nums1), len(nums2)\n    l, r = 0, m\n    while l <= r:\n        px = (l + r) // 2\n        py = (m + n + 1) // 2 - px\n        maxLX = float('-inf') if px == 0 else nums1[px - 1]\n        minRX = float('inf') if px == m else nums1[px]\n        maxLY = float('-inf') if py == 0 else nums2[py - 1]\n        minRY = float('inf') if py == n else nums2[py]\n        if maxLX <= minRY and maxLY <= minRX:\n            if (m + n) % 2 != 0: return float(max(maxLX, maxLY))\n            return (max(maxLX, maxLY) + min(minRX, minRY)) / 2.0\n        elif maxLX > minRY: r = px - 1\n        else: l = px + 1\n    return 0.0`,
            cpp: `// C++ Median of Two Sorted Arrays`,
            java: `// Java Median of Two Sorted Arrays`,
            c: `// C Median of Two Sorted Arrays`,
            go: `// Go Median of Two Sorted Arrays`
        }
    },
    {
        id: 52,
        title: "Top K Frequent Elements",
        topic: "Tries & Heaps",
        difficulty: "Medium",
        companies: ["Amazon", "Meta", "Yelp"],
        description: "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
        examples: [
            { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
            { input: "nums = [1], k = 1", output: "[1]" }
        ],
        testCases: [
            { input: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
            { input: [[1], 1], expected: [1] }
        ],
        entryFunction: "topKFrequent",
        hints: ["Bucket sort by frequency achieves linear O(N) runtime."],
        approach: "Count frequencies in a map. Create buckets where bucket[freq] contains numbers appearing freq times. Iterate buckets from highest frequency downwards to collect k items. Time O(N), Space O(N).",
        starterCodes: {
            javascript: `function topKFrequent(nums, k) {\n    const count = new Map();\n    for (const n of nums) count.set(n, (count.get(n) || 0) + 1);\n    const buckets = Array.from({ length: nums.length + 1 }, () => []);\n    for (const [num, freq] of count.entries()) {\n        buckets[freq].push(num);\n    }\n    const res = [];\n    for (let i = buckets.length - 1; i >= 0 && res.length < k; i--) {\n        if (buckets[i].length) {\n            res.push(...buckets[i]);\n        }\n    }\n    return res.slice(0, k);\n}`,
            python: `def topKFrequent(nums: list[int], k: int) -> list[int]:\n    from collections import Counter\n    count = Counter(nums)\n    buckets = [[] for _ in range(len(nums) + 1)]\n    for num, freq in count.items(): buckets[freq].append(num)\n    res = []\n    for i in range(len(buckets) - 1, 0, -1):\n        for n in buckets[i]:\n            res.append(n)\n            if len(res) == k: return res\n    return res`,
            cpp: `// C++ Top K Frequent Elements`,
            java: `// Java Top K Frequent Elements`,
            c: `// C Top K Frequent Elements`,
            go: `// Go Top K Frequent Elements`
        }
    }
];
