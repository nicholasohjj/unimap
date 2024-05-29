import json
import csv

def read_json():
    try:
        with open("./db/cleaned_output.json", 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)
        return data
    except Exception as e:
        print(f"An error occurred while reading the JSON file: {e}")
        return None

def json_to_csv(json_data):
    try:
        if not json_data:
            print("No data to write to CSV.")
            return

        # Open the CSV file for writing
        with open("./db/final_clean.csv", 'w', newline='', encoding='utf-8') as csv_file:
            if isinstance(json_data, list) and json_data:
                # Use the keys from the first dictionary as the CSV fieldnames
                fieldnames = json_data[0].keys()
                writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
                
                # Write the header
                writer.writeheader()
                
                # Write the data rows
                for entry in json_data:
                    writer.writerow(entry)
            else:
                print("The JSON data format is not as expected. Please check the data structure.")
        
        print(f"Data successfully written to ./db/final_clean.csv")
    except Exception as e:
        print(f"An error occurred while writing to the CSV file: {e}")

# Parameters

# Process
json_data = read_json()
json_to_csv(json_data)
