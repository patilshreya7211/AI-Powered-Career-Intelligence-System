def generate_career_roadmap(career):
    
    career = career.lower()

    if "machine learning" in career or "ai" in career:

        return {
            "title": "AI / Machine Learning Engineer",
            "steps": [
                "Learn Python",
                "Master Data Structures & Algorithms",
                "Learn Statistics & Mathematics",
                "Learn Machine Learning",
                "Learn Deep Learning",
                "Build AI Projects",
                "Learn MLOps",
                "Practice LeetCode",
                "Apply for AI Internships",
                "Become AI Engineer"
            ]
        }

    elif "full stack" in career:

        return {
            "title": "Full Stack Developer",
            "steps": [
                "HTML",
                "CSS",
                "JavaScript",
                "React",
                "Node.js",
                "Express.js",
                "MongoDB",
                "Deploy Projects",
                "Apply for Jobs"
            ]
        }

    else:

        return {
            "title": "Software Engineer",
            "steps": [
                "Learn Programming",
                "Master DSA",
                "SQL",
                "System Design",
                "Projects",
                "Internship",
                "Placement Preparation"
            ]
        }