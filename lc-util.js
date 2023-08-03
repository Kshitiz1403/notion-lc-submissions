const getSubmissionHeaders = () => {
    return {
        'authority': 'leetcode.com', 
        'accept': '*/*', 
        'accept-language': 'en-US,en;q=0.9', 
        'cookie': `gr_user_id=293bd4d3-332d-410f-9fba-59432c9cfc50; 87b5a3c3f1a55520_gr_last_sent_cs1=Kshitiz1403; __stripe_mid=ed3e43ab-ff26-4566-b862-99ab35662ba4295957; __atuvc=2%7C18%2C12%7C19; _gid=GA1.2.1959368310.1686343119; csrftoken=oyLXCQS0d4f6CEIN0Tl93eJXOPg8WxuFUTcFZABFX7Jw9NMGDFdSFCbAEx4wZf5A; _gcl_au=1.1.890587113.1686584127; INTERVIEW_SESSION=MTY4Njg0ODc1NnxfNVFNQVAtUVpYbEthR0pIWTJsUGFVcEpWWHBKTVU1cFNYTkpibEkxWTBOSk5rbHJjRmhXUTBvNUxtVjVTbXBaVnpWcllWZFNhR1JIVm1aaFYxRnBUMnBSTUU1cVl6Vk5hWGRwV2xob2QyRllTbXhhUmpsb1pFTkpOazFVV1RST2FtdDZUbFJGTVU1dU1DNTBVSFkxVUZKb2FtOVlkM3BEWmkxSVVWUTRTbGxzUmt0WVUwdGhkV3cyVVMxelVFNUdiRko2TFVObnxtSa6q1bXoCFHPl-4k01ptzDHh_tIGIg3EL3QY17Na5w==; LEETCODE_SESSION=${process.env.COOKIE}; c_a_u="S3NoaXRpejE0MDM=:1q9sOC:3B_NisO9GoetahCjPAW2dmd8E3g"; 87b5a3c3f1a55520_gr_cs1=Kshitiz1403; _ga_DKXQ03QCVK=GS1.1.1686854640.10.1.1686856537.60.0.0; _gat=1; _dd_s=rum=0&expire=1686896153573; _ga=GA1.1.2086603612.1683387358; _ga_CDRWKZTDEX=GS1.1.1686895245.40.1.1686895260.45.0.0; csrftoken=2A8kTR8WSnZosDQniPO7jVQvX5dnpbRMN16bjTMXwA5nNFmzrzoO9BSiEx6GKEtk`, 
        'referer': 'https://leetcode.com/submissions/', 
        'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"', 
        'sec-ch-ua-mobile': '?0', 
        'sec-ch-ua-platform': '"Windows"', 
        'sec-fetch-dest': 'empty', 
        'sec-fetch-mode': 'cors', 
        'sec-fetch-site': 'same-origin', 
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.43', 
        'x-requested-with': 'XMLHttpRequest'
    
    }
}

const getQuestionConfig = (problemSlug) => {
    var data = JSON.stringify({
        
        "operationName": "questionData",
        "variables": {
            "titleSlug": `${problemSlug}`
        },
        "query": "query questionData($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    questionFrontendId\n    boundTopicId\n    title\n    titleSlug\n    content\n    translatedTitle\n    translatedContent\n    isPaidOnly\n    canSeeQuestion\n    difficulty\n    likes\n    dislikes\n    isLiked\n    similarQuestions\n    exampleTestcases\n    categoryTitle\n    contributors {\n      username\n      profileUrl\n      avatarUrl\n      __typename\n    }\n    topicTags {\n      name\n      slug\n      translatedName\n      __typename\n    }\n    companyTagStats\n    codeSnippets {\n      lang\n      langSlug\n      code\n      __typename\n    }\n    stats\n    hints\n    solution {\n      id\n      canSeeDetail\n      paidOnly\n      hasVideoSolution\n      paidOnlyVideo\n      __typename\n    }\n    status\n    sampleTestCase\n    metaData\n    judgerAvailable\n    judgeType\n    mysqlSchemas\n    enableRunCode\n    enableTestMode\n    enableDebugger\n    envInfo\n    libraryUrl\n    adminUrl\n    challengeQuestion {\n      id\n      date\n      incompleteChallengeCount\n      streakCount\n      type\n      __typename\n    }\n    __typename\n  }\n}\n"
    });

    var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://leetcode.com/graphql',
        headers: {
            'authority': 'leetcode.com',
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.5',
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'origin': 'https://leetcode.com',
            'pragma': 'no-cache',
            'referer': 'https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/',
            'sec-ch-ua': '"Brave";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'sec-gpc': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
            'x-csrftoken': '2A8kTR8WSnZosDQniPO7jVQvX5dnpbRMN16bjTMXwA5nNFmzrzoO9BSiEx6GKEtk',
            'x-newrelic-id': 'UAQDVFVRGwEAXVlbBAg='
        },
        data: data
    };

    return { data, config }
}

module.exports = { getSubmissionHeaders, getQuestionConfig }