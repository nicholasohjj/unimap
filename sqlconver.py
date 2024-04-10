import json

# Read JSON data from file
with open('modules_details.json', 'r') as file:
    course_data = json.load(file)

# Define the SQL template for insertion
sql_template = """
INSERT INTO course_details (module_code, exam_date, exam_duration, prereq_tree, fulfill_requirements)
VALUES ('{module_code}', {exam_date}, {exam_duration}, '{prereq_tree}', '{fulfill_requirements}');
"""

# Open a file to write SQL queries
with open('insert_queries.sql', 'w') as sql_file:
    # Iterate over each course object and generate insert query
    for course in course_data:
        module_code = course['module_code']

        if all(value is None for key, value in course.items() if key != 'module_code'):
            continue  # Skip generating SQL query for this course

        exam_date = (
            f"'{course['examDate']}'" if course['examDate'] else 'null'
        )  # Insert actual NULL if examDate is null
        
        exam_duration = course['examDuration'] if course['examDuration'] is not None else 'null'
        
        # Convert prereq_tree and fulfill_requirements to JSON strings or 'null' if None
        prereq_tree = json.dumps(course['prereqTree']) if course.get('prereqTree') else 'null'
        fulfill_requirements = json.dumps(course['fulfillRequirements']) if course.get('fulfillRequirements') else 'null'
        
        # Format the SQL query with values
        insert_query = sql_template.format(
            module_code=module_code,
            exam_date=exam_date,
            exam_duration=exam_duration,
            prereq_tree=prereq_tree,
            fulfill_requirements=fulfill_requirements
        )
        
        # Write the query to the SQL file
        sql_file.write(insert_query + '\n')
