import requests
import pandas as pd
import json

# Replace 'your_csv_file.csv' with the path to your CSV file
csv_file_path = r"C:\Users\nicho\unimap\code.txt"
# Academic year in the required format
acad_year = '2023-2024'
# NUSMods API base URL
api_base_url = 'https://api.nusmods.com/v2/{}/modules/'.format(acad_year)

def fetch_module_details(module_code):
    """Fetches module details from the NUSMods API."""
    url = api_base_url + module_code + '.json'
    print(url)
    response = requests.get(api_base_url + module_code + '.json')
    if response.status_code == 200:
        module_info = response.json()
        # Filter out the required information
        semester_data = module_info.get("semesterData", [])
        examDate = semester_data[0].get("examDate") if semester_data else None
        examDuration = semester_data[0].get("examDuration") if semester_data else None
        
        prereqTree = module_info.get("prereqTree")
        fulfillRequirements = module_info.get("fulfillRequirements")
        filtered_info = {"module_code": module_code, "examDate": examDate, "examDuration": examDuration, "prereqTree": prereqTree, "fulfillRequirements": fulfillRequirements}
        return filtered_info
    else:
        print('Failed to fetch data for module code:', module_code)
        return None

def main():
    # Replace 'your_text_file.txt' with the path to your text file
    text_file_path = r"C:\Users\nicho\unimap\code.txt"
    
    # Read module codes from each line of the text file
    with open(text_file_path, 'r') as file:
        module_codes = [line.strip() for line in file.readlines()]

    all_modules_details = []

    # Fetch details for each module code and append to the list
    for module_code in module_codes:
        print('Fetching details for module code:', module_code)
        module_details = fetch_module_details(module_code)
        if module_details:
            all_modules_details.append(module_details)
    # Write the collected module details to a JSON file
    with open('modules_details.json', 'w') as json_file:
        json.dump(all_modules_details, json_file, indent=4)

    print('All module details fetched and stored in modules_details.json.')

if __name__ == '__main__':
    main()
