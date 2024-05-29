import json

def clean_module_data(data):
    cleaned_data = []
    for module in data:
        cleaned_module = {
            'moduleCode': module.get('moduleCode'),
            'moduleCredit': module.get('moduleCredit'),
            'prereqTree': module.get('prereqTree')
        }
        cleaned_data.append(cleaned_module)
    return cleaned_data

def read_json():
    try:
        with open("./db/combined_output.json", 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)
        return data
    except Exception as e:
        print(f"An error occurred while reading the JSON file: {e}")
        return []

def save_to_json(data):
    try:
        with open("./db/cleaned_output.json", 'w', encoding='utf-8') as json_file:
            json.dump(data, json_file, indent=4)
        print(f"Cleaned data successfully saved to ./db/cleaned_output.json")
    except Exception as e:
        print(f"An error occurred while saving to JSON file: {e}")

# Parameters
input_json_file_name = 'combined_output.json'  # Replace with your input JSON file path
output_json_file_name = './cleaned_output.json'  # Replace with your desired output JSON file path

# Process
data = read_json()
cleaned_data = clean_module_data(data)
save_to_json(cleaned_data)
