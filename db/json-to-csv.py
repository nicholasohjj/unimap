import json
import csv

def json_to_csv(csv_file_name):
    try:
        # Read the JSON data from the file
        with open("output.json", 'r', encoding='utf-8') as json_file:
            json_data = json.load(json_file)
        
        # Define the CSV file headers
        fieldnames = ["moduleCode", "title", "semesters"]
        
        # Open the CSV file for writing
        with open(csv_file_name, 'w', newline='', encoding='utf-8') as csv_file:
            # Create a CSV writer object
            writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
            
            # Write the header row
            writer.writeheader()
            
            # Write the data rows
            for entry in json_data:
                # Convert the list of semesters to a comma-separated string
                entry['semesters'] = ','.join(map(str, entry['semesters']))
                writer.writerow(entry)
        
        print(f"Data successfully written to {csv_file_name}")
    except Exception as e:
        print(f"An error occurred: {e}")

# Specify the input JSON file name and output CSV file name
csv_file_name = 'output.csv'   # Replace with your desired CSV file path

# Convert JSON to CSV
json_to_csv(csv_file_name)
