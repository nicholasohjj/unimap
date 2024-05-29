import csv

def read_csv(csv_file):
    data = []
    try:
        with open(csv_file, mode='r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                data.append(row)
        return data
    except Exception as e:
        print(f"An error occurred while reading the CSV file: {e}")
        return []

def combine_csv():
    csv_data1 = read_csv("./db/output.csv")  # Replace with the first CSV file path
    csv_data2 = read_csv("./db/final_clean.csv") # Replace with the second CSV file path

    combined_data = []
    for row1 in csv_data1:
        for row2 in csv_data2:
            if row1['moduleCode'] == row2['moduleCode']:
                combined_row = {**row1, **row2}
                combined_data.append(combined_row)
                break
    
    return combined_data

def write_csv(data):
    try:
        with open("./db/combined_csv", mode='w', newline='', encoding='utf-8') as file:
            fieldnames = data[0].keys() if data else []
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)
            print(data)
        print(f"Data successfully written to ./db/combined_csv.csv")
    except Exception as e:
        print(f"An error occurred while writing the CSV file: {e}")

# Parameters

# Process
combined_data = combine_csv()
write_csv(combined_data)
