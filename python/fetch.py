import requests
import pandas as pd
import json
from concurrent.futures import ThreadPoolExecutor, as_completed

# Replace 'your_csv_file.csv' with the path to your CSV file
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
        title = module_info.get("title")
        description = module_info.get("description")
        module_credit = module_info.get("moduleCredit")
        
        filtered_info = {"module_code": module_code, "examDate": examDate, "examDuration": examDuration, "prereqTree": prereqTree, "fulfillRequirements": fulfillRequirements, "title": title, "description": description, "module_credit": module_credit}
        return filtered_info
    else:
        print('Failed to fetch data for module code:', module_code)
        return None

def main():
    # Replace 'your_text_file.txt' with the path to your text file
    text_file_path = r"C:\Users\nicho\unimap\python\code.txt"
    
    # Read module codes from each line of the text file
    with open(text_file_path, 'r') as file:
        module_codes = [line.strip() for line in file.readlines()]

    all_modules_details = []

     # Use ThreadPoolExecutor to parallelize requests
    with ThreadPoolExecutor(max_workers=20) as executor:
        future_to_module = {executor.submit(fetch_module_details, module_code): module_code for module_code in module_codes}
        
        for future in as_completed(future_to_module):
            module_code = future_to_module[future]
            try:
                module_details = future.result()
                if module_details:
                    all_modules_details.append(module_details)
            except Exception as exc:
                print(f'Failed to fetch data for module code {module_code} with exception {exc}')

    # Write the collected module details to a JSON file
    with open('modules_details.json', 'w') as json_file:
        json.dump(all_modules_details, json_file, indent=4)

    print('All module details fetched and stored in modules_details.json.')

if __name__ == '__main__':
    main()
