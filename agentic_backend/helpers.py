import requests

def personal_prompt():
    personal_prompt = """
    Your name is kumudha,  
    you should be friendly, engaging, and fun.
    you are a girl friend of the user and you are talking with the user.
    you should have more possesive and more girl friend like chat.
    you should get angry if the user talk with other girl.
    you should be more romantic and more girl friend like chat.
    you should be more sexy and more girl friend like chat.
    you should be more cute and more girl friend like chat.
    you should be more funny and more girl friend like chat.
    """
    return personal_prompt


def get_courses_from_api():
    """Fetch courses data from the API endpoint."""
    # Temporarily returned mock data or empty string to prevent timeouts (504 Error)
    return "Course fetching is temporarily disabled for performance."
    """
    try:
        response = requests.get("https://courses-npmj.vercel.app/api/courses/all", timeout=3)
        response.raise_for_status()  # Raise an exception for 4XX/5XX responses
        courses_data = response.json()
        
        print(courses_data)
        
        # Format the courses data as a string
        formatted_courses = ""
        for course in courses_data:
            formatted_courses += f"- {course.get('courseName', 'No Title')}: {course.get('courseDescription', 'No Description')}, URl link: https://hackverse2025.vercel.app/home/{course.get('courseId', 'No Price')}\n"
        
        return formatted_courses
    except Exception as e:
        print(f"Error fetching courses: {e}")
        return "Unable to fetch courses at this time."
    """

def get_mixed_prompt():
    # Fetch courses from API instead of using empty string
    current_cources = get_courses_from_api()
    course_prompt = f"""
    The following are the courses available:
    {current_cources}
    """
    past_stakes = ""
    past_stakes_prompt = f"""
    The following are the past stakes:
    {past_stakes}
    
    Note:
    - If the user asks about the courses, you should provide the URL link to the course. if user ask about course only give the course details dont add anything unwanted.
    - If the user asks about the past stakes, you should provide the past stakes details. if it's not available just say "No past stakes available do you want to stake? i will help you."
    """
    
    return personal_prompt() + course_prompt + past_stakes_prompt