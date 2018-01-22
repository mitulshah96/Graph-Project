from flask import Flask,render_template,request,g,session,url_for,flash,redirect
from flask_oauthlib.client import OAuth

app = Flask(__name__)
app.secret_key = 'development'
oauth = OAuth(app)

twitter = oauth.remote_app(
    'twitter',
    consumer_key='oY2RlposCqyuqlR6qk5d9TaqA',
    consumer_secret='eKPnchwXLh87QvEKBLVYgNoysgzNCKQ8m6JLfL48aGzdqep80F',
    base_url='https://api.twitter.com/1.1/',
    request_token_url='https://api.twitter.com/oauth/request_token',
    access_token_url='https://api.twitter.com/oauth/access_token',
    authorize_url='https://api.twitter.com/oauth/authorize'
)


@twitter.tokengetter
def get_twitter_token():
    if 'twitter_oauth' in session:
        resp = session['twitter_oauth']
        return resp['oauth_token'], resp['oauth_token_secret']


@app.before_request
def before_request():
    g.user = None
    if 'twitter_oauth' in session:
        g.user = session['twitter_oauth']




@app.route("/main")
def main():
    return render_template('index.html')

@app.route("/")
def index():
    tweets = None
    if g.user is not None:
        resp = twitter.request('statuses/home_timeline.json')
        if resp.status == 200:
            tweets = resp.data
        else:
            flash('Unable to load tweets from Twitter.')
    return render_template('twitter.html', tweets=tweets)


@app.route('/tweet', methods=['POST'])
def tweet():
    if g.user is None:
        return redirect(url_for('login', next=request.url))
    status = request.form['tweet']
    if not status:
        return redirect(url_for('index'))
    resp = twitter.post('statuses/update.json', data={
        'status': status
    })

    if resp.status == 403:
        flash("Error: #%d, %s " % (
            resp.data.get('errors')[0].get('code'),
            resp.data.get('errors')[0].get('message'))
        )
    elif resp.status == 401:
        flash('Authorization error with Twitter.')
    else:
        flash('Successfully tweeted your tweet (ID: #%s)' % resp.data['id'])
    return redirect(url_for('index'))


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


@app.route('/login')
def login():
    callback_url = url_for('oauthorized', next=request.args.get('next'))
    return twitter.authorize(callback=callback_url or request.referrer or None)

@app.route('/logout')
def logout():
    session.pop('twitter_oauth', None)
    return redirect(url_for('index'))

@app.route('/oauthorized')
def oauthorized():
    resp = twitter.authorized_response()
    if resp is None:
        flash('You denied the request to sign in.')
    else:
        session['twitter_oauth'] = resp
    return redirect(url_for('index'))

@app.route('/signin')
def signin():
    return render_template('signin.html')

@app.route('/main')
def mains():
    return render_template('index.html')

@app.route('/ig_page')
def ig_page():
    return render_template('ig_page.html')

@app.route('/fb_page')
def fb_page():
    return render_template('fb_page.html')

if __name__ == "__main__":
    app.run(debug=True)