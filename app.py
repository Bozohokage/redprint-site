from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/Pedidos')  # Nova rota para acessar o formulário
def Pedidos():
    return render_template('Pedidos.html')

if __name__ == '__main__':
    app.run(debug=True)
