import csv
import json
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

def read_csv(csv_file_name):
    module_codes = []
    try:
        with open(csv_file_name, mode='r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                module_codes.append(row['moduleCode'])
        return module_codes
    except Exception as e:
        print(f"An error occurred while reading the CSV file: {e}")
        return []

def fetch_module_data(module_code):
    url = f'https://api.nusmods.com/v2/2023-2024/modules/{module_code}.json'
    try:
        response = requests.get(url)
        response.raise_for_status()  # Check if the request was successful
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while fetching data for module {module_code}: {e}")
        return None

def fetch_and_combine_data(module_codes):
    combined_data = []
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_module = {executor.submit(fetch_module_data, code): code for code in module_codes}
        for future in as_completed(future_to_module):
            module_code = future_to_module[future]
            try:
                data = future.result()
                if data is not None:
                    print("module added" + module_code)
                    combined_data.append(data)
            except Exception as e:
                print(f"An error occurred while processing module {module_code}: {e}")
    return combined_data

def save_to_json(data, json_file_name):
    try:
        with open(json_file_name, 'w', encoding='utf-8') as json_file:
            json.dump(data, json_file, indent=4)
        print(f"Combined data successfully saved to {json_file_name}")
    except Exception as e:
        print(f"An error occurred while saving to JSON file: {e}")

# Parameters
csv_file_name = 'output.csv'  # Replace with your CSV file path
json_file_name = 'combined_output.json'  # Replace with your desired output JSON file path

# Process
module_codes = read_csv(csv_file_name)
combined_data = fetch_and_combine_data(module_codes)
save_to_json(combined_data, json_file_name)
