import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

base_dir = os.path.dirname(os.path.abspath(__file__))

json_path = os.path.join(base_dir, "intents.json")

# Load intents from JSON file
with open(json_path, "r") as file:
    intents_data = json.load(file)

# Extract intent questions and responses
questions = []
responses = []

for intent in intents_data['intents']:
    for pattern in intent['patterns']:
        questions.append(pattern.lower())
        responses.append(intent['responses'][0])

# Create DataFrame
df = pd.DataFrame({'Question': questions, 'Answer': responses})

# Text Processing
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(df['Question'].values.astype('U'))

# Function to get response
def get_response(user_input):
    user_input_vec = vectorizer.transform([user_input])
    similarities = cosine_similarity(user_input_vec, X)
    idx = np.argmax(similarities)
    return df.iloc[idx]['Answer']

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')
    response = get_response(user_input)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
