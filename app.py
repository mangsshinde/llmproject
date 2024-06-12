from flask import Flask, render_template, request, jsonify, session
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser
import os
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from dotenv import load_dotenv
load_dotenv()
os.environ['GOOGLE_API_KEY'] = os.getenv('GOOGLE_API_KEY')

app = Flask(__name__)

llm = ChatGoogleGenerativeAI(model='gemini-1.5-flash', temperature=0)
output_parser = StrOutputParser()
prompt = ChatPromptTemplate.from_messages(
            [
                ("system","You are a hepful assistant. Please respond to the user queries"),
                ("user","Question: {question}")
            ]
        )

chain = LLMChain(llm=llm, prompt=prompt, output_parser=output_parser)

@app.route("/")
def initializer():
    return render_template('index.html')

@app.route('/submit_data',methods=['POST'])
def submit_data():
    text = request.form.get('text')
    # audio = request.files.get('audio')
    if text:
        result = chain.invoke({'question': text})
    else:
        pass
    print(result)
    return jsonify({'response': result})

    
if __name__ == "__main__":
    app.run(debug=True)