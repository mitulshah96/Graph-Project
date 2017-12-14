from flask import Flask,render_template,request
app = Flask(__name__)


@app.route("/")
def main():
    return render_template('index.html')


@app.route('/showSignUp')
def showSignUp():
    return render_template('signup.html')

@app.route("/dashboard",methods=['POST'])
def dashboard():
    email=request.form['inputEmail']
    password=request.form['inputPassword']
    if email == "admin@somaiya.edu" and password =="admin":
        return render_template('dashboard.html')
    else:
        return render_template('signin.html')

@app.route('/dashboards')
def dashboards():
    return render_template('dashboard.html')


@app.route('/signin')
def signin():
    return render_template('signin.html')

@app.route('/main')
def mains():
    return render_template('index.html')

@app.route('/fb_page')
def fb_page():
    return render_template('fb_page.html')

if __name__ == "__main__":
    app.run(debug=True)