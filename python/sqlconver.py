import json

# Read JSON data from file
with open('./python/modules_details.json', 'r') as file:
    course_data = json.load(file)

# Define the SQL template for insertion
sql_template = """
INSERT INTO course_details (module_code, exam_date, exam_duration, prereq_tree, fulfill_requirements, title, description, module_credit)
VALUES ('{module_code}', {exam_date}, {exam_duration}, '{prereq_tree}', '{fulfill_requirements}', '{title}', '{description}', '{module_credit}');
"""

# Open a file to write SQL queries
with open('insert_queries.sql', 'w', encoding='utf-8') as sql_file:
    # Iterate over each course object and generate insert query
    for course in course_data:  # Assuming course_data is a list of courses
        # Safely extract values, handling potential missing keys with defaults
        module_code = course.get('module_code', '')
        title = course.get('title', '').replace("'", "''")  # Escape single quotes in SQL
        description = course.get('description', '').replace("'", "''")  # Escape single quotes
        module_credit = course.get('module_credit', '')

        # Handle nullable values appropriately, converting to SQL 'null' or formatting as needed
        exam_date = f"'{course.get('examDate')}'" if course.get('examDate') else 'null'
        exam_duration = course.get('examDuration', 'null')
        prereq_tree = json.dumps(course.get('prereqTree')).replace("'", "''") if course.get('prereqTree') else 'null'
        fulfill_requirements = json.dumps(course.get('fulfillRequirements')).replace("'", "''") if course.get('fulfillRequirements') else 'null'

        # Use the SQL template to format our insert query with the extracted values
        insert_query = sql_template.format(
            module_code=module_code,
            exam_date=exam_date,
            exam_duration=exam_duration,
            prereq_tree=prereq_tree,
            fulfill_requirements=fulfill_requirements,
            title=title,
            description=description,
            module_credit=module_credit
        )
        
        # Write each formatted insert query to our SQL file, followed by a newline
        sql_file.write(insert_query + '\n')
