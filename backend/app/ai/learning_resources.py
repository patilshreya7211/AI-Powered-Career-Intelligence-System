# Learning Resources Database

LEARNING_RESOURCES = {

    "Python": [
        {
            "platform": "Coursera",
            "course": "Python for Everybody",
            "link": "https://www.coursera.org/specializations/python"
        },
        {
            "platform": "Infosys Springboard",
            "course": "Python Programming",
            "link": "https://infyspringboard.onwingspan.com/"
        },
        {
            "platform": "W3Schools",
            "course": "Python Tutorial",
            "link": "https://www.w3schools.com/python/"
        }
    ],

    "Machine Learning": [
        {
            "platform": "Coursera",
            "course": "Machine Learning Specialization",
            "link": "https://www.coursera.org/specializations/machine-learning-introduction"
        },
        {
            "platform": "Infosys Springboard",
            "course": "Machine Learning",
            "link": "https://infyspringboard.onwingspan.com/"
        },
        {
            "platform": "Scikit-Learn",
            "course": "Official Documentation",
            "link": "https://scikit-learn.org/"
        }
    ],

    "Deep Learning": [
        {
            "platform": "Coursera",
            "course": "Deep Learning Specialization",
            "link": "https://www.coursera.org/specializations/deep-learning"
        },
        {
            "platform": "DeepLearning.AI",
            "course": "Deep Learning",
            "link": "https://www.deeplearning.ai/"
        },
        {
            "platform": "TensorFlow",
            "course": "Official Documentation",
            "link": "https://www.tensorflow.org/"
        }
    ],

    "TensorFlow": [
        {
            "platform": "TensorFlow",
            "course": "Official Documentation",
            "link": "https://www.tensorflow.org/"
        },
        {
            "platform": "Coursera",
            "course": "TensorFlow in Practice",
            "link": "https://www.coursera.org/"
        }
    ],

    "React": [
        {
            "platform": "Coursera",
            "course": "Meta Front-End Developer",
            "link": "https://www.coursera.org/professional-certificates/meta-front-end-developer"
        },
        {
            "platform": "Infosys Springboard",
            "course": "ReactJS",
            "link": "https://infyspringboard.onwingspan.com/"
        },
        {
            "platform": "React",
            "course": "Official Documentation",
            "link": "https://react.dev/"
        }
    ],

    "Docker": [
        {
            "platform": "Docker",
            "course": "Official Documentation",
            "link": "https://docs.docker.com/"
        },
        {
            "platform": "Coursera",
            "course": "Docker Essentials",
            "link": "https://www.coursera.org/"
        }
    ],

    "FastAPI": [
        {
            "platform": "FastAPI",
            "course": "Official Documentation",
            "link": "https://fastapi.tiangolo.com/"
        },
        {
            "platform": "YouTube",
            "course": "FastAPI Crash Course",
            "link": "https://www.youtube.com/results?search_query=fastapi+crash+course"
        }
    ],

    "Git": [
        {
            "platform": "Git",
            "course": "Official Documentation",
            "link": "https://git-scm.com/doc"
        },
        {
            "platform": "Coursera",
            "course": "Version Control with Git",
            "link": "https://www.coursera.org/"
        }
    ],

    "SQL": [
        {
            "platform": "W3Schools",
            "course": "SQL Tutorial",
            "link": "https://www.w3schools.com/sql/"
        },
        {
            "platform": "Coursera",
            "course": "SQL for Data Science",
            "link": "https://www.coursera.org/"
        }
    ]
}


def recommend_learning_resources(missing_skills):
    """
    Recommend learning resources for missing skills.
    """

    recommendations = []

    for skill in missing_skills:

        recommendations.append({

            "skill": skill,

            "resources": LEARNING_RESOURCES.get(

                skill,

                [
                    {
                        "platform": "YouTube",
                        "course": f"Learn {skill}",
                        "link": f"https://www.youtube.com/results?search_query={skill.replace(' ', '+')}"
                    },
                    {
                        "platform": "Google",
                        "course": f"{skill} Documentation",
                        "link": f"https://www.google.com/search?q={skill.replace(' ', '+')}+documentation"
                    },
                    {
                        "platform": "GitHub",
                        "course": f"{skill} Projects",
                        "link": f"https://github.com/search?q={skill.replace(' ', '+')}"
                    }
                ]

            )

        })

    return recommendations