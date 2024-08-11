import pymongo

client = pymongo.MongoClient("mongodb+srv://jessi:Cluster0Password@cluster0.fyvpbon.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["hangman"]
collection = db["words"]

file_path = "words.txt"

words_data = []
with open(file_path, "r") as file:
    for line in file:
        word = line.strip()
        word_length = len(word)
        words_data.append({"word": word, "length": word_length})

collection.insert_many(words_data)