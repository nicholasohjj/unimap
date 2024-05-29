import requests

def fetch_and_save_data(url, file_name):
    try:
        # Send a GET request to the specified URL
        response = requests.get(url)
        
        # Raise an HTTPError if the HTTP request returned an unsuccessful status code
        response.raise_for_status()
        
        # Get the content of the response
        data = response.text
        
        # Write the data to a text file
        with open(file_name, 'w', encoding='utf-8') as file:
            file.write(data)
        
        print(f"Data successfully fetched from {url} and saved to {file_name}")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

# Replace 'http://xxx.com/adasds' with the actual URL you want to fetch data from
url = 'https://api.nusmods.com/v2/2023-2024/moduleList.json'
file_name = 'output.json'

fetch_and_save_data(url, file_name)
